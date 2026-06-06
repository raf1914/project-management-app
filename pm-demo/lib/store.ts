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

import type { Comment, Priority, Project, Task, TimeLog } from "./types";

//* Default billable-hour estimate per task priority.
export const HOURS_BY_PRIORITY: Record<Priority, number> = {
  low: 6,
  medium: 12,
  high: 20,
};

interface Database {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  timeLogs: TimeLog[];
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

  const comments: Comment[] = [
    {
      id: "c-1",
      taskId: "t-1",
      author: "Dana Kim",
      body: "Audit complete. Found 12 pages with inconsistent layouts and 3 with significant performance issues. Flagging the product pages as highest priority.",
      createdAt: "2026-05-11T14:30:00.000Z",
    },
    {
      id: "c-2",
      taskId: "t-3",
      author: "Mateo Rivera",
      body: "Started with the button and badge components. Need to sync with Dana on hover state for the ghost variant — holding off on inputs until that's resolved.",
      createdAt: "2026-06-01T10:15:00.000Z",
    },
    {
      id: "c-3",
      taskId: "t-3",
      author: "Dana Kim",
      body: "Ghost hover should use a 10% opacity tint of the brand color. Sent the token reference over Slack.",
      createdAt: "2026-06-02T09:40:00.000Z",
    },
    {
      id: "c-4",
      taskId: "t-8",
      author: "Lena Walsh",
      body: "Cut the flow from 5 steps to 3 by merging the profile and preferences screens. Running usability tests this week.",
      createdAt: "2026-06-03T16:00:00.000Z",
    },
  ];

  const timeLogs: TimeLog[] = [
    { id: "tl-1", taskId: "t-3", author: "Mateo Rivera", hours: 4,   date: "2026-06-01", note: "Button and badge components, base layout tokens.", createdAt: "2026-06-01T17:00:00.000Z" },
    { id: "tl-2", taskId: "t-3", author: "Mateo Rivera", hours: 3.5, date: "2026-06-03", note: "Input and select field variants.", createdAt: "2026-06-03T18:00:00.000Z" },
    { id: "tl-3", taskId: "t-8", author: "Lena Walsh",   hours: 3,   date: "2026-06-04", note: "Merged profile and preferences screens into one step.", createdAt: "2026-06-04T16:30:00.000Z" },
    { id: "tl-4", taskId: "t-4", author: "Mateo Rivera", hours: 5,   date: "2026-06-05", note: "Initial landing page port to component library.", createdAt: "2026-06-05T17:00:00.000Z" },
  ];

  return { projects, tasks, comments, timeLogs, counter: 0 };
}

//* Singleton store — persisted on globalThis to survive HMR file saves in dev.
export const db: Database = (globalThis.__PM_DB__ ??= seed());
//* Patch fields added after the singleton was first created (avoids restart on schema changes).
db.comments  ??= [];
db.timeLogs  ??= [];

//* Generate a stable, unique ID for a new record using time + monotonic counter.
export function nextId(prefix: string): string {
  db.counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${db.counter}`;
}
