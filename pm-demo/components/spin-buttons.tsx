"use client";

import { ChevronDownIcon } from "./icons";

export function SpinButtons({ inputId }: { inputId: string }) {
  function step(dir: "up" | "down") {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;
    if (dir === "up") input.stepUp();
    else input.stepDown();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <div className="absolute inset-y-0 right-0 flex w-7 flex-col rounded-r-lg border-l border-white/20 overflow-hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Increment"
        onClick={() => step("up")}
        className="flex flex-1 items-center justify-center text-ink-muted/70 transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan active:bg-neon-cyan/20"
      >
        <ChevronDownIcon width={10} height={10} className="rotate-180" />
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Decrement"
        onClick={() => step("down")}
        className="flex flex-1 items-center justify-center border-t border-white/20 text-ink-muted/70 transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan active:bg-neon-cyan/20"
      >
        <ChevronDownIcon width={10} height={10} />
      </button>
    </div>
  );
}
