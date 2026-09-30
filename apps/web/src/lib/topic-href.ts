/**
 * Links between Today and its topic pages (M20-21). The date rides in the
 * query so Back from a topic page lands on the same day.
 */

export function topicHref(dateISO: string, topic: string): string {
  return `/today/topic/?date=${dateISO}&topic=${encodeURIComponent(topic)}`;
}

export function todayHref(dateISO: string): string {
  return `/today/?date=${dateISO}`;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** The `date` query value when it's a well-formed "YYYY-MM-DD", else null. */
export function dateFromQuery(search: string): string | null {
  const value = new URLSearchParams(search).get("date");
  return value !== null && DATE_PATTERN.test(value) ? value : null;
}
