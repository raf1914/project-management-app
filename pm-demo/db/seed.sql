-- seed.sql — seed data copied from seed() in lib/store.ts.
-- estimateHours values are expanded from HOURS_BY_PRIORITY (low 6, medium 12, high 20).
PRAGMA foreign_keys = ON;
BEGIN;

INSERT INTO projects (id, name, description, status, color, budgetHours, createdAt) VALUES
  (1, 'Website Redesign',
   'Refresh the marketing site with a new design system and faster pages.',
   'active', 'indigo', 70, '2026-05-04T09:00:00.000Z'),
  (2, 'Mobile App v2',
   'Ship the next major version of the mobile app with offline support.',
   'active', 'emerald', 64, '2026-05-12T09:00:00.000Z'),
  (3, 'Q3 Marketing Launch',
   'Plan and execute the Q3 product launch campaign.',
   'on-hold', 'amber', 40, '2026-05-20T09:00:00.000Z');

INSERT INTO tasks (id, projectId, title, description, status, priority, assignee, estimateHours, dueDate, createdAt) VALUES
  -- Website Redesign
  (1,  1, 'Audit current pages',
   'Survey all existing marketing pages and document layout patterns, performance issues, and content gaps.',
   'done', 'medium', 'Dana Kim', 12, '2026-05-10', '2026-05-04T09:00:00.000Z'),
  (2,  1, 'Define design tokens',
   'Establish the color, typography, spacing, and shadow tokens that will drive the new design system.',
   'done', 'high', 'Dana Kim', 20, '2026-05-18', '2026-05-04T09:00:00.000Z'),
  (3,  1, 'Build component library',
   'Implement core UI components — buttons, cards, inputs, badges — using the new design tokens.',
   'in-progress', 'high', 'Mateo Rivera', 20, '2026-06-10', '2026-05-04T09:00:00.000Z'),
  (4,  1, 'Migrate landing page',
   'Port the existing landing page to use the component library and optimize for Core Web Vitals.',
   'in-progress', 'medium', 'Mateo Rivera', 12, '2026-06-14', '2026-05-04T09:00:00.000Z'),
  (5,  1, 'Set up analytics',
   'Integrate analytics tracking with event capture for page views, CTAs, and conversion funnels.',
   'todo', 'low', 'Priya Patel', 6, '2026-06-20', '2026-05-04T09:00:00.000Z'),
  (6,  1, 'Accessibility review',
   'Audit all migrated pages against WCAG 2.1 AA criteria and resolve any issues found.',
   'todo', 'medium', 'Priya Patel', 12, '2026-05-30', '2026-05-04T09:00:00.000Z'),
  -- Mobile App v2
  (7,  2, 'Offline data sync spike',
   'Prototype a local-first sync approach to determine the best offline strategy for the app.',
   'done', 'high', 'Sam Chen', 20, '2026-05-22', '2026-05-04T09:00:00.000Z'),
  (8,  2, 'Redesign onboarding flow',
   'Simplify the new-user experience from sign-up through first meaningful action to under 3 steps.',
   'in-progress', 'high', 'Lena Walsh', 20, '2026-06-08', '2026-05-04T09:00:00.000Z'),
  (9,  2, 'Implement push notifications',
   'Add device-level push notification support with opt-in prompt and per-category preference management.',
   'todo', 'medium', 'Sam Chen', 12, '2026-06-25', '2026-05-04T09:00:00.000Z'),
  (10, 2, 'Beta release checklist',
   'Compile and sign off on QA checklist, app store assets, and staged rollout plan for the beta.',
   'todo', 'low', 'Lena Walsh', 6, '2026-07-01', '2026-05-04T09:00:00.000Z'),
  -- Q3 Marketing Launch
  (11, 3, 'Draft launch messaging',
   'Write the core value proposition, taglines, and channel-specific copy for the Q3 campaign.',
   'todo', 'high', 'Priya Patel', 20, '2026-06-15', '2026-05-04T09:00:00.000Z'),
  (12, 3, 'Coordinate with design',
   'Align with the design team on visual assets, brand guidelines, and approval workflow for campaign materials.',
   'todo', 'medium', 'Dana Kim', 12, NULL, '2026-05-04T09:00:00.000Z');

INSERT INTO comments (id, taskId, author, body, createdAt) VALUES
  (1, 1, 'Dana Kim',
   'Audit complete. Found 12 pages with inconsistent layouts and 3 with significant performance issues. Flagging the product pages as highest priority.',
   '2026-05-11T14:30:00.000Z'),
  (2, 3, 'Mateo Rivera',
   'Started with the button and badge components. Need to sync with Dana on hover state for the ghost variant — holding off on inputs until that''s resolved.',
   '2026-06-01T10:15:00.000Z'),
  (3, 3, 'Dana Kim',
   'Ghost hover should use a 10% opacity tint of the brand color. Sent the token reference over Slack.',
   '2026-06-02T09:40:00.000Z'),
  (4, 8, 'Lena Walsh',
   'Cut the flow from 5 steps to 3 by merging the profile and preferences screens. Running usability tests this week.',
   '2026-06-03T16:00:00.000Z');

INSERT INTO timeLogs (id, taskId, author, hours, date, note, createdAt) VALUES
  (1, 3, 'Mateo Rivera', 4,   '2026-06-01', 'Button and badge components, base layout tokens.',        '2026-06-01T17:00:00.000Z'),
  (2, 3, 'Mateo Rivera', 3.5, '2026-06-03', 'Input and select field variants.',                       '2026-06-03T18:00:00.000Z'),
  (3, 8, 'Lena Walsh',   3,   '2026-06-04', 'Merged profile and preferences screens into one step.',  '2026-06-04T16:30:00.000Z'),
  (4, 4, 'Mateo Rivera', 5,   '2026-06-05', 'Initial landing page port to component library.',        '2026-06-05T17:00:00.000Z');

COMMIT;
