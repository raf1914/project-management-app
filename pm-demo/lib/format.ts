/**
 * @file Small formatting helpers shared across the UI.
 */

//* Format in UTC so a date-only value like "2026-06-10" (parsed as UTC midnight)
//* renders as its stored calendar day regardless of the server/client timezone.
const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

//* Format an ISO date/timestamp as e.g. "Jun 3, 2026". Returns "" for null/invalid.
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const parsedDate = new Date(iso);
  return Number.isNaN(parsedDate.getTime()) ? "" : dateFmt.format(parsedDate);
}

//* Today's LOCAL calendar date as "yyyy-mm-dd" — matches how dueDate is stored
//* (a calendar date picked by the user, not a UTC instant).
export function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

//* True when a due date is strictly before today's local calendar date.
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate < todayLocal();
}

//* Initials for an assignee name — e.g. "Dana" -> "DA", "Mary Jo" -> "MJ".
export function initials(name: string): string {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) return "?";
  if (nameParts.length === 1) return nameParts[0].slice(0, 2).toUpperCase();
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}
