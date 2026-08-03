import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';

/*
 * Scans one competitor page for real: server-side fetch of the URL, then
 * structured extraction of the elements we track between snapshots.
 * Limitation (documented): content rendered only by client-side JS is not
 * visible to a plain HTML fetch; Shopify-style storefronts server-render
 * the parts we care about.
 */

export type Snapshot = {
  url: string;
  fetchedAt: string;
  title: string;
  headline: string;
  cta: string;
  offer: string;
  prices: string;
  copy: string;
};

const CTA_PATTERN =
  /(shop|buy|get started|get yours|get \d|start|try|join|subscribe|order|add to cart|take .{0,20}quiz|quiz|sign up|claim|unlock|build your)/i;

const OFFER_PATTERN =
  /(\d{1,2}%\s?off|free shipping|save \$?\d+|\bsale\b|\bbundle\b|discount|money-back|first order)/i;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

function extract(url: string, html: string): Snapshot {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg, iframe').remove();

  const title = norm($('title').first().text());

  const headline =
    norm($('h1').first().text()) ||
    norm($('meta[property="og:title"]').attr('content') || '');

  // CTA: first short link/button whose text looks like a call to action
  let cta = '';
  const candidates: string[] = [];
  $('a, button').each((_, el) => {
    const t = norm($(el).text());
    if (t && t.length >= 3 && t.length <= 45) candidates.push(t);
  });
  cta = candidates.find((t) => CTA_PATTERN.test(t)) || candidates[0] || '';

  // Offer: first promotional phrase in the visible text
  const bodyText = norm($('body').text()).slice(0, 20000);
  let offer = '';
  const om = bodyText.match(OFFER_PATTERN);
  if (om && om.index !== undefined) {
    const start = Math.max(0, om.index - 40);
    offer = norm(bodyText.slice(start, om.index + om[0].length + 40));
  }

  // Prices: first distinct currency amounts on the page
  const prices = Array.from(
    new Set((bodyText.match(/\$\d+(?:\.\d{2})?/g) || []).slice(0, 8)),
  )
    .slice(0, 5)
    .join(' · ');

  // Key copy: meta description + first subheadings
  const desc = norm($('meta[name="description"]').attr('content') || '');
  const h2s = $('h2')
    .slice(0, 3)
    .map((_, el) => norm($(el).text()))
    .get()
    .filter(Boolean)
    .join(' · ');
  const copy = [desc, h2s].filter(Boolean).join(' · ').slice(0, 500);

  return {
    url,
    fetchedAt: new Date().toISOString(),
    title,
    headline,
    cta,
    offer,
    prices,
    copy,
  };
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

  try {
    const res = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `The page responded with HTTP ${res.status}. Try again or check the URL.` },
        { status: 502 },
      );
    }
    const html = await res.text();
    const snapshot = extract(url, html);
    if (!snapshot.title && !snapshot.headline) {
      return NextResponse.json(
        { error: 'Fetched the page but could not extract readable content (it may be fully client-rendered).' },
        { status: 422 },
      );
    }
    return NextResponse.json({ snapshot });
  } catch (err) {
    console.error('[agent/scan] fetch failed:', err);
    return NextResponse.json(
      { error: 'Could not reach the page (network error or timeout). Check the URL and try again.' },
      { status: 502 },
    );
  }
}
