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
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(177,74,237,0.3), transparent 60%), radial-gradient(120% 60% at 50% 110%, rgba(255,46,151,0.25), transparent 55%), linear-gradient(180deg, #0b0418 0%, #120627 45%, #08030f 100%)",
          color: "#f4ecff",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#ff4d6d",
            textShadow: "0 0 10px #ff4d6d, 0 0 26px rgba(255,77,109,0.6)",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            marginTop: "0.5rem",
            maxWidth: "28rem",
            fontSize: "0.875rem",
            color: "#a78bdc",
          }}
        >
          An unexpected error occurred. Try again, or reload the page.
        </p>
        <button
          onClick={() => retry()}
          style={{
            marginTop: "1.5rem",
            borderRadius: "0.6rem",
            border: "none",
            background: "linear-gradient(95deg, #22e6ff, #ff2e97)",
            color: "#0a0418",
            padding: "0.55rem 1.1rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 22px -4px rgba(255,46,151,0.8)",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
