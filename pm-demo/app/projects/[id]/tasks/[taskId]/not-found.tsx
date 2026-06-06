import Link from "next/link";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-5xl font-display font-bold holo-text">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">Task not found</h1>
      <p className="mt-2 text-sm text-ink-muted">
        This task may have been deleted or the link is invalid.
      </p>
      <Link href="/projects" className="btn-ghost mt-8">
        ← Back to projects
      </Link>
    </div>
  );
}
