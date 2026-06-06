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
      return {
        ...project,
        taskCount: projectTasks.length,
        doneCount: projectTasks.filter((t) => t.status === "done").length,
        progress: progressOf(projectTasks),
        overdueCount: projectTasks.filter(
          (t) => t.status !== "done" && t.dueDate !== null && t.dueDate < today,
        ).length,
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

  //* Billable-hour rollups: projected = whole scope, current = delivered (done).
  const projectedHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0);
  const currentHours = doneTasks.reduce((sum, t) => sum + t.estimateHours, 0);

  //* A project is over budget when its committed task hours exceed its budget.
  const overBudgetCount = projects.filter(function isOverBudget(project) {
    const committedHours = tasks
      .filter((t) => t.projectId === project.id)
      .reduce((sum, t) => sum + t.estimateHours, 0);
    return committedHours > project.budgetHours;
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
