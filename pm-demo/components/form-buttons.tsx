"use client";

/**
 * @file Reusable form button components (SubmitButton, ConfirmButton) wired to
 * React's useFormStatus for progressive-enhancement pending states.
 */

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/**
 * Submit button wired to the parent <form>'s pending state via `useFormStatus`.
 * Must be rendered as a CHILD of the <form> (that's how the hook finds it).
 */
export function SubmitButton({
  children,
  pendingText,
  className = "",
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} aria-busy={pending}>
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/**
 * Submit button that asks for confirmation before submitting — used for
 * destructive actions (delete project / task). Still progressively enhanced:
 * the form submits to the Server Action either way.
 */
export function ConfirmButton({
  children,
  confirmMessage,
  className = "",
  title,
}: {
  children: ReactNode;
  confirmMessage: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      aria-busy={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
