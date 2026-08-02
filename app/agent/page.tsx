'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Radio,
  FlaskConical,
  Inbox,
  Sparkles,
  Check,
  Loader2,
  CircleDashed,
  FileText,
  ArrowRight,
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

/* ----------------------------------- data ---------------------------------- */

const SOURCES = [
  'Meta Ads Library',
  'Competitor Website',
  'Landing Page',
  'Pricing',
  'Manual Input',
];

const COMPETITORS = ['Bonafide', 'Alloy', 'O Positiv', 'Happy Mammoth', 'Kindra'];

const DEMO_SIGNALS = [
  {
    label: 'Bonafide Quiz',
    source: 'Competitor Website',
    competitor: 'Bonafide',
    text: 'Bonafide launched a symptom-first quiz on their homepage that visitors complete before any email capture or product browsing.',
  },
  {
    label: 'Happy Mammoth Bundle',
    source: 'Pricing',
    competitor: 'Happy Mammoth',
    text: 'Happy Mammoth introduced a 3-product "Menopause Reset" bundle with a 20% discount, promoted on the PDP and at checkout.',
  },
  {
    label: 'O Positiv New Messaging',
    source: 'Landing Page',
    competitor: 'O Positiv',
    text: 'O Positiv shifted homepage messaging from product benefits to symptom outcomes ("Wake up without night sweats").',
  },
];

const PROGRESS_STEPS = [
  'Analyzing competitor…',
  'Extracting behavioral pattern…',
  'Comparing with historical signals…',
  'Generating experiment…',
  'Preparing PM brief…',
];

type Brief = {
  title: string;
  insight: string;
  hypothesis: string;
  recommendedTest: string;
  primaryKPI: string;
  secondaryKPI: string;
  confidence: 'High' | 'Medium' | 'Low';
};

type Phase = 'empty' | 'loading' | 'ready';
type Review = 'awaiting' | 'approved' | 'revision';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------- page ----------------------------------- */

export default function AgentPage() {
  const [source, setSource] = React.useState(SOURCES[0]);
  const [competitor, setCompetitor] = React.useState(COMPETITORS[0]);
  const [signal, setSignal] = React.useState('');

  const [phase, setPhase] = React.useState<Phase>('empty');
  const [step, setStep] = React.useState(0);
  const [brief, setBrief] = React.useState<Brief | null>(null);
  const [briefMeta, setBriefMeta] = React.useState({ source: '', competitor: '' });
  const [review, setReview] = React.useState<Review>('awaiting');
  const [stats, setStats] = React.useState({ signals: 12, experiments: 4, awaiting: 2 });
  const [error, setError] = React.useState<string | null>(null);

  const loading = phase === 'loading';

  // staged progress while loading
  React.useEffect(() => {
    if (!loading) return;
    setStep(0);
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, PROGRESS_STEPS.length - 1)),
      520,
    );
    return () => clearInterval(id);
  }, [loading]);

  const loadDemo = (d: (typeof DEMO_SIGNALS)[number]) => {
    setSource(d.source);
    setCompetitor(d.competitor);
    setSignal(d.text);
    setError(null);
  };

  const generate = async () => {
    if (!signal.trim() || loading) return;
    setError(null);
    setPhase('loading');
    setBrief(null);
    try {
      const [res] = await Promise.all([
        fetch('/api/agent/generate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ source, competitor, signal }),
        }),
        delay(2700), // let the progress sequence play out
      ]);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setBrief(data.brief as Brief);
      setBriefMeta({ source, competitor });
      setReview('awaiting');
      setPhase('ready');
      setStats((s) => ({
        signals: s.signals + 1,
        experiments: s.experiments + 1,
        awaiting: s.awaiting + 1,
      }));
    } catch {
      setPhase(brief ? 'ready' : 'empty');
      setError('Something went wrong generating the brief. Try again.');
    }
  };

  const approve = () => {
    if (review !== 'awaiting') return;
    setReview('approved');
    setStats((s) => ({ ...s, awaiting: Math.max(0, s.awaiting - 1) }));
  };

  const needsReview = () => setReview('revision');

  const dismiss = () => {
    setPhase('empty');
    setBrief(null);
    setReview('awaiting');
    setStats((s) => ({ ...s, awaiting: Math.max(0, s.awaiting - 1) }));
  };

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em]">
            Growth Intelligence Agent
          </h1>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[#667085]">
            Monitor competitor activity and automatically generate review-ready
            experiment briefs.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#E3E8EF] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#5A6B7E] shadow-card">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Monitoring 5 competitors
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Radio}
          label="Signals detected"
          value={stats.signals}
          hint="+3 this week"
        />
        <StatCard
          icon={FlaskConical}
          label="Experiments generated"
          value={stats.experiments}
          hint="from 12 signals"
        />
        <StatCard
          icon={Inbox}
          label="Awaiting PM review"
          value={stats.awaiting}
          hint="oldest 2 days"
          accent
        />
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">
        {/* LEFT — signal input */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-[-0.01em]">
              New Competitor Signal
            </h2>
            <Badge tone="gray">Simulated feed</Badge>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="source">Input source</Label>
                <Select
                  id="source"
                  value={source}
                  disabled={loading}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="competitor">Competitor</Label>
                <Select
                  id="competitor"
                  value={competitor}
                  disabled={loading}
                  onChange={(e) => setCompetitor(e.target.value)}
                >
                  {COMPETITORS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signal">Signal</Label>
              <Textarea
                id="signal"
                rows={5}
                placeholder='Paste a competitor signal… e.g. "Bonafide launched a symptom-first quiz before collecting email."'
                value={signal}
                disabled={loading}
                onChange={(e) => setSignal(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-[#EDF0F5]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A97A8]">
                or load a demo signal
              </span>
              <div className="h-px flex-1 bg-[#EDF0F5]" />
            </div>

            <div className="flex flex-wrap gap-2">
              {DEMO_SIGNALS.map((d) => (
                <button
                  key={d.label}
                  disabled={loading}
                  onClick={() => loadDemo(d)}
                  className="focusable rounded-full border border-[#D8DFE8] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#3D4E62] shadow-[0_1px_2px_rgba(16,42,77,.05)] transition-all hover:border-accent-line hover:bg-accent-soft hover:text-accent disabled:opacity-50"
                >
                  {d.label}
                </button>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-1 w-full"
              disabled={!signal.trim()}
              loading={loading}
              onClick={generate}
            >
              {!loading && <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating…' : 'Generate Experiment'}
            </Button>

            {error && (
              <p className="text-[12.5px] font-medium text-red-600">{error}</p>
            )}

            <p className="flex items-center gap-1.5 pt-1 text-[11.5px] leading-relaxed text-[#8A97A8]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              The agent prepares recommendations. A Product Manager approves
              every experiment before it runs.
            </p>
          </div>
        </Card>

        {/* RIGHT — brief */}
        <div className="min-w-0">
          {phase === 'empty' && <EmptyState />}
          {phase === 'loading' && <LoadingState step={step} />}
          {phase === 'ready' && brief && (
            <BriefCard
              brief={brief}
              meta={briefMeta}
              review={review}
              onApprove={approve}
              onNeedsReview={needsReview}
              onDismiss={dismiss}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- subcomponents ------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  accent?: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={
          accent
            ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4ED] text-[#B15738]'
            : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent'
        }
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-[#667085]">{label}</div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[24px] font-bold leading-none tracking-[-0.02em]">
            {value}
          </span>
          <span className="text-[11px] font-medium text-[#9AA6B5]">{hint}</span>
        </div>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8DFE8] bg-white/60 px-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">
        <FileText className="h-5 w-5 text-accent" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-[15px] font-bold">No brief yet</h3>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-[#8A97A8]">
        Load a demo signal or paste competitor activity, then generate a
        review-ready experiment brief.
      </p>
      <div className="mt-5 flex items-center gap-2 text-[12px] font-semibold text-[#B0BAC7]">
        <span>Signal</span>
        <ArrowRight className="h-3.5 w-3.5" />
        <span>Brief</span>
        <ArrowRight className="h-3.5 w-3.5" />
        <span>PM review</span>
      </div>
    </div>
  );
}

function LoadingState({ step }: { step: number }) {
  return (
    <Card className="min-h-[460px] p-7">
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

      <div className="mt-8 space-y-5 border-t border-[#EDF0F5] pt-6">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

function BriefCard({
  brief,
  meta,
  review,
  onApprove,
  onNeedsReview,
  onDismiss,
}: {
  brief: Brief;
  meta: { source: string; competitor: string };
  review: Review;
  onApprove: () => void;
  onNeedsReview: () => void;
  onDismiss: () => void;
}) {
  const confidenceTone =
    brief.confidence === 'High' ? 'green' : brief.confidence === 'Low' ? 'gray' : 'blue';

  return (
    <Card className="animate-fade-up p-7">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent">
          Experiment Brief
        </span>
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

      <h3 className="mt-4 max-w-xl text-[20px] font-bold leading-snug tracking-[-0.01em]">
        {brief.title}
      </h3>

      {/* sections */}
      <div className="mt-6 space-y-5">
        <BriefRow label="Insight" value={brief.insight} />
        <BriefRow label="Hypothesis" value={brief.hypothesis} />
        <BriefRow label="Recommended Test" value={brief.recommendedTest} />
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#EDF0F5] pt-6 sm:grid-cols-3">
        <div className="rounded-xl bg-ink px-4 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9FC0FF]">
            Primary KPI
          </div>
          <div className="mt-1 text-[14px] font-bold text-white">
            {brief.primaryKPI}
          </div>
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
        </div>
      </div>

      {/* meta */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-[#8A97A8]">
        <span>
          Source · <span className="text-[#5A6B7E]">{meta.source}</span>
        </span>
        <span>
          Competitor · <span className="text-[#5A6B7E]">{meta.competitor}</span>
        </span>
        <span>
          Generated · <span className="text-[#5A6B7E]">Just now</span>
        </span>
      </div>

      {/* approval confirmation */}
      {review === 'approved' && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800 animate-fade-up">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          Approved and added to the Experiments backlog as EXP-013.
        </div>
      )}
      {review === 'revision' && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-medium text-amber-800 animate-fade-up">
          Sent back to the agent with your feedback. It stays in the review
          queue.
        </div>
      )}

      {/* actions */}
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
