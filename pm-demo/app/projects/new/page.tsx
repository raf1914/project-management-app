/**
 * @file New Project page that renders a centered form for creating a project
 * with a name, description, and accent color selection.
 */

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
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neon-cyan/80 transition hover:text-neon-cyan hover:text-glow-sm"
        >
          ← Projects
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold uppercase leading-none tracking-wide holo-text">
          New Project
        </h1>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
          Name it and pick an accent to get started
        </p>
      </header>

      <NewProjectForm />
    </div>
  );
}
