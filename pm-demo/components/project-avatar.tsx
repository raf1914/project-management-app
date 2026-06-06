import { PROJECT_COLOR_META } from "@/lib/ui";
import type { ProjectColor } from "@/lib/types";

const R = 15;
const C = 2 * Math.PI * R; // circumference ≈ 94.25

export function ProjectAvatar({
  name,
  color,
  progress,
  overdueCount = 0,
  size = "md",
}: {
  name: string;
  color: ProjectColor;
  progress: number;
  overdueCount?: number;
  size?: "sm" | "md" | "lg";
}) {
  const meta = PROJECT_COLOR_META[color];
  const arc = (progress / 100) * C;
  const initials = name.slice(0, 2).toUpperCase();

  const sizeClass =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const roundedClass =
    size === "sm" ? "rounded-md" : size === "lg" ? "rounded-xl" : "rounded-lg";
  const textClass =
    size === "sm" ? "text-[9px]" : size === "lg" ? "text-xs" : "text-[10px]";

  return (
    <span
      className={`relative shrink-0 ${sizeClass} ${roundedClass} ${meta.bg} ring-1 ring-inset ring-white/10`}
      aria-hidden
    >
      {/* Progress ring */}
      <svg
        viewBox="0 0 36 36"
        className={`h-full w-full -rotate-90 ${meta.text}`}
      >
        {/* Track */}
        <circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          strokeWidth="3"
          stroke="rgba(255,255,255,0.12)"
        />
        {/* Arc — only render when there's measurable progress */}
        {arc > 0 && (
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${C}`}
          />
        )}
      </svg>

      {/* Initials centered over the ring */}
      <span
        className={`absolute inset-0 flex items-center justify-center font-bold text-glow-sm ${meta.text} ${textClass}`}
      >
        {initials}
      </span>

      {/* Overdue badge */}
      {overdueCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-neon-red px-0.5 text-[8px] font-bold leading-none text-white shadow-[0_0_6px_rgba(255,77,109,0.8)] ring-[1.5px] ring-[#0c0420]">
          {overdueCount > 9 ? "9+" : overdueCount}
        </span>
      )}
    </span>
  );
}
