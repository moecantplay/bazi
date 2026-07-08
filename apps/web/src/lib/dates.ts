/**
 * Calendar-date helpers for the Today date strip. All arithmetic is done in UTC
 * on the YYYY-MM-DD label so day counts never drift across daylight-saving
 * boundaries; the label is a civil date, not an instant.
 */

function labelToUtc(iso: string): number {
  const [year = 1970, month = 1, day = 1] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function utcToLabel(ms: number): string {
  const date = new Date(ms);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's civil date on the device, as YYYY-MM-DD. */
export function todayLabel(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The label `days` away from `iso` (may be negative). */
export function addDays(iso: string, days: number): string {
  return utcToLabel(labelToUtc(iso) + days * 86_400_000);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: string, to: string): number {
  return Math.round((labelToUtc(to) - labelToUtc(from)) / 86_400_000);
}

/**
 * A human date like "Tue, 7 Jul 2026", formatted in UTC to match the label.
 * The locale is the device's own so day/month order matches what the user
 * expects everywhere else on their phone.
 */
export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${iso}T00:00:00Z`));
}
