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
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          New project
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Give your project a name and an accent color to get started.
        </p>
      </header>

      <NewProjectForm />
    </div>
  );
}
