import { cache } from "react";
import { db } from "./store";
import { todayLocal } from "./format";
import type {
  DashboardStats,
  Project,
  ProjectWithStats,
  Task,
  TaskStatus,
} from "./types";

/**
 * Read-only data-access layer.
 *
 * These run on the server (called from Server Components). Each is wrapped in
 * React's `cache()` so repeated calls within a single render are de-duplicated.
 * The functions are async to mirror a real database/ORM — swap the bodies for
 * actual queries and nothing else in the app needs to change.
 */

function progressOf(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

export const getProjects = cache(async (): Promise<ProjectWithStats[]> => {
  const today = todayLocal();
  return db.projects
    .map((project) => {
      const tasks = db.tasks.filter((t) => t.projectId === project.id);
      return {
        ...project,
        taskCount: tasks.length,
        doneCount: tasks.filter((t) => t.status === "done").length,
        progress: progressOf(tasks),
        overdueCount: tasks.filter(
          (t) => t.status !== "done" && t.dueDate !== null && t.dueDate < today,
        ).length,
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export const getProject = cache(
  async (id: string): Promise<Project | undefined> => {
    return db.projects.find((p) => p.id === id);
  },
);

export const getTasksByProject = cache(
  async (projectId: string): Promise<Task[]> => {
    return db.tasks
      .filter((t) => t.projectId === projectId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
);

export const getTask = cache(
  async (id: string): Promise<Task | undefined> => {
    return db.tasks.find((t) => t.id === id);
  },
);

/** Unique, sorted list of assignee names across all tasks. */
export const getTeamMembers = cache(async (): Promise<string[]> => {
  return [
    ...new Set(
      db.tasks
        .map((t) => t.assignee)
        .filter((a) => a && a !== "Unassigned"),
    ),
  ].sort();
});

/** Group a project's tasks into kanban columns keyed by status. */
export const getBoard = cache(
  async (
    projectId: string,
  ): Promise<Record<TaskStatus, Task[]>> => {
    const tasks = await getTasksByProject(projectId);
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    };
  },
);

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const { projects, tasks } = db;
  const today = todayLocal();

  const doneCount = tasks.filter((t) => t.status === "done").length;

  // Billable-hour rollups: projected = whole scope, current = delivered (done).
  const projectedHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0);
  const currentHours = tasks
    .filter((t) => t.status === "done")
    .reduce((sum, t) => sum + t.estimateHours, 0);

  // A project is over budget when its committed task hours exceed its budget.
  const overBudgetCount = projects.filter((p) => {
    const committed = tasks
      .filter((t) => t.projectId === p.id)
      .reduce((sum, t) => sum + t.estimateHours, 0);
    return committed > p.budgetHours;
  }).length;

  return {
    projectCount: projects.length,
    activeProjectCount: projects.filter((p) => p.status === "active").length,
    taskCount: tasks.length,
    todoCount: tasks.filter((t) => t.status === "todo").length,
    inProgressCount: tasks.filter((t) => t.status === "in-progress").length,
    doneCount,
    overdueCount: tasks.filter(
      (t) => t.status !== "done" && t.dueDate !== null && t.dueDate < today,
    ).length,
    completionRate: tasks.length
      ? Math.round((doneCount / tasks.length) * 100)
      : 0,
    projectedHours,
    currentHours,
    overBudgetCount,
  };
});
