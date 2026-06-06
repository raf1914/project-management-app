"use client"; //* Error boundaries must be Client Components.

/**
 * @file Route-segment error boundary that catches render errors and offers a
 * retry action using Next.js's reset or unstable_retry recovery prop.
 */

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
    //* Report to your error-tracking service here.
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset ?? (() => {});

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-neon-red text-glow">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        An unexpected error occurred while loading this page.
      </p>
      <button onClick={() => retry()} className="btn-neon mt-6">
        Try again
      </button>
    </div>
  );
}
