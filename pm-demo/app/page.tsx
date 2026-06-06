/**
 * @file Dashboard page — the root route that displays overall completion stats,
 * system-status telemetry, and a list of recent projects.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { getDashboardStats, getProjects } from "@/lib/data";
import { EmptyState, ProgressBar } from "@/components/ui";
import { MetricTile } from "@/components/metric-tile";
import { ProjectRow } from "@/components/project-row";
import {
  CheckIcon,
  ClockIcon,
  FireIcon,
  FolderIcon,
  ListIcon,
  PlusIcon,
  TrendingUpIcon,
} from "@/components/icons";

//* In-memory data is mutated by Server Actions, so always render fresh.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, projects] = await Promise.all([
    getDashboardStats(),
    getProjects(),
  ]);
  const recent = projects.slice(0, 4);

  const projectLevel = [
    {
      label: "Projects",
      value: stats.projectCount,
      hint: `${stats.activeProjectCount} active`,
      icon: <FolderIcon width={18} height={18} />,
      tone: "text-neon-purple",
    },
  ];
  const taskLevel = [
    {
      label: "To Do",
      value: stats.todoCount,
      hint: "",
      icon: <ListIcon width={18} height={18} />,
      tone: "text-neon-cyan",
    },
    {
      label: "In Progress",
      value: stats.inProgressCount,
      hint: "",
      icon: <ClockIcon width={18} height={18} />,
      tone: "text-neon-orange",
    },
    {
      label: "Completed",
      value: stats.doneCount,
      hint: "",
      icon: <CheckIcon width={18} height={18} />,
      tone: "text-neon-green",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ===== Command strip ===== */}
      <header className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green text-neon-green shadow-[0_0_10px_2px]" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold uppercase leading-none tracking-wide holo-text">
              Dashboard
            </h1>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
              Mission Control
            </p>
          </div>
        </div>
        <Link href="/projects/new" className="btn-neon">
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      {/* ===== Console grid: wide completion + tall telemetry + mission list ===== */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Completion + key billing / risk metrics (wide) */}
        <section className="panel p-6 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Overall Completion
          </h2>
          <p className="mt-2 font-display text-6xl font-bold leading-none holo-text">
            {stats.completionRate}
            <span className="text-3xl">%</span>
          </p>
          <div className="mt-6">
            <ProgressBar
              value={stats.completionRate}
              barClass="bg-neon-green text-neon-green"
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricTile
              icon={<TrendingUpIcon width={16} height={16} />}
              value={`${stats.projectedHours}h`}
              label="Projected billable"
              tone="text-neon-cyan"
            />
            <MetricTile
              icon={<CheckIcon width={16} height={16} />}
              value={`${stats.currentHours}h`}
              label="Current billable"
              tone="text-neon-green"
            />
            <MetricTile
              icon={<ClockIcon width={16} height={16} />}
              value={stats.overdueCount}
              label="Overdue"
              tone="text-neon-orange"
            />
            <MetricTile
              icon={<FireIcon width={16} height={16} />}
              value={stats.overBudgetCount}
              label="Over budget"
              tone="text-neon-red"
            />
          </div>
        </section>

        {/* Telemetry stack (tall, right rail) — grouped by level */}
        <section className="panel flex flex-col p-0 lg:col-span-1 lg:row-span-2">
          <h2 className="border-b border-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            System Status
          </h2>
          <ul className="flex flex-1 flex-col divide-y divide-white/5">
            <GroupHeader>Project-level</GroupHeader>
            {projectLevel.map((t) => (
              <StatusRow key={t.label} {...t} />
            ))}
            <GroupHeader>Task-level · {stats.taskCount} total</GroupHeader>
            {taskLevel.map((t) => (
              <StatusRow key={t.label} {...t} />
            ))}
          </ul>
        </section>

        {/* Recent projects as a mission list (wide) */}
        <section className="panel p-0 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Recent Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs font-medium text-neon-cyan transition hover:text-glow-sm"
            >
              View all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No projects yet"
                description="Create your first project to start tracking tasks."
                action={
                  <Link href="/projects/new" className="btn-neon">
                    <PlusIcon width={16} height={16} />
                    New Project
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((project) => (
                <li key={project.id}>
                  <ProjectRow project={project} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/** Level divider inside the System Status rail (project- vs task-level). */
function GroupHeader({ children }: { children: ReactNode }) {
  return (
    <li className="bg-white/[0.02] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-muted/80">
      {children}
    </li>
  );
}

/** A single metric row in the System Status rail. */
function StatusRow({
  icon,
  label,
  hint,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  value: ReactNode;
  tone: string;
}) {
  return (
    <li className="flex flex-1 items-center gap-3 px-5 py-3.5">
      <span className={`${tone} text-glow`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
      <span className={`font-display text-2xl font-bold ${tone}`}>{value}</span>
    </li>
  );
}

