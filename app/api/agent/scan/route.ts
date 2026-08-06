import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { randomBytes } from 'crypto';
import { launchBrowser, UA } from '../_lib/browser';

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
    let snippet = bodyText.slice(start, om.index + om[0].length + 50);
    if (start > 0) snippet = snippet.replace(/^\S*\s/, ''); // drop partial leading word
    snippet = snippet.replace(/\s\S*$/, ''); // drop partial trailing word
    offer = norm(snippet).slice(0, 110);
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

async function browserCapture(url: string) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 1280, height: 900 });
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    const status = resp?.status() ?? 0;
    if (status >= 400) throw new Error(`HTTP_${status}`);
    // let hero content/fonts settle briefly
    await new Promise((r) => setTimeout(r, 800));
    // Sites may client-side redirect right after load (e.g. Shopify geo
    // redirects); reading the page mid-navigation throws "execution context
    // was destroyed" - wait out the navigation and retry.
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // JS-built storefronts paint the hero after load: wait for real text,
        // then nudge lazy sections with a scroll before capturing.
        await page
          .waitForFunction('document.body && document.body.innerText.trim().length > 600', {
            timeout: 7_000,
          })
          .catch(() => {});
        await page.evaluate(() => window.scrollBy(0, 1000));
        await new Promise((r) => setTimeout(r, 1200));
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise((r) => setTimeout(r, 700));
        // Visual extraction: what the EYE sees on the rendered page, so the
        // fields correlate with the screenshot (raw-HTML order lies - the
        // nav's "Shop" is not the hero CTA).
        const hints: { headline?: string; cta?: string } = await page
          .evaluate(() => {
            const vis = (el: Element) => {
              const r = el.getBoundingClientRect();
              const st = getComputedStyle(el);
              return (
                r.width > 10 && r.height > 8 && r.top < 1100 && r.bottom > 0 &&
                st.visibility !== 'hidden' && st.display !== 'none' && parseFloat(st.opacity || '1') > 0.2
              );
            };
            let headline = '';
            let hlSize = 0;
            document.querySelectorAll<HTMLElement>('h1,h2,h3,p,span,div').forEach((el) => {
              if (el.childElementCount > 0) return;
              const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
              if (t.length < 8 || t.length > 120) return;
              if (!vis(el)) return;
              const fs = parseFloat(getComputedStyle(el).fontSize) || 0;
              if (fs > hlSize) {
                hlSize = fs;
                headline = t;
              }
            });
            let cta = '';
            let ctaScore = 0;
            document.querySelectorAll<HTMLElement>('a,button,[role="button"]').forEach((el) => {
              const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
              if (t.length < 3 || t.length > 32) return;
              if (!vis(el)) return;
              const r = el.getBoundingClientRect();
              const st = getComputedStyle(el);
              const styled =
                st.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(st.borderRadius) > 0;
              const area = r.width * r.height;
              const score = area * (styled ? 2 : 1);
              if (area > 1200 && score > ctaScore) {
                ctaScore = score;
                cta = t;
              }
            });
            return { headline, cta };
          })
          .catch(() => ({}));
        const html = await page.content();
        const shot = (await page.screenshot({
          type: 'jpeg',
          quality: 60,
          encoding: 'base64',
        })) as string;
        return { html, screenshot: `data:image/jpeg;base64,${shot}`, hints };
      } catch (e) {
        lastErr = e;
        if (!/context was destroyed|cannot find context|navigat/i.test(String(e))) throw e;
        await new Promise((r) => setTimeout(r, 1800));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Page kept navigating during capture');
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
  let hints: { headline?: string; cta?: string } = {};

  try {
    const r = await browserCapture(url);
    html = r.html;
    screenshot = r.screenshot;
    hints = r.hints || {};
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
  // Prefer what is visually on screen over raw-HTML document order.
  if (hints.headline) fields.headline = hints.headline;
  if (hints.cta) fields.cta = hints.cta;
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
