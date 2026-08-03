import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { launchBrowser, UA } from '../_lib/browser';

export const runtime = 'nodejs';
export const maxDuration = 60;

/*
 * Captures the competitor's PUBLIC Meta Ad Library page for real: the
 * headless browser opens the search results, screenshots the visible ads,
 * and extracts the approximate result count plus a sample of the visible
 * ad text. If Meta gates the page (login wall / bot check), we return an
 * explicit error - never substituted content.
 */

const adLibraryUrl = (competitor: string) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(
    competitor,
  )}&search_type=keyword_unordered&media_type=all`;

export async function POST(req: Request) {
  let body: { competitor?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const competitor = (body.competitor || '').trim();
  if (!competitor) {
    return NextResponse.json({ error: 'competitor is required' }, { status: 400 });
  }

  const target = process.env.ADS_LIBRARY_URL_OVERRIDE || adLibraryUrl(competitor);

  let browser;
  try {
    browser = await launchBrowser();
  } catch (e) {
    console.error('[agent/ads] browser launch failed:', e);
    return NextResponse.json(
      { error: 'The capture browser could not start on this server.' },
      { status: 502 },
    );
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 1280, height: 1600 });
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 25_000 });

    // Dismiss a cookie dialog if one appears (best effort).
    try {
      await new Promise((r) => setTimeout(r, 2000));
      await page.evaluate(() => {
        const labels = ['decline optional cookies', 'allow all cookies', 'only allow essential cookies'];
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('[role="button"], button'));
        const btn = nodes.find((n) => labels.includes((n.textContent || '').trim().toLowerCase()));
        btn?.click();
      });
    } catch {
      /* no dialog */
    }

    // Give the client-rendered results time to paint.
    await new Promise((r) => setTimeout(r, 5000));

    const bodyText: string = await page.evaluate(
      () => document.body?.innerText?.replace(/\s+/g, ' ').slice(0, 30000) || '',
    );

    const gated =
      /log in or sign up|log into facebook|checkpoint/i.test(bodyText.slice(0, 3000)) &&
      !/library id/i.test(bodyText);
    if (gated) {
      return NextResponse.json(
        {
          error:
            'Meta is gating the Ad Library from this server (login wall). The ads are viewable in a normal browser via the Ad Library link.',
        },
        { status: 502 },
      );
    }

    const countMatch = bodyText.match(/([~≈]?\s?[\d.,]+)\s*results?/i);
    const libraryIds = (bodyText.match(/library id/gi) || []).length;
    if (!countMatch && libraryIds === 0) {
      return NextResponse.json(
        {
          error:
            'The Ad Library page loaded but no ad results were detected (Meta may have changed the page or is rate-limiting this server).',
        },
        { status: 422 },
      );
    }

    // Text sample around the results, for the reasoning layer.
    const resultsIdx = bodyText.search(/results?/i);
    const textSample = bodyText
      .slice(Math.max(0, resultsIdx), Math.max(0, resultsIdx) + 1500)
      .trim();

    const shot = (await page.screenshot({
      type: 'jpeg',
      quality: 55,
      encoding: 'base64',
    })) as string;

    return NextResponse.json({
      ads: {
        id: randomBytes(3).toString('hex'),
        url: adLibraryUrl(competitor),
        capturedAt: new Date().toISOString(),
        screenshot: `data:image/jpeg;base64,${shot}`,
        approxCount: countMatch
          ? countMatch[1].replace(/[^\d.,]/g, '')
          : String(libraryIds),
        visibleAdCards: libraryIds,
        textSample,
      },
    });
  } catch (err) {
    console.error('[agent/ads] capture failed:', err);
    return NextResponse.json(
      { error: 'Could not capture the Ad Library page (timeout or navigation error). Try again.' },
      { status: 502 },
    );
  } finally {
    await browser.close().catch(() => {});
  }
}
