import Link from "next/link";
import { getDashboardStats, getProjects } from "@/lib/data";
import { Badge, EmptyState, ProgressBar } from "@/components/ui";
import { PROJECT_COLOR_META, PROJECT_STATUS_META } from "@/lib/ui";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon,
} from "@/components/icons";

// In-memory data is mutated by Server Actions, so always render fresh.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, projects] = await Promise.all([
    getDashboardStats(),
    getProjects(),
  ]);
  const recent = projects.slice(0, 4);

  const telemetry = [
    {
      label: "Projects",
      value: stats.projectCount,
      hint: `${stats.activeProjectCount} active`,
      icon: <FolderIcon width={18} height={18} />,
      tone: "text-neon-purple",
    },
    {
      label: "In Progress",
      value: stats.inProgressCount,
      hint: `${stats.todoCount} still to do`,
      icon: <ClockIcon width={18} height={18} />,
      tone: "text-neon-cyan",
    },
    {
      label: "Completed",
      value: stats.doneCount,
      hint: `of ${stats.taskCount} tasks`,
      icon: <CheckIcon width={18} height={18} />,
      tone: "text-neon-green",
    },
    {
      label: "Overdue",
      value: stats.overdueCount,
      hint: "past due date",
      icon: <AlertIcon width={18} height={18} />,
      tone: "text-neon-red",
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
        {/* Completion — the single hero metric (wide) */}
        <section className="panel flex flex-col justify-center p-6 lg:col-span-2">
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
        </section>

        {/* Telemetry stack (tall, right rail) — owns all the counts */}
        <section className="panel flex flex-col p-0 lg:col-span-1 lg:row-span-2">
          <h2 className="border-b border-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            System Status
          </h2>
          <ul className="flex flex-1 flex-col divide-y divide-white/5">
            {telemetry.map((t) => (
              <li
                key={t.label}
                className="flex flex-1 items-center gap-3 px-5 py-4"
              >
                <span className={`${t.tone} text-glow`}>{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{t.label}</p>
                  <p className="text-xs text-ink-muted">{t.hint}</p>
                </div>
                <span className={`font-display text-2xl font-bold ${t.tone}`}>
                  {t.value}
                </span>
              </li>
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
              {recent.map((project) => {
                const color = PROJECT_COLOR_META[project.color];
                const status = PROJECT_STATUS_META[project.status];
                return (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span
                        className={`h-9 w-1 shrink-0 rounded-full ${color.bar}`}
                        aria-hidden
                      />
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold text-glow-sm ring-1 ring-inset ring-white/10 ${color.bg} ${color.text}`}
                        aria-hidden
                      >
                        {project.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink transition-colors group-hover:text-neon-cyan">
                          {project.name}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="w-28 max-w-[40%]">
                            <ProgressBar
                              value={project.progress}
                              barClass={`${color.bar} ${color.text}`}
                            />
                          </div>
                          <span className="text-xs text-ink-muted">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <Badge className={`hidden shrink-0 sm:inline-flex ${status.badge}`}>
                        {status.label}
                      </Badge>
                      <span className="hidden shrink-0 text-xs text-ink-muted md:block">
                        {project.doneCount}/{project.taskCount}
                      </span>
                      <span className="shrink-0 text-ink-muted/50 transition-colors group-hover:text-neon-cyan">
                        <ArrowRightIcon width={16} height={16} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

