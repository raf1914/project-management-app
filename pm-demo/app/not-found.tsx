/**
 * @file 404 Not Found page displayed when Next.js cannot match a route or when
 * notFound() is called from a server component.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-black text-neon-pink text-glow">404</p>
      <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-ink">
        Page not found
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="btn-neon mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}
