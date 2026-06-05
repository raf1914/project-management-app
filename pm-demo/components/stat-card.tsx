import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  accent = "text-slate-500",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={accent}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
