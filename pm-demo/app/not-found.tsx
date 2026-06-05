import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">
        Page not found
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
