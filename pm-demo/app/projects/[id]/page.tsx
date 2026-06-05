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
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Projects
        </Link>
      </div>

      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ${color.bg} ${color.text}`}
              aria-hidden
            >
              {project.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">
                  {project.name}
                </h1>
                <Badge className={`shrink-0 ${PROJECT_STATUS_META[project.status].badge}`}>
                  {PROJECT_STATUS_META[project.status].label}
                </Badge>
              </div>
              {project.description && (
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <form action={deleteProject.bind(null, project.id)}>
            <ConfirmButton
              confirmMessage={`Delete project "${project.name}" and all its tasks?`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
            >
              <TrashIcon width={16} height={16} />
              Delete
            </ConfirmButton>
          </form>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-600">Progress</span>
              <span>
                {board.done.length}/{total} tasks · {progress}%
              </span>
            </div>
            <ProgressBar value={progress} barClass={color.bar} />
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-xs font-medium text-slate-500">Status:</span>
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
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-slate-800 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
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
