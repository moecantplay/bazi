/**
 * SEEDKEY CONVENTION (frozen — do not change without invalidating every
 * reading anyone has seen):
 *   natal seedKey = `${date}|${time ?? "unknown"}|${tz}|${sex}`
 * This is the single copy of the convention inside this package — reading.ts,
 * guidance.ts, compare.ts, and date-finder.ts all import it from here rather
 * than each defining their own. apps/web/src/lib/reading.ts (the old app,
 * frozen) still carries its own copy; it's untouched deliberately and is
 * retired wholesale at cutover (Phase 12), not folded into this one.
 */

import type { StoredProfile } from "./types.js";

export function natalSeedKey(profile: StoredProfile): string {
  const { birth } = profile;
  return `${birth.date}|${birth.time ?? "unknown"}|${birth.city.tz}|${birth.sex}`;
}
