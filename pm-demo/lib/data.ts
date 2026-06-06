/**
 * @file Read-only data-access layer. Each function is wrapped in React's cache()
 *       so repeated calls within a single render are de-duplicated.
 *       The functions are async to mirror a real database/ORM — swap the bodies
 *       for actual queries and nothing else in the app needs to change.
 */

import { cache } from "react";
import { db } from "./store";
import { todayLocal } from "./format";
import type {
  Comment,
  DashboardStats,
  Project,
  ProjectWithStats,
  Task,
  TaskStatus,
  TimeLog,
} from "./types";

//* Derive a 0-100 completion percentage from a task list.
function progressOf(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  return Math.round((doneCount / tasks.length) * 100);
}

//* All projects enriched with live task stats, newest-first.
export const getProjects = cache(async function getProjects(): Promise<ProjectWithStats[]> {
  const today = todayLocal();
  return db.projects
    .map(function enrichProject(project) {
      const projectTasks = db.tasks.filter((t) => t.projectId === project.id);
      const taskIds = new Set(projectTasks.map((t) => t.id));
      const loggedHours = db.timeLogs
        .filter((tl) => taskIds.has(tl.taskId))
        .reduce((sum, tl) => sum + tl.hours, 0);
      return {
        ...project,
        taskCount: projectTasks.length,
        doneCount: projectTasks.filter((t) => t.status === "done").length,
        progress: progressOf(projectTasks),
        overdueCount: projectTasks.filter(
          (t) => t.status !== "done" && t.dueDate !== null && t.dueDate < today,
        ).length,
        loggedHours,
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

//* Single project by ID — undefined when not found.
export const getProject = cache(async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.find((p) => p.id === id);
});

//* All tasks for a project, sorted oldest-first (stable kanban order).
export const getTasksByProject = cache(async function getTasksByProject(projectId: string): Promise<Task[]> {
  return db.tasks
    .filter((t) => t.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
});

//* Single task by ID — undefined when not found.
export const getTask = cache(async function getTask(id: string): Promise<Task | undefined> {
  return db.tasks.find((t) => t.id === id);
});

//* All comments for a task, oldest-first (thread order).
export const getComments = cache(async function getComments(taskId: string): Promise<Comment[]> {
  return db.comments
    .filter((c) => c.taskId === taskId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
});

//* Time log entries for a task, sorted oldest-first.
export const getTimeLogs = cache(async function getTimeLogs(taskId: string): Promise<TimeLog[]> {
  return db.timeLogs
    .filter((tl) => tl.taskId === taskId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
});

//* Logged hours per task for an entire project — Record<taskId, totalHours>.
export const getLoggedHoursForProject = cache(async function getLoggedHoursForProject(
  projectId: string,
): Promise<Record<string, number>> {
  const taskIds = new Set(
    db.tasks.filter((t) => t.projectId === projectId).map((t) => t.id),
  );
  const map: Record<string, number> = {};
  for (const tl of db.timeLogs) {
    if (taskIds.has(tl.taskId)) {
      map[tl.taskId] = (map[tl.taskId] ?? 0) + tl.hours;
    }
  }
  return map;
});

//* Unique, sorted list of assignee names across all tasks (excludes "Unassigned").
export const getTeamMembers = cache(async function getTeamMembers(): Promise<string[]> {
  const assigneeNames = db.tasks
    .map((t) => t.assignee)
    .filter((a) => a && a !== "Unassigned");
  return [...new Set(assigneeNames)].sort();
});

//* Group a project's tasks into kanban columns keyed by status.
export const getBoard = cache(async function getBoard(projectId: string): Promise<Record<TaskStatus, Task[]>> {
  const projectTasks = await getTasksByProject(projectId);
  return {
    todo: projectTasks.filter((t) => t.status === "todo"),
    "in-progress": projectTasks.filter((t) => t.status === "in-progress"),
    done: projectTasks.filter((t) => t.status === "done"),
  };
});

//* Aggregate stats across all projects and tasks for the dashboard.
export const getDashboardStats = cache(async function getDashboardStats(): Promise<DashboardStats> {
  const { projects, tasks } = db;
  const today = todayLocal();

  const doneTasks = tasks.filter((t) => t.status === "done");
  const doneCount = doneTasks.length;

  //* Billable-hour rollups: projected = whole scope (estimates), current = actual logged hours.
  const projectedHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0);
  const currentHours  = db.timeLogs.reduce((sum, tl) => sum + tl.hours, 0);

  //* Precompute logged hours per task for budget comparisons.
  const loggedByTask: Record<string, number> = {};
  for (const tl of db.timeLogs) {
    loggedByTask[tl.taskId] = (loggedByTask[tl.taskId] ?? 0) + tl.hours;
  }

  //* A project is over budget when its actual logged hours exceed its budget.
  const overBudgetCount = projects.filter(function isOverBudget(project) {
    const projectLoggedHours = tasks
      .filter((t) => t.projectId === project.id)
      .reduce((sum, t) => sum + (loggedByTask[t.id] ?? 0), 0);
    return projectLoggedHours > project.budgetHours;
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
