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

  const newProjectId = nextId("p");
  db.projects.push({
    id: newProjectId,
    name: projectName,
    description: str(formData, "description"),
    status: "active",
    color: projectColor,
    budgetHours: DEFAULT_BUDGET_HOURS,
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

  const newTask: Task = {
    id: nextId("t"),
    projectId,
    title: taskTitle,
    description: str(formData, "description"),
    status: TASK_STATUSES.includes(statusInput) ? statusInput : "todo",
    priority: taskPriority,
    estimateHours: HOURS_BY_PRIORITY[taskPriority],
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
