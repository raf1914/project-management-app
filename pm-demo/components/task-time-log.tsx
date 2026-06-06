"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { logTime, deleteTimeLog, type FormState } from "@/lib/actions";
import { Avatar } from "./ui";
import { SelectField } from "./select-field";
import { DateField } from "./date-field";
import { SpinButtons } from "./spin-buttons";
import { SubmitButton } from "./form-buttons";
import { CheckIcon, AlertIcon, TrashIcon, ClockIcon } from "./icons";
import { formatDate, todayLocal } from "@/lib/format";
import type { TimeLog } from "@/lib/types";

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

export function TaskTimeLog({
  timeLogs,
  taskId,
  projectId,
  estimateHours,
  teamMembers,
}: {
  timeLogs: TimeLog[];
  taskId: string;
  projectId: string;
  estimateHours: number;
  teamMembers: string[];
}) {
  const totalLogged = timeLogs.reduce((sum, tl) => sum + tl.hours, 0);
  const pct = estimateHours > 0 ? Math.round((totalLogged / estimateHours) * 100) : 0;
  const isOver = totalLogged > estimateHours;
  const isNear = !isOver && pct >= 80;
  const barColor = isOver
    ? "bg-neon-red shadow-[0_0_8px_rgba(255,90,74,0.55)]"
    : isNear
      ? "bg-neon-orange shadow-[0_0_8px_rgba(255,154,60,0.5)]"
      : "bg-neon-cyan shadow-[0_0_8px_rgba(47,224,219,0.4)]";

  const [state, formAction] = useActionState<FormState, FormData>(logTime, null);
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
        Time Logged
        {timeLogs.length > 0 && (
          <span className="ml-2 rounded-full bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-ink-muted/50">
            {timeLogs.length}
          </span>
        )}
      </h2>

      <div className="panel overflow-hidden">
        {/* Burn bar */}
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span
              className={`font-semibold tabular-nums ${isOver ? "text-neon-red text-glow-sm" : "text-ink"}`}
            >
              {totalLogged}h logged
            </span>
            <span className="text-ink-muted/60">{estimateHours}h estimated</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          {isOver && (
            <p className="mt-1.5 text-[11px] font-medium text-neon-red text-glow-sm">
              {(totalLogged - estimateHours).toFixed(1)}h over estimate
            </p>
          )}
        </div>

        {/* Log entries */}
        {timeLogs.length > 0 && (
          <ul className="divide-y divide-white/[0.06]">
            {timeLogs.map((tl) => (
              <li key={tl.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="mt-0.5 shrink-0">
                  <Avatar name={tl.author} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-ink">{tl.author}</span>
                    <span className="text-[11px] text-ink-muted/50">{formatDate(tl.date)}</span>
                    <span className="flex items-center gap-0.5 rounded-md bg-neon-cyan/10 px-1.5 py-0.5 text-[11px] font-semibold text-neon-cyan ring-1 ring-inset ring-neon-cyan/20">
                      <ClockIcon width={10} height={10} />
                      {tl.hours}h
                    </span>
                  </div>
                  {tl.note && (
                    <p className="mt-1 text-sm text-ink-muted">{tl.note}</p>
                  )}
                </div>
                <form action={deleteTimeLog.bind(null, tl.id, taskId, projectId)}>
                  <SubmitButton className="rounded p-1 text-ink-muted/25 transition-colors hover:text-neon-red/70 disabled:opacity-40">
                    <span className="sr-only">Delete entry</span>
                    <TrashIcon width={12} height={12} />
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}

        {/* Add time form */}
        <form
          ref={formRef}
          action={formAction}
          className="space-y-3 border-t border-white/[0.06] p-5"
        >
          <input type="hidden" name="taskId" value={taskId} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <FieldLabel htmlFor="tl-author">Author</FieldLabel>
              <SelectField
                key={`author-${resetKey}`}
                id="tl-author"
                name="author"
                defaultValue=""
                searchable
                options={[
                  { value: "", label: "Select author…" },
                  ...teamMembers.map((m) => ({ value: m, label: m })),
                ]}
              />
            </div>
            <div className="sm:col-span-5">
              <FieldLabel htmlFor="tl-date">Date</FieldLabel>
              <DateField
                key={`date-${resetKey}`}
                id="tl-date"
                name="date"
                defaultValue={todayLocal()}
              />
            </div>
            <div className="sm:col-span-3">
              <FieldLabel htmlFor="tl-hours">Hours</FieldLabel>
              <div className="relative">
                <input
                  id="tl-hours"
                  name="hours"
                  type="number"
                  min="0.25"
                  max="24"
                  step="0.25"
                  defaultValue="1"
                  required
                  className="field pr-8 [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                />
                <SpinButtons inputId="tl-hours" />
              </div>
            </div>
            <div className="sm:col-span-12">
              <FieldLabel htmlFor="tl-note">
                Note{" "}
                <span className="normal-case font-normal text-ink-muted/40">
                  (optional)
                </span>
              </FieldLabel>
              <input
                id="tl-note"
                name="note"
                type="text"
                maxLength={300}
                placeholder="What did you work on?"
                className="field"
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
                  Time logged.
                </span>
              )}
            </p>
            <SubmitButton pendingText="Saving…" className="btn-neon">
              Log time
            </SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}
