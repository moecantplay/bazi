import { describe, expect, it } from "vitest";
import { dailyBundleFor, dayTone, readingZoneOf, type StoredProfile } from "../src/index.js";

/** Fixture A, born in Jakarta. */
const PROFILE: StoredProfile = {
  birth: {
    date: "1994-12-08",
    time: "16:30",
    sex: "male",
    city: { name: "Jakarta", country: "ID", lat: -6.2, lng: 106.8, tz: "Asia/Jakarta" }
  },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-07-07T00:00:00.000Z"
};

describe("readingZoneOf", () => {
  it("falls back to the birth zone when no reading zone is attached", () => {
    expect(readingZoneOf(PROFILE)).toBe("Asia/Jakarta");
  });

  it("prefers the attached reading zone", () => {
    expect(readingZoneOf({ ...PROFILE, readingZone: "Europe/London" })).toBe("Europe/London");
  });

  it("leaves the natal chart and the seed untouched — only the day's transit moves", () => {
    const home = dailyBundleFor(PROFILE, "2026-06-21");
    const away = dailyBundleFor({ ...PROFILE, readingZone: "Pacific/Kiritimati" }, "2026-06-21");
    // The pillar is keyed at local noon, so the same calendar day is the same
    // sexagenary day in every zone; the reading, seeded on birth data + date
    // only, is identical too. Only the officer can move, on jié boundary days.
    expect(away.dayPillar).toEqual(home.dayPillar);
    expect(away.reading).toEqual(home.reading);
    expect(dayTone({ ...PROFILE, readingZone: "America/Los_Angeles" }, "2026-06-21")).toBe(
      dayTone(PROFILE, "2026-06-21")
    );
  });
});
