/**
 * @file Read-only data-access layer. Each function is wrapped in React's cache()
 *       so repeated calls within a single render are de-duplicated.
 *
 *       Queries hit the libsql/SQLite database (lib/db.ts). ids are integers in
 *       the DB but the app treats them as opaque strings, so every SELECT casts
 *       id/projectId/taskId to TEXT — callers and the domain types in
 *       lib/types.ts are unchanged.
 */

import { cache } from "react";
import { all, one, rows } from "./db";
import type {
  Comment,
  DashboardStats,
  Project,
  ProjectWithStats,
  Task,
  TaskStatus,
  TimeLog,
} from "./types";

//* Column lists casting integer ids back to the strings the app expects.
const PROJECT_COLS = "CAST(id AS TEXT) AS id, name, description, status, color, budgetHours, createdAt";
const TASK_COLS =
  "CAST(id AS TEXT) AS id, CAST(projectId AS TEXT) AS projectId, title, description, status, priority, assignee, estimateHours, dueDate, createdAt";
const COMMENT_COLS = "CAST(id AS TEXT) AS id, CAST(taskId AS TEXT) AS taskId, author, body, createdAt";
const TIMELOG_COLS =
  "CAST(id AS TEXT) AS id, CAST(taskId AS TEXT) AS taskId, author, hours, date, note, createdAt";

//* All projects enriched with live task stats, newest-first (projectStats view).
export const getProjects = cache(async function getProjects(): Promise<ProjectWithStats[]> {
  return all<ProjectWithStats>(
    `SELECT CAST(id AS TEXT) AS id, name, description, status, color, budgetHours, createdAt,
            taskCount, doneCount, progress, overdueCount, loggedHours
       FROM projectStats`,
  );
});

//* Single project by ID — undefined when not found.
export const getProject = cache(async function getProject(id: string): Promise<Project | undefined> {
  return one<Project>(`SELECT ${PROJECT_COLS} FROM projects WHERE id = ?`, [id]);
});

//* All tasks for a project, sorted oldest-first (stable kanban order).
export const getTasksByProject = cache(async function getTasksByProject(projectId: string): Promise<Task[]> {
  return all<Task>(
    `SELECT ${TASK_COLS} FROM tasks WHERE projectId = ? ORDER BY createdAt ASC, id ASC`,
    [projectId],
  );
});

//* Single task by ID — undefined when not found.
export const getTask = cache(async function getTask(id: string): Promise<Task | undefined> {
  return one<Task>(`SELECT ${TASK_COLS} FROM tasks WHERE id = ?`, [id]);
});

//* All comments for a task, oldest-first (thread order).
export const getComments = cache(async function getComments(taskId: string): Promise<Comment[]> {
  return all<Comment>(
    `SELECT ${COMMENT_COLS} FROM comments WHERE taskId = ? ORDER BY createdAt ASC, id ASC`,
    [taskId],
  );
});

//* Time log entries for a task, sorted oldest-first.
export const getTimeLogs = cache(async function getTimeLogs(taskId: string): Promise<TimeLog[]> {
  return all<TimeLog>(
    `SELECT ${TIMELOG_COLS} FROM timeLogs WHERE taskId = ? ORDER BY date ASC, createdAt ASC`,
    [taskId],
  );
});

//* Logged hours per task for an entire project — Record<taskId, totalHours>.
export const getLoggedHoursForProject = cache(async function getLoggedHoursForProject(
  projectId: string,
): Promise<Record<string, number>> {
  const grouped = await rows(
    `SELECT CAST(tl.taskId AS TEXT) AS taskId, sum(tl.hours) AS hours
       FROM timeLogs tl JOIN tasks t ON t.id = tl.taskId
      WHERE t.projectId = ?
      GROUP BY tl.taskId`,
    [projectId],
  );
  const map: Record<string, number> = {};
  for (const row of grouped) map[row.taskId as string] = Number(row.hours);
  return map;
});

//* Unique, sorted list of assignee names across all tasks (excludes "Unassigned").
export const getTeamMembers = cache(async function getTeamMembers(): Promise<string[]> {
  const members = await rows(
    "SELECT DISTINCT assignee FROM tasks WHERE assignee <> 'Unassigned' ORDER BY assignee",
  );
  return members.map((m) => m.assignee as string);
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

//* Aggregate stats across all projects and tasks for the dashboard (one-row view).
export const getDashboardStats = cache(async function getDashboardStats(): Promise<DashboardStats> {
  return (await one<DashboardStats>("SELECT * FROM dashboardStats"))!;
});
