# Project Hub — a basic project-management framework

A small but complete **project-management** starter built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

It demonstrates the modern Next.js data-flow end to end:

- **Server Components** read data directly (no client fetching, no API layer needed).
- **Server Actions** (`"use server"`) handle every mutation, then `revalidatePath` refreshes the affected routes.
- A swappable **in-memory data layer** stands in for a database, so the framework runs with zero setup.

## Features

- **Dashboard** (`/`) — project/task stats, overall completion, and recent projects.
- **Projects** (`/projects`) — grid of projects with per-project progress.
- **New project** (`/projects/new`) — create a project with name, description, and accent color.
- **Project detail** (`/projects/[id]`) — a **Kanban board** (To Do / In Progress / Done) with:
  - add tasks inline (title, assignee, priority, due date),
  - move tasks between columns,
  - delete tasks (with confirm),
  - change project status, delete project,
  - overdue-date highlighting.
- Proper **loading**, **error**, and **not-found** UI.

## Getting started

```bash
npm install      # if you haven't already
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # ESLint (flat config)
```

> The store is in-memory and seeded on server start (see `lib/store.ts`). Data
> resets when the server process restarts.

## Project structure

```
app/
  layout.tsx            # app shell: sidebar + main, root <html>/<body>, metadata
  page.tsx              # dashboard (force-dynamic)
  error.tsx             # route error boundary (client; uses unstable_retry)
  not-found.tsx         # global 404
  projects/
    page.tsx            # projects list (force-dynamic)
    new/page.tsx        # create-project form
    [id]/
      page.tsx          # project detail + kanban board, generateMetadata, notFound()
      loading.tsx       # board skeleton
      not-found.tsx     # scoped "project not found"
components/             # presentational + interactive UI (server & client)
lib/
  types.ts              # domain types (Project, Task, ...)
  store.ts              # in-memory store (globalThis-cached for HMR) + seed data
  data.ts               # read functions (React cache()), used by Server Components
  actions.ts            # Server Actions ("use server") — the only place data is mutated
  ui.ts                 # status/priority/color presentation metadata
  format.ts             # date/initials helpers
```

## How it works (Next.js 16 patterns used)

- **Async route params** — `params` is a `Promise` and is always awaited:
  `const { id } = await params`.
- **Server Actions** — defined in `lib/actions.ts`. Form-driven actions use the
  `useActionState` signature `(prevState, formData)`; status/delete buttons bind
  arguments with `action.bind(null, id, status)`. Each mutation calls
  `revalidatePath(...)` and the create/delete flows `redirect()` **last**.
- **Caching** — [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
  is intentionally **off**. Data pages export `dynamic = "force-dynamic"` so the
  mutable in-memory store always renders fresh, and `revalidatePath` busts the
  client router cache. (If you later move to a real DB and want static shells,
  enable `cacheComponents` and adopt `use cache` + `updateTag`.)
- **Progressive enhancement** — the kanban move/delete forms submit to Server
  Actions and work even without client JavaScript; `useFormStatus` adds pending
  state on top.

## Swapping in a real database

The UI and actions never touch the store directly beyond `lib/data.ts` and
`lib/actions.ts`. Replace the bodies of those functions with real queries
(Prisma, Drizzle, etc.) — keep the function signatures — and the rest of the app
is unchanged. Add authentication/authorization checks inside every Server Action
(they are reachable via direct POST requests).
