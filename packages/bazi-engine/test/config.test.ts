import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  dailyPillar,
  dayPillar,
  hourPillar,
  monthPillar,
  yearPillar,
  type EngineConfig,
} from "../src/index.js";

function localInstant(zone: string, iso: string): Date {
  return DateTime.fromISO(iso, { zone }).toJSDate();
}

const TRUE_SOLAR: EngineConfig = { lateZiHour: "midnight", trueSolarTime: true };

describe("true solar time", () => {
  it("pushes a just-after-midnight birth into the previous day when far west of the meridian", () => {
    // Zone UTC (reference 0°), longitude −30° → −120 min of longitude correction.
    // A 00:30 birth becomes ~22:30 the previous evening in apparent solar time.
    const instant = localInstant("UTC", "2000-06-15T00:30");
    const civil = dayPillar(instant, "UTC");
    const solar = dayPillar(instant, "UTC", TRUE_SOLAR, -30);
    expect(`${solar.stem}${solar.branch}`).not.toBe(`${civil.stem}${civil.branch}`);
  });

  it("moves the hour branch when apparent solar time crosses a slot boundary", () => {
    const instant = localInstant("UTC", "2000-06-15T00:30");
    expect(hourPillar(instant, "UTC", "甲").branch).toBe("子");
    expect(hourPillar(instant, "UTC", "甲", TRUE_SOLAR, -30).branch).toBe("亥");
  });

  it("throws when true solar time is requested without a longitude", () => {
    const instant = localInstant("UTC", "2000-06-15T00:30");
    expect(() => dayPillar(instant, "UTC", TRUE_SOLAR)).toThrow(/longitude/);
    expect(() => hourPillar(instant, "UTC", "甲", TRUE_SOLAR)).toThrow(/longitude/);
  });
});

describe("input validation", () => {
  const instant = localInstant("UTC", "1994-06-15T12:00");

  it("rejects an invalid timezone", () => {
    expect(() => yearPillar(instant, "Not/AZone")).toThrow(/timezone/);
    expect(() => dayPillar(instant, "Mars/Olympus")).toThrow(/timezone/);
  });

  it("rejects a malformed date string in dailyPillar", () => {
    expect(() => dailyPillar("not-a-date", "UTC")).toThrow();
  });

  it("throws a RangeError for instants outside the solar-term table", () => {
    const tooEarly = new Date("1850-01-01T00:00:00Z");
    expect(() => yearPillar(tooEarly, "UTC")).toThrow(RangeError);
    expect(() => monthPillar(tooEarly, "UTC")).toThrow(RangeError);
  });
});
