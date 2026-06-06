"use client";

import { useOptimistic, useTransition, useState } from "react";
import { setTaskStatus } from "@/lib/actions";
import { STATUS_META, TASK_STATUSES } from "@/lib/ui";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./task-card";

const OVER_RING: Record<TaskStatus, string> = {
  "todo":        "ring-2 ring-inset ring-neon-cyan/40 bg-neon-cyan/[0.04]",
  "in-progress": "ring-2 ring-inset ring-neon-orange/40 bg-neon-orange/[0.04]",
  "done":        "ring-2 ring-inset ring-neon-green/40 bg-neon-green/[0.04]",
};

function KanbanColumn({
  status,
  tasks,
  onDrop,
}: {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (taskId: string, fromStatus: TaskStatus) => void;
}) {
  const meta = STATUS_META[status];
  const [dragCount, setDragCount] = useState(0);
  const isOver = dragCount > 0;

  return (
    <section
      className={`panel flex flex-col border-t-4 transition-[box-shadow,background-color] ${meta.column} ${
        isOver ? OVER_RING[status] : ""
      }`}
      onDragEnter={() => setDragCount((c) => c + 1)}
      onDragLeave={() => setDragCount((c) => Math.max(0, c - 1))}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDragCount(0);
        const taskId = e.dataTransfer.getData("taskId");
        const fromStatus = e.dataTransfer.getData("taskStatus") as TaskStatus;
        if (taskId && fromStatus !== status) onDrop(taskId, fromStatus);
      }}
      aria-label={meta.label}
    >
      <header className="flex items-center justify-between px-3 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full shadow-[0_0_8px_2px] ${meta.dot}`}
            aria-hidden
          />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            {meta.label}
          </h3>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-ink-muted ring-1 ring-inset ring-white/10">
          {tasks.length}
        </span>
      </header>

      <div className="flex min-h-24 flex-1 flex-col gap-2 p-3 pt-1">
        {tasks.length === 0 ? (
          <p
            className={`rounded-lg border border-dashed py-6 text-center text-xs transition-colors ${
              isOver
                ? "border-white/25 text-ink-muted/80"
                : "border-white/10 text-ink-muted/60"
            }`}
          >
            {isOver ? "Release to move here" : "No tasks"}
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
  const [, startTransition] = useTransition();
  const [optimisticBoard, moveOptimistic] = useOptimistic(
    board,
    (
      state,
      {
        taskId,
        fromStatus,
        toStatus,
      }: { taskId: string; fromStatus: TaskStatus; toStatus: TaskStatus },
    ) => {
      const task = state[fromStatus].find((t) => t.id === taskId);
      if (!task) return state;
      return {
        ...state,
        [fromStatus]: state[fromStatus].filter((t) => t.id !== taskId),
        [toStatus]: [...state[toStatus], { ...task, status: toStatus }],
      };
    },
  );

  function handleDrop(taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) {
    startTransition(async () => {
      moveOptimistic({ taskId, fromStatus, toStatus });
      await setTaskStatus(taskId, toStatus);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={optimisticBoard[status]}
          onDrop={(taskId, fromStatus) => handleDrop(taskId, fromStatus, status)}
        />
      ))}
    </div>
  );
}
