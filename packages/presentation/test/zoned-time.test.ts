import { describe, expect, it } from "vitest";
import { zonedTimeToUtc } from "../src/zoned-time.js";

describe("zonedTimeToUtc", () => {
  it("converts a wall time in a fixed-offset zone (Asia/Jakarta, UTC+7)", () => {
    const instant = zonedTimeToUtc("1994-12-08", "16:30", "Asia/Jakarta");
    expect(instant.toISOString()).toBe("1994-12-08T09:30:00.000Z");
  });

  it("accounts for daylight saving in a DST-observing zone", () => {
    // 2026-07-15 12:00 America/New_York is EDT (UTC-4).
    const summer = zonedTimeToUtc("2026-07-15", "12:00", "America/New_York");
    expect(summer.toISOString()).toBe("2026-07-15T16:00:00.000Z");

    // 2026-01-15 12:00 America/New_York is EST (UTC-5).
    const winter = zonedTimeToUtc("2026-01-15", "12:00", "America/New_York");
    expect(winter.toISOString()).toBe("2026-01-15T17:00:00.000Z");
  });

  it("resolves a nonexistent spring-forward local time to the post-transition offset", () => {
    // 2026-03-08 is America/New_York's spring-forward day: 02:00-03:00 doesn't exist.
    const instant = zonedTimeToUtc("2026-03-08", "02:30", "America/New_York");
    expect(instant.toISOString()).toBe("2026-03-08T06:30:00.000Z");
  });

  it("is deterministic across repeated calls", () => {
    const a = zonedTimeToUtc("2026-07-07", "09:00", "Asia/Jakarta");
    const b = zonedTimeToUtc("2026-07-07", "09:00", "Asia/Jakarta");
    expect(a.getTime()).toBe(b.getTime());
  });
});
