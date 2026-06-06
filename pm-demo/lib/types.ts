// Core domain types for the project-management app.
// These are shared across the data layer, server actions, and UI components.

export type TaskStatus = "todo" | "in-progress" | "done";

export type Priority = "low" | "medium" | "high";

export type ProjectStatus = "active" | "on-hold" | "completed";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  /** Tailwind-friendly accent color name used for the project badge/avatar. */
  color: ProjectColor;
  /** Billable-hour budget for the project. */
  budgetHours: number;
  createdAt: string; // ISO timestamp
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  /** Estimated billable hours for this task. */
  estimateHours: number;
  dueDate: string | null; // ISO date (yyyy-mm-dd) or null
  createdAt: string; // ISO timestamp
}

export type ProjectColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet";

/** A project plus its derived task metrics, used by list/dashboard views. */
export interface ProjectWithStats extends Project {
  taskCount: number;
  doneCount: number;
  /** Percentage of tasks completed, 0–100. */
  progress: number;
  /** Number of non-done tasks whose due date is in the past. */
  overdueCount: number;
}

export interface DashboardStats {
  projectCount: number;
  activeProjectCount: number;
  taskCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  overdueCount: number;
  completionRate: number; // 0–100 across all tasks
  /** Total estimated billable hours across all tasks (full projected scope). */
  projectedHours: number;
  /** Billable hours already delivered (sum of done tasks' estimates). */
  currentHours: number;
  /** Projects whose committed hours exceed their budget. */
  overBudgetCount: number;
}
