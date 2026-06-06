import type { ReactNode } from "react";

/** Compact KPI tile (billing / risk metrics) shared across dashboard + detail. */
export function MetricTile({
  icon,
  value,
  label,
  tone,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <span className={tone}>{icon}</span>
      <p className={`mt-1.5 font-display text-2xl font-bold leading-none ${tone}`}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
    </div>
  );
}
