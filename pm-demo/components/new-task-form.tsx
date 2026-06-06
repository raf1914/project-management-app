"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createTask, type FormState } from "@/lib/actions";
import { CheckIcon, AlertIcon } from "./icons";
import { SelectField } from "./select-field";
import { DateField } from "./date-field";

const field = "field";
const TITLE_MAX = 200;

/** Small uppercase field label, matching the console aesthetic. */
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted"
    >
      {children}
    </label>
  );
}

/**
 * Inline "add task" form. Uses `useActionState` for the pending flag and
 * server-returned validation errors, and resets itself after a successful add.
 */
export function NewTaskForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createTask,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  // The custom Select/Date fields hold their own state, so a native form.reset()
  // won't clear them. Bumping this key remounts them back to their defaults.
  const [resetKey, setResetKey] = useState(0);

  function resetForm() {
    formRef.current?.reset();
    setTitle("");
    setResetKey((k) => k + 1);
  }

  useEffect(() => {
    if (state?.ok) resetForm();
  }, [state]);

  const titleEmpty = title.trim().length === 0;

  return (
    <form ref={formRef} action={formAction} className="panel relative z-30 p-4">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        {/* Title — spans the full row on its own so it has room to breathe. */}
        <div className="sm:col-span-12">
          <div className="flex items-baseline justify-between">
            <FieldLabel htmlFor="task-title">Task</FieldLabel>
            <span
              className={`text-[10px] tabular-nums ${
                title.length > TITLE_MAX * 0.9 ? "text-neon-orange" : "text-ink-muted/60"
              }`}
            >
              {title.length}/{TITLE_MAX}
            </span>
          </div>
          <input
            id="task-title"
            name="title"
            required
            maxLength={TITLE_MAX}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to get done?"
            autoComplete="off"
            aria-invalid={Boolean(state?.error) && titleEmpty}
            className={field}
          />
        </div>

        <div className="sm:col-span-4">
          <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
          <input
            id="task-assignee"
            name="assignee"
            maxLength={80}
            placeholder="Unassigned"
            autoComplete="off"
            className={field}
          />
        </div>
        <div className="sm:col-span-3">
          <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
          <SelectField
            key={`priority-${resetKey}`}
            id="task-priority"
            name="priority"
            defaultValue="medium"
            aria-label="Priority"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="task-status">Status</FieldLabel>
          <SelectField
            key={`status-${resetKey}`}
            id="task-status"
            name="status"
            defaultValue="todo"
            aria-label="Status"
            options={[
              { value: "todo", label: "To Do" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <FieldLabel htmlFor="task-due">Due date</FieldLabel>
          <DateField
            key={`due-${resetKey}`}
            id="task-due"
            name="dueDate"
            aria-label="Due date"
          />
        </div>

        {/* Optional details. */}
        <div className="sm:col-span-12">
          <FieldLabel htmlFor="task-description">Details (optional)</FieldLabel>
          <textarea
            id="task-description"
            name="description"
            rows={2}
            maxLength={2000}
            placeholder="Add context, acceptance criteria, or links…"
            className={`${field} resize-y`}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="flex min-h-[1.25rem] items-center gap-1.5 text-sm font-medium"
          aria-live="polite"
        >
          {state?.error ? (
            <span className="flex items-center gap-1.5 text-neon-red text-glow-sm">
              <AlertIcon width={14} height={14} />
              {state.error}
            </span>
          ) : state?.ok ? (
            <span className="flex items-center gap-1.5 text-neon-green text-glow-sm">
              <CheckIcon width={14} height={14} />
              Task added.
            </span>
          ) : null}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={pending}
            className="btn-ghost"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={pending}
            className="btn-neon"
          >
            {pending ? "Adding…" : "Add task"}
          </button>
        </div>
      </div>
    </form>
  );
}
