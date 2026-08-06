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
