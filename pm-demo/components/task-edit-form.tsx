"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateTask, deleteTaskAndRedirect, type FormState } from "@/lib/actions";
import { CheckIcon, AlertIcon, ClockIcon, TrashIcon } from "./icons";
import { SelectField } from "./select-field";
import { DateField } from "./date-field";
import { SpinButtons } from "./spin-buttons";
import { ConfirmButton } from "./form-buttons";
import { TASK_STATUSES, STATUS_META, PRIORITY_META } from "@/lib/ui";
import { formatDate, isOverdue } from "@/lib/format";
import type { Task, Project, Priority, TaskStatus } from "@/lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const field = "field";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted"
    >
      {children}
    </label>
  );
}

export function TaskEditForm({
  task,
  project,
  teamMembers,
}: {
  task: Task;
  project: Project;
  teamMembers: string[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    updateTask,
    null,
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);

  const overdue = status !== "done" && isOverdue(task.dueDate);

  return (
    <div className="space-y-6">
      {/* ── Header row ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href={`/projects/${project.id}`}
            className="font-semibold uppercase tracking-[0.18em] text-[11px] text-neon-cyan/80 transition hover:text-neon-cyan hover:text-glow-sm"
          >
            ← {project.name}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {state?.error && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-neon-red text-glow-sm">
              <AlertIcon width={14} height={14} />
              {state.error}
            </span>
          )}
          {state?.ok && !pending && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-neon-green text-glow-sm">
              <CheckIcon width={14} height={14} />
              Saved
            </span>
          )}
          {/* Delete — its own form so it stays outside the update form */}
          <form action={deleteTaskAndRedirect.bind(null, task.id, project.id)}>
            <ConfirmButton
              confirmMessage={`Delete "${task.title}"?`}
              className="btn-ghost flex items-center gap-1.5 border-neon-red/25 text-neon-red/60 hover:border-neon-red/50 hover:bg-neon-red/5 hover:text-neon-red"
            >
              <TrashIcon width={13} height={13} />
              Delete
            </ConfirmButton>
          </form>
          {/* Save references the update form by id */}
          <button
            type="submit"
            form="task-edit"
            disabled={pending}
            className="btn-neon"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* ── Two-column edit layout ───────────────────────────────────── */}
      <form id="task-edit" action={formAction}>
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="priority" value={priority} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left — title, status, description */}
          <div className="space-y-4 lg:col-span-7">
            <div className="panel p-5">
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <input
                id="task-title"
                name="title"
                required
                maxLength={200}
                defaultValue={task.title}
                placeholder="Task title"
                autoComplete="off"
                className={`${field} text-[15px] font-semibold`}
              />
            </div>

            <div className="panel p-5">
              <FieldLabel>Status</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {TASK_STATUSES.map((s) => {
                  const meta = STATUS_META[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-all ${
                        active
                          ? `${meta.badge} scale-[1.03]`
                          : "text-ink-muted/50 ring-white/10 hover:text-ink-muted hover:ring-white/20"
                      }`}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="panel p-5">
              <FieldLabel htmlFor="task-description">Description</FieldLabel>
              <textarea
                id="task-description"
                name="description"
                rows={9}
                maxLength={2000}
                defaultValue={task.description}
                placeholder="Add context, acceptance criteria, or links…"
                className={`${field} resize-y`}
              />
            </div>
          </div>

          {/* Right — meta fields + metadata */}
          <aside className="space-y-4 lg:col-span-5">
            <div className="panel divide-y divide-white/[0.06] p-5">
              {/* Priority */}
              <div className="pb-5">
                <FieldLabel>Priority</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => {
                    const meta = PRIORITY_META[p];
                    const active = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-all ${
                          active
                            ? `${meta.badge} scale-[1.03]`
                            : "text-ink-muted/50 ring-white/10 hover:text-ink-muted hover:ring-white/20"
                        }`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assignee */}
              <div className="py-5">
                <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
                <SelectField
                  id="task-assignee"
                  name="assignee"
                  defaultValue={task.assignee === "Unassigned" ? "" : task.assignee}
                  searchable
                  options={[
                    { value: "", label: "Unassigned" },
                    ...teamMembers.map((m) => ({ value: m, label: m })),
                  ]}
                />
              </div>

              {/* Due date */}
              <div className="py-5">
                <FieldLabel htmlFor="task-due">Due date</FieldLabel>
                <DateField
                  id="task-due"
                  name="dueDate"
                  defaultValue={task.dueDate ?? ""}
                />
                {overdue && (
                  <p className="mt-1.5 text-xs font-medium text-neon-red text-glow-sm">
                    Overdue · was due {formatDate(task.dueDate)}
                  </p>
                )}
              </div>

              {/* Estimate hours */}
              <div className="py-5">
                <FieldLabel htmlFor="task-estimate">Estimate</FieldLabel>
                <div className="relative">
                  <ClockIcon
                    width={12}
                    height={12}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted/50"
                  />
                  <input
                    id="task-estimate"
                    name="estimateHours"
                    type="number"
                    min={0}
                    step={0.5}
                    defaultValue={task.estimateHours}
                    className={`${field} pl-7 pr-14 [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-9 flex items-center text-[11px] font-medium text-ink-muted/80">
                    h
                  </span>
                  <SpinButtons inputId="task-estimate" />
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-5 space-y-1 text-xs text-ink-muted/50">
                <p>Added {formatDate(task.createdAt)}</p>
                <p className="font-mono">{task.id}</p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
