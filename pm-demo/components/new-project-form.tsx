"use client";

/**
 * @file NewProjectForm component — a controlled form bound to the createProject
 * Server Action with name, description, and accent-color fields.
 */

import { useActionState } from "react";
import { createProject, type FormState } from "@/lib/actions";
import { PROJECT_COLORS, PROJECT_COLOR_META, PROJECT_STATUSES, PROJECT_STATUS_META } from "@/lib/ui";
import { SelectField } from "./select-field";
import { SpinButtons } from "./spin-buttons";

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-muted">
            Status
          </label>
          <SelectField
            name="status"
            defaultValue="active"
            options={PROJECT_STATUSES.map((s) => ({ value: s, label: PROJECT_STATUS_META[s].label }))}
          />
        </div>
        <div>
          <label htmlFor="budgetHours" className="mb-1.5 block text-sm font-medium text-ink-muted">
            Budget hours
          </label>
          <div className="relative">
            <input
              id="budgetHours"
              name="budgetHours"
              type="number"
              min={0}
              step={1}
              defaultValue={40}
              className={`${field} pr-14 [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-9 flex items-center text-xs font-medium text-ink-muted/80">
              h
            </span>
            <SpinButtons inputId="budgetHours" />
          </div>
        </div>
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

      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="submit" disabled={pending} className="btn-neon">
          {pending ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}
