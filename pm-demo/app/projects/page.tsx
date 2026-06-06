import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import { EmptyState } from "@/components/ui";
import { ProjectRow } from "@/components/project-row";
import { PlusIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Projects" };

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-5">
      {/* Command strip */}
      <header className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-none tracking-wide holo-text">
            Projects
          </h1>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
            {activeCount} active
          </p>
        </div>
        <Link href="/projects/new" className="btn-neon">
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      {/* Mission list */}
      <section className="panel p-0">
        <h2 className="border-b border-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          All Projects
        </h2>

        {projects.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No projects yet"
              description="Create your first project to start tracking tasks."
              action={
                <Link href="/projects/new" className="btn-neon">
                  <PlusIcon width={16} height={16} />
                  New Project
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectRow project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
