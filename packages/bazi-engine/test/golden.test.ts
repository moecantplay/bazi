import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  annualPillar,
  dayPillar,
  hourPillar,
  monthPillar,
  yearPillar,
  type EngineConfig,
  type Pillar,
} from "../src/index.js";

/** Build a UTC instant from a local civil time in a given zone. */
function localInstant(
  zone: string,
  year: number,
  month: number,
  day: number,
  hour = 12,
  minute = 0,
): Date {
  return DateTime.fromObject({ year, month, day, hour, minute }, { zone }).toJSDate();
}

/** Render a pillar as its two Chinese characters for readable assertions. */
function render(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

const MIDNIGHT: EngineConfig = { lateZiHour: "midnight", trueSolarTime: false };
const SHIFT_DAY: EngineConfig = { lateZiHour: "shift-day", trueSolarTime: false };

describe("Fixture A — 1994-12-08 16:30 Asia/Jakarta", () => {
  const zone = "Asia/Jakarta";
  const instant = localInstant(zone, 1994, 12, 8, 16, 30);

  it("year pillar is 甲戌", () => {
    expect(render(yearPillar(instant, zone))).toBe("甲戌");
  });

  it("month pillar is 丙子", () => {
    expect(render(monthPillar(instant, zone))).toBe("丙子");
  });

  it("day pillar is 戊辰", () => {
    expect(render(dayPillar(instant, zone, MIDNIGHT))).toBe("戊辰");
  });

  it("hour pillar is 庚申", () => {
    const dayStem = dayPillar(instant, zone, MIDNIGHT).stem;
    expect(render(hourPillar(instant, zone, dayStem, MIDNIGHT))).toBe("庚申");
  });

  it("annualPillar(2026) is 丙午", () => {
    expect(render(annualPillar(2026))).toBe("丙午");
  });
});

describe("Fixture B — 立春 year boundary in Asia/Jakarta", () => {
  const zone = "Asia/Jakarta";

  it("1994-02-03 (before 立春) is 癸酉", () => {
    expect(render(yearPillar(localInstant(zone, 1994, 2, 3), zone))).toBe("癸酉");
  });

  it("1994-02-05 (after 立春) is 甲戌", () => {
    expect(render(yearPillar(localInstant(zone, 1994, 2, 5), zone))).toBe("甲戌");
  });
});

describe("Fixture C — day anchor", () => {
  it("1949-10-01 noon is 甲子 in any zone", () => {
    for (const zone of ["Asia/Jakarta", "America/New_York", "UTC", "Pacific/Auckland"]) {
      expect(render(dayPillar(localInstant(zone, 1949, 10, 1), zone))).toBe("甲子");
    }
  });
});

describe("Fixture D — late zi hour (23:30 local)", () => {
  const zone = "Asia/Jakarta";
  const instant = localInstant(zone, 2000, 6, 15, 23, 30);

  it("hour branch is 子 under both configs", () => {
    const midnightStem = dayPillar(instant, zone, MIDNIGHT).stem;
    const shiftStem = dayPillar(instant, zone, SHIFT_DAY).stem;
    expect(hourPillar(instant, zone, midnightStem, MIDNIGHT).branch).toBe("子");
    expect(hourPillar(instant, zone, shiftStem, SHIFT_DAY).branch).toBe("子");
  });

  it("day pillar shifts by exactly one day between configs", () => {
    const midnightDay = dayPillar(instant, zone, MIDNIGHT);
    const shiftDay = dayPillar(instant, zone, SHIFT_DAY);
    expect(render(midnightDay)).not.toBe(render(shiftDay));
    // A one-day advance moves both stem (+1 mod 10) and branch (+1 mod 12).
    const nextStem = "甲乙丙丁戊己庚辛壬癸".indexOf(shiftDay.stem);
    const prevStem = "甲乙丙丁戊己庚辛壬癸".indexOf(midnightDay.stem);
    expect((prevStem + 1) % 10).toBe(nextStem);
  });
});
