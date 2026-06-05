"use client";

import { useActionState } from "react";
import { createProject, type FormState } from "@/lib/actions";
import { PROJECT_COLORS, PROJECT_COLOR_META } from "@/lib/ui";

const field = "field";

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createProject,
    null,
  );

  return (
    <form
      action={formAction}
      className="panel space-y-5 p-6"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-muted">
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
          className="mb-1.5 block text-sm font-medium text-ink-muted"
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
        <legend className="mb-2 block text-sm font-medium text-ink-muted">
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
                className={`block h-8 w-8 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-[#170a31] transition peer-checked:scale-110 peer-checked:ring-white ${PROJECT_COLOR_META[color].bar} shadow-[0_0_12px_-1px_currentColor] ${PROJECT_COLOR_META[color].text}`}
                title={color}
              />
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="text-sm font-medium text-neon-red text-glow-sm" aria-live="polite">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className="btn-neon">
          {pending ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}
