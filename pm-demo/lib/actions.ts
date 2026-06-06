"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, HOURS_BY_PRIORITY, nextId } from "./store";

/** Default billable-hour budget applied to a newly created project. */
const DEFAULT_BUDGET_HOURS = 40;
import { PROJECT_COLORS } from "./ui";
import type {
  Priority,
  ProjectColor,
  ProjectStatus,
  Task,
  TaskStatus,
} from "./types";

/**
 * Server Actions — the only place data is mutated.
 *
 * Every export in this file is a Server Action (`"use server"` at the top of the
 * file). They mutate the in-memory store, then call `revalidatePath` so the
 * affected routes re-render with fresh data on the next request and the client
 * router cache is invalidated.
 *
 * NOTE: A real app must authenticate/authorize inside each action — these are
 * reachable via direct POST requests, not just through the UI.
 */

export type FormState = { error?: string; ok?: boolean } | null;

const TASK_STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];
const PRIORITIES: Priority[] = ["low", "medium", "high"];
const PROJECT_STATUSES: ProjectStatus[] = ["active", "on-hold", "completed"];

// Read a trimmed string field, capped to a max length. The cap is
// defense-in-depth: Server Actions are reachable via direct POST, so we can't
// rely on the form's maxLength attributes alone.
function str(formData: FormData, key: string, maxLen = 2000): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim().slice(0, maxLen) : "";
}

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
  const name = str(formData, "name", 120);
  if (!name) return { error: "Project name is required." };

  const colorInput = str(formData, "color") as ProjectColor;
  const color = PROJECT_COLORS.includes(colorInput) ? colorInput : "indigo";

  const id = nextId("p");
  db.projects.push({
    id,
    name,
    description: str(formData, "description"),
    status: "active",
    color,
    budgetHours: DEFAULT_BUDGET_HOURS,
    createdAt: new Date().toISOString(),
  });

  refreshLists();
  redirect(`/projects/${id}`);
}

export async function setProjectStatus(id: string, status: ProjectStatus) {
  if (!PROJECT_STATUSES.includes(status)) return;
  const project = db.projects.find((p) => p.id === id);
  if (!project) return;
  project.status = status;
  refreshLists();
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
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

  const title = str(formData, "title", 200);
  if (!title) return { error: "Task title is required." };

  const priorityInput = str(formData, "priority") as Priority;
  const statusInput = str(formData, "status") as TaskStatus;
  const dueDate = str(formData, "dueDate");
  const priority = PRIORITIES.includes(priorityInput) ? priorityInput : "medium";

  const task: Task = {
    id: nextId("t"),
    projectId,
    title,
    description: str(formData, "description"),
    status: TASK_STATUSES.includes(statusInput) ? statusInput : "todo",
    priority,
    estimateHours: HOURS_BY_PRIORITY[priority],
    assignee: str(formData, "assignee", 80) || "Unassigned",
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
  };
  db.tasks.push(task);

  refreshLists();
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  if (!TASK_STATUSES.includes(status)) return;
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return;
  task.status = status;
  refreshLists();
  revalidatePath(`/projects/${task.projectId}`);
}

export async function deleteTask(id: string) {
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return;
  const projectId = task.projectId;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  refreshLists();
  revalidatePath(`/projects/${projectId}`);
}
