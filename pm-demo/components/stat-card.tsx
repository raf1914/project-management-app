import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  accent = "text-neon-cyan",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="panel panel-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          {label}
        </p>
        <span className={`${accent} text-glow`}>{icon}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
