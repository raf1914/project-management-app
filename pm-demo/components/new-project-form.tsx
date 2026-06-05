"use client";

import { useActionState } from "react";
import { createProject, type FormState } from "@/lib/actions";
import { PROJECT_COLORS, PROJECT_COLOR_META } from "@/lib/ui";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createProject,
    null,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
          Project name
        </label>
        <input
          id="name"
          name="name"
          required
          autoFocus
          maxLength={120}
          placeholder="e.g. Website Redesign"
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
          placeholder="What is this project about?"
          className={field}
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-slate-700">
          Accent color
        </legend>
        <div className="flex flex-wrap gap-3">
          {PROJECT_COLORS.map((color, i) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={i === 0}
                aria-label={`${color} accent`}
                className="peer sr-only"
              />
              <span
                className={`block h-8 w-8 rounded-full ring-2 ring-offset-2 ring-transparent peer-checked:ring-slate-800 ${PROJECT_COLOR_META[color].bar}`}
                title={color}
              />
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="text-sm text-rose-600" aria-live="polite">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}
