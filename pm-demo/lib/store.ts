import type { Priority, Project, Task } from "./types";

/** Default billable-hour estimate per task priority. */
export const HOURS_BY_PRIORITY: Record<Priority, number> = {
  low: 6,
  medium: 12,
  high: 20,
};

/**
 * In-memory data store.
 *
 * This is intentionally simple — the whole point of the "basic framework" is to
 * demonstrate the Next.js App Router data-flow (Server Components reading data,
 * Server Actions mutating it) without coupling to a particular database. Swap the
 * functions in `lib/data.ts` / `lib/actions.ts` for real DB calls and the rest of
 * the app is unchanged.
 *
 * Data lives in module state. We stash it on `globalThis` so it survives
 * Hot Module Replacement during `next dev` (otherwise every file save would
 * reset your seed data). It still resets when the server process restarts.
 */
interface Database {
  projects: Project[];
  tasks: Task[];
  counter: number;
}

declare global {
  var __PM_DB__: Database | undefined;
}

function seed(): Database {
  const projects: Project[] = [
    {
      id: "p-1",
      name: "Website Redesign",
      description:
        "Refresh the marketing site with a new design system and faster pages.",
      status: "active",
      color: "indigo",
      budgetHours: 70,
      createdAt: "2026-05-04T09:00:00.000Z",
    },
    {
      id: "p-2",
      name: "Mobile App v2",
      description:
        "Ship the next major version of the mobile app with offline support.",
      status: "active",
      color: "emerald",
      budgetHours: 64,
      createdAt: "2026-05-12T09:00:00.000Z",
    },
    {
      id: "p-3",
      name: "Q3 Marketing Launch",
      description: "Plan and execute the Q3 product launch campaign.",
      status: "on-hold",
      color: "amber",
      budgetHours: 40,
      createdAt: "2026-05-20T09:00:00.000Z",
    },
  ];

  const tasks: Task[] = [
    // Website Redesign
    task("p-1", "Audit current pages", "done", "medium", "Dana", "2026-05-10"),
    task("p-1", "Define design tokens", "done", "high", "Dana", "2026-05-18"),
    task("p-1", "Build component library", "in-progress", "high", "Mateo", "2026-06-10"),
    task("p-1", "Migrate landing page", "in-progress", "medium", "Mateo", "2026-06-14"),
    task("p-1", "Set up analytics", "todo", "low", "Priya", "2026-06-20"),
    task("p-1", "Accessibility review", "todo", "medium", "Priya", "2026-05-30"),
    // Mobile App v2
    task("p-2", "Offline data sync spike", "done", "high", "Sam", "2026-05-22"),
    task("p-2", "Redesign onboarding flow", "in-progress", "high", "Lena", "2026-06-08"),
    task("p-2", "Implement push notifications", "todo", "medium", "Sam", "2026-06-25"),
    task("p-2", "Beta release checklist", "todo", "low", "Lena", "2026-07-01"),
    // Q3 Marketing Launch
    task("p-3", "Draft launch messaging", "todo", "high", "Priya", "2026-06-15"),
    task("p-3", "Coordinate with design", "todo", "medium", "Dana", null),
  ];

  return { projects, tasks, counter: 0 };
}

let _seedCounter = 0;
function task(
  projectId: string,
  title: string,
  status: Task["status"],
  priority: Task["priority"],
  assignee: string,
  dueDate: string | null,
): Task {
  _seedCounter += 1;
  return {
    id: `t-${_seedCounter}`,
    projectId,
    title,
    description: "",
    status,
    priority,
    assignee,
    estimateHours: HOURS_BY_PRIORITY[priority],
    dueDate,
    createdAt: "2026-05-04T09:00:00.000Z",
  };
}

export const db: Database = (globalThis.__PM_DB__ ??= seed());

/** Generate a stable, unique id for a new record. */
export function nextId(prefix: string): string {
  db.counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${db.counter}`;
}
