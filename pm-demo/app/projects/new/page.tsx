import type { Metadata } from "next";
import Link from "next/link";
import { NewProjectForm } from "@/components/new-project-form";

export const metadata: Metadata = { title: "New Project" };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <Link
          href="/projects"
          className="text-sm font-medium text-neon-cyan/80 transition hover:text-neon-cyan hover:text-glow-sm"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-ink text-glow-sm">
          New project
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Give your project a name and an accent color to get started.
        </p>
      </header>

      <NewProjectForm />
    </div>
  );
}
