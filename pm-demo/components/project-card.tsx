import Link from "next/link";
import { formatDate } from "@/lib/format";
import { PROJECT_COLOR_META, PROJECT_STATUS_META } from "@/lib/ui";
import type { ProjectWithStats } from "@/lib/types";
import { Badge, ProgressBar } from "./ui";
import { CheckIcon, ListIcon } from "./icons";

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  const color = PROJECT_COLOR_META[project.color];
  const status = PROJECT_STATUS_META[project.status];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${color.bg} ${color.text}`}
            aria-hidden
          >
            {project.name.slice(0, 2).toUpperCase()}
          </span>
          <h3 className="min-w-0 break-words font-semibold text-slate-800 group-hover:text-indigo-700">
            {project.name}
          </h3>
        </div>
        <Badge className={`shrink-0 ${status.badge}`}>{status.label}</Badge>
      </div>

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex-1" />

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-600">{project.progress}% complete</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ListIcon width={14} height={14} />
              {project.taskCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckIcon width={14} height={14} />
              {project.doneCount}
            </span>
          </span>
        </div>
        <ProgressBar value={project.progress} barClass={color.bar} />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Created {formatDate(project.createdAt)}
      </p>
    </Link>
  );
}
