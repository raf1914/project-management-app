"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";

/**
 * Route error boundary. In Next.js 16.2 the recovery prop is `unstable_retry`
 * (re-fetch + re-render); `reset` (re-render only) remains as a fallback, so we
 * accept both and prefer retry.
 */
export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // Report to your error-tracking service here.
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset ?? (() => {});

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-slate-900">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => retry()}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  );
}
