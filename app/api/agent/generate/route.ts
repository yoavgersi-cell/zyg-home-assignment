import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Brief = {
  title: string;
  insight: string;
  hypothesis: string;
  recommendedTest: string;
  primaryKPI: string;
  secondaryKPI: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
};

type SnapshotIn = {
  fetchedAt?: string;
  title?: string;
  headline?: string;
  cta?: string;
  offer?: string;
  prices?: string;
  copy?: string;
};

const SYSTEM_PROMPT = `You are the reasoning engine of "Growth Intelligence", an internal tool used by the growth team at Stripes Beauty (a DTC menopause wellness brand, stripesbeauty.us). The tool monitors one competitor web page over time. You receive the page's BASELINE snapshot, its CURRENT snapshot, and a summary of the detected change. Turn that change into one structured, review-ready A/B experiment brief for the Stripes site.

Rules:
- Be concrete and credible. No hype, no marketing language. Write like a senior growth PM.
- The experiment must be something Stripes could realistically test on its own site or funnel.
- Insight: 1-2 sentences describing what the competitor changed and why it matters.
- Hypothesis: one sentence, causal ("Doing X will improve Y because Z").
- recommendedTest: one sentence, "variant vs. control" phrasing.
- KPIs: choose from realistic e-commerce metrics (Purchase Conversion Rate, Homepage -> PDP CTR, PDP Add-to-Cart Rate, Subscription Adoption Rate, Average Order Value, Revenue per Visitor, Lead Capture Rate, Checkout Start Rate). Primary and secondary must differ.
- confidence: High, Medium, or Low - based on how directly the detected change maps to a testable change for Stripes.
- confidenceReason: one short sentence explaining the confidence rating.
- Title: short headline (max 9 words), states the market movement, not the test.
- Ground everything in the specific competitor and the actual before/after content you are given - never generic.

Respond with ONLY a minified JSON object, no markdown fences, matching exactly:
{"title":"","insight":"","hypothesis":"","recommendedTest":"","primaryKPI":"","secondaryKPI":"","confidence":"","confidenceReason":""}`;

/* Curated briefs: served when no API key is configured and as a safety net
 * if the live call fails mid-presentation. Templated by competitor name. */
function curatedFor(competitor: string, change: string): Brief {
  const c = competitor || 'The competitor';
  if (/quiz|symptom/i.test(change)) {
    return {
      title: `${c} is moving toward symptom-first journeys`,
      insight: `${c} added a symptom-first quiz entry point ahead of product discovery, qualifying visitors around their primary concern before showing products.`,
      hypothesis:
        'Helping visitors identify their primary symptom before browsing products will increase product engagement and downstream conversion.',
      recommendedTest: 'Homepage symptom discovery flow vs. current homepage.',
      primaryKPI: 'Homepage → PDP CTR',
      secondaryKPI: 'Purchase Conversion Rate',
      confidence: 'High',
      confidenceReason:
        'The pattern maps directly to an existing Stripes funnel step and is cheap to test.',
    };
  }
  if (/bundle|kit|% off|discount|sale|offer/i.test(change)) {
    return {
      title: `${c} is leaning on offers to lift order value`,
      insight: `${c} changed its visible offer, trading margin for a larger or easier first purchase.`,
      hypothesis:
        'Testing a sharper first-order offer on the PDP will increase conversion without unsustainable margin cost.',
      recommendedTest: 'PDP with revised introductory offer vs. current PDP.',
      primaryKPI: 'Purchase Conversion Rate',
      secondaryKPI: 'Average Order Value',
      confidence: 'Medium',
      confidenceReason:
        'Offer tests are high-signal but the right discount depth for Stripes is untested.',
    };
  }
  if (/headline|messaging|title|copy/i.test(change)) {
    return {
      title: `${c} repositioned its page messaging`,
      insight: `${c} rewrote its main page messaging, changing how the value proposition is framed to first-time visitors.`,
      hypothesis:
        'Leading the Stripes hero with a sharper outcome-focused message will improve engagement and click-through to product pages.',
      recommendedTest: 'Revised hero messaging vs. current hero.',
      primaryKPI: 'Homepage → PDP CTR',
      secondaryKPI: 'Purchase Conversion Rate',
      confidence: 'Medium',
      confidenceReason:
        'Messaging tests are low-risk and fast, but the winning frame has to be found by testing.',
    };
  }
  return {
    title: `${c} changed its page in a way worth testing against`,
    insight: `${c} modified a tracked page element that shapes how visitors enter or move through its funnel.`,
    hypothesis:
      'Adapting the underlying pattern to the Stripes site will improve funnel progression at the affected stage.',
    recommendedTest: 'Adapted variant vs. current experience.',
    primaryKPI: 'Purchase Conversion Rate',
    secondaryKPI: 'Homepage → PDP CTR',
    confidence: 'Medium',
    confidenceReason:
      'The change is real but its funnel impact for Stripes needs validation.',
  };
}

function sanitize(raw: unknown, fallback: Brief): Brief {
  if (!raw || typeof raw !== 'object') return fallback;
  const o = raw as Record<string, unknown>;
  const str = (k: string, fb: string) =>
    typeof o[k] === 'string' && (o[k] as string).trim() ? (o[k] as string).trim() : fb;
  const conf = str('confidence', fallback.confidence);
  return {
    title: str('title', fallback.title),
    insight: str('insight', fallback.insight),
    hypothesis: str('hypothesis', fallback.hypothesis),
    recommendedTest: str('recommendedTest', fallback.recommendedTest),
    primaryKPI: str('primaryKPI', fallback.primaryKPI),
    secondaryKPI: str('secondaryKPI', fallback.secondaryKPI),
    confidence: (['High', 'Medium', 'Low'].includes(conf) ? conf : 'Medium') as Brief['confidence'],
    confidenceReason: str('confidenceReason', fallback.confidenceReason),
  };
}

const snapLines = (label: string, s: SnapshotIn) =>
  `${label} (captured ${s.fetchedAt || 'unknown'}):
- Page title: ${s.title || '—'}
- Headline: ${s.headline || '—'}
- Main CTA: ${s.cta || '—'}
- Visible offer: ${s.offer || '—'}
- Prices: ${s.prices || '—'}
- Key copy: ${s.copy || '—'}`;

export async function POST(req: Request) {
  let body: {
    competitor?: string;
    url?: string;
    baseline?: SnapshotIn;
    current?: SnapshotIn;
    detectedChange?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const competitor = (body.competitor || '').trim();
  const detectedChange = (body.detectedChange || '').trim();
  if (!competitor || !detectedChange || !body.baseline || !body.current) {
    return NextResponse.json(
      { error: 'competitor, baseline, current and detectedChange are required' },
      { status: 400 },
    );
  }

  const fallback = curatedFor(competitor, detectedChange);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ brief: fallback, mode: 'demo' });
  }

  const userContent = `Competitor: ${competitor}
Tracked page: ${body.url || '—'}

${snapLines('BASELINE', body.baseline)}

${snapLines('CURRENT', body.current)}

DETECTED CHANGE: ${detectedChange}`;

  try {
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userContent }],
        }),
        signal: AbortSignal.timeout(25_000),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 500)}`);
      }
      const data = await res.json();
      const text: string = data?.content?.[0]?.text ?? '';
      try {
        const jsonText = text.replace(/^```(?:json)?/m, '').replace(/```\s*$/m, '').trim();
        const parsed = JSON.parse(
          jsonText.slice(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1),
        );
        return NextResponse.json({ brief: sanitize(parsed, fallback), mode: 'live' });
      } catch (parseErr) {
        console.error(
          `[agent/generate] parse failed (attempt ${attempt + 1}), raw head:`,
          text.slice(0, 300),
        );
        lastErr = parseErr;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Could not parse model output');
  } catch (err) {
    // Log the full error server-side; return a readable message with the
    // fallback so the UI can show that live generation failed.
    console.error('[agent/generate] live call failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ brief: fallback, mode: 'fallback', error: message });
  }
}
