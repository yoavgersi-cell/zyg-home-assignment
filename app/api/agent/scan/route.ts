import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { existsSync } from 'fs';
import { randomBytes } from 'crypto';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

/*
 * Scans one competitor page for real: a headless browser loads the URL,
 * captures a screenshot (the visual evidence shown in the dashboard), and
 * the rendered HTML is parsed into the structured fields we track between
 * snapshots. If the browser cannot start, we fall back to a plain HTML
 * fetch (no screenshot) rather than fail the scan entirely — but we never
 * substitute demo content.
 */

export type Snapshot = {
  id: string;
  url: string;
  fetchedAt: string;
  title: string;
  headline: string;
  cta: string;
  offer: string;
  prices: string;
  copy: string;
  screenshot?: string; // data:image/jpeg;base64,...
  capture: 'browser' | 'html-only';
  captureError?: string;
};

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const CTA_PATTERN =
  /(shop|buy|get started|get yours|get \d|start|try|join|subscribe|order|add to cart|take .{0,20}quiz|quiz|sign up|claim|unlock|build your)/i;

const OFFER_PATTERN =
  /(\d{1,2}%\s?off|free shipping|save \$?\d+|\bsale\b|\bbundle\b|discount|money-back|first order)/i;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

function extract(url: string, html: string): Omit<Snapshot, 'id' | 'screenshot' | 'capture'> {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg, iframe').remove();

  const title = norm($('title').first().text());
  const headline =
    norm($('h1').first().text()) ||
    norm($('meta[property="og:title"]').attr('content') || '');

  let cta = '';
  const candidates: string[] = [];
  $('a, button').each((_, el) => {
    const t = norm($(el).text());
    if (t && t.length >= 3 && t.length <= 45) candidates.push(t);
  });
  cta = candidates.find((t) => CTA_PATTERN.test(t)) || candidates[0] || '';

  const bodyText = norm($('body').text()).slice(0, 20000);
  let offer = '';
  const om = bodyText.match(OFFER_PATTERN);
  if (om && om.index !== undefined) {
    const start = Math.max(0, om.index - 40);
    let snippet = bodyText.slice(start, om.index + om[0].length + 40);
    if (start > 0) snippet = snippet.replace(/^\S*\s/, '');
    offer = norm(snippet).slice(0, 120);
  }

  const prices = Array.from(
    new Set((bodyText.match(/\$\d+(?:\.\d{2})?/g) || []).slice(0, 8)),
  )
    .slice(0, 5)
    .join(' · ');

  const desc = norm($('meta[name="description"]').attr('content') || '');
  const h2s = $('h2')
    .slice(0, 3)
    .map((_, el) => norm($(el).text()))
    .get()
    .filter(Boolean)
    .join(' · ');
  const copy = [desc, h2s].filter(Boolean).join(' · ').slice(0, 500);

  return { url, fetchedAt: new Date().toISOString(), title, headline, cta, offer, prices, copy };
}

async function launchBrowser() {
  // Local / sandbox chromium first; on Vercel use the packaged lambda build.
  const localPath =
    process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  if (existsSync(localPath)) {
    return puppeteer.launch({
      executablePath: localPath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  }
  const chromium = (await import('@sparticuz/chromium')).default;
  // sparticuz ships the headless *shell* build; puppeteer must be told so,
  // otherwise it passes new-headless flags and the launch fails on Vercel.
  return puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    defaultViewport: { width: 1280, height: 900 },
    headless: 'shell',
  });
}

async function browserCapture(url: string) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 1280, height: 900 });
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    const status = resp?.status() ?? 0;
    if (status >= 400) throw new Error(`HTTP_${status}`);
    // let hero content/fonts settle briefly
    await new Promise((r) => setTimeout(r, 1500));
    const html = await page.content();
    const shot = (await page.screenshot({
      type: 'jpeg',
      quality: 60,
      encoding: 'base64',
    })) as string;
    return { html, screenshot: `data:image/jpeg;base64,${shot}` };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function plainFetch(url: string) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
  return res.text();
}

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const url = (body.url || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: 'Enter a full URL starting with http(s)://' },
      { status: 400 },
    );
  }

  let html = '';
  let screenshot: string | undefined;
  let capture: Snapshot['capture'] = 'browser';
  let captureError: string | undefined;

  try {
    const r = await browserCapture(url);
    html = r.html;
    screenshot = r.screenshot;
  } catch (browserErr) {
    console.error('[agent/scan] browser capture failed:', browserErr);
    captureError =
      browserErr instanceof Error ? browserErr.message.slice(0, 200) : 'Unknown browser error';
    const httpErr = browserErr instanceof Error && /^HTTP_(\d+)/.exec(browserErr.message);
    if (httpErr) {
      return NextResponse.json(
        { error: `The page responded with HTTP ${httpErr[1]}. The site may be blocking automated access.` },
        { status: 502 },
      );
    }
    // Browser could not run (or timed out) — try a plain HTML fetch so the
    // scan can still succeed, just without visual evidence.
    try {
      html = await plainFetch(url);
      capture = 'html-only';
    } catch (fetchErr) {
      console.error('[agent/scan] plain fetch failed:', fetchErr);
      const fh = fetchErr instanceof Error && /^HTTP_(\d+)/.exec(fetchErr.message);
      return NextResponse.json(
        {
          error: fh
            ? `The page responded with HTTP ${fh[1]}. The site may be blocking automated access.`
            : 'Could not reach the page (network error or timeout). Check the URL and try again.',
        },
        { status: 502 },
      );
    }
  }

  const fields = extract(url, html);
  if (!fields.title && !fields.headline) {
    return NextResponse.json(
      { error: 'Fetched the page but could not extract readable content.' },
      { status: 422 },
    );
  }

  const snapshot: Snapshot = {
    id: randomBytes(3).toString('hex'),
    ...fields,
    screenshot,
    capture,
  };
  return NextResponse.json({ snapshot, captureError });
}
