"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon, CheckIcon } from "./icons";

export type SelectOption = { value: string; label: string };

/**
 * Themed replacement for a native <select>. Portals its dropdown to document.body
 * so it escapes any overflow:hidden ancestor. Pass searchable for a filter input.
 */
export function SelectField({
  name,
  options,
  defaultValue,
  id,
  "aria-label": ariaLabel,
  searchable = false,
}: {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  id?: string;
  "aria-label"?: string;
  searchable?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, minWidth: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Selected item pinned at top; rest follow (no duplicates).
  const pinned = options.find((o) => o.value === value);
  const rest = options.filter((o) => o.value !== value);
  const ordered = pinned ? [pinned, ...rest] : rest;
  const filtered = query
    ? ordered.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : ordered;

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const current = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openDropdown() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect)
      setPos({ top: rect.bottom + 4, left: rect.left, minWidth: rect.width });
    setQuery("");
    setActive(selectedIndex);
    setOpen(true);
  }

  function commit(val: string) {
    setValue(val);
    setOpen(false);
    setQuery("");
  }

  function onButtonKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { openDropdown(); return; }
      setActive((a) =>
        e.key === "ArrowDown"
          ? Math.min(filtered.length - 1, a + 1)
          : Math.max(0, a - 1),
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) { if (filtered[active]) commit(filtered[active].value); }
      else openDropdown();
    }
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) commit(filtered[active].value);
    }
  }

  const dropdown = (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        minWidth: pos.minWidth,
      }}
      className="popover z-[9999] overflow-hidden p-1"
    >
      {searchable && (
        <div className="px-1 pb-1">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onSearchKey}
            placeholder="Search…"
            className="field w-full text-sm"
          />
        </div>
      )}
      <ul id={listId} role="listbox" className="max-h-52 overflow-auto">
        {filtered.length === 0 ? (
          <li className="px-2.5 py-2 text-sm text-ink-muted/60">
            No results
          </li>
        ) : (
          filtered.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => commit(o.value)}
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
          })
        )}
      </ul>
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
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openDropdown())}
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

      {open && createPortal(dropdown, document.body)}
    </div>
  );
}
