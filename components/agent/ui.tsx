'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* ---------------------------------- Button --------------------------------- */

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-[#3557C7] active:bg-[#2F4EB5] shadow-[0_1px_2px_rgba(16,42,77,.18)] disabled:opacity-50',
  outline:
    'bg-white text-ink border border-[#D8DFE8] hover:bg-[#F5F7FA] active:bg-[#EEF1F5] disabled:opacity-50',
  ghost:
    'text-[#667085] hover:bg-[#F2F4F8] hover:text-ink active:bg-[#EAEDF2] disabled:opacity-50',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_1px_2px_rgba(16,42,77,.18)] disabled:opacity-50',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'h-9 px-3.5 text-[13.5px] rounded-lg gap-2',
  lg: 'h-11 px-5 text-[14px] rounded-xl gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}) {
  return (
    <button
      className={cx(
        'focusable inline-flex select-none items-center justify-center font-semibold transition-all duration-150',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ----------------------------------- Card ---------------------------------- */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-[#E7EBF1] bg-white shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

type BadgeTone = 'orange' | 'green' | 'blue' | 'gray' | 'amber';

const badgeTones: Record<BadgeTone, string> = {
  orange: 'bg-[#FFF4ED] text-[#B15738] border-[#F5DCCB]',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-accent-soft text-accent border-accent-line',
  gray: 'bg-[#F2F4F8] text-[#5A6B7E] border-[#E3E8EF]',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function Badge({
  tone = 'gray',
  dot = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]',
        badgeTones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ---------------------------------- Field ---------------------------------- */

export function Label({
  className,
  children,
  htmlFor,
}: {
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx(
        'block text-[12px] font-semibold text-[#5A6B7E]',
        className,
      )}
    >
      {children}
    </label>
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        'focusable h-9 w-full rounded-lg border border-[#D8DFE8] bg-white pl-3 pr-9 text-[13.5px] font-medium text-ink transition-colors hover:border-[#C3CCD9] disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        'focusable w-full rounded-xl border border-[#D8DFE8] bg-white px-3.5 py-3 text-[13.5px] leading-relaxed text-ink transition-colors hover:border-[#C3CCD9] disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------------- Skeleton -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton', className)} />;
}
