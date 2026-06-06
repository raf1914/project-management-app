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
//* JSON). Read each card top-to-bottom: Goal → Key idea → Learn → In this repo →
//* Build it → Watch out for → Checkpoint.
const PHASES: LearnPhase[] = [
  {
    id: "modern-js",
    index: 1,
    tag: "Modern JS",
    title: "Modern JavaScript foundations",
    duration: "~3–5 days",
    goal:
      "Read modern JavaScript without guessing. React and Next are just JS — these idioms appear on every line of this app.",
    keyIdea:
      "React and Next add almost no new syntax — they're libraries written in the JavaScript you're learning here. Get fluent in these idioms and the frameworks become mostly APIs on top.",
    learn: [
      { term: "let / const & block scope", detail: "const by default, let only when you must reassign — both scoped to their block, unlike the old var." },
      { term: "Arrow functions vs declarations", detail: "Arrows are terse and inherit this; you'll see them as the callback in nearly every .map and event handler." },
      { term: "Template literals", detail: "Backtick strings with ${expr} interpolation — how every dynamic string and className is assembled." },
      { term: "Destructuring", detail: "Pull fields out by name: const { title } = task. Props and hook returns are destructured constantly." },
      { term: "Spread / rest …", detail: "{ ...task, status } copies-then-overrides; [ ...list, x ] appends without mutating — the basis of immutable updates React relies on." },
      { term: "map / filter / reduce / find", detail: "Transform, select, fold-to-one, and look-up over arrays — these replace almost every for-loop you'd write." },
      { term: "Ternary, && , ??", detail: "cond ? a : b for either/or; cond && <X/> to render-or-nothing; a ?? b for 'a unless it's null/undefined'." },
      { term: "Optional chaining ?.", detail: "state?.ok reads safely when the left side may be null — no more 'cannot read property of undefined'." },
      { term: "ES modules", detail: "import / export wire files together; every file in this repo is a module." },
      { term: "Promises & async / await", detail: "await pauses for an async result; the data layer is async so it can mirror a real database call." },
    ],
    read: [
      { path: "lib/format.ts", note: "template literals, split/map, padStart — small pure functions to read first" },
      { path: "lib/data.ts", note: "map / filter / reduce and async functions doing the real work" },
      { path: "lib/ui.ts", note: "exported const objects, Array.includes, named helpers" },
    ],
    build:
      "In a scratch file, write summarize(tasks) that returns counts per status using reduce, then run it with `node`. No React — just the language.",
    pitfalls: [
      "Using map when you mean forEach — map returns a new array, forEach returns undefined.",
      "Mutating an array/object in place (push, splice, obj.x = …) where React expects a fresh reference — prefer spread.",
      "Using == (which coerces types) instead of === — always use ===.",
      "Treating an async function's result as a value — without await you get a Promise, not the data.",
    ],
    checkpoint:
      "you can open any function in lib/ and explain what each .map / .filter / .reduce produces, without running it.",
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
    keyIdea:
      "Types are a contract checked before your code runs. They describe the shape of every value so the editor catches mistakes you'd otherwise hit at runtime — then vanish entirely at build time.",
    learn: [
      { term: "Primitives & inference", detail: "TS infers types from values, so you rarely annotate locals — mostly just function boundaries." },
      { term: "type vs interface", detail: "Both name a shape: interface for objects you might extend, type for unions and aliases. This app uses both." },
      { term: "Union & literal types", detail: "type TaskStatus = 'todo' | 'in-progress' | 'done' — a value must be exactly one of these strings." },
      { term: "Optional ? & readonly", detail: "dueDate?: string may be absent; readonly fields can't be reassigned after creation." },
      { term: "Typing params & returns", detail: "The signature is documentation: getTask(id: string): Promise<Task | undefined> tells you everything." },
      { term: "Generics, just enough", detail: "Array<Task>, Record<TaskStatus, Task[]>, Promise<T> — containers parameterized by the type they hold." },
      { term: "as assertions", detail: "x as Foo overrides the checker — a last resort that silences it, never a real runtime cast. Avoid where you can." },
      { term: "Types are erased", detail: "All of this disappears at build time: zero runtime cost, and zero runtime safety — so validate real inputs yourself." },
    ],
    read: [
      { path: "lib/types.ts", note: "START HERE — the whole domain model (Task, Project, unions like TaskStatus)" },
      { path: "lib/ui.ts", note: "Record<TaskStatus, …> maps a union to metadata for every case" },
      { path: "lib/data.ts", note: "return types like Promise<ProjectWithStats[]> describe each reader" },
    ],
    build:
      "Add a field to the Task interface in lib/types.ts (e.g. tags: string[]). Don't fix anything yet — just read every red squiggle TypeScript raises across the app to see what the type touches. (You'll finish this thread in the capstone.)",
    pitfalls: [
      "Reaching for any — it switches off checking for that value and everything it flows into. Prefer unknown + narrowing.",
      "Trusting as to make bad data safe — assertions lie to the compiler; they don't validate anything.",
      "Confusing a type error (build-time) with a runtime crash — green types don't guarantee correct logic.",
    ],
    checkpoint:
      "given lib/types.ts, you can predict which fields are required, optional, or unions — and add a new field the compiler then demands everywhere it's needed.",
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
    keyIdea:
      "UI is a function of data. A component takes props in and returns JSX; change the data and React re-runs the function to produce the new markup. You describe what the UI should be, not how to mutate it.",
    learn: [
      { term: "A component returns JSX", detail: "A capitalized function that returns markup — that's the entire primitive." },
      { term: "JSX rules", detail: "className not class, { } for JS expressions, exactly one root element (or a <>…</> fragment)." },
      { term: "Props & typing them", detail: "Inputs passed like HTML attributes, typed with an inline object: { task }: { task: Task }." },
      { term: "Composition & children", detail: "Components nest; the special children prop renders whatever you place between the tags." },
      { term: "Lists with map + key", detail: "Render arrays with .map and give each item a stable key so React can track it across renders." },
      { term: "Conditional rendering", detail: "cond && <X/> or a ternary decide what — if anything — to render." },
      { term: "Re-rendering", detail: "When props or state change, the function runs again and React diffs the result against the DOM." },
    ],
    read: [
      { path: "components/ui.tsx", note: "Badge, ProgressBar, Avatar, EmptyState — tiny prop-driven components" },
      { path: "components/metric-tile.tsx", note: "a focused presentational component taking simple props" },
      { path: "components/project-card.tsx", note: "receives one typed object as a prop and renders it" },
      { path: "app/page.tsx", href: "/", note: ".map with key + conditional empty state in a real page" },
    ],
    build:
      "Create components/info-pill.tsx — a presentational component taking { label, value } props — and drop a few onto the dashboard temporarily to see them render.",
    pitfalls: [
      "Using the array index as key when the list reorders or filters — causes subtle UI bugs. Use a stable id.",
      "Writing class= or for= instead of className= / htmlFor=.",
      "Putting a bare if-statement inside JSX — use a ternary or &&, or compute the value above the return.",
      "Mutating props — they're read-only inputs, not state.",
    ],
    checkpoint:
      "you can build a small presentational component from scratch, type its props, and render a list of them with correct keys — without copying an existing file.",
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
    keyIdea:
      "Hooks let a component remember things (state) and reach outside React (effects, refs, the DOM). In the App Router everything is server-rendered until a file opts into the browser with \"use client\".",
    learn: [
      { term: "useState & events", detail: "Holds values that change over time; calling the setter re-renders the component with the new value." },
      { term: "Controlled inputs", detail: "value + onChange make React the single source of truth for a form field." },
      { term: "useEffect & deps", detail: "Run a side effect after render; the dependency array decides when it re-runs. Empty [] = once on mount." },
      { term: "useRef", detail: "A mutable box that survives renders without causing one — for DOM nodes or a 'latest value'." },
      { term: '"use client"', detail: "Marks a file — and everything it imports — as browser code, so it can use hooks, events, and the DOM." },
      { term: "Rules of hooks", detail: "Call hooks at the top level of a component, in the same order every render — never inside a condition or loop." },
      { term: "Lifting state up", detail: "When two components need the same state, move it to their closest shared parent and pass it down as props." },
    ],
    read: [
      { path: "components/nav-link.tsx", note: "the smallest possible client island — one hook (usePathname)" },
      { path: "components/new-task-form.tsx", note: "useState, useEffect, and useRef working together in a real form" },
      { path: "components/learn-progress.tsx", href: "/learn", note: "THIS page's checklist — useState + a custom hook (useSyncExternalStore) saving to localStorage" },
      { path: "components/kanban.tsx", note: "useOptimistic + useTransition + drag-and-drop — client state once the basics click" },
    ],
    build:
      "You already have a working example here: the Expand/Collapse-all button on this page is a useState toggle in learn-progress.tsx. Trace how it flips every card, then add a third 'expand only incomplete' option.",
    pitfalls: [
      "Missing a dependency in useEffect gives stale values; over-listing them causes infinite loops. Lint warnings here are real.",
      "Adding \"use client\" to a whole page when only one widget needs it — keep client islands small and push them to the leaves.",
      "Calling a hook conditionally or inside a loop — breaks the rules-of-hooks ordering.",
      "Storing in state what you can derive from existing props/state — compute it during render instead.",
    ],
    checkpoint:
      "you can take a static component, add a useState toggle, and explain exactly why that file now needs \"use client\".",
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
    keyIdea:
      "The filesystem is the router. A folder under app/ is a URL segment, a page.tsx inside it is the page, and special files (layout, loading, error, not-found) wrap behavior around that route.",
    learn: [
      { term: "File routing", detail: "app/projects/page.tsx → /projects. The folder path literally is the URL." },
      { term: "layout.tsx", detail: "A shared shell that wraps every route beneath it and persists across navigations." },
      { term: "Dynamic segments [id]", detail: "A folder named [id] captures that URL part and hands it to the page via params." },
      { term: "<Link> navigation", detail: "Client-side route changes with prefetching — no full page reload, client state survives." },
      { term: "loading / error / not-found", detail: "Drop-in files that render during data load, on a thrown error, or when notFound() is called." },
      { term: "Metadata", detail: "Export metadata (or generateMetadata) to set <title> and SEO tags per route." },
      { term: "params & searchParams", detail: "In this Next version params is a Promise — you await it inside the page (see the [id] routes)." },
    ],
    read: [
      { path: "app/layout.tsx", note: "the root shell: fonts, global CSS, sidebar, metadata template" },
      { path: "app/projects/page.tsx", href: "/projects", note: "a static list route" },
      { path: "app/projects/[id]/page.tsx", note: "a dynamic route that awaits params, then reads by id" },
      { path: "app/projects/[id]/loading.tsx", note: "instant loading UI; see also not-found.tsx & error.tsx nearby" },
    ],
    build:
      "Add a new route at app/about/page.tsx describing this app, then add a sidebar link to it (see components/sidebar.tsx + nav-link.tsx for the pattern).",
    pitfalls: [
      "Forgetting to await params / searchParams — in this Next version they're Promises, not plain objects.",
      "Putting client-only logic in a layout or page that should stay a Server Component.",
      "Using a plain <a href> for internal links — it does a full reload and drops client state; use <Link>.",
      "Naming the dynamic folder [id] but reading a different key off params.",
    ],
    checkpoint:
      "you can add a new route plus a sidebar link from scratch and say which file would handle its loading and not-found states.",
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
    keyIdea:
      "Components render on the server by default. A Server Component can be async and await its data directly — no useEffect, no fetch-on-mount, no loading flicker. It never ships to the browser as JavaScript.",
    learn: [
      { term: "Server is the default", detail: "No directive = Server Component. Only files marked \"use client\" run in the browser." },
      { term: "async components", detail: "A Server Component can be async and await its data right in the body before returning JSX." },
      { term: "No hooks/browser APIs server-side", detail: "useState, useEffect, window, localStorage don't exist there — that's exactly what client islands are for." },
      { term: "Passing data as props", detail: "Fetch on the server, then hand plain serializable data down to client components as props." },
      { term: "cache()", detail: "Wrap a reader so repeated calls within one request return the same result instead of re-querying." },
      { term: "force-dynamic", detail: "export const dynamic = 'force-dynamic' opts a route out of caching so it always re-renders with fresh store data." },
      { term: "The in-memory store", detail: "lib/store.ts stands in for a database; swap it for real queries and nothing else in the app changes." },
    ],
    read: [
      { path: "lib/store.ts", note: "the fake 'database' + seed data; survives HMR on globalThis" },
      { path: "lib/data.ts", note: "read-only functions, each wrapped in cache()" },
      { path: "app/page.tsx", href: "/", note: "an async Server Component: Promise.all of two reads, then render" },
      { path: "app/projects/[id]/page.tsx", note: "reads by id and calls notFound() when missing" },
    ],
    build:
      "Add getOverdueTasks() to lib/data.ts (wrap it in cache()), then render its count on the dashboard. Notice you never touched a client component or a hook.",
    pitfalls: [
      "Reaching for useEffect + fetch out of habit — a Server Component just awaits the data directly.",
      "Trying to pass a function or class instance from server to client — only serializable data crosses that boundary.",
      "Forgetting force-dynamic on a route that reads mutable store data — you may serve a stale render.",
      "Importing a server-only module into a client component (or vice-versa).",
    ],
    checkpoint:
      "you can add a new cache()-wrapped reader and surface its result on a page without writing a single hook.",
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
    keyIdea:
      "A Server Action is a function that runs on the server but is called like a normal function from the client — usually as a form's action. It's how every write in this app happens, and it's a real endpoint, so the server must validate.",
    learn: [
      { term: '"use server"', detail: "Marks a function (or whole file) as a Server Action — privileged code that may touch the data store." },
      { term: "<form action={fn}>", detail: "Wire a form straight to an action; the browser posts its FormData to it." },
      { term: "Reading FormData", detail: "Pull fields with formData.get('name'); coerce and trim them yourself (see the str() helper in actions.ts)." },
      { term: "Server-side validation", detail: "Actions are reachable by direct POST, so never trust client input — re-check every field on the server." },
      { term: "revalidatePath / redirect", detail: "Bust the cache for affected routes so they re-render; redirect to navigate after a successful write." },
      { term: "useActionState", detail: "Track an action's pending state and returned value (error / ok) for inline form feedback." },
      { term: "useFormStatus", detail: "Let a submit button know its parent form is pending, without prop-drilling (see form-buttons.tsx)." },
      { term: "Progressive enhancement", detail: "Because it's a real form post, it works even before/without JS — the hooks just upgrade the experience." },
    ],
    read: [
      { path: "lib/actions.ts", note: "READ TOP TO BOTTOM — every mutation lives here: createTask, updateTask, logTime, addComment…" },
      { path: "components/new-task-form.tsx", note: "useActionState; resets itself after a successful add" },
      { path: "components/task-edit-form.tsx", note: "the update path — a client form bound to the updateTask action" },
      { path: "components/form-buttons.tsx", note: "useFormStatus pending button + confirm-to-delete" },
      { path: "app/projects/new/page.tsx", href: "/projects/new", note: "a full create form wired to a Server Action" },
    ],
    build:
      "Add a duplicateTask Server Action in lib/actions.ts that clones a task (fresh id, '(copy)' appended to the title), then revalidatePath the board so the copy appears instantly. Model it on createTask + setTaskStatus.",
    pitfalls: [
      "Validating only in the browser — the action is a public endpoint; re-validate on the server every time.",
      "Forgetting revalidatePath — the mutation succeeds but the stale UI never updates.",
      "Wrapping redirect() in a try/catch — it works by throwing a special signal; don't swallow it.",
      "Returning a non-serializable value from an action — the result has to cross back to the client as JSON.",
    ],
    checkpoint:
      "you can add a new action that validates input, mutates the store, revalidates the route, and shows pending + error states via useActionState.",
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
    keyIdea:
      "Style by composing small utility classes on the element, and reach for this app's named tokens and component classes (.panel, .btn-neon, neon-*) instead of inventing new colors or spacing.",
    learn: [
      { term: "Utility-first", detail: "Small single-purpose classes (px-3, flex, text-sm) composed directly on the element." },
      { term: "Responsive prefixes", detail: "sm: md: lg: apply a utility only at or above that width — mobile-first." },
      { term: "State variants", detail: "hover: focus: disabled: apply a utility only in that interaction state." },
      { term: "@theme (v4 CSS-first config)", detail: "Tailwind v4 configures design tokens in CSS, not a JS file — see the @theme block atop globals.css." },
      { term: "@layer components / utilities", detail: "Where reusable classes like .panel and .btn-neon are defined." },
      { term: "This app's tokens", detail: "neon-* colors plus panel / ink / ink-muted — use these so new UI matches automatically." },
      { term: "Reusable classes", detail: ".panel, .btn-neon, .field, .holo-text encapsulate the look — prefer them over re-deriving the styles." },
    ],
    read: [
      { path: "app/globals.css", note: "the entire design system: tokens, .panel, .btn-neon, .field, glows, the starfield + horizon grid" },
      { path: "lib/ui.ts", note: "class strings mapped per status/priority/color — styling as data" },
      { path: "components/project-card.tsx", note: "see .panel, badges, and ProgressBar composed in real markup" },
    ],
    build:
      "Add a new accent color token to @theme in globals.css, then add a matching ProjectColor in lib/types.ts and an entry in PROJECT_COLOR_META (lib/ui.ts). Create a project with it.",
    pitfalls: [
      "Building class names dynamically (text-${color}) — Tailwind can't see them so they're never generated. Use full literal strings (see the ACCENTS array in learn-progress.tsx).",
      "Hard-coding hex colors instead of the neon-* tokens — it breaks visual consistency.",
      "Re-implementing .panel or .btn-neon with raw utilities instead of just reusing the class.",
      "Fighting specificity — utilities are flat; what matters is layer order in the CSS, not selector weight.",
    ],
    checkpoint:
      "you can add a new element that looks native to the app using existing tokens and classes — and explain why a dynamically-built class name wouldn't render.",
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
    keyIdea:
      "A feature only proves you've learned the stack when it spans every layer: type → store → read → mutate → UI → route → style. Build one thin slice all the way through and the whole thing clicks.",
    learn: [
      { term: "1 · Types", detail: "Add tags: string[] to the Task interface in lib/types.ts (you may have started this back in Phase 2)." },
      { term: "2 · Store", detail: "Give a few seed tasks some tags in lib/store.ts so there's data to render on first load." },
      { term: "3 · Read", detail: "Add getAllTags() to lib/data.ts (unique + sorted), wrapped in cache() — mirror getTeamMembers()." },
      { term: "4 · Mutate", detail: "Read tags from FormData in createTask / updateTask (comma-split + trim), validating on the server." },
      { term: "5 · UI", detail: "Render tag badges on the task card, plus a client tag input in the edit form — reuse the Badge + .field styles." },
      { term: "6 · Route", detail: "Surface tags on the task detail page; for extra credit, filter the board by a selected tag." },
      { term: "7 · Style", detail: "Match the existing badge / field / btn-neon tokens so the feature looks native." },
    ],
    read: [
      { path: "components/task-comments.tsx", note: "a complete server-list + client-form slice already shipped — the exact pattern to copy" },
      { path: "components/task-time-log.tsx", note: "a second full slice, with a derived stat (logged vs estimate) — study how it rolls up" },
      { path: "lib/actions.ts", note: "model your tag mutations on createTask / updateTask / logTime" },
      { path: "app/projects/[id]/tasks/[taskId]/page.tsx", note: "where those slices are surfaced — extend it with tags" },
    ],
    build:
      "Build 'Task Tags' through all 7 layers above. The Comments and Time-log features already in this repo are your reference implementations — read them, then ship tags the same way. Finish by writing a short README explaining what each layer does; teaching it back is the real test that you've got it.",
    pitfalls: [
      "Starting with the UI — get types → store → read solid first, or you're building on sand.",
      "Skipping server-side validation/trimming because it's 'just a demo' — build the habit now.",
      "Forgetting revalidatePath after add/remove — the new tag won't show until a manual reload.",
      "Cramming the list and the form into one component — split the Server list from the client input, like task-comments.tsx does.",
    ],
    checkpoint:
      "your feature reads, writes, validates, revalidates, and looks native — and you can walk someone else through every layer it touches.",
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
        <span className="text-xs text-ink-muted">9 phases · ~4–6 weeks part-time</span>
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
              concepts, kept to what this app actually uses, each with a one-line gloss.
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
            Each card also surfaces the{" "}
            <span className="text-ink">key idea</span> to anchor on, the{" "}
            <span className="text-ink">pitfalls</span> to dodge, and a{" "}
            <span className="text-ink">checkpoint</span> so you know when you&apos;ve
            actually got it. Tick phases off as you go — your progress is saved in this
            browser.
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
