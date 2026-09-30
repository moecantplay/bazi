/**
 * Shared test fixtures. Fixture A mirrors apps/web/e2e/helpers.ts's fixture of
 * the same name (1994-12-08 16:30 Asia/Jakarta, male; pillars 甲戌 丙子 戊辰
 * 庚申) so this package's golden-pillar test stays consistent with the E2E
 * suite's own golden fixture.
 */

import type { StoredCity, StoredProfile } from "../src/types.js";

export const JAKARTA: StoredCity = {
  name: "Jakarta",
  country: "Indonesia",
  lat: -6.2146,
  lng: 106.8451,
  tz: "Asia/Jakarta"
};

export const FIXTURE_A: StoredProfile = {
  birth: { date: "1994-12-08", time: "16:30", city: JAKARTA, sex: "male" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

export const FIXTURE_UNKNOWN_TIME: StoredProfile = {
  birth: { date: "1994-12-08", time: null, city: JAKARTA, sex: "female" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

/** Golden Fixture B's birth date (the 立春 boundary day, before it), noon. */
export const FIXTURE_B: StoredProfile = {
  birth: { date: "1994-02-03", time: "12:00", city: JAKARTA, sex: "female" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

/** Golden Fixture C's day anchor (甲子), noon. */
export const FIXTURE_C: StoredProfile = {
  birth: { date: "1949-10-01", time: "12:00", city: JAKARTA, sex: "male" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

/** Golden Fixture D's late zi hour (23:30). */
export const FIXTURE_D: StoredProfile = {
  birth: { date: "2000-06-15", time: "23:30", city: JAKARTA, sex: "female" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

/** Every fixture the 90-day reading checks run over. */
export const READING_FIXTURES: readonly [string, StoredProfile][] = [
  ["A", FIXTURE_A],
  ["unknown time", FIXTURE_UNKNOWN_TIME],
  ["B", FIXTURE_B],
  ["C", FIXTURE_C],
  ["D", FIXTURE_D]
];
