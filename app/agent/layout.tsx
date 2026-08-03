import './agent.css';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Growth Intelligence — Stripes Beauty',
  description:
    'Monitor one competitor page, detect meaningful changes, and turn them into review-ready experiments.',
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gia flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-10 border-b border-[#E7EBF1] bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1080px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <Sparkles className="h-4 w-4 text-[#9FC0FF]" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="text-[13.5px] font-bold tracking-[-0.01em]">
                Growth Intelligence
              </div>
              <div className="text-[10.5px] font-medium text-[#8A97A8]">
                Stripes Beauty · internal prototype
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF1FE] text-[11px] font-bold text-accent">
              YG
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-[12.5px] font-semibold">Yoav Gersi</div>
              <div className="text-[10.5px] text-[#8A97A8]">Product Manager</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-[#EDF0F5] bg-white/60">
        <div className="mx-auto w-full max-w-[1080px] px-6 py-4">
          <p className="text-[11.5px] leading-relaxed text-[#9AA6B5]">
            Prototype scope: one manually triggered monitored page. Production
            would add scheduled scans, additional competitors, Meta Ads
            Library, and server-side storage.
          </p>
        </div>
      </footer>
    </div>
  );
}
