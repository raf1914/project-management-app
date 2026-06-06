"use client";

/**
 * @file Interactive learning-path checklist — the single Client Component island
 * on the /learn route. Renders each phase as a collapsible card, tracks which
 * phases are complete in localStorage, and shows overall progress. The phase
 * content is passed in from the (server-rendered) page, so this island only owns
 * the interactivity — a live example of the server/client split Phase 4 teaches.
 */

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ProgressBar } from "./ui";
import { CheckIcon, ChevronDownIcon } from "./icons";

//* A pointer into this repo to study during a phase. `href` is set only when the
//* file also backs a live route, so the card can offer an "open live" link.
export type LearnReading = { path: string; href?: string; note: string };
export type LearnResource = { label: string; href: string };

export type LearnPhase = {
  id: string;
  index: number;
  tag: string;
  title: string;
  duration: string;
  goal: string;
  learn: string[];
  read: LearnReading[];
  build: string;
  resources: LearnResource[];
  capstone?: boolean;
};

const STORAGE_KEY = "pm-learn-progress";

//* Same-tab subscribers. The native "storage" event only fires in OTHER tabs, so
//* we notify our own listeners explicitly whenever we write.
const storeListeners = new Set<() => void>();

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

/**
 * A Set<string> persisted to localStorage, exposed as a React value. Built on
 * useSyncExternalStore so it is SSR-safe (server renders the empty snapshot, so
 * there is no hydration mismatch) and stays in sync across tabs — all without
 * calling setState inside an effect.
 */
function usePersistentSet(): {
  has: (id: string) => boolean;
  size: number;
  toggle: (id: string) => void;
  clear: () => void;
} {
  const subscribe = useCallback((onChange: () => void) => {
    storeListeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
      storeListeners.delete(onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  //* getSnapshot returns the raw JSON string; equal content compares equal, so
  //* React won't loop. The server snapshot is a constant empty list.
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");

  const ids = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(raw) as string[]);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const write = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      //* Private mode / storage disabled — interactivity still works in-session.
    }
    storeListeners.forEach((notify) => notify());
  }, []);

  //* Read fresh from storage at write time so rapid toggles can't race a stale set.
  const toggle = useCallback(
    (id: string) => {
      const next = new Set<string>(JSON.parse(readRaw()) as string[]);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
    },
    [write],
  );

  const clear = useCallback(() => write(new Set()), [write]);

  return { has: (id) => ids.has(id), size: ids.size, toggle, clear };
}

//* Rotating accent per phase number — full literal class strings so Tailwind's
//* compiler can see them (it can't resolve dynamically-built class names).
const ACCENTS = [
  "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10",
  "border-neon-purple/50 text-neon-purple bg-neon-purple/10",
  "border-neon-green/50 text-neon-green bg-neon-green/10",
  "border-neon-orange/50 text-neon-orange bg-neon-orange/10",
  "border-neon-blue/50 text-neon-blue bg-neon-blue/10",
  "border-neon-pink/50 text-neon-pink bg-neon-pink/10",
];
const CAPSTONE_ACCENT = "border-neon-yellow/60 text-neon-yellow bg-neon-yellow/10";

export function LearningPath({ phases }: { phases: LearnPhase[] }) {
  const done = usePersistentSet();
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  function toggleCollapsed(id: string) {
    setCollapsed(function (prev) {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allCollapsed = collapsed.size === phases.length;
  function toggleAll() {
    setCollapsed(allCollapsed ? new Set() : new Set(phases.map((p) => p.id)));
  }

  const completedCount = phases.filter((p) => done.has(p.id)).length;
  const percent = Math.round((completedCount / phases.length) * 100);

  return (
    <div className="space-y-4">
      {/* ===== Progress summary ===== */}
      <section className="panel p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Your Progress
            </h2>
            <p className="mt-1 font-display text-3xl font-bold leading-none holo-text">
              {completedCount}
              <span className="text-ink-muted">/{phases.length}</span>
              <span className="ml-2 text-lg text-ink-muted">phases</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleAll} className="btn-ghost">
              {allCollapsed ? "Expand all" : "Collapse all"}
            </button>
            {completedCount > 0 && (
              <button type="button" onClick={done.clear} className="btn-ghost">
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={percent} barClass="bg-neon-green text-neon-green" />
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          {percent === 100
            ? "🎉 Every phase complete — go ship something."
            : `${percent}% complete · progress is saved in this browser.`}
        </p>
      </section>

      {/* ===== Phase cards ===== */}
      <ol className="space-y-4">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isDone={done.has(phase.id)}
            isOpen={!collapsed.has(phase.id)}
            onToggleDone={() => done.toggle(phase.id)}
            onToggleOpen={() => toggleCollapsed(phase.id)}
          />
        ))}
      </ol>
    </div>
  );
}

function PhaseCard({
  phase,
  isDone,
  isOpen,
  onToggleDone,
  onToggleOpen,
}: {
  phase: LearnPhase;
  isDone: boolean;
  isOpen: boolean;
  onToggleDone: () => void;
  onToggleOpen: () => void;
}) {
  const accent = phase.capstone
    ? CAPSTONE_ACCENT
    : ACCENTS[(phase.index - 1) % ACCENTS.length];

  return (
    <li
      className={`panel overflow-hidden p-0 ${
        phase.capstone ? "ring-1 ring-neon-yellow/30" : ""
      }`}
    >
      {/* Header row: complete toggle · title (expands) · chevron */}
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={isDone}
          aria-label={`Mark "${phase.title}" complete`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold transition ${
            isDone
              ? "border-neon-green/60 bg-neon-green/15 text-neon-green glow-green"
              : accent
          }`}
        >
          {isDone ? <CheckIcon width={18} height={18} /> : phase.index}
        </button>

        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ring-1 ring-inset ${accent}`}
              >
                {phase.tag}
              </span>
              {phase.capstone && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-yellow text-glow-sm">
                  Final
                </span>
              )}
              <span className="text-[11px] text-ink-muted">{phase.duration}</span>
            </div>
            <h3
              className={`mt-0.5 font-display text-base font-bold uppercase tracking-wide ${
                isDone ? "text-ink-muted line-through" : "text-ink"
              }`}
            >
              {phase.title}
            </h3>
          </div>
          <ChevronDownIcon
            width={18}
            height={18}
            className={`shrink-0 text-ink-muted transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="space-y-4 border-t border-white/5 px-4 py-4 sm:px-5">
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">Goal — </span>
            {phase.goal}
          </p>

          <Section label="Learn">
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {phase.learn.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section label="In this codebase">
            <ul className="space-y-1.5">
              {phase.read.map((r) => (
                <li key={r.path} className="text-sm">
                  <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[12px] text-neon-cyan ring-1 ring-inset ring-neon-cyan/20">
                    {r.path}
                  </code>
                  <span className="text-ink-muted"> — {r.note}</span>
                  {r.href && (
                    <Link
                      href={r.href}
                      className="ml-1.5 whitespace-nowrap text-[12px] font-medium text-neon-cyan hover:text-glow-sm"
                    >
                      open live →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section label="Build it">
            <p className="rounded-lg border border-neon-purple/25 bg-neon-purple/[0.07] px-3 py-2.5 text-sm text-ink">
              {phase.build}
            </p>
          </Section>

          {phase.resources.length > 0 && (
            <Section label="Docs">
              <div className="flex flex-wrap gap-2">
                {phase.resources.map((res) => (
                  <a
                    key={res.href}
                    href={res.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                  >
                    {res.label} ↗
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </li>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </p>
      {children}
    </div>
  );
}
