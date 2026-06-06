/**
 * @file Learning Path page — a guided, codebase-grounded curriculum that ramps a
 * developer from HTML/CSS/JavaScript up to this app's stack (TypeScript, React 19,
 * the Next.js App Router, Server Components/Actions, and Tailwind v4). The page
 * shell is a Server Component; the interactive checklist is a Client island.
 */

import type { Metadata } from "next";
import { LearningPath, type LearnPhase } from "@/components/learn-progress";
import { BookIcon, RocketIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "A guided learning path from HTML/CSS/JS to this app's stack: TypeScript, React, Next.js App Router, Server Actions, and Tailwind.",
};

//* The curriculum. Each phase is plain serializable data so the Server Component
//* can hand it to the <LearningPath> Client island (props cross that boundary as
//* JSON). Read top-to-bottom: every phase is Learn → Read this repo → Build it.
const PHASES: LearnPhase[] = [
  {
    id: "modern-js",
    index: 1,
    tag: "Modern JS",
    title: "Modern JavaScript foundations",
    duration: "~3–5 days",
    goal:
      "Read modern JavaScript without guessing. React and Next are just JS — these idioms appear on every line of this app.",
    learn: [
      "let / const and block scope",
      "Arrow functions vs function declarations",
      "Template literals `${…}`",
      "Object & array destructuring",
      "Spread / rest with …",
      "Array methods: map, filter, reduce, find, some",
      "Ternary, && short-circuit, ?? nullish",
      "Optional chaining ?.",
      "ES modules: import / export",
      "Promises and async / await",
    ],
    read: [
      {
        path: "lib/format.ts",
        note: "template literals, split/map, padStart — small pure functions to read first",
      },
      {
        path: "lib/data.ts",
        note: "map / filter / reduce and async functions doing the real work",
      },
      {
        path: "lib/ui.ts",
        note: "exported const objects, Array.indexOf, named helpers",
      },
    ],
    build:
      "In a scratch file, write summarize(tasks) that returns counts per status using reduce, then run it with `node`. No React — just the language.",
    resources: [
      { label: "MDN JS Guide", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { label: "javascript.info", href: "https://javascript.info/" },
    ],
  },
  {
    id: "typescript",
    index: 2,
    tag: "Types",
    title: "TypeScript essentials",
    duration: "~3–4 days",
    goal:
      "Read and extend the type annotations that appear everywhere here. Types are the app's contract — they tell you the shape of every value.",
    learn: [
      "Primitive types & inference",
      "type vs interface",
      "Union & string-literal types",
      "Optional ? and readonly fields",
      "Typing function params & returns",
      "Generics, just enough: Array<T>, Record<K,V>, Promise<T>",
      "as assertions (and why to avoid them)",
      "Types are erased — no runtime cost",
    ],
    read: [
      {
        path: "lib/types.ts",
        note: "START HERE — the whole domain model (Task, Project, unions like TaskStatus)",
      },
      {
        path: "lib/ui.ts",
        note: "Record<TaskStatus, …> maps a union to metadata for every case",
      },
      {
        path: "lib/data.ts",
        note: "return types like Promise<ProjectWithStats[]> describe each reader",
      },
    ],
    build:
      "Add a field to the Task interface in lib/types.ts (e.g. tags: string[]). Don't fix anything yet — just read every red squiggle TypeScript raises across the app to see what the type touches.",
    resources: [
      { label: "TS Handbook", href: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "TS for JS Devs", href: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" },
    ],
  },
  {
    id: "react-fundamentals",
    index: 3,
    tag: "Components",
    title: "React fundamentals",
    duration: "~4–6 days",
    goal:
      "Understand components, JSX, props, and rendering lists. This is the core model — everything else builds on it.",
    learn: [
      "A component is a function that returns JSX",
      "JSX rules: className, {expressions}, one root, fragments",
      "Props, and typing them",
      "Composition and the children prop",
      "Rendering lists with .map + a stable key",
      "Conditional rendering with && and ternary",
      "What 're-rendering' means",
    ],
    read: [
      {
        path: "components/ui.tsx",
        note: "Badge, ProgressBar, Avatar, EmptyState — tiny prop-driven components",
      },
      {
        path: "components/metric-tile.tsx",
        note: "a focused presentational component taking simple props",
      },
      {
        path: "components/project-card.tsx",
        note: "receives one typed object as a prop and renders it",
      },
      {
        path: "app/page.tsx",
        href: "/",
        note: ".map with key + conditional empty state in a real page",
      },
    ],
    build:
      "Create components/info-pill.tsx — a presentational component taking { label, value } props — and drop a few onto the dashboard temporarily to see them render.",
    resources: [
      { label: "Describing the UI", href: "https://react.dev/learn/describing-the-ui" },
    ],
  },
  {
    id: "hooks",
    index: 4,
    tag: "Hooks",
    title: "State, hooks & client interactivity",
    duration: "~4–6 days",
    goal:
      "Add interactivity with hooks, and know exactly when a component must run in the browser instead of on the server.",
    learn: [
      "useState and event handlers",
      "Controlled inputs (value + onChange)",
      "useEffect and the dependency array",
      "useRef for DOM nodes & mutable values",
      "The \"use client\" directive — when & why",
      "Rules of hooks (top level, components only)",
      "Lifting state up to a shared parent",
    ],
    read: [
      {
        path: "components/nav-link.tsx",
        note: "the smallest possible client island — one hook (usePathname)",
      },
      {
        path: "components/new-task-form.tsx",
        note: "useState, useEffect, and useRef working together in a real form",
      },
      {
        path: "components/learn-progress.tsx",
        href: "/learn",
        note: "THIS page's checklist — useState + a custom hook saving to localStorage",
      },
      {
        path: "components/select-field.tsx",
        note: "a richer client widget once the basics click",
      },
    ],
    build:
      "You already have a working example here: the Expand/Collapse-all button on this page is a useState toggle in learn-progress.tsx. Trace how it flips every card, then add a third 'expand only incomplete' option.",
    resources: [
      { label: "Adding Interactivity", href: "https://react.dev/learn/adding-interactivity" },
      { label: "Escape Hatches", href: "https://react.dev/learn/escape-hatches" },
    ],
  },
  {
    id: "app-router",
    index: 5,
    tag: "Routing",
    title: "Next.js App Router",
    duration: "~3–5 days",
    goal:
      "Know how a URL maps to a file, and how layouts, navigation, and the special files fit together.",
    learn: [
      "File routing: app/**/page.tsx = a route",
      "layout.tsx wraps a shared shell around routes",
      "Dynamic segments: the [id] folder",
      "<Link> and client-side navigation",
      "loading.tsx, error.tsx, not-found.tsx",
      "Route metadata for <title> / SEO",
      "params and searchParams",
    ],
    read: [
      {
        path: "app/layout.tsx",
        note: "the root shell: fonts, global CSS, sidebar, metadata template",
      },
      {
        path: "app/projects/page.tsx",
        href: "/projects",
        note: "a static list route",
      },
      {
        path: "app/projects/[id]/page.tsx",
        note: "a dynamic route reading params.id",
      },
      {
        path: "app/projects/[id]/loading.tsx",
        note: "instant loading UI; see also not-found.tsx & error.tsx",
      },
    ],
    build:
      "Add a new route at app/about/page.tsx describing this app, then add a sidebar link to it (see components/sidebar.tsx + nav-link.tsx for the pattern).",
    resources: [
      { label: "Routing Fundamentals", href: "https://nextjs.org/docs/app/building-your-application/routing" },
      { label: "Pages & Layouts", href: "https://nextjs.org/docs/app/api-reference/file-conventions/layout" },
    ],
  },
  {
    id: "server-components",
    index: 6,
    tag: "RSC",
    title: "Server Components & data fetching",
    duration: "~4–6 days",
    goal:
      "Internalize server-first rendering — the biggest mental shift coming from classic React — and how this app reads data.",
    learn: [
      "Server vs Client Components (server is the default)",
      "async components that await data directly",
      "Why server components can't use useState / browser APIs",
      "Passing server data down as props",
      "React cache() to de-dupe reads in one request",
      "export const dynamic = 'force-dynamic'",
      "The in-memory store as a stand-in for a database",
    ],
    read: [
      {
        path: "lib/store.ts",
        note: "the fake 'database' + seed data; survives HMR on globalThis",
      },
      {
        path: "lib/data.ts",
        note: "read-only functions, each wrapped in cache()",
      },
      {
        path: "app/page.tsx",
        href: "/",
        note: "an async Server Component: Promise.all of two reads, then render",
      },
      {
        path: "app/projects/[id]/page.tsx",
        note: "reads by id and calls notFound() when missing",
      },
    ],
    build:
      "Add getOverdueTasks() to lib/data.ts (wrap it in cache()), then render its count on the dashboard. Notice you never touched a client component.",
    resources: [
      { label: "Server Components", href: "https://nextjs.org/docs/app/building-your-application/rendering/server-components" },
      { label: "react.dev: cache", href: "https://react.dev/reference/react/cache" },
    ],
  },
  {
    id: "server-actions",
    index: 7,
    tag: "Mutations",
    title: "Server Actions & forms",
    duration: "~5–7 days",
    goal:
      "Change data safely and refresh the UI — the hardest and most rewarding phase. This is where reads, writes, and forms all meet.",
    learn: [
      "\"use server\" Server Actions",
      "<form action={serverAction}>",
      "Reading values from FormData",
      "Validating on the server (never trust the client)",
      "revalidatePath to bust caches; redirect to navigate",
      "useActionState for pending + returned errors",
      "useFormStatus for the submit button's pending state",
      "Progressive enhancement — forms work without JS",
    ],
    read: [
      {
        path: "lib/actions.ts",
        note: "READ TOP TO BOTTOM — every mutation in the app lives here",
      },
      {
        path: "components/new-task-form.tsx",
        note: "useActionState; resets itself after a successful add",
      },
      {
        path: "components/form-buttons.tsx",
        note: "useFormStatus pending button + confirm-to-delete",
      },
      {
        path: "app/projects/new/page.tsx",
        href: "/projects/new",
        note: "a full create form wired to a Server Action",
      },
    ],
    build:
      "Add an editTask Server Action in lib/actions.ts plus a small inline edit form. Validate the input, then revalidatePath the project route so the change shows immediately.",
    resources: [
      { label: "Server Actions", href: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" },
      { label: "useActionState", href: "https://react.dev/reference/react/useActionState" },
    ],
  },
  {
    id: "tailwind",
    index: 8,
    tag: "Styling",
    title: "Tailwind v4 & the design system",
    duration: "~2–4 days",
    goal:
      "Style new UI so it matches this app instead of inventing one-off patterns. The whole look lives in one CSS file.",
    learn: [
      "Utility-first styling on the element",
      "Responsive prefixes: sm: md: lg:",
      "State variants: hover: focus: disabled:",
      "Tailwind v4's CSS-first @theme config",
      "@layer components / utilities",
      "This app's tokens: neon-*, panel, ink, ink-muted",
      "Reusable classes: .panel, .btn-neon, .field, .holo-text",
    ],
    read: [
      {
        path: "app/globals.css",
        note: "the entire design system: tokens, .panel, .btn-neon, .field, glows",
      },
      {
        path: "lib/ui.ts",
        note: "class strings mapped per status/priority/color — styling as data",
      },
      {
        path: "components/project-card.tsx",
        note: "see .panel, badges, and ProgressBar composed in real markup",
      },
    ],
    build:
      "Add a new accent color token to @theme in globals.css, then add a matching ProjectColor in lib/types.ts and an entry in PROJECT_COLOR_META (lib/ui.ts). Create a project with it.",
    resources: [
      { label: "Tailwind: Styling", href: "https://tailwindcss.com/docs/styling-with-utility-classes" },
      { label: "Tailwind: Theme", href: "https://tailwindcss.com/docs/theme" },
    ],
  },
  {
    id: "capstone",
    index: 9,
    tag: "Capstone",
    title: "Ship a feature end-to-end",
    duration: "~1–2 weeks",
    goal:
      "Prove it. Build one vertical slice that touches every layer you just learned — that's what makes the knowledge stick.",
    learn: [
      "1 · Types — add a Comment type in lib/types.ts",
      "2 · Store — seed a few comments in lib/store.ts",
      "3 · Read — getCommentsByTask() in lib/data.ts, wrapped in cache()",
      "4 · Mutate — addComment / deleteComment actions in lib/actions.ts",
      "5 · UI — a server list + a client CommentForm (useActionState)",
      "6 · Route — surface it on the project detail page",
      "7 · Style — match the panel / field / button system",
    ],
    read: [
      {
        path: "lib/actions.ts",
        note: "model your new actions on createTask / deleteTask",
      },
      {
        path: "app/projects/[id]/page.tsx",
        note: "the page you'll extend with the comments section",
      },
      {
        path: "components/new-task-form.tsx",
        note: "the client-form pattern to copy for CommentForm",
      },
    ],
    build:
      "Build 'Comments on tasks' through all 7 layers above. Then write a short README explaining what each layer does — teaching it back is the real test that you've got it.",
    resources: [
      { label: "Next.js Docs", href: "https://nextjs.org/docs" },
      { label: "react.dev", href: "https://react.dev/learn" },
    ],
    capstone: true,
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-5">
      {/* ===== Command strip ===== */}
      <header className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan text-[#04070d] shadow-[0_0_18px_-2px_rgba(46,230,255,0.85)]">
            <BookIcon width={22} height={22} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold uppercase leading-none tracking-wide holo-text">
              Learning Path
            </h1>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
              Zero → This Stack
            </p>
          </div>
        </div>
        <span className="text-xs text-ink-muted">~4–6 weeks · part-time</span>
      </header>

      {/* ===== Orientation ===== */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            How to use this
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            You already know <span className="text-ink">HTML, CSS, and JavaScript</span>.
            This path bridges that to the exact stack this app is built on. Work the
            phases <span className="text-ink">in order</span> — each one follows the
            same rhythm:
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
            <li>
              <span className="font-semibold text-neon-cyan">Learn</span> — the
              concepts, kept to what this app actually uses.
            </li>
            <li>
              <span className="font-semibold text-neon-cyan">In this codebase</span> —
              real files here to study; the best textbook is the code itself.
            </li>
            <li>
              <span className="font-semibold text-neon-cyan">Build it</span> — a small,
              concrete change to make it stick.
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Tick phases off as you go — your progress is saved in this browser.
          </p>
        </div>

        {/* The one big idea + setup */}
        <div className="space-y-5 lg:col-span-1">
          <div className="panel p-5">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              <RocketIcon width={15} height={15} className="text-neon-orange" />
              The one big idea
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              <span className="holo-text font-semibold">Server-first.</span> Components
              render on the server and send HTML by default. You opt into the browser
              with <code className="rounded bg-black/30 px-1 font-mono text-[12px] text-neon-cyan">{'"use client"'}</code>{" "}
              only for interactivity. Hold onto this — it reframes every phase below.
            </p>
          </div>
          <div className="panel p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Run it locally
            </h2>
            <ol className="mt-2 space-y-1 font-mono text-[12px] text-neon-cyan">
              <li>npm install</li>
              <li>npm run dev</li>
              <li className="text-ink-muted"># open localhost:3000</li>
            </ol>
            <p className="mt-2 text-xs text-ink-muted">
              Keep the app running while you read — edit a file, save, watch it change.
            </p>
          </div>
        </div>
      </section>

      {/* ===== The interactive curriculum (Client island) ===== */}
      <LearningPath phases={PHASES} />

      {/* ===== Where to go next ===== */}
      <section className="panel p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Where to go next
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Once the capstone ships, the natural next steps beyond this app:
          <span className="text-ink"> automated testing</span> (Vitest + Playwright),
          a <span className="text-ink">real database</span> (Prisma or Drizzle on
          Postgres — swap out lib/store.ts and lib/data.ts),
          <span className="text-ink"> authentication</span> (NextAuth or Clerk),
          and <span className="text-ink">deployment</span> (Vercel). Each one slots
          into the layers you now understand.
        </p>
      </section>
    </div>
  );
}
