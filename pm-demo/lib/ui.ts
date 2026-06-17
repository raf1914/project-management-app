/**
 * @file Presentation metadata for the domain enums: labels and Tailwind class sets.
 *       Pure constants/helpers — safe to import from both Server and Client Components.
 */

import type {
  Priority,
  ProjectColor,
  ProjectStatus,
  TaskStatus,
} from "./types";

//* Canonical status order — drives column layout and advance/regress logic.
export const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

export const STATUS_META: Record<
  TaskStatus,
  { label: string; badge: string; dot: string; column: string }
> = {
  todo: {
    label: "To Do",
    badge: "bg-neon-cyan/10 text-neon-cyan ring-neon-cyan/40 text-glow-sm",
    dot: "bg-neon-cyan text-neon-cyan",
    column: "border-t-neon-cyan",
  },
  "in-progress": {
    label: "In Progress",
    badge: "bg-neon-orange/10 text-neon-orange ring-neon-orange/40 text-glow-sm",
    dot: "bg-neon-orange text-neon-orange",
    column: "border-t-neon-orange",
  },
  done: {
    label: "Done",
    badge: "bg-neon-green/10 text-neon-green ring-neon-green/40 text-glow-sm",
    dot: "bg-neon-green text-neon-green",
    column: "border-t-neon-green",
  },
};

//* Default billable-hour estimate per task priority — used when a task is
//* created without an explicit estimate.
export const HOURS_BY_PRIORITY: Record<Priority, number> = {
  low: 6,
  medium: 12,
  high: 20,
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badge: string }
> = {
  low: {
    label: "Low",
    badge: "bg-neon-blue/10 text-neon-blue ring-neon-blue/40 text-glow-sm",
  },
  medium: {
    label: "Medium",
    badge: "bg-neon-yellow/10 text-neon-yellow ring-neon-yellow/40 text-glow-sm",
  },
  high: {
    label: "High",
    badge: "bg-neon-red/10 text-neon-red ring-neon-red/40 text-glow-sm",
  },
};

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; badge: string }
> = {
  active: {
    label: "Active",
    badge: "bg-neon-green/10 text-neon-green ring-neon-green/40 text-glow-sm",
  },
  "on-hold": {
    label: "On Hold",
    badge: "bg-neon-orange/10 text-neon-orange ring-neon-orange/40 text-glow-sm",
  },
  completed: {
    label: "Completed",
    badge: "bg-neon-purple/10 text-neon-purple ring-neon-purple/40 text-glow-sm",
  },
};

//* Color metadata keyed by project accent — bg, text, and progress-bar classes.
export const PROJECT_COLOR_META: Record<
  ProjectColor,
  { bg: string; text: string; bar: string }
> = {
  indigo: { bg: "bg-neon-purple/15", text: "text-neon-purple", bar: "bg-neon-purple" },
  emerald: { bg: "bg-neon-green/15",  text: "text-neon-green",  bar: "bg-neon-green"  },
  amber:   { bg: "bg-neon-orange/15", text: "text-neon-orange", bar: "bg-neon-orange" },
  rose:    { bg: "bg-neon-pink/15",   text: "text-neon-pink",   bar: "bg-neon-pink"   },
  sky:     { bg: "bg-neon-cyan/15",   text: "text-neon-cyan",   bar: "bg-neon-cyan"   },
  violet:  { bg: "bg-neon-magenta/15",text: "text-neon-magenta",bar: "bg-neon-magenta"},
};

export const PROJECT_COLORS = Object.keys(PROJECT_COLOR_META) as ProjectColor[];

export const PROJECT_STATUSES: ProjectStatus[] = ["active", "on-hold", "completed"];

//* The status a task advances to when moved right on the board, or null at the end.
export function nextStatus(status: TaskStatus): TaskStatus | null {
  const statusIndex = TASK_STATUSES.indexOf(status);
  return statusIndex < TASK_STATUSES.length - 1 ? TASK_STATUSES[statusIndex + 1] : null;
}

//* The status a task regresses to when moved left on the board, or null at the start.
export function prevStatus(status: TaskStatus): TaskStatus | null {
  const statusIndex = TASK_STATUSES.indexOf(status);
  return statusIndex > 0 ? TASK_STATUSES[statusIndex - 1] : null;
}
