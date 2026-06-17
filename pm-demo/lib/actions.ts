"use server";

/**
 * @file Server Actions — the only place data is mutated.
 *
 *       Every export is a Server Action ("use server" at file top). They write
 *       to the SQLite database (lib/db.ts), then call revalidatePath so affected
 *       routes re-render with fresh data and the client router cache is
 *       invalidated. New ids are assigned by the INTEGER PRIMARY KEY columns;
 *       inserts omit id and read it back from lastInsertRowid.
 *
 *       NOTE: A real app must authenticate/authorize inside each action — these are
 *       reachable via direct POST requests, not just through the UI.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { one, run } from "./db";
import {
  HOURS_BY_PRIORITY,
  PROJECT_COLORS,
  TASK_STATUSES,
  PROJECT_STATUSES,
} from "./ui";
import type {
  Priority,
  ProjectColor,
  ProjectStatus,
  TaskStatus,
} from "./types";

const DEFAULT_BUDGET_HOURS = 40;
const PRIORITIES: Priority[] = ["low", "medium", "high"];

export type FormState = { error?: string; ok?: boolean } | null;

//* Read a trimmed string field, capped to a max length. Defense-in-depth: Server
//* Actions are reachable via direct POST, so we can't rely on form maxLength alone.
function str(formData: FormData, key: string, maxLen = 2000): string {
  const fieldValue = formData.get(key);
  return typeof fieldValue === "string" ? fieldValue.trim().slice(0, maxLen) : "";
}

//* Bust both list routes so they always re-render after any mutation.
function refreshLists() {
  revalidatePath("/");
  revalidatePath("/projects");
}

//* projectId of a task, or undefined if it doesn't exist.
async function projectIdOfTask(taskId: string): Promise<string | undefined> {
  const row = await one<{ projectId: string }>(
    "SELECT CAST(projectId AS TEXT) AS projectId FROM tasks WHERE id = ?",
    [taskId],
  );
  return row?.projectId;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function createProject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const projectName = str(formData, "name", 120);
  if (!projectName) return { error: "Project name is required." };

  const colorInput = str(formData, "color") as ProjectColor;
  const projectColor = PROJECT_COLORS.includes(colorInput) ? colorInput : "indigo";

  const statusInput = str(formData, "status") as ProjectStatus;
  const projectStatus = PROJECT_STATUSES.includes(statusInput) ? statusInput : "active";

  const budgetInput = parseFloat(str(formData, "budgetHours"));
  const budgetHours = budgetInput >= 0 ? budgetInput : DEFAULT_BUDGET_HOURS;

  const result = await run(
    `INSERT INTO projects (name, description, status, color, budgetHours, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      projectName,
      str(formData, "description"),
      projectStatus,
      projectColor,
      budgetHours,
      new Date().toISOString(),
    ],
  );

  refreshLists();
  redirect(`/projects/${result.lastInsertRowid}`);
}

export async function setProjectStatus(id: string, status: ProjectStatus) {
  if (!PROJECT_STATUSES.includes(status)) return;
  const result = await run("UPDATE projects SET status = ? WHERE id = ?", [status, id]);
  if (result.rowsAffected === 0) return;
  refreshLists();
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  //* Tasks/comments/time logs cascade via the schema's ON DELETE CASCADE.
  await run("DELETE FROM projects WHERE id = ?", [id]);
  refreshLists();
  redirect("/projects");
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export async function createTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const projectId = str(formData, "projectId");
  const project = await one("SELECT 1 FROM projects WHERE id = ?", [projectId]);
  if (!projectId || !project) return { error: "Unknown project." };

  const taskTitle = str(formData, "title", 200);
  if (!taskTitle) return { error: "Task title is required." };

  const priorityInput = str(formData, "priority") as Priority;
  const statusInput   = str(formData, "status") as TaskStatus;
  const dueDateInput  = str(formData, "dueDate");
  const taskPriority  = PRIORITIES.includes(priorityInput) ? priorityInput : "medium";

  const estimateInput = parseFloat(str(formData, "estimateHours"));
  const estimateHours = estimateInput > 0 ? estimateInput : HOURS_BY_PRIORITY[taskPriority];

  await run(
    `INSERT INTO tasks (projectId, title, description, status, priority, assignee, estimateHours, dueDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      taskTitle,
      str(formData, "description"),
      TASK_STATUSES.includes(statusInput) ? statusInput : "todo",
      taskPriority,
      str(formData, "assignee", 80) || "Unassigned",
      estimateHours,
      dueDateInput || null,
      new Date().toISOString(),
    ],
  );

  refreshLists();
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  if (!TASK_STATUSES.includes(status)) return;
  const projectId = await projectIdOfTask(id);
  if (!projectId) return;
  await run("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
  refreshLists();
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTask(id: string) {
  const projectId = await projectIdOfTask(id);
  if (!projectId) return;
  await run("DELETE FROM tasks WHERE id = ?", [id]);
  refreshLists();
  revalidatePath(`/projects/${projectId}`);
}

export async function updateTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = str(formData, "id");
  const task = await one<{ projectId: string; status: TaskStatus; priority: Priority }>(
    "SELECT CAST(projectId AS TEXT) AS projectId, status, priority FROM tasks WHERE id = ?",
    [id],
  );
  if (!task) return { error: "Task not found." };

  const title = str(formData, "title", 200);
  if (!title) return { error: "Task title is required." };

  const priorityInput = str(formData, "priority") as Priority;
  const statusInput   = str(formData, "status") as TaskStatus;
  const estimateInput = parseFloat(str(formData, "estimateHours"));

  const priority = PRIORITIES.includes(priorityInput) ? priorityInput : task.priority;
  const status   = TASK_STATUSES.includes(statusInput) ? statusInput : task.status;
  const estimateHours = estimateInput > 0 ? estimateInput : HOURS_BY_PRIORITY[priority];

  await run(
    `UPDATE tasks
        SET title = ?, description = ?, status = ?, priority = ?,
            assignee = ?, dueDate = ?, estimateHours = ?
      WHERE id = ?`,
    [
      title,
      str(formData, "description"),
      status,
      priority,
      str(formData, "assignee", 80) || "Unassigned",
      str(formData, "dueDate") || null,
      estimateHours,
      id,
    ],
  );

  refreshLists();
  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath(`/projects/${task.projectId}/tasks/${id}`);
  return { ok: true };
}

export async function deleteTaskAndRedirect(id: string, projectId: string) {
  //* Comments and time logs cascade via ON DELETE CASCADE.
  await run("DELETE FROM tasks WHERE id = ?", [id]);
  refreshLists();
  redirect(`/projects/${projectId}`);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function addComment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const taskId = str(formData, "taskId");
  const projectId = await projectIdOfTask(taskId);
  if (!projectId) return { error: "Task not found." };

  const body = str(formData, "body", 2000);
  if (!body) return { error: "Update cannot be empty." };

  await run(
    "INSERT INTO comments (taskId, author, body, createdAt) VALUES (?, ?, ?, ?)",
    [taskId, str(formData, "author", 80) || "Unknown", body, new Date().toISOString()],
  );

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { ok: true };
}

export async function deleteComment(id: string, taskId: string, projectId: string) {
  await run("DELETE FROM comments WHERE id = ?", [id]);
  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
}

// ---------------------------------------------------------------------------
// Time logs
// ---------------------------------------------------------------------------

export async function logTime(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const taskId = str(formData, "taskId");
  const projectId = await projectIdOfTask(taskId);
  if (!projectId) return { error: "Task not found." };

  const hoursInput = parseFloat(str(formData, "hours"));
  if (!hoursInput || hoursInput <= 0) return { error: "Hours must be greater than 0." };
  if (hoursInput > 24) return { error: "Cannot log more than 24 hours in a single entry." };

  const date = str(formData, "date") || new Date().toISOString().slice(0, 10);

  await run(
    "INSERT INTO timeLogs (taskId, author, hours, date, note, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      taskId,
      str(formData, "author", 80) || "Unknown",
      Math.round(hoursInput * 4) / 4, // round to nearest 0.25
      date,
      str(formData, "note", 300),
      new Date().toISOString(),
    ],
  );

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { ok: true };
}

export async function deleteTimeLog(id: string, taskId: string, projectId: string) {
  await run("DELETE FROM timeLogs WHERE id = ?", [id]);
  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
}
