import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-slate-900">
        Project not found
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        This project may have been deleted or never existed.
      </p>
      <Link
        href="/projects"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Back to projects
      </Link>
    </div>
  );
}
