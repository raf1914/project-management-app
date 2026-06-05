/** Small formatting helpers shared across the UI. */

// Format in UTC so a date-only value like "2026-06-10" (parsed as UTC midnight)
// renders as its stored calendar day regardless of the server/client timezone.
const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Format an ISO date/timestamp as e.g. "Jun 3, 2026". Returns "" for null. */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFmt.format(d);
}

/** Today's LOCAL calendar date as "yyyy-mm-dd" — matches how dueDate is stored
 * (a calendar date picked via <input type="date">, not an instant). */
export function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** True when a due date is strictly before today's local calendar date. */
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate < todayLocal();
}

/** Initials for an assignee name, e.g. "Dana" -> "DA", "Mary Jo" -> "MJ". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
