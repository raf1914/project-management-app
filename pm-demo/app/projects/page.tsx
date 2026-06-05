import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/ui";
import { PlusIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Projects" };

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide holo-text">
            Projects
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Link href="/projects/new" className="btn-neon">
          <PlusIcon width={16} height={16} />
          New Project
        </Link>
      </header>

      {projects.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
