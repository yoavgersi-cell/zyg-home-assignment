import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { launchBrowser, UA } from '../_lib/browser';

export const runtime = 'nodejs';
export const maxDuration = 60;

/*
 * Captures the competitor's PUBLIC Meta Ad Library for real: the headless
 * browser opens the ad results (by keyword, or by exact Facebook Page ID
 * when provided), counts active ads, and captures the individual ad cards.
 *
 * Ranking honesty: Meta does not publish impression numbers for regular
 * commercial ads, so "top creatives" are ranked by LONGEST-RUNNING - the
 * standard media-buyer proxy (ads that keep running keep performing).
 * If Meta gates the page from this server, we return an explicit error -
 * never substituted content.
 */

const AD_COUNTRY = 'US'; // per product decision: track US-targeted ads only

const keywordUrl = (competitor: string) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${AD_COUNTRY}&q=${encodeURIComponent(
    competitor,
  )}&search_type=keyword_unordered&media_type=all`;

const pageUrl = (pageId: string) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${AD_COUNTRY}&view_all_page_id=${encodeURIComponent(
    pageId,
  )}&search_type=page&media_type=all`;

type TopAd = {
  libraryId?: string;
  startedRunning?: string;
  daysRunning?: number;
  text: string;
  screenshot?: string;
};

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseStartDate(text: string): { label?: string; date?: Date } {
  const m = text.match(/started running on\s+([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})/i);
  if (!m) return {};
  const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
  if (mon === undefined) return { label: `${m[1]} ${m[2]}, ${m[3]}` };
  return { label: `${m[1]} ${m[2]}, ${m[3]}`, date: new Date(Number(m[3]), mon, Number(m[2])) };
}

export async function POST(req: Request) {
  let body: { competitor?: string; pageId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const competitor = (body.competitor || '').trim();
  const pageId = (body.pageId || '').trim();
  if (!competitor) {
    return NextResponse.json({ error: 'competitor is required' }, { status: 400 });
  }

  const publicUrl = pageId ? pageUrl(pageId) : keywordUrl(competitor);
  const target = process.env.ADS_LIBRARY_URL_OVERRIDE || publicUrl;

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
    await page.setViewport({ width: 1440, height: 2400 });
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 20_000 });

    // Dismiss a cookie dialog if one appears (best effort).
    try {
      await new Promise((r) => setTimeout(r, 1500));
      await page.evaluate(() => {
        const labels = ['decline optional cookies', 'allow all cookies', 'only allow essential cookies'];
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('[role="button"], button'));
        const btn = nodes.find((n) => labels.includes((n.textContent || '').trim().toLowerCase()));
        btn?.click();
      });
    } catch {
      /* no dialog */
    }

    // Let the client-rendered results paint, then scroll once to load more cards.
    await new Promise((r) => setTimeout(r, 4000));
    try {
      await page.evaluate(() => window.scrollBy(0, 1200));
      await new Promise((r) => setTimeout(r, 1500));
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 500));
    } catch {
      /* scrolling is best-effort */
    }

    let bodyText = '';
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        bodyText = await page.evaluate(
          () => document.body?.innerText?.replace(/\s+/g, ' ').slice(0, 40000) || '',
        );
        break;
      } catch (e) {
        if (!/context was destroyed|cannot find context|navigat/i.test(String(e)) || attempt === 2)
          throw e;
        await new Promise((r) => setTimeout(r, 1800));
      }
    }

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

    const countMatch = bodyText.match(/([\d.,]+)\s*results?/i);

    // Tag each ad card container in the DOM (cards contain "Library ID").
    // Take the OUTERMOST ancestor that is still card-width: the first tall
    // ancestor is only the card's text section - the creative lives in a
    // sibling below it, so climbing to the outermost keeps it in frame.
    const cardCount: number = await page.evaluate(() => {
      const leaves = Array.from(document.querySelectorAll<HTMLElement>('div, span')).filter(
        (el) => el.childElementCount === 0 && /library id/i.test(el.textContent || ''),
      );
      let idx = 0;
      for (const leaf of leaves) {
        let anc: HTMLElement | null = leaf.parentElement;
        let best: HTMLElement | null = null;
        while (anc) {
          const r = anc.getBoundingClientRect();
          if (r.width > 620) break; // reached the results grid
          if (r.width >= 240 && r.height >= 180) best = anc;
          anc = anc.parentElement;
        }
        if (best && !best.hasAttribute('data-gi-card')) {
          best.setAttribute('data-gi-card', String(idx++));
        }
        if (idx >= 12) break; // enough candidates
      }
      return idx;
    });

    if (!countMatch && cardCount === 0) {
      return NextResponse.json(
        {
          error:
            'The Ad Library page loaded but no ad results were detected (Meta may have changed the page or is rate-limiting this server).',
        },
        { status: 422 },
      );
    }

    // Read every tagged card: text + individual screenshot.
    const rawCards: Array<{ text: string; index: number }> = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-gi-card]')).map((el) => ({
        index: Number(el.getAttribute('data-gi-card')),
        text: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 600),
      })),
    );

    // Rank by run time FIRST (performance proxy - see header comment),
    // then screenshot only the top five - scrolling each into view so its
    // lazy-loaded creative media paints before the capture.
    const parsed = rawCards.map((rc) => {
      const { label, date } = parseStartDate(rc.text);
      const libMatch = rc.text.match(/library id:?\s*(\d{6,})/i);
      return {
        index: rc.index,
        card: {
          libraryId: libMatch ? libMatch[1] : undefined,
          startedRunning: label,
          daysRunning: date
            ? Math.max(0, Math.round((Date.now() - date.getTime()) / 86_400_000))
            : undefined,
          text: rc.text,
        } as TopAd,
      };
    });
    parsed.sort((a, b) => (b.card.daysRunning ?? -1) - (a.card.daysRunning ?? -1));
    const winners = parsed.slice(0, 5);

    // Clip a generous fixed region from each card's top downward instead of
    // trusting Meta's obfuscated card containers - the creative sits below
    // the text block and cannot escape a tall clip.
    const docHeight: number = await page.evaluate(
      () => document.documentElement.scrollHeight || document.body.scrollHeight,
    );
    for (const w of winners) {
      try {
        const handle = await page.$(`[data-gi-card="${w.index}"]`);
        if (!handle) continue;
        await handle.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        await new Promise((r) => setTimeout(r, 1500)); // let the creative load
        const box = await handle.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width };
        });
        const clipX = Math.max(0, box.x - 6);
        const clipY = Math.max(0, box.y - 6);
        const clipH = Math.min(860, Math.max(300, docHeight - clipY - 4));
        const shot = (await page.screenshot({
          type: 'jpeg',
          quality: 55,
          encoding: 'base64',
          clip: { x: clipX, y: clipY, width: Math.min(box.w + 12, 640), height: clipH },
        })) as string;
        w.card.screenshot = `data:image/jpeg;base64,${shot}`;
      } catch {
        /* screenshot is best-effort */
      }
    }
    const top = winners.map((w) => w.card);

    return NextResponse.json({
      ads: {
        id: randomBytes(3).toString('hex'),
        url: publicUrl,
        capturedAt: new Date().toISOString(),
        totalCount: countMatch ? countMatch[1] : String(cardCount),
        rankedBy: 'longest-running',
        top,
        textSample: bodyText
          .slice(Math.max(0, bodyText.search(/results?/i)), Math.max(0, bodyText.search(/results?/i)) + 1200)
          .trim(),
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
