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
    task("p-1", "Audit current pages", "done", "medium", "Dana", "2026-05-10",
      "Survey all existing marketing pages and document layout patterns, performance issues, and content gaps."),
    task("p-1", "Define design tokens", "done", "high", "Dana", "2026-05-18",
      "Establish the color, typography, spacing, and shadow tokens that will drive the new design system."),
    task("p-1", "Build component library", "in-progress", "high", "Mateo", "2026-06-10",
      "Implement core UI components — buttons, cards, inputs, badges — using the new design tokens."),
    task("p-1", "Migrate landing page", "in-progress", "medium", "Mateo", "2026-06-14",
      "Port the existing landing page to use the component library and optimize for Core Web Vitals."),
    task("p-1", "Set up analytics", "todo", "low", "Priya", "2026-06-20",
      "Integrate analytics tracking with event capture for page views, CTAs, and conversion funnels."),
    task("p-1", "Accessibility review", "todo", "medium", "Priya", "2026-05-30",
      "Audit all migrated pages against WCAG 2.1 AA criteria and resolve any issues found."),
    // Mobile App v2
    task("p-2", "Offline data sync spike", "done", "high", "Sam", "2026-05-22",
      "Prototype a local-first sync approach to determine the best offline strategy for the app."),
    task("p-2", "Redesign onboarding flow", "in-progress", "high", "Lena", "2026-06-08",
      "Simplify the new-user experience from sign-up through first meaningful action to under 3 steps."),
    task("p-2", "Implement push notifications", "todo", "medium", "Sam", "2026-06-25",
      "Add device-level push notification support with opt-in prompt and per-category preference management."),
    task("p-2", "Beta release checklist", "todo", "low", "Lena", "2026-07-01",
      "Compile and sign off on QA checklist, app store assets, and staged rollout plan for the beta."),
    // Q3 Marketing Launch
    task("p-3", "Draft launch messaging", "todo", "high", "Priya", "2026-06-15",
      "Write the core value proposition, taglines, and channel-specific copy for the Q3 campaign."),
    task("p-3", "Coordinate with design", "todo", "medium", "Dana", null,
      "Align with the design team on visual assets, brand guidelines, and approval workflow for campaign materials."),
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
  description = "",
): Task {
  _seedCounter += 1;
  return {
    id: `t-${_seedCounter}`,
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

export const db: Database = (globalThis.__PM_DB__ ??= seed());

/** Generate a stable, unique id for a new record. */
export function nextId(prefix: string): string {
  db.counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${db.counter}`;
}
