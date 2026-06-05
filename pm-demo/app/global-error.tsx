"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";

/**
 * Global error boundary. Catches errors thrown by the root `layout.tsx` /
 * `template.tsx` (which the segment-level `error.tsx` cannot reach) and replaces
 * the whole document, so it must render its own <html>/<body>.
 *
 * Providing this file also means the app no longer depends on Next's built-in
 * `node_modules/.../builtin/global-error.js` fallback — an app-owned boundary is
 * compiled into the route's own client chunks, so it is registered in the RSC
 * client manifest alongside `error.tsx` instead of as a separately-resolved
 * vendor chunk.
 *
 * In Next.js 16.2 the recovery prop is `unstable_retry` (re-fetch + re-render);
 * `reset` (re-render only) remains as a fallback, so we accept both.
 */
export default function GlobalError({
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
    // global-error replaces the root layout, so it must render its own document.
    // Styles are inline because the app's global CSS lives behind the (replaced)
    // root layout.
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h2>
        <p
          style={{
            marginTop: "0.5rem",
            maxWidth: "28rem",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          An unexpected error occurred. Try again, or reload the page.
        </p>
        <button
          onClick={() => retry()}
          style={{
            marginTop: "1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
