import './agent.css';
import type { Metadata } from 'next';
import {
  LayoutDashboard,
  Building2,
  Radio,
  FlaskConical,
  Sparkles,
  Search,
  Bell,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agent — Growth Intelligence',
  description:
    'Monitor competitor activity and automatically generate review-ready experiment briefs.',
};

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Competitors', icon: Building2 },
  { label: 'Signals', icon: Radio },
  { label: 'Experiments', icon: FlaskConical },
  { label: 'Agent', icon: Sparkles, active: true },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gia flex min-h-screen bg-canvas text-ink">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] flex-col border-r border-[#E7EBF1] bg-white md:flex">
        <div className="flex items-center gap-2.5 px-5 pb-5 pt-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <Sparkles className="h-4 w-4 text-[#9FC0FF]" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className="text-[13.5px] font-bold tracking-[-0.01em]">
              Growth Intelligence
            </div>
            <div className="text-[10.5px] font-medium text-[#8A97A8]">
              Stripes Beauty
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'flex items-center gap-2.5 rounded-lg bg-accent-soft px-3 py-2 text-[13.5px] font-semibold text-accent'
                  : 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-[#5A6B7E] transition-colors hover:bg-[#F5F7FA] hover:text-ink'
              }
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.2 : 2} />
              {label}
            </a>
          ))}
        </nav>

        <div className="border-t border-[#EDF0F5] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF1FE] text-[11px] font-bold text-accent">
              YG
            </div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold">Yoav Gersi</div>
              <div className="text-[10.5px] text-[#8A97A8]">Product Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-[232px]">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#E7EBF1] bg-white/85 px-6 backdrop-blur">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#8A97A8]">
            <span>Workspace</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-ink">Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-56 items-center gap-2 rounded-lg border border-[#E3E8EF] bg-[#FAFBFC] px-2.5 text-[12.5px] text-[#9AA6B5] lg:flex">
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="ml-auto rounded border border-[#E3E8EF] bg-white px-1.5 py-px text-[10px] font-semibold text-[#8A97A8]">
                ⌘K
              </kbd>
            </div>
            <button
              aria-label="Notifications"
              className="focusable relative flex h-8 w-8 items-center justify-center rounded-lg text-[#5A6B7E] transition-colors hover:bg-[#F2F4F8]"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
