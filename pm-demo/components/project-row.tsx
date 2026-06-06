import Link from "next/link";
import { PROJECT_COLOR_META, PROJECT_STATUS_META } from "@/lib/ui";
import type { ProjectWithStats } from "@/lib/types";
import { Badge, ProgressBar } from "./ui";
import { ArrowRightIcon } from "./icons";

/**
 * A clickable project "mission row" — the shared list item used by the
 * dashboard's recent list and the Projects page.
 */
export function ProjectRow({ project }: { project: ProjectWithStats }) {
  const color = PROJECT_COLOR_META[project.color];
  const status = PROJECT_STATUS_META[project.status];
  return (
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
          <span className="text-xs text-ink-muted">{project.progress}%</span>
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
  );
}
