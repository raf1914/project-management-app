import type {
  Priority,
  ProjectColor,
  ProjectStatus,
  TaskStatus,
} from "./types";

/**
 * Presentation metadata for the domain enums: labels and Tailwind class sets.
 * Pure constants/helpers — safe to import from both Server and Client Components.
 */

export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

export const STATUS_META: Record<
  TaskStatus,
  { label: string; badge: string; dot: string; column: string }
> = {
  todo: {
    label: "To Do",
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
    column: "border-slate-300",
  },
  "in-progress": {
    label: "In Progress",
    badge: "bg-blue-100 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
    column: "border-blue-400",
  },
  done: {
    label: "Done",
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    column: "border-emerald-400",
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badge: string }
> = {
  low: { label: "Low", badge: "bg-slate-100 text-slate-600 ring-slate-200" },
  medium: {
    label: "Medium",
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  high: { label: "High", badge: "bg-rose-100 text-rose-700 ring-rose-200" },
};

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; badge: string }
> = {
  active: {
    label: "Active",
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  "on-hold": {
    label: "On Hold",
    badge: "bg-amber-100 text-amber-700 ring-amber-200",
  },
  completed: {
    label: "Completed",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export const PROJECT_COLOR_META: Record<
  ProjectColor,
  { bg: string; text: string; bar: string }
> = {
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700", bar: "bg-indigo-500" },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
  },
  amber: { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" },
  rose: { bg: "bg-rose-100", text: "text-rose-700", bar: "bg-rose-500" },
  sky: { bg: "bg-sky-100", text: "text-sky-700", bar: "bg-sky-500" },
  violet: { bg: "bg-violet-100", text: "text-violet-700", bar: "bg-violet-500" },
};

export const PROJECT_COLORS = Object.keys(
  PROJECT_COLOR_META,
) as ProjectColor[];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "active",
  "on-hold",
  "completed",
];

/** The status a task moves to when advanced/regressed on the board. */
export function nextStatus(status: TaskStatus): TaskStatus | null {
  const order = TASK_STATUSES;
  const i = order.indexOf(status);
  return i < order.length - 1 ? order[i + 1] : null;
}

export function prevStatus(status: TaskStatus): TaskStatus | null {
  const order = TASK_STATUSES;
  const i = order.indexOf(status);
  return i > 0 ? order[i - 1] : null;
}
