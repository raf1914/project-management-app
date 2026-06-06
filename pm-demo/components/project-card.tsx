import Link from "next/link";
import { formatDate } from "@/lib/format";
import { PROJECT_STATUS_META } from "@/lib/ui";
import type { ProjectWithStats } from "@/lib/types";
import { Badge, ProgressBar } from "./ui";
import { CheckIcon, ListIcon } from "./icons";
import { ProjectAvatar } from "./project-avatar";

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  const status = PROJECT_STATUS_META[project.status];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="panel panel-hover group flex flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ProjectAvatar
            name={project.name}
            color={project.color}
            progress={project.progress}
            overdueCount={project.overdueCount}
            size="md"
          />
          <h3 className="min-w-0 break-words font-semibold text-ink transition-colors group-hover:text-neon-cyan group-hover:text-glow-sm">
            {project.name}
          </h3>
        </div>
        <Badge className={`shrink-0 ${status.badge}`}>{status.label}</Badge>
      </div>

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex-1" />

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
          <span className="font-medium text-neon-cyan/80">{project.progress}% complete</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ListIcon width={14} height={14} />
              {project.taskCount}
            </span>
            <span className="inline-flex items-center gap-1 text-neon-green">
              <CheckIcon width={14} height={14} />
              {project.doneCount}
            </span>
          </span>
        </div>
        <ProgressBar value={project.progress} barClass={`${color.bar} ${color.text}`} />
      </div>

      <p className="mt-3 text-xs text-ink-muted/70">
        Created {formatDate(project.createdAt)}
      </p>
    </Link>
  );
}
