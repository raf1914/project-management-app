import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-neon-pink text-glow">
        Project not found
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        This project may have been deleted or never existed.
      </p>
      <Link href="/projects" className="btn-neon mt-6">
        Back to projects
      </Link>
    </div>
  );
}
