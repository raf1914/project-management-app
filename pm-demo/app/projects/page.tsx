import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import { EmptyState } from "@/components/ui";
import { ProjectRow } from "@/components/project-row";
import { PlusIcon } from "@/components/icons";
import { PROJECT_STATUSES, PROJECT_STATUS_META } from "@/lib/ui";
import type { ProjectStatus, ProjectWithStats } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

export const dynamic = "force-dynamic";

/** Per-status accent classes for the group headers (dot, rail, text). */
const GROUP_ACCENT: Record<
  ProjectStatus,
  { dot: string; text: string; rail: string }
> = {
  active: {
    dot: "bg-neon-green text-neon-green",
    text: "text-neon-green",
    rail: "bg-neon-green/60",
  },
  "on-hold": {
    dot: "bg-neon-orange text-neon-orange",
    text: "text-neon-orange",
    rail: "bg-neon-orange/60",
  },
  completed: {
    dot: "bg-neon-purple text-neon-purple",
    text: "text-neon-purple",
    rail: "bg-neon-purple/60",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const activeCount = projects.filter((p) => p.status === "active").length;

  // Group projects by status, preserving the canonical status order and the
  // createdAt sort already applied by getProjects().
  const groups = PROJECT_STATUSES.map((status) => ({
    status,
    items: projects.filter((p) => p.status === status),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {/* Command strip */}
      <header className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-none tracking-wide holo-text">
            Projects
          </h1>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
            {activeCount} active
          </p>
        </div>
        <Link href="/projects/new" className="btn-neon">
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      {projects.length === 0 ? (
        <section className="panel p-6">
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
        </section>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <StatusGroup
              key={group.status}
              status={group.status}
              items={group.items}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusGroup({
  status,
  items,
}: {
  status: ProjectStatus;
  items: ProjectWithStats[];
}) {
  const accent = GROUP_ACCENT[status];
  const meta = PROJECT_STATUS_META[status];

  // Aggregate roll-ups for the group, shown in the header.
  const taskTotal = items.reduce((sum, p) => sum + p.taskCount, 0);
  const doneTotal = items.reduce((sum, p) => sum + p.doneCount, 0);
  const avgProgress = Math.round(
    items.reduce((sum, p) => sum + p.progress, 0) / items.length,
  );

  return (
    <section className="panel overflow-hidden p-0">
      <header className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
        <span className={`h-7 w-1 rounded-full ${accent.rail}`} aria-hidden />
        <span
          className={`h-2 w-2 rounded-full shadow-[0_0_10px_currentColor] ${accent.dot}`}
          aria-hidden
        />
        <h2
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent.text}`}
        >
          {meta.label}
        </h2>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-muted ring-1 ring-inset ring-white/10">
          {items.length}
        </span>
        <span className="ml-auto hidden text-[11px] uppercase tracking-[0.18em] text-ink-muted sm:block">
          {doneTotal}/{taskTotal} tasks · {avgProgress}% avg
        </span>
      </header>

      <ul className="divide-y divide-white/5">
        {items.map((project) => (
          <li key={project.id}>
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
