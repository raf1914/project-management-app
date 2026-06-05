import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoard, getProject } from "@/lib/data";
import { deleteProject, setProjectStatus } from "@/lib/actions";
import {
  PROJECT_COLOR_META,
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
} from "@/lib/ui";
import { KanbanBoard } from "@/components/kanban";
import { NewTaskForm } from "@/components/new-task-form";
import { Badge, ProgressBar } from "@/components/ui";
import { ConfirmButton } from "@/components/form-buttons";
import { TrashIcon } from "@/components/icons";

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
  const total =
    board.todo.length + board["in-progress"].length + board.done.length;
  const progress = total
    ? Math.round((board.done.length / total) * 100)
    : 0;
  const color = PROJECT_COLOR_META[project.color];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projects"
          className="text-sm font-medium text-neon-cyan/80 transition hover:text-neon-cyan hover:text-glow-sm"
        >
          ← Projects
        </Link>
      </div>

      <header className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ring-1 ring-inset ring-white/10 text-glow-sm ${color.bg} ${color.text}`}
              aria-hidden
            >
              {project.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="break-words font-display text-2xl font-bold tracking-wide holo-text">
                  {project.name}
                </h1>
                <Badge className={`shrink-0 ${PROJECT_STATUS_META[project.status].badge}`}>
                  {PROJECT_STATUS_META[project.status].label}
                </Badge>
              </div>
              {project.description && (
                <p className="mt-1 max-w-2xl text-sm text-ink-muted">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <form action={deleteProject.bind(null, project.id)}>
            <ConfirmButton
              confirmMessage={`Delete project "${project.name}" and all its tasks?`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neon-red/40 bg-neon-red/5 px-3 py-1.5 text-sm font-medium text-neon-red/80 transition hover:bg-neon-red/15 hover:text-neon-red hover:shadow-[0_0_18px_-6px_rgba(255,77,109,0.9)] disabled:opacity-60"
            >
              <TrashIcon width={16} height={16} />
              Delete
            </ConfirmButton>
          </form>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
              <span className="font-medium uppercase tracking-wider text-neon-cyan/80">Progress</span>
              <span>
                {board.done.length}/{total} tasks · {progress}%
              </span>
            </div>
            <ProgressBar value={progress} barClass={`${color.bar} ${color.text}`} />
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Status:</span>
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
          </div>
        </div>
      </header>

      <NewTaskForm projectId={project.id} />

      <KanbanBoard board={board} />
    </div>
  );
}
