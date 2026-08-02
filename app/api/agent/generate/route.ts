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

const SYSTEM_PROMPT = `You are the reasoning engine of "Growth Intelligence", an internal tool used by the growth team at Stripes Beauty (a DTC menopause wellness brand, stripesbeauty.us). Product managers feed you a single competitor signal; you turn it into one structured, review-ready A/B experiment brief for the Stripes site.

Rules:
- Be concrete and credible. No hype, no marketing language. Write like a senior growth PM.
- The experiment must be something Stripes could realistically test on its own site or funnel.
- Insight: 1-2 sentences describing the competitor behavior and why it matters.
- Hypothesis: one sentence, causal ("Doing X will improve Y because Z").
- recommendedTest: one sentence, "variant vs. control" phrasing.
- KPIs: choose from realistic e-commerce metrics (Purchase Conversion Rate, Homepage -> PDP CTR, PDP Add-to-Cart Rate, Subscription Adoption Rate, Average Order Value, Revenue per Visitor, Lead Capture Rate, Checkout Start Rate). Primary and secondary must differ.
- confidence: High, Medium, or Low - based on how directly the signal maps to a testable change for Stripes.
- confidenceReason: one short sentence explaining the confidence rating.
- Title: short headline (max 9 words), states the market movement, not the test.
- Ground everything in the specific competitor, source and signal you are given - never generic.

Respond with ONLY a minified JSON object, no markdown fences, matching exactly:
{"title":"","insight":"","hypothesis":"","recommendedTest":"","primaryKPI":"","secondaryKPI":"","confidence":"","confidenceReason":""}`;

/* Curated briefs: used when no API key is configured (demo mode) and as a
 * safety net if the live call fails mid-presentation. */
const CURATED: Array<{ match: RegExp; brief: Brief }> = [
  {
    match: /quiz|symptom-first|before collecting email/i,
    brief: {
      title: 'Competitors are moving toward symptom-first journeys',
      insight:
        'Bonafide introduced a symptom-first quiz before product discovery, qualifying visitors around their primary concern before asking for anything.',
      hypothesis:
        'Helping visitors identify their primary symptom before browsing products will increase product engagement and downstream conversion.',
      recommendedTest:
        'Homepage symptom discovery flow vs. current homepage.',
      primaryKPI: 'Homepage → PDP CTR',
      secondaryKPI: 'Purchase Conversion Rate',
      confidence: 'High',
      confidenceReason:
        'The pattern maps directly to an existing Stripes funnel step and is cheap to test.',
    },
  },
  {
    match: /bundle|reset|kit|discount at checkout/i,
    brief: {
      title: 'Bundling is emerging as a category AOV lever',
      insight:
        'Happy Mammoth is packaging three products into a discounted "Menopause Reset" bundle, trading margin for a larger first order and simpler decision-making.',
      hypothesis:
        'Offering a curated starter bundle on the PDP will increase average order value without hurting overall purchase conversion.',
      recommendedTest:
        'PDP with a "Complete Routine" bundle option vs. current single-product PDP.',
      primaryKPI: 'Average Order Value',
      secondaryKPI: 'Purchase Conversion Rate',
      confidence: 'Medium',
      confidenceReason:
        'Bundles lift AOV in comparable catalogs, but discount depth for Stripes is untested.',
    },
  },
  {
    match: /messaging|outcome|night sweats|headline/i,
    brief: {
      title: 'Category messaging is shifting from products to outcomes',
      insight:
        'O Positiv rewrote its homepage around symptom outcomes ("Wake up without night sweats") instead of product benefits, leading with the felt result.',
      hypothesis:
        'Leading the homepage hero with a specific symptom outcome will improve engagement and click-through to product pages.',
      recommendedTest:
        'Outcome-led hero messaging vs. current product-led hero.',
      primaryKPI: 'Homepage → PDP CTR',
      secondaryKPI: 'Purchase Conversion Rate',
      confidence: 'Medium',
      confidenceReason:
        'Messaging tests are low-risk, but outcome claims need compliance review first.',
    },
  },
];

const GENERIC: Brief = {
  title: 'New competitor movement worth testing against',
  insight:
    'A competitor changed how it acquires or converts customers in a way that overlaps with the Stripes funnel.',
  hypothesis:
    'Adapting the underlying pattern to the Stripes site will improve funnel progression at the affected stage.',
  recommendedTest: 'Adapted variant vs. current experience.',
  primaryKPI: 'Purchase Conversion Rate',
  secondaryKPI: 'Homepage → PDP CTR',
  confidence: 'Medium',
  confidenceReason:
    'The signal is directional; the exact funnel stage it affects needs confirmation.',
};

function curatedFor(signal: string): Brief {
  const hit = CURATED.find((c) => c.match.test(signal));
  return hit ? hit.brief : GENERIC;
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

export async function POST(req: Request) {
  let body: { source?: string; competitor?: string; signal?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const signal = (body.signal || '').trim();
  const competitor = (body.competitor || 'Unknown').trim();
  const source = (body.source || 'Manual Input').trim();
  if (!signal) {
    return NextResponse.json({ error: 'Signal is required' }, { status: 400 });
  }

  const fallback = curatedFor(signal);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ brief: fallback, mode: 'demo' });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Source: ${source}\nCompetitor: ${competitor}\nSignal: ${signal}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 500)}`);
    }
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? '';
    const jsonText = text.replace(/^```(?:json)?/m, '').replace(/```\s*$/m, '').trim();
    const parsed = JSON.parse(jsonText.slice(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1));
    return NextResponse.json({ brief: sanitize(parsed, fallback), mode: 'live' });
  } catch (err) {
    // Log the full error server-side; return a readable message with the
    // fallback so the UI can show that live generation failed.
    console.error('[agent/generate] live call failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ brief: fallback, mode: 'fallback', error: message });
  }
}
