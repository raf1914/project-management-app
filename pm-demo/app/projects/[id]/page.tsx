import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoard, getProject } from "@/lib/data";
import { deleteProject, setProjectStatus } from "@/lib/actions";
import { isOverdue } from "@/lib/format";
import {
  PROJECT_COLOR_META,
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
} from "@/lib/ui";
import { KanbanBoard } from "@/components/kanban";
import { NewTaskForm } from "@/components/new-task-form";
import { MetricTile } from "@/components/metric-tile";
import { Badge, ProgressBar } from "@/components/ui";
import { ConfirmButton } from "@/components/form-buttons";
import {
  CheckIcon,
  ClockIcon,
  FireIcon,
  TrashIcon,
  TrendingUpIcon,
} from "@/components/icons";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return { title: project ? project.name : "Project not found" };
}

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const board = await getBoard(id);
  const tasks = [...board.todo, ...board["in-progress"], ...board.done];
  const total = tasks.length;
  const progress = total ? Math.round((board.done.length / total) * 100) : 0;
  const color = PROJECT_COLOR_META[project.color];

  // Per-project billing / risk, mirroring the dashboard.
  const projectedHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0);
  const currentHours = board.done.reduce((sum, t) => sum + t.estimateHours, 0);
  const overdueCount = tasks.filter(
    (t) => t.status !== "done" && isOverdue(t.dueDate),
  ).length;
  const overBudget = projectedHours > project.budgetHours;

  return (
    <div className="space-y-5">
      <Link
        href="/projects"
        className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neon-cyan/80 transition hover:text-neon-cyan hover:text-glow-sm"
      >
        ← Projects
      </Link>

      {/* Command strip: identity + project actions */}
      <header className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-glow-sm ring-1 ring-inset ring-white/10 ${color.bg} ${color.text}`}
            aria-hidden
          >
            {project.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words font-display text-2xl font-bold leading-none tracking-wide holo-text">
                {project.name}
              </h1>
              <Badge className={`shrink-0 ${PROJECT_STATUS_META[project.status].badge}`}>
                {PROJECT_STATUS_META[project.status].label}
              </Badge>
            </div>
            {project.description && (
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {PROJECT_STATUSES.map((status) => {
            const isCurrent = status === project.status;
            return (
              <form
                key={status}
                action={setProjectStatus.bind(null, project.id, status)}
              >
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    isCurrent
                      ? "bg-neon-purple/20 text-neon-purple text-glow-sm ring-1 ring-inset ring-neon-purple/50"
                      : "border border-white/10 text-ink-muted hover:border-neon-cyan/50 hover:text-neon-cyan"
                  }`}
                >
                  {PROJECT_STATUS_META[status].label}
                </button>
              </form>
            );
          })}
          <form action={deleteProject.bind(null, project.id)}>
            <ConfirmButton
              confirmMessage={`Delete project "${project.name}" and all its tasks?`}
              className="inline-flex items-center gap-1.5 rounded-md border border-neon-red/40 bg-neon-red/5 px-2.5 py-1 text-xs font-medium text-neon-red/80 transition hover:bg-neon-red/15 hover:text-neon-red hover:shadow-[0_0_18px_-6px_rgba(255,77,109,0.9)] disabled:opacity-60"
            >
              <TrashIcon width={14} height={14} />
              Delete
            </ConfirmButton>
          </form>
        </div>
      </header>

      {/* Completion + per-project billing / risk */}
      <section className="panel p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Overall Completion
        </h2>
        <p className="mt-2 font-display text-6xl font-bold leading-none holo-text">
          {progress}
          <span className="text-3xl">%</span>
        </p>
        <p className="mt-1.5 text-xs uppercase tracking-wider text-ink-muted">
          {board.done.length}/{total} tasks
        </p>
        <div className="mt-5">
          <ProgressBar value={progress} barClass={`${color.bar} ${color.text}`} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricTile
            icon={<TrendingUpIcon width={16} height={16} />}
            value={`${projectedHours}h`}
            label="Projected billable"
            tone="text-neon-cyan"
          />
          <MetricTile
            icon={<CheckIcon width={16} height={16} />}
            value={`${currentHours}h`}
            label="Current billable"
            tone="text-neon-green"
          />
          <MetricTile
            icon={<ClockIcon width={16} height={16} />}
            value={overdueCount}
            label="Overdue"
            tone="text-neon-orange"
          />
          <MetricTile
            icon={<FireIcon width={16} height={16} />}
            value={`${projectedHours}/${project.budgetHours}h`}
            label="Budget"
            tone={overBudget ? "text-neon-red" : "text-neon-purple"}
          />
        </div>
      </section>

      {/* Add task */}
      <NewTaskForm projectId={project.id} />

      {/* Board */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Board
        </h2>
        <KanbanBoard board={board} />
      </section>
    </div>
  );
}
