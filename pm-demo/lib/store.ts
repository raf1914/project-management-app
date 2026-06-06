/**
 * @file In-memory data store with seed data.
 *
 *       Intentionally simple — demonstrates Next.js App Router data-flow (Server
 *       Components reading, Server Actions mutating) without coupling to a DB.
 *       Swap the functions in lib/data.ts and lib/actions.ts for real queries and
 *       the rest of the app is unchanged.
 *
 *       Data lives in module state, stashed on globalThis so it survives Hot Module
 *       Replacement during `next dev`. Resets when the server process restarts.
 */

import type { Priority, Project, Task } from "./types";

//* Default billable-hour estimate per task priority.
export const HOURS_BY_PRIORITY: Record<Priority, number> = {
  low: 6,
  medium: 12,
  high: 20,
};

interface Database {
  projects: Project[];
  tasks: Task[];
  counter: number;
}

declare global {
  var __PM_DB__: Database | undefined;
}

function seed(): Database {
  let taskCounter = 0;

  //* Helper to build a Task record with auto-incrementing seed IDs.
  function makeTask(
    projectId: string,
    title: string,
    status: Task["status"],
    priority: Task["priority"],
    assignee: string,
    dueDate: string | null,
    description = "",
  ): Task {
    taskCounter += 1;
    return {
      id: `t-${taskCounter}`,
      projectId,
      title,
      description,
      status,
      priority,
      assignee,
      estimateHours: HOURS_BY_PRIORITY[priority],
      dueDate,
      createdAt: "2026-05-04T09:00:00.000Z",
    };
  }

  const projects: Project[] = [
    {
      id: "p-1",
      name: "Website Redesign",
      description: "Refresh the marketing site with a new design system and faster pages.",
      status: "active",
      color: "indigo",
      budgetHours: 70,
      createdAt: "2026-05-04T09:00:00.000Z",
    },
    {
      id: "p-2",
      name: "Mobile App v2",
      description: "Ship the next major version of the mobile app with offline support.",
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
    //* Website Redesign
    makeTask("p-1", "Audit current pages",     "done",        "medium", "Dana Kim",     "2026-05-10",
      "Survey all existing marketing pages and document layout patterns, performance issues, and content gaps."),
    makeTask("p-1", "Define design tokens",    "done",        "high",   "Dana Kim",     "2026-05-18",
      "Establish the color, typography, spacing, and shadow tokens that will drive the new design system."),
    makeTask("p-1", "Build component library", "in-progress", "high",   "Mateo Rivera", "2026-06-10",
      "Implement core UI components — buttons, cards, inputs, badges — using the new design tokens."),
    makeTask("p-1", "Migrate landing page",    "in-progress", "medium", "Mateo Rivera", "2026-06-14",
      "Port the existing landing page to use the component library and optimize for Core Web Vitals."),
    makeTask("p-1", "Set up analytics",        "todo",        "low",    "Priya Patel",  "2026-06-20",
      "Integrate analytics tracking with event capture for page views, CTAs, and conversion funnels."),
    makeTask("p-1", "Accessibility review",    "todo",        "medium", "Priya Patel",  "2026-05-30",
      "Audit all migrated pages against WCAG 2.1 AA criteria and resolve any issues found."),

    //* Mobile App v2
    makeTask("p-2", "Offline data sync spike",       "done",        "high",   "Sam Chen",   "2026-05-22",
      "Prototype a local-first sync approach to determine the best offline strategy for the app."),
    makeTask("p-2", "Redesign onboarding flow",      "in-progress", "high",   "Lena Walsh", "2026-06-08",
      "Simplify the new-user experience from sign-up through first meaningful action to under 3 steps."),
    makeTask("p-2", "Implement push notifications",  "todo",        "medium", "Sam Chen",   "2026-06-25",
      "Add device-level push notification support with opt-in prompt and per-category preference management."),
    makeTask("p-2", "Beta release checklist",        "todo",        "low",    "Lena Walsh", "2026-07-01",
      "Compile and sign off on QA checklist, app store assets, and staged rollout plan for the beta."),

    //* Q3 Marketing Launch
    makeTask("p-3", "Draft launch messaging",  "todo", "high",   "Priya Patel", "2026-06-15",
      "Write the core value proposition, taglines, and channel-specific copy for the Q3 campaign."),
    makeTask("p-3", "Coordinate with design",  "todo", "medium", "Dana Kim",    null,
      "Align with the design team on visual assets, brand guidelines, and approval workflow for campaign materials."),
  ];

  return { projects, tasks, counter: 0 };
}

//* Singleton store — persisted on globalThis to survive HMR file saves in dev.
export const db: Database = (globalThis.__PM_DB__ ??= seed());

//* Generate a stable, unique ID for a new record using time + monotonic counter.
export function nextId(prefix: string): string {
  db.counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${db.counter}`;
}
