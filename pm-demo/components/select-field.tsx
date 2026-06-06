"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "./icons";

export type SelectOption = { value: string; label: string };

/**
 * Themed replacement for a native <select>. The native option list is OS chrome
 * that can't be styled, so we render our own popover and mirror the value into a
 * hidden input so it still submits with the surrounding <form>.
 */
export function SelectField({
  name,
  options,
  defaultValue,
  id,
  "aria-label": ariaLabel,
}: {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const [value, setValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const current = options[selectedIndex];

  // Dismiss on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  function commit(i: number) {
    setValue(options[i].value);
    setOpen(false);
  }

  function onButtonKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActive(selectedIndex);
        setOpen(true);
        return;
      }
      setActive((a) =>
        e.key === "ArrowDown"
          ? Math.min(options.length - 1, a + 1)
          : Math.max(0, a - 1),
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) commit(active);
      else {
        setActive(selectedIndex);
        setOpen(true);
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setActive(selectedIndex);
          setOpen((o) => !o);
        }}
        onKeyDown={onButtonKey}
        className={`field flex cursor-pointer items-center justify-between text-left ${
          open ? "ring-2 ring-neon-cyan/40" : ""
        }`}
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`ml-2 shrink-0 text-ink-muted transition-transform ${
            open ? "rotate-180 text-neon-cyan" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="popover absolute left-0 right-0 top-full z-[60] mt-1.5 max-h-60 overflow-auto p-1"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => commit(i)}
                className={`flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-neon-cyan/10 text-neon-cyan"
                    : isSelected
                      ? "text-neon-cyan"
                      : "text-ink"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {isSelected && (
                  <CheckIcon width={14} height={14} className="ml-2 shrink-0" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
