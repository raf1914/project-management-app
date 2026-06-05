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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            An overview of your projects and tasks.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.projectCount}
          accent="text-indigo-500"
          icon={<FolderIcon />}
          hint={`${stats.activeProjectCount} active`}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressCount}
          accent="text-blue-500"
          icon={<ClockIcon />}
          hint={`${stats.todoCount} still to do`}
        />
        <StatCard
          label="Completed"
          value={stats.doneCount}
          accent="text-emerald-500"
          icon={<CheckIcon />}
          hint={`of ${stats.taskCount} tasks`}
        />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          accent="text-rose-500"
          icon={<AlertIcon />}
          hint="past due date"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Overall completion
          </h2>
          <span className="text-sm font-semibold text-slate-900">
            {stats.completionRate}%
          </span>
        </div>
        <ProgressBar value={stats.completionRate} barClass="bg-emerald-500" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start tracking tasks."
            action={
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
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
