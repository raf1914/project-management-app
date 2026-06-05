"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type FormState } from "@/lib/actions";
import { PlusIcon } from "./icons";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

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

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <label className="sr-only" htmlFor="task-title">
            Task title
          </label>
          <input
            id="task-title"
            name="title"
            required
            maxLength={200}
            placeholder="Add a task…"
            className={field}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="sr-only" htmlFor="task-assignee">
            Assignee
          </label>
          <input
            id="task-assignee"
            name="assignee"
            maxLength={80}
            placeholder="Assignee"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="sr-only" htmlFor="task-priority">
            Priority
          </label>
          <select id="task-priority" name="priority" defaultValue="medium" className={field}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="sr-only" htmlFor="task-due">
            Due date
          </label>
          <input id="task-due" type="date" name="dueDate" className={field} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-rose-600" aria-live="polite">
          {state?.error ?? ""}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          <PlusIcon width={16} height={16} />
          {pending ? "Adding…" : "Add task"}
        </button>
      </div>
    </form>
  );
}
