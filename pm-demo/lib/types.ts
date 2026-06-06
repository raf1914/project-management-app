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
  /** Sum of all time-log entries for this project's tasks. */
  loggedHours: number;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  body: string;
  createdAt: string; // ISO timestamp
}

export interface TimeLog {
  id: string;
  taskId: string;
  author: string;
  hours: number;
  date: string;      // ISO date yyyy-mm-dd
  note: string;
  createdAt: string; // ISO timestamp
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
  /** Actual hours logged via time-tracking entries (across all tasks). */
  currentHours: number;
  /** Projects whose committed hours exceed their budget. */
  overBudgetCount: number;
}
