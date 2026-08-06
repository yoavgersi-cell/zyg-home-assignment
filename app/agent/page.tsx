'use client';

import * as React from 'react';
import {
  Globe,
  Camera,
  RefreshCw,
  Check,
  Loader2,
  CircleDashed,
  Eye,
  EyeOff,
  Sparkles,
  FlaskConical,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Label,
  Select,
  Textarea,
  Skeleton,
} from '../../components/agent/ui';

/* ---------------------------------- types ---------------------------------- */

type Snapshot = {
  id?: string;
  url: string;
  fetchedAt: string;
  title: string;
  headline: string;
  cta: string;
  offer: string;
  prices: string;
  copy: string;
  screenshot?: string;
  capture?: 'browser' | 'html-only';
  captureError?: string;
  simulated?: boolean;
};

type TopAd = {
  libraryId?: string;
  startedRunning?: string;
  daysRunning?: number;
  text: string;
  screenshot?: string;
};

type AdsEvidence = {
  id: string;
  url: string;
  capturedAt: string;
  totalCount?: string;
  rankedBy?: string;
  top?: TopAd[];
  textSample?: string;
  // legacy v1 fields (older captures in localStorage)
  screenshot?: string;
  approxCount?: string;
};

type Tracker = {
  competitor: string;
  url: string;
  frequency: string;
  notes: string;
  metaPageId?: string;
  baseline: Snapshot | null;
  latest: Snapshot | null;
  ads?: AdsEvidence | null;
};

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

type GenMode = 'live' | 'demo' | 'fallback';
type Review = 'awaiting' | 'approved' | 'revision';

type StoredBrief = {
  brief: Brief;
  mode: GenMode;
  error: string | null;
  review: Review;
  changeSummary: string;
  generatedAt: string;
};

const TRACKER_KEY = 'growth-intel-tracker-v1';
const BRIEF_KEY = 'growth-intel-brief-v1';

const PROGRESS_STEPS = [
  'Reading baseline snapshot…',
  'Reading current snapshot…',
  'Isolating the change…',
  'Generating experiment…',
  'Preparing PM brief…',
];

const FIELDS: Array<{ key: keyof Snapshot; label: string }> = [
  { key: 'title', label: 'Page title' },
  { key: 'headline', label: 'Headline' },
  { key: 'cta', label: 'Main CTA' },
  { key: 'offer', label: 'Visible offer' },
  { key: 'prices', label: 'Prices' },
];

const norm = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function compare(baseline: Snapshot, latest: Snapshot, competitor: string) {
  const changed = FIELDS.filter(
    (f) => norm(baseline[f.key] as string) !== norm(latest[f.key] as string),
  ).map((f) => ({
    key: f.key,
    label: f.label,
    before: (baseline[f.key] as string) || '—',
    after: (latest[f.key] as string) || '—',
  }));
  const meaningful = changed.length > 0;
  const summary = latest.simulated
    ? `${competitor} added a symptom-first quiz CTA above its product grid.`
    : meaningful
      ? `${competitor} updated its ${changed.map((c) => c.label.toLowerCase()).join(', ')} on the tracked page.`
      : '';
  return { changed, meaningful, summary };
}

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/* Competitor-to-source consistency: the UI must never present content as the
 * competitor's when the tracked URL or the scanned content clearly is not.
 * Returns a human-readable reason when inconsistent, else null. */
function sourceMismatch(tracker: Tracker): string | null {
  let host = '';
  try {
    host = new URL(tracker.url).hostname.toLowerCase();
  } catch {
    return 'The tracked URL is not a valid URL.';
  }
  const name = compact(tracker.competitor);
  const isStripes = name.includes('stripes');
  const demoHost =
    /^(localhost|127\.|0\.0\.0\.0)/.test(host) ||
    host.endsWith('.vercel.app') ||
    host.includes('stripesbeauty');
  const nameInHost = name.length >= 4 && compact(host).includes(name);
  if (demoHost && !nameInHost) {
    return `The tracked URL (${host}) is a demo or Stripes host, not a ${tracker.competitor} property.`;
  }
  const b = tracker.baseline;
  if (b && !isStripes) {
    const txt = compact(`${b.title} ${b.headline} ${b.copy}`);
    if (txt.includes('stripes')) {
      return `The scanned content looks like a Stripes page, but the competitor is set to ${tracker.competitor}.`;
    }
  }
  return null;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* Vercel returns plain-text error pages on function timeouts/crashes;
 * parse defensively so the UI shows a readable message instead of a
 * JSON.parse exception. */
async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `The server function failed (HTTP ${res.status}) — likely a timeout. If this repeats, enable Fluid Compute in Vercel Settings → Functions and redeploy.`,
    );
  }
}

/* ---------------------------------- page ----------------------------------- */

export default function AgentPage() {
  const [mounted, setMounted] = React.useState(false);
  const [tracker, setTracker] = React.useState<Tracker | null>(null);
  const [stored, setStored] = React.useState<StoredBrief | null>(null);

  const [scanning, setScanning] = React.useState<'baseline' | 'scan' | null>(null);
  const [capturingAds, setCapturingAds] = React.useState(false);
  const [adsError, setAdsError] = React.useState<string | null>(null);
  const [scanError, setScanError] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [showBaseline, setShowBaseline] = React.useState(false);

  // hydrate from localStorage (client only)
  React.useEffect(() => {
    try {
      const t = localStorage.getItem(TRACKER_KEY);
      if (t) setTracker(JSON.parse(t));
      const b = localStorage.getItem(BRIEF_KEY);
      if (b) setStored(JSON.parse(b));
    } catch {
      /* corrupted storage -> start fresh */
    }
    setMounted(true);
  }, []);

  const saveTracker = (t: Tracker | null) => {
    setTracker(t);
    if (!t) {
      localStorage.removeItem(TRACKER_KEY);
      return;
    }
    try {
      localStorage.setItem(TRACKER_KEY, JSON.stringify(t));
    } catch {
      // Storage quota: persist without screenshots, keep them in memory.
      const strip = (sn: Snapshot | null) => (sn ? { ...sn, screenshot: undefined } : sn);
      try {
        localStorage.setItem(
          TRACKER_KEY,
          JSON.stringify({
            ...t,
            baseline: strip(t.baseline),
            latest: strip(t.latest),
            ads: t.ads
              ? {
                  ...t.ads,
                  screenshot: undefined,
                  top: t.ads.top?.map((a) => ({ ...a, screenshot: undefined })),
                }
              : t.ads,
          }),
        );
      } catch {
        /* give up persisting silently; state still lives in memory */
      }
    }
  };
  const saveBrief = (b: StoredBrief | null) => {
    setStored(b);
    if (b) localStorage.setItem(BRIEF_KEY, JSON.stringify(b));
    else localStorage.removeItem(BRIEF_KEY);
  };

  React.useEffect(() => {
    if (!generating) return;
    setStep(0);
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, PROGRESS_STEPS.length - 1)),
      520,
    );
    return () => clearInterval(id);
  }, [generating]);

  const runScan = async (kind: 'baseline' | 'scan') => {
    if (!tracker || scanning) return;
    setScanning(kind);
    setScanError(null);
    try {
      const res = await fetch('/api/agent/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: tracker.url }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error((data.error as string) || 'Scan failed');
      const snap: Snapshot = {
        ...(data.snapshot as Snapshot),
        captureError: data.captureError as string | undefined,
      };
      if (kind === 'baseline') {
        saveTracker({ ...tracker, baseline: snap, latest: null });
        saveBrief(null);
        setShowBaseline(true); // show the evidence immediately
      } else {
        saveTracker({ ...tracker, latest: snap });
      }
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(null);
    }
  };

  const captureAds = async () => {
    if (!tracker || capturingAds) return;
    setCapturingAds(true);
    setAdsError(null);
    try {
      const res = await fetch('/api/agent/ads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          competitor: tracker.competitor,
          pageId: tracker.metaPageId || undefined,
        }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error((data.error as string) || 'Ad capture failed');
      saveTracker({ ...tracker, ads: data.ads as AdsEvidence });
    } catch (err) {
      setAdsError(err instanceof Error ? err.message : 'Ad capture failed');
    } finally {
      setCapturingAds(false);
    }
  };

  const simulateChange = () => {
    if (!tracker?.baseline) return;
    const latest: Snapshot = {
      ...tracker.baseline,
      id: 'sim' + Math.random().toString(16).slice(2, 5),
      fetchedAt: new Date().toISOString(),
      cta: 'TAKE THE SYMPTOM QUIZ',
      simulated: true,
    };
    saveTracker({ ...tracker, latest });
  };

  const comparison =
    tracker?.baseline && tracker?.latest
      ? compare(tracker.baseline, tracker.latest, tracker.competitor)
      : null;

  const mismatch = tracker ? sourceMismatch(tracker) : null;

  const generate = async () => {
    if (!tracker?.baseline || !tracker.latest || !comparison?.meaningful || generating) return;
    if (mismatch) return; // never generate a brief from an inconsistent source
    setGenerating(true);
    try {
      const [res] = await Promise.all([
        fetch('/api/agent/generate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            competitor: tracker.competitor,
            url: tracker.url,
            baseline: { ...tracker.baseline, screenshot: undefined },
            current: { ...tracker.latest, screenshot: undefined },
            detectedChange: comparison.summary,
            adsContext: tracker.ads
              ? `Captured ${tracker.ads.capturedAt} from ${tracker.ads.url}. Total active ads: ${tracker.ads.totalCount || tracker.ads.approxCount || 'unknown'}.${
                  tracker.ads.top?.length
                    ? ` Top ${tracker.ads.top.length} longest-running ads (performance proxy): ` +
                      tracker.ads.top
                        .map(
                          (a, i) =>
                            `${i + 1}) ${a.startedRunning ? `running since ${a.startedRunning}` : 'start date unknown'}: "${a.text.slice(0, 160)}"`,
                        )
                        .join(' ')
                    : ` Visible ad text sample: ${tracker.ads.textSample || 'n/a'}`
                }`
              : undefined,
          }),
        }),
        delay(2700),
      ]);
      const data = await readJson(res);
      if (!res.ok) throw new Error((data.error as string) || 'Generation failed');
      saveBrief({
        brief: data.brief as Brief,
        mode: (data.mode as GenMode) || 'demo',
        error: typeof data.error === 'string' ? data.error : null,
        review: 'awaiting',
        changeSummary: comparison.summary,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em]">
            Growth Intelligence
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[#667085]">
            Monitor one competitor, detect meaningful changes, and turn them
            into review-ready experiments.
          </p>
        </div>
        {tracker?.baseline && (
          <div className="flex items-center gap-2 rounded-full border border-[#E3E8EF] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#5A6B7E] shadow-card">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tracking 1 page · manual scans
          </div>
        )}
      </div>

      {!tracker ? (
        <SetupCard onCreate={(t) => saveTracker(t)} />
      ) : (
        <>
          {/* Competitor status card */}
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                  <Globe className="h-5 w-5 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[17px] font-bold tracking-[-0.01em]">
                      {tracker.competitor}
                    </h2>
                    <Badge tone="blue">{tracker.frequency}</Badge>
                  </div>
                  <a
                    href={tracker.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focusable mt-1 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#667085] hover:text-accent"
                  >
                    {tracker.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {tracker.notes && (
                    <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-[#8A97A8]">
                      {tracker.notes}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  saveTracker(null);
                  saveBrief(null);
                  setScanError(null);
                }}
                className="focusable flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-[#8A97A8] transition-colors hover:bg-[#F2F4F8] hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset tracker
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#EDF0F5] pt-5 sm:grid-cols-3">
              <MetaTile
                label="Baseline"
                value={
                  tracker.baseline
                    ? `${fmt(tracker.baseline.fetchedAt)}${tracker.baseline.id ? ` · #${tracker.baseline.id}` : ''}`
                    : 'Not created yet'
                }
                ok={!!tracker.baseline}
              />
              <MetaTile
                label="Last scan"
                value={
                  tracker.latest
                    ? fmt(tracker.latest.fetchedAt)
                    : tracker.baseline
                      ? fmt(tracker.baseline.fetchedAt)
                      : '—'
                }
                ok={!!(tracker.latest || tracker.baseline)}
              />
              <MetaTile label="Monitoring" value="Manual · prototype" ok />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!tracker.baseline ? (
                <Button
                  size="lg"
                  loading={scanning === 'baseline'}
                  onClick={() => runScan('baseline')}
                >
                  {!scanning && <Camera className="h-4 w-4" />}
                  {scanning === 'baseline'
                    ? 'Scanning page…'
                    : 'Create baseline snapshot'}
                </Button>
              ) : (
                <>
                  <Button loading={scanning === 'scan'} onClick={() => runScan('scan')}>
                    {!scanning && <RefreshCw className="h-4 w-4" />}
                    {scanning === 'scan' ? 'Scanning page…' : 'Run scan now'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBaseline((v) => !v)}
                  >
                    {showBaseline ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showBaseline ? 'Hide baseline' : 'View baseline'}
                  </Button>
                  <Button variant="ghost" onClick={simulateChange} disabled={!!scanning}>
                    Demo: simulate a change
                  </Button>
                  <Button variant="outline" loading={capturingAds} onClick={captureAds}>
                    {!capturingAds && <Camera className="h-4 w-4" />}
                    {capturingAds ? 'Capturing ads…' : 'Capture live ads'}
                  </Button>
                </>
              )}
            </div>

            {scanError && (
              <p className="mt-3 text-[12.5px] font-medium text-red-600">{scanError}</p>
            )}

            {mismatch && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-800">
                <span className="font-bold">Source mismatch.</span> {mismatch}{' '}
                Experiment brief generation is disabled until the tracked URL
                and competitor match.
              </div>
            )}

            {tracker.baseline && !tracker.latest && !scanError && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                Baseline created · {fmt(tracker.baseline.fetchedAt)}. Run a scan
                later to compare the live page against it.
              </div>
            )}

            {tracker.baseline && tracker.baseline.capture === 'html-only' && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800">
                This scan captured the page&apos;s HTML but{' '}
                <span className="font-bold">could not take a screenshot</span>{' '}
                (the headless browser was unavailable). The extracted fields
                below are still real. Re-run the scan to retry the screenshot.
                {tracker.baseline.captureError && (
                  <span className="mt-1.5 block font-mono text-[10.5px] text-amber-700/80">
                    {tracker.baseline.captureError}
                  </span>
                )}
              </div>
            )}

            {adsError && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800">
                <span className="font-bold">Ad capture failed.</span> {adsError}{' '}
                <a
                  href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(tracker.competitor)}&search_type=keyword_unordered`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                >
                  Open the Ad Library directly
                </a>
                .
              </div>
            )}

            {tracker.ads && (
              <div className="mt-4 rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#8A97A8]">
                    Live ad evidence · Meta Ad Library · #{tracker.ads.id} ·{' '}
                    {fmt(tracker.ads.capturedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="blue">
                      {tracker.ads.totalCount || tracker.ads.approxCount || '?'} active ads
                    </Badge>
                    <a
                      href={tracker.ads.url}
                      target="_blank"
                      rel="noreferrer"
                      className="focusable text-[11.5px] font-semibold text-accent hover:underline"
                    >
                      Open source ↗
                    </a>
                  </div>
                </div>
                {tracker.ads.top && tracker.ads.top.length > 0 ? (
                  <>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tracker.ads.top.map((ad, i) => (
                        <div
                          key={ad.libraryId || i}
                          className="overflow-hidden rounded-lg border border-[#E3E8EF] bg-white"
                        >
                          {ad.screenshot ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={ad.screenshot}
                              alt={`Ad creative ${i + 1}`}
                              className="w-full"
                            />
                          ) : (
                            <div className="flex h-32 items-center justify-center bg-[#F5F7FA] px-2 text-center text-[10px] text-[#9AA6B5]">
                              No creative capture
                            </div>
                          )}
                          <div className="space-y-1.5 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-accent">
                                #{i + 1}
                              </span>
                              {ad.daysRunning !== undefined && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                  {ad.daysRunning}d live
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-3 text-[12px] leading-snug text-[#5A6B7E]">
                              {ad.text.replace(/library id:?\s*\d+/i, '').slice(0, 160)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-[10.5px] text-[#9AA6B5]">
                      Top creatives ranked by longest-running — the standard
                      performance proxy, since Meta publishes no impression data
                      for commercial ads. Feeds the reasoning layer alongside
                      the page snapshots.
                    </p>
                  </>
                ) : tracker.ads.screenshot ? (
                  <figure className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tracker.ads.screenshot}
                      alt={`Live ads of ${tracker.competitor} in the Meta Ad Library`}
                      className="max-h-[420px] w-full rounded-lg border border-[#E3E8EF] object-cover object-top shadow-card"
                    />
                  </figure>
                ) : (
                  <p className="mt-3 text-[12px] text-[#9AA6B5]">
                    Captured without creative screenshots (text only).
                  </p>
                )}
              </div>
            )}

            {showBaseline && tracker.baseline && (
              <div className="mt-4 rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#8A97A8]">
                    Baseline snapshot
                    {tracker.baseline.id ? ` · #${tracker.baseline.id}` : ''} ·{' '}
                    {fmt(tracker.baseline.fetchedAt)}
                  </div>
                  <Badge tone={tracker.baseline.capture === 'browser' ? 'blue' : 'gray'}>
                    {tracker.baseline.capture === 'browser'
                      ? 'Browser capture'
                      : 'HTML capture · no screenshot'}
                  </Badge>
                </div>
                <div className="mt-2.5 grid grid-cols-1 items-stretch gap-x-5 gap-y-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
                  {tracker.baseline.screenshot ? (
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tracker.baseline.screenshot}
                        alt={`Screenshot of ${tracker.baseline.url}`}
                        className="max-h-[400px] w-full rounded-lg border border-[#E3E8EF] object-cover object-top shadow-card"
                      />
                      <figcaption className="mt-1.5 text-[10.5px] text-[#9AA6B5]">
                        Captured render of {tracker.baseline.url}
                      </figcaption>
                    </figure>
                  ) : (
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-[#D8DFE8] p-6 text-center text-[11.5px] text-[#9AA6B5]">
                      No screenshot for this snapshot (text-only capture).
                    </div>
                  )}
                  <dl className="flex h-full flex-col justify-evenly gap-2 py-0.5">
                    {FIELDS.map((f) => (
                      <div key={f.key} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A97A8]">
                          {f.label}
                        </dt>
                        <dd className="text-[12.5px] leading-relaxed text-[#3D4E62]">
                          {(tracker.baseline![f.key] as string) || '—'}
                        </dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A97A8]">
                        Source URL
                      </dt>
                      <dd className="break-all text-[12.5px] leading-relaxed text-[#3D4E62]">
                        {tracker.baseline.url}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </Card>

          {/* Comparison result */}
          {comparison && (
            <Card className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent">
                  Snapshot comparison
                </span>
                <div className="flex items-center gap-2">
                  {mismatch && (
                    <Badge tone="amber" dot>
                      Source mismatch
                    </Badge>
                  )}
                  {tracker.latest?.simulated && (
                    <Badge tone="amber" dot>
                      Simulated change · demo
                    </Badge>
                  )}
                  {comparison.meaningful ? (
                    <Badge tone="orange" dot>
                      Change detected
                    </Badge>
                  ) : (
                    <Badge tone="green" dot>
                      No meaningful change
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mt-2 text-[12px] text-[#8A97A8]">
                Baseline {fmt(tracker.baseline!.fetchedAt)}
                {tracker.baseline!.id ? ` (#${tracker.baseline!.id})` : ''} · Latest scan{' '}
                {fmt(tracker.latest!.fetchedAt)}
                {tracker.latest!.id ? ` (#${tracker.latest!.id})` : ''} · Compared: page
                title, headline, main CTA, visible offer, prices
              </p>

              {(tracker.baseline!.screenshot || tracker.latest!.screenshot) && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <figure>
                    <figcaption className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#B0BAC7]">
                      Baseline{tracker.baseline!.id ? ` · #${tracker.baseline!.id}` : ''}
                    </figcaption>
                    {tracker.baseline!.screenshot ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={tracker.baseline!.screenshot}
                        alt="Baseline screenshot"
                        className="w-full rounded-lg border border-[#E3E8EF]"
                      />
                    ) : (
                      <div className="rounded-lg border border-dashed border-[#D8DFE8] p-6 text-center text-[11px] text-[#9AA6B5]">
                        No screenshot
                      </div>
                    )}
                  </figure>
                  <figure>
                    <figcaption className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
                      Latest{tracker.latest!.id ? ` · #${tracker.latest!.id}` : ''}
                      {tracker.latest!.simulated ? ' (simulated fields)' : ''}
                    </figcaption>
                    {tracker.latest!.screenshot ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={tracker.latest!.screenshot}
                        alt="Latest scan screenshot"
                        className="w-full rounded-lg border border-[#E3E8EF]"
                      />
                    ) : (
                      <div className="rounded-lg border border-dashed border-[#D8DFE8] p-6 text-center text-[11px] text-[#9AA6B5]">
                        No screenshot
                      </div>
                    )}
                  </figure>
                </div>
              )}

              {comparison.meaningful ? (
                <>
                  <div className="mt-5 space-y-3">
                    {comparison.changed.map((c) => (
                      <div
                        key={c.key}
                        className="grid grid-cols-1 gap-2 rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] p-4 sm:grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4"
                      >
                        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A97A8]">
                          {c.label}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#B0BAC7]">
                            Before
                          </div>
                          <div className="mt-1 text-[13px] leading-relaxed text-[#5A6B7E] line-through decoration-[#C7D0DB]">
                            {c.before}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
                            After
                          </div>
                          <div className="mt-1 text-[13px] font-semibold leading-relaxed text-ink">
                            {c.after}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-accent-soft px-4 py-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
                      Detected change
                    </div>
                    <p className="mt-1 text-[13.5px] font-semibold text-ink">
                      {comparison.summary}
                    </p>
                  </div>

                  {!stored && !generating && (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Button size="lg" onClick={generate} disabled={!!mismatch}>
                        <Sparkles className="h-4 w-4" />
                        Generate experiment brief
                      </Button>
                      {mismatch && (
                        <span className="text-[12px] font-medium text-amber-700">
                          Disabled — competitor and tracked source don&apos;t match.
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-4 text-[13.5px] leading-relaxed text-[#5A6B7E]">
                  The tracked elements are unchanged since the baseline. The
                  agent stays quiet unless something meaningful moves — no
                  noise, no busywork.
                </p>
              )}
            </Card>
          )}

          {/* Generating */}
          {generating && (
            <Card className="p-7">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent">
                  Experiment Brief
                </span>
                <Badge tone="gray">Generating</Badge>
              </div>
              <ul className="mt-6 space-y-3.5">
                {PROGRESS_STEPS.map((label, i) => {
                  const done = i < step;
                  const current = i === step;
                  return (
                    <li key={label} className="flex items-center gap-3">
                      {done ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                        </span>
                      ) : current ? (
                        <Loader2 className="h-5 w-5 animate-spin text-accent" strokeWidth={2.2} />
                      ) : (
                        <CircleDashed className="h-5 w-5 text-[#C7D0DB]" strokeWidth={2} />
                      )}
                      <span
                        className={
                          done
                            ? 'text-[13.5px] font-medium text-[#8A97A8] line-through decoration-[#C7D0DB]'
                            : current
                              ? 'text-[13.5px] font-semibold text-ink'
                              : 'text-[13.5px] font-medium text-[#B0BAC7]'
                        }
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-7 space-y-4 border-t border-[#EDF0F5] pt-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          )}

          {/* Brief */}
          {stored && !generating && (
            <BriefCard
              stored={stored}
              competitor={tracker.competitor}
              url={tracker.url}
              onApprove={() => saveBrief({ ...stored, review: 'approved' })}
              onNeedsReview={() => saveBrief({ ...stored, review: 'revision' })}
              onDismiss={() => saveBrief(null)}
            />
          )}
        </>
      )}

      <p className="flex items-center gap-1.5 text-[11.5px] leading-relaxed text-[#9AA6B5]">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        The agent prepares recommendations. A Product Manager approves every
        experiment before it runs.
      </p>
    </div>
  );
}

/* ------------------------------- subcomponents ------------------------------ */

function MetaTile({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A97A8]">
        {label}
      </div>
      <div
        className={
          ok
            ? 'mt-1 text-[13px] font-semibold text-ink'
            : 'mt-1 text-[13px] font-medium text-[#B0BAC7]'
        }
      >
        {value}
      </div>
    </div>
  );
}

function SetupCard({ onCreate }: { onCreate: (t: Tracker) => void }) {
  const [competitor, setCompetitor] = React.useState('Happy Mammoth');
  const [url, setUrl] = React.useState('https://happymammoth.com/');
  const [frequency, setFrequency] = React.useState('Manual (prototype)');
  const [notes, setNotes] = React.useState('');
  const [metaPageId, setMetaPageId] = React.useState('');

  return (
    <Card className="p-6">
      <h2 className="text-[15px] font-bold tracking-[-0.01em]">
        Track a competitor page
      </h2>
      <p className="mt-1 text-[12.5px] text-[#8A97A8]">
        One competitor, one page. The first scan creates the baseline snapshot
        every future scan is compared against.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="competitor">Competitor</Label>
          <input
            id="competitor"
            value={competitor}
            onChange={(e) => setCompetitor(e.target.value)}
            className="focusable h-9 w-full rounded-lg border border-[#D8DFE8] bg-white px-3 text-[13.5px] font-medium text-ink transition-colors hover:border-[#C3CCD9]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="url">Tracked page URL</Label>
          <input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="focusable h-9 w-full rounded-lg border border-[#D8DFE8] bg-white px-3 text-[13.5px] font-medium text-ink transition-colors hover:border-[#C3CCD9]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="frequency">Scan frequency</Label>
          <Select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Manual (prototype)</option>
            <option>Daily (planned)</option>
            <option>Weekly (planned)</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="metaPageId">Meta Page ID (optional)</Label>
          <input
            id="metaPageId"
            value={metaPageId}
            onChange={(e) => setMetaPageId(e.target.value)}
            placeholder="Targets the exact Facebook page's ads; keyword search otherwise"
            className="focusable h-9 w-full rounded-lg border border-[#D8DFE8] bg-white px-3 text-[13.5px] font-medium text-ink transition-colors hover:border-[#C3CCD9]"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Watching their homepage acquisition flow"
            className="focusable h-9 w-full rounded-lg border border-[#D8DFE8] bg-white px-3 text-[13.5px] font-medium text-ink transition-colors hover:border-[#C3CCD9]"
          />
        </div>
      </div>
      <Button
        size="lg"
        className="mt-5"
        disabled={!competitor.trim() || !/^https?:\/\//i.test(url.trim())}
        onClick={() =>
          onCreate({
            competitor: competitor.trim(),
            url: url.trim(),
            frequency,
            notes: notes.trim(),
            metaPageId: metaPageId.trim() || undefined,
            baseline: null,
            latest: null,
          })
        }
      >
        Start tracking
      </Button>
    </Card>
  );
}

function BriefCard({
  stored,
  competitor,
  url,
  onApprove,
  onNeedsReview,
  onDismiss,
}: {
  stored: StoredBrief;
  competitor: string;
  url: string;
  onApprove: () => void;
  onNeedsReview: () => void;
  onDismiss: () => void;
}) {
  const { brief, mode, error, review } = stored;
  const confidenceTone =
    brief.confidence === 'High' ? 'green' : brief.confidence === 'Low' ? 'gray' : 'blue';

  return (
    <Card className="animate-fade-up p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent">
            Experiment Brief
          </span>
          {mode === 'live' ? (
            <Badge tone="green" dot>
              Live AI Generated
            </Badge>
          ) : (
            <Badge tone="gray" dot>
              Demo Fallback
            </Badge>
          )}
        </div>
        {review === 'awaiting' && (
          <Badge tone="orange" dot>
            Awaiting PM Review
          </Badge>
        )}
        {review === 'approved' && (
          <Badge tone="green" dot>
            Approved
          </Badge>
        )}
        {review === 'revision' && (
          <Badge tone="amber" dot>
            Needs revision
          </Badge>
        )}
      </div>

      {mode === 'fallback' && error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12px] leading-relaxed text-amber-800">
          Live generation failed — showing a curated fallback. ({error})
        </div>
      )}

      <h3 className="mt-4 max-w-xl text-[20px] font-bold leading-snug tracking-[-0.01em]">
        {brief.title}
      </h3>

      <div className="mt-6 space-y-5">
        <BriefRow label="Insight" value={brief.insight} />
        <BriefRow label="Hypothesis" value={brief.hypothesis} />
        <BriefRow label="Recommended Test" value={brief.recommendedTest} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#EDF0F5] pt-6 sm:grid-cols-3">
        <div className="rounded-xl bg-ink px-4 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9FC0FF]">
            Primary KPI
          </div>
          <div className="mt-1 text-[14px] font-bold text-white">{brief.primaryKPI}</div>
        </div>
        <div className="rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] px-4 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A97A8]">
            Secondary KPI
          </div>
          <div className="mt-1 text-[14px] font-semibold text-ink">
            {brief.secondaryKPI}
          </div>
        </div>
        <div className="rounded-xl border border-[#E7EBF1] bg-[#FAFBFC] px-4 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A97A8]">
            Confidence
          </div>
          <div className="mt-1.5">
            <Badge tone={confidenceTone}>{brief.confidence}</Badge>
          </div>
          {brief.confidenceReason && (
            <p className="mt-2 text-[11px] leading-snug text-[#8A97A8]">
              {brief.confidenceReason}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-[#8A97A8]">
        <span>
          Competitor · <span className="text-[#5A6B7E]">{competitor}</span>
        </span>
        <span>
          Source ·{' '}
          <span className="text-[#5A6B7E] break-all">{url}</span>
        </span>
        <span>
          Generated · <span className="text-[#5A6B7E]">{fmt(stored.generatedAt)}</span>
        </span>
      </div>

      {review === 'approved' && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800 animate-fade-up">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          Approved. In production this would move to the experiments backlog.
        </div>
      )}
      {review === 'revision' && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-800 animate-fade-up">
          <FlaskConical className="h-4 w-4 shrink-0" />
          Marked for revision — the PM wants changes before this can run.
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#EDF0F5] pt-5">
        <Button
          variant={review === 'approved' ? 'success' : 'primary'}
          onClick={onApprove}
          disabled={review === 'approved'}
        >
          {review === 'approved' ? (
            <>
              <Check className="h-4 w-4" /> Approved
            </>
          ) : (
            'Approve Experiment'
          )}
        </Button>
        <Button variant="outline" onClick={onNeedsReview} disabled={review !== 'awaiting'}>
          Needs Review
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          Dismiss
        </Button>
        <span className="ml-auto hidden text-[11.5px] font-medium text-[#9AA6B5] sm:block">
          The agent prepares the brief. The PM decides whether to run it.
        </span>
      </div>
    </Card>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-4">
      <div className="pt-0.5 text-[10.5px] font-bold uppercase leading-4 tracking-[0.1em] text-[#8A97A8]">
        {label}
      </div>
      <p className="text-[13.5px] leading-relaxed text-[#3D4E62]">{value}</p>
    </div>
  );
}
