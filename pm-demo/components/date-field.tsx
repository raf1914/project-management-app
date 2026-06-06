"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatDate, todayLocal } from "@/lib/format";
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "./icons";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const monthLabelFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function iso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Build the 42-cell (6-week) grid for a given month, Sunday-first. */
function buildGrid(year: number, month: number): Date[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - firstWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/**
 * Themed date picker. The native <input type="date"> calendar is browser chrome
 * that can't be styled, so we render our own calendar popover and submit the
 * value (yyyy-mm-dd) through a hidden input.
 *
 * The popover is portaled to document.body so it escapes any overflow:hidden
 * ancestor, and uses position:fixed so viewport coords from getBoundingClientRect
 * apply directly.
 */
export function DateField({
  name,
  defaultValue = "",
  id,
  "aria-label": ariaLabel,
}: {
  name: string;
  defaultValue?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Which month the grid is showing — seeded from the value, else today.
  const seed = value || todayLocal();
  const [seedY, seedM] = seed.split("-").map(Number);
  const [view, setView] = useState({ year: seedY, month: seedM - 1 });

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openCalendar() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPopoverPos({ top: rect.bottom + 6, left: rect.left });
    // Re-center the grid on the current value (or today) each time it opens.
    const [y, m] = (value || todayLocal()).split("-").map(Number);
    setView({ year: y, month: m - 1 });
    setOpen(true);
  }

  function pick(date: Date) {
    setValue(iso(date));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const today = todayLocal();
  const grid = buildGrid(view.year, view.month);
  const monthLabel = monthLabelFmt.format(new Date(view.year, view.month, 1));

  const popoverEl = (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Choose date"
      style={{ position: "fixed", top: popoverPos.top, left: popoverPos.left }}
      className="popover z-[9999] w-[17rem] p-3"
    >
      {/* Month nav */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-white/5 hover:text-neon-cyan"
          >
            <ArrowLeftIcon width={16} height={16} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-white/5 hover:text-neon-cyan"
          >
            <ArrowRightIcon width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((d) => {
          const dIso = iso(d);
          const inMonth = d.getMonth() === view.month;
          const isSelected = dIso === value;
          const isToday = dIso === today;
          return (
            <button
              key={dIso}
              type="button"
              onClick={() => pick(d)}
              aria-pressed={isSelected}
              className={`relative h-8 rounded-md text-sm tabular-nums transition-colors ${
                isSelected
                  ? "bg-neon-cyan/20 font-semibold text-neon-cyan ring-1 ring-inset ring-neon-cyan/50"
                  : inMonth
                    ? "text-ink hover:bg-white/5 hover:text-neon-cyan"
                    : "text-ink-muted/40 hover:bg-white/5"
              } ${
                isToday && !isSelected
                  ? "ring-1 ring-inset ring-white/15"
                  : ""
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setValue("");
            setOpen(false);
          }}
          className="font-medium text-ink-muted transition-colors hover:text-neon-red"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(today);
            setOpen(false);
          }}
          className="font-medium text-neon-cyan transition-colors hover:text-glow-sm"
        >
          Today
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openCalendar())}
        className={`field flex cursor-pointer items-center justify-between text-left ${
          open ? "ring-2 ring-neon-cyan/40" : ""
        }`}
      >
        <span className={value ? "text-ink" : "text-ink-muted/60"}>
          {value ? formatDate(value) : "Select date"}
        </span>
        <CalendarIcon
          width={16}
          height={16}
          className={`ml-2 shrink-0 transition-colors ${
            open ? "text-neon-cyan" : "text-ink-muted"
          }`}
        />
      </button>

      {open && createPortal(popoverEl, document.body)}
    </div>
  );
}
