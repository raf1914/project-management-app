"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTask } from "@/lib/actions";
import { formatDate, isOverdue } from "@/lib/format";
import { PRIORITY_META } from "@/lib/ui";
import type { Task } from "@/lib/types";
import { Avatar, Badge } from "./ui";
import { ConfirmButton } from "./form-buttons";
import { ClockIcon, TrashIcon } from "./icons";

export function TaskCard({ task }: { task: Task }) {
  const priority = PRIORITY_META[task.priority];
  const overdue = task.status !== "done" && isOverdue(task.dueDate);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <article
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("taskStatus", task.status);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`relative rounded-lg border border-white/10 bg-[#0e0524]/70 p-3 backdrop-blur-sm transition-[border-color,opacity] hover:border-white/20 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/projects/${task.projectId}/tasks/${task.id}`}
          draggable={false}
          className="min-w-0 break-words text-sm font-medium leading-snug text-ink transition-colors hover:text-neon-cyan after:absolute after:inset-0 after:content-['']"
        >
          {task.title}
        </Link>
        <Badge className={`relative z-10 shrink-0 ${priority.badge}`}>{priority.label}</Badge>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-ink-muted">
          {task.description}
        </p>
      )}

      <p className="mt-2 text-[10px] text-ink-muted/40">
        Added {formatDate(task.createdAt)}
      </p>

      <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
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
