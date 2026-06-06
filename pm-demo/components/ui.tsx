/**
 * @file Small server-safe presentational primitives (Badge, ProgressBar, Avatar,
 * EmptyState) shared across the application.
 */

import type { ReactNode } from "react";

/** Small presentational primitives shared across the app (all server-safe). */

export function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  barClass = "bg-neon-purple text-neon-purple",
}: {
  value: number;
  barClass?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/10"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all shadow-[0_0_16px_-2px_currentColor] ${barClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      title={name}
      role="img"
      aria-label={name}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-purple/20 text-[11px] font-semibold text-neon-purple ring-1 ring-inset ring-neon-purple/40"
    >
      {initials(name)}
    </span>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neon-purple/30 bg-white/[0.03] px-6 py-12 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
