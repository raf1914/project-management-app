"use server";

/**
 * @file Server Actions — the only place data is mutated.
 *
 *       Every export is a Server Action ("use server" at file top). They mutate
 *       the in-memory store, then call revalidatePath so affected routes re-render
 *       with fresh data and the client router cache is invalidated.
 *
 *       NOTE: A real app must authenticate/authorize inside each action — these are
 *       reachable via direct POST requests, not just through the UI.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, HOURS_BY_PRIORITY, nextId } from "./store";
import { PROJECT_COLORS, TASK_STATUSES, PROJECT_STATUSES } from "./ui";
import type {
  Priority,
  ProjectColor,
  ProjectStatus,
  Task,
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

  const newProjectId = nextId("p");
  db.projects.push({
    id: newProjectId,
    name: projectName,
    description: str(formData, "description"),
    status: projectStatus,
    color: projectColor,
    budgetHours,
    createdAt: new Date().toISOString(),
  });

  refreshLists();
  redirect(`/projects/${newProjectId}`);
}

export async function setProjectStatus(id: string, status: ProjectStatus) {
  if (!PROJECT_STATUSES.includes(status)) return;
  const targetProject = db.projects.find((p) => p.id === id);
  if (!targetProject) return;
  targetProject.status = status;
  refreshLists();
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  //* Remove the project and all its tasks in one pass each.
  db.projects = db.projects.filter((p) => p.id !== id);
  db.tasks = db.tasks.filter((t) => t.projectId !== id);
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
  if (!projectId || !db.projects.some((p) => p.id === projectId)) {
    return { error: "Unknown project." };
  }

  const taskTitle = str(formData, "title", 200);
  if (!taskTitle) return { error: "Task title is required." };

  const priorityInput = str(formData, "priority") as Priority;
  const statusInput   = str(formData, "status") as TaskStatus;
  const dueDateInput  = str(formData, "dueDate");
  const taskPriority  = PRIORITIES.includes(priorityInput) ? priorityInput : "medium";

  const estimateInput = parseFloat(str(formData, "estimateHours"));
  const estimateHours = estimateInput > 0 ? estimateInput : HOURS_BY_PRIORITY[taskPriority];

  const newTask: Task = {
    id: nextId("t"),
    projectId,
    title: taskTitle,
    description: str(formData, "description"),
    status: TASK_STATUSES.includes(statusInput) ? statusInput : "todo",
    priority: taskPriority,
    estimateHours,
    assignee: str(formData, "assignee", 80) || "Unassigned",
    dueDate: dueDateInput || null,
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(newTask);

  refreshLists();
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  if (!TASK_STATUSES.includes(status)) return;
  const targetTask = db.tasks.find((t) => t.id === id);
  if (!targetTask) return;
  targetTask.status = status;
  refreshLists();
  revalidatePath(`/projects/${targetTask.projectId}`);
}

export async function deleteTask(id: string) {
  const targetTask = db.tasks.find((t) => t.id === id);
  if (!targetTask) return;
  const owningProjectId = targetTask.projectId;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  refreshLists();
  revalidatePath(`/projects/${owningProjectId}`);
}

export async function updateTask(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = str(formData, "id");
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return { error: "Task not found." };

  const title = str(formData, "title", 200);
  if (!title) return { error: "Task title is required." };

  const priorityInput = str(formData, "priority") as Priority;
  const statusInput   = str(formData, "status") as TaskStatus;
  const estimateInput = parseFloat(str(formData, "estimateHours"));

  task.title       = title;
  task.description = str(formData, "description");
  task.status      = TASK_STATUSES.includes(statusInput) ? statusInput : task.status;
  task.priority    = PRIORITIES.includes(priorityInput) ? priorityInput : task.priority;
  task.assignee    = str(formData, "assignee", 80) || "Unassigned";
  task.dueDate     = str(formData, "dueDate") || null;
  task.estimateHours = estimateInput > 0 ? estimateInput : HOURS_BY_PRIORITY[task.priority];

  refreshLists();
  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath(`/projects/${task.projectId}/tasks/${id}`);
  return { ok: true };
}

export async function deleteTaskAndRedirect(id: string, projectId: string) {
  db.tasks    = db.tasks.filter((t) => t.id !== id);
  db.comments = db.comments.filter((c) => c.taskId !== id);
  db.timeLogs = db.timeLogs.filter((tl) => tl.taskId !== id);
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
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return { error: "Task not found." };

  const body = str(formData, "body", 2000);
  if (!body) return { error: "Update cannot be empty." };

  const author = str(formData, "author", 80) || "Unknown";

  db.comments.push({
    id: nextId("c"),
    taskId,
    author,
    body,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/projects/${task.projectId}/tasks/${taskId}`);
  return { ok: true };
}

export async function deleteComment(id: string, taskId: string, projectId: string) {
  db.comments = db.comments.filter((c) => c.id !== id);
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
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return { error: "Task not found." };

  const hoursInput = parseFloat(str(formData, "hours"));
  if (!hoursInput || hoursInput <= 0) return { error: "Hours must be greater than 0." };
  if (hoursInput > 24) return { error: "Cannot log more than 24 hours in a single entry." };

  const author = str(formData, "author", 80) || "Unknown";
  const date   = str(formData, "date") || new Date().toISOString().slice(0, 10);
  const note   = str(formData, "note", 300);

  db.timeLogs.push({
    id: nextId("tl"),
    taskId,
    author,
    hours: Math.round(hoursInput * 4) / 4, // round to nearest 0.25
    date,
    note,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/projects/${task.projectId}/tasks/${taskId}`);
  return { ok: true };
}

export async function deleteTimeLog(id: string, taskId: string, projectId: string) {
  db.timeLogs = db.timeLogs.filter((tl) => tl.id !== id);
  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
}
