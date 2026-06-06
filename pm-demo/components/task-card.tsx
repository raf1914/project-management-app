/**
 * @file TaskCard component that renders a single kanban task with priority
 * badge, assignee, due date, status-move arrows, and a delete action.
 */

import { deleteTask, setTaskStatus } from "@/lib/actions";
import { formatDate, isOverdue } from "@/lib/format";
import { PRIORITY_META, STATUS_META, nextStatus, prevStatus } from "@/lib/ui";
import type { Task } from "@/lib/types";
import { Avatar, Badge } from "./ui";
import { ConfirmButton, SubmitButton } from "./form-buttons";
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, TrashIcon } from "./icons";

/**
 * A single task on the kanban board. Status moves and deletion are plain forms
 * bound to Server Actions, so they work even without client JavaScript
 * (progressive enhancement); the submit buttons add a pending state on top.
 */
export function TaskCard({ task }: { task: Task }) {
  const priority = PRIORITY_META[task.priority];
  const prev = prevStatus(task.status);
  const next = nextStatus(task.status);
  const overdue = task.status !== "done" && isOverdue(task.dueDate);

  return (
    <article className="rounded-lg border border-white/10 bg-[#0e0524]/70 p-3 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 break-words text-sm font-medium leading-snug text-ink">
          {task.title}
        </h4>
        <Badge className={`shrink-0 ${priority.badge}`}>{priority.label}</Badge>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-ink-muted">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Avatar name={task.assignee} />
          <span>{task.assignee}</span>
          {task.dueDate && (
            <span className={`flex items-center gap-0.5 ${overdue ? "font-semibold text-neon-red text-glow-sm" : ""}`}>
              <span className="text-ink-muted/50">·</span>
              {overdue ? "Overdue " : "Due "}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-ink-muted/70 ring-1 ring-inset ring-white/10">
            <ClockIcon width={10} height={10} />
            {task.estimateHours}h
          </span>
          {prev && (
            <form action={setTaskStatus.bind(null, task.id, prev)}>
              <SubmitButton
                className="rounded-md p-1 text-ink-muted/70 transition-colors hover:bg-white/10 hover:text-neon-cyan disabled:opacity-50"
              >
                <span className="sr-only">Move to {STATUS_META[prev].label}</span>
                <ArrowLeftIcon width={16} height={16} />
              </SubmitButton>
            </form>
          )}
          {next && (
            <form action={setTaskStatus.bind(null, task.id, next)}>
              <SubmitButton
                className="rounded-md p-1 text-ink-muted/70 transition-colors hover:bg-white/10 hover:text-neon-cyan disabled:opacity-50"
              >
                <span className="sr-only">Move to {STATUS_META[next].label}</span>
                <ArrowRightIcon width={16} height={16} />
              </SubmitButton>
            </form>
          )}
          <form action={deleteTask.bind(null, task.id)}>
            <ConfirmButton
              confirmMessage={`Delete task "${task.title}"?`}
              title="Delete task"
              className="rounded-md p-1 text-ink-muted/70 transition-colors hover:bg-neon-red/10 hover:text-neon-red disabled:opacity-50"
            >
              <span className="sr-only">Delete task</span>
              <TrashIcon width={16} height={16} />
            </ConfirmButton>
          </form>
        </div>
      </div>
    </article>
  );
}
