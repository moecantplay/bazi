/**
 * Convert a wall-clock date and time in a named IANA zone to the absolute UTC
 * instant it refers to.
 *
 * The engine takes an absolute `Date` plus the zone, so the web layer must turn
 * "1994-12-08 16:30 in Asia/Jakarta" into the correct instant. We can't add
 * luxon here, so we use the standard two-pass Intl technique: guess the instant
 * as if the wall time were UTC, measure the zone's offset at that guess, correct
 * for it, then re-measure once more to settle daylight-saving transitions.
 *
 * Nonexistent local times (inside a spring-forward gap) resolve deterministically
 * to the post-transition offset, e.g. 02:30 America/New_York on a gap day → 06:30Z.
 */

/**
 * The offset of `zone` at the given absolute instant, in milliseconds
 * (positive east of UTC). Computed by formatting the instant in the zone and
 * comparing the resulting wall clock against the same fields read as UTC.
 */
function zoneOffsetMs(instant: Date, zone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const fields = new Map<string, number>();
  for (const part of formatter.formatToParts(instant)) {
    if (part.type !== "literal") {
      fields.set(part.type, Number(part.value));
    }
  }

  const field = (name: string): number => fields.get(name) ?? 0;

  // Intl with hour12:false can report midnight as hour 24; normalize it.
  const rawHour = field("hour");
  const hour = rawHour === 24 ? 0 : rawHour;
  const wallAsUtc = Date.UTC(
    field("year"),
    field("month") - 1,
    field("day"),
    hour,
    field("minute"),
    field("second")
  );

  return wallAsUtc - instant.getTime();
}

/**
 * Turn a `YYYY-MM-DD` date and `HH:mm` time interpreted in `zone` into the
 * absolute UTC instant they denote. Deterministic across environments.
 */
export function zonedTimeToUtc(
  dateString: string,
  timeString: string,
  zone: string
): Date {
  const [year = 0, month = 1, day = 1] = dateString.split("-").map(Number);
  const [hour = 0, minute = 0] = timeString.split(":").map(Number);

  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const firstOffset = zoneOffsetMs(new Date(wallAsUtc), zone);
  const firstGuess = wallAsUtc - firstOffset;

  // A single correction settles all but daylight-saving boundaries; a second
  // pass at the corrected instant resolves those.
  const secondOffset = zoneOffsetMs(new Date(firstGuess), zone);
  if (secondOffset === firstOffset) {
    return new Date(firstGuess);
  }
  return new Date(wallAsUtc - secondOffset);
}
