import { STATUS_META, TASK_STATUSES } from "@/lib/ui";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./task-card";

function KanbanColumn({
  status,
  tasks,
}: {
  status: TaskStatus;
  tasks: Task[];
}) {
  const meta = STATUS_META[status];
  return (
    <section
      className={`flex flex-col rounded-xl border-t-4 bg-slate-50/80 ${meta.column}`}
      aria-label={meta.label}
    >
      <header className="flex items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />
          <h3 className="text-sm font-semibold text-slate-700">{meta.label}</h3>
        </div>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </header>

      <div className="flex min-h-24 flex-1 flex-col gap-2 p-3 pt-1">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
            No tasks
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({
  board,
}: {
  board: Record<TaskStatus, Task[]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn key={status} status={status} tasks={board[status]} />
      ))}
    </div>
  );
}
