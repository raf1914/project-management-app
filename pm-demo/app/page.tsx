import Link from "next/link";
import { getDashboardStats, getProjects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { StatCard } from "@/components/stat-card";
import { EmptyState, ProgressBar } from "@/components/ui";
import {
  AlertIcon,
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
  const recent = projects.slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink text-glow-sm">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            An overview of your projects and tasks.
          </p>
        </div>
        <Link href="/projects/new" className="btn-neon">
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.projectCount}
          accent="text-neon-purple"
          icon={<FolderIcon />}
          hint={`${stats.activeProjectCount} active`}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressCount}
          accent="text-neon-cyan"
          icon={<ClockIcon />}
          hint={`${stats.todoCount} still to do`}
        />
        <StatCard
          label="Completed"
          value={stats.doneCount}
          accent="text-neon-green"
          icon={<CheckIcon />}
          hint={`of ${stats.taskCount} tasks`}
        />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          accent="text-neon-red"
          icon={<AlertIcon />}
          hint="past due date"
        />
      </section>

      <section className="panel p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Overall completion
          </h2>
          <span className="font-display text-sm font-bold text-neon-green text-glow-sm">
            {stats.completionRate}%
          </span>
        </div>
        <ProgressBar value={stats.completionRate} barClass="bg-neon-green text-neon-green" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
            Recent projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-neon-cyan transition hover:text-glow-sm"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
