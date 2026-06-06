"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addComment, deleteComment, type FormState } from "@/lib/actions";
import { Avatar } from "./ui";
import { SelectField } from "./select-field";
import { SubmitButton } from "./form-buttons";
import { CheckIcon, AlertIcon, TrashIcon } from "./icons";
import { formatDate } from "@/lib/format";
import type { Comment } from "@/lib/types";

const field = "field";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted"
    >
      {children}
    </label>
  );
}

export function TaskComments({
  comments,
  taskId,
  projectId,
  teamMembers,
}: {
  comments: Comment[];
  taskId: string;
  projectId: string;
  teamMembers: string[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setResetKey((k) => k + 1);
    }
  }, [state]);

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        Updates
        {comments.length > 0 && (
          <span className="ml-2 rounded-full bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-ink-muted/50">
            {comments.length}
          </span>
        )}
      </h2>

      <div className="panel overflow-hidden">
        {/* Thread */}
        {comments.length > 0 && (
          <ul className="divide-y divide-white/[0.06]">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 px-5 py-4">
                <div className="mt-0.5 shrink-0">
                  <Avatar name={comment.author} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-ink">
                        {comment.author}
                      </span>
                      <span className="text-[11px] text-ink-muted/50">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <form action={deleteComment.bind(null, comment.id, taskId, projectId)}>
                      <SubmitButton className="rounded p-1 text-ink-muted/25 transition-colors hover:text-neon-red/70 disabled:opacity-40">
                        <span className="sr-only">Delete update</span>
                        <TrashIcon width={12} height={12} />
                      </SubmitButton>
                    </form>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add update form */}
        <form
          ref={formRef}
          action={formAction}
          className="space-y-3 border-t border-white/[0.06] p-5"
        >
          <input type="hidden" name="taskId" value={taskId} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <FieldLabel htmlFor="comment-author">Author</FieldLabel>
              <SelectField
                key={`author-${resetKey}`}
                id="comment-author"
                name="author"
                defaultValue=""
                searchable
                options={[
                  { value: "", label: "Select author…" },
                  ...teamMembers.map((m) => ({ value: m, label: m })),
                ]}
              />
            </div>
            <div className="sm:col-span-8">
              <FieldLabel htmlFor="comment-body">Update</FieldLabel>
              <textarea
                id="comment-body"
                name="body"
                rows={3}
                required
                maxLength={2000}
                placeholder="What's the latest on this task?"
                className={`${field} resize-y`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p
              className="flex min-h-[1.25rem] items-center gap-1.5 text-sm font-medium"
              aria-live="polite"
            >
              {state?.error && (
                <span className="flex items-center gap-1.5 text-neon-red text-glow-sm">
                  <AlertIcon width={14} height={14} />
                  {state.error}
                </span>
              )}
              {state?.ok && (
                <span className="flex items-center gap-1.5 text-neon-green text-glow-sm">
                  <CheckIcon width={14} height={14} />
                  Update posted.
                </span>
              )}
            </p>
            <SubmitButton pendingText="Posting…" className="btn-neon">
              Post update
            </SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}
