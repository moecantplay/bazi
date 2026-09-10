/**
 * The IANA zone the device's clock runs in — the zone a day is *read* in
 * (see presentation's readingZoneOf). Falls back to the given zone when the
 * runtime can't say (very old engines return undefined or "Etc/Unknown").
 */

export function deviceZone(fallback: string): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (typeof zone === "string" && zone.length > 0 && zone !== "Etc/Unknown") {
      return zone;
    }
  } catch {
    // Intl unavailable or misconfigured: read in the fallback zone.
  }
  return fallback;
}
