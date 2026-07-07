import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  annualPillar,
  dailyPillar,
  hourPillar,
  monthPillar,
  yearPillar,
  type Pillar,
} from "../src/index.js";

function utcInstant(iso: string): Date {
  return DateTime.fromISO(iso, { zone: "utc" }).toJSDate();
}

function render(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

describe("month-branch boundaries at a jié", () => {
  const zone = "Asia/Shanghai";

  it("switches from 丑 to 寅 across 立春 1994 (2024-02-04 01:30 UTC)", () => {
    // 立春 1994 is 1994-02-04T01:30Z; the 丑 month (小寒) precedes it.
    expect(monthPillar(utcInstant("1994-02-03T00:00:00Z"), zone).branch).toBe("丑");
    expect(monthPillar(utcInstant("1994-02-06T00:00:00Z"), zone).branch).toBe("寅");
  });

  it("opens the 子 month at 大雪 1994", () => {
    expect(monthPillar(utcInstant("1994-12-10T00:00:00Z"), zone).branch).toBe("子");
  });
});

describe("Five Tigers month stem", () => {
  it("gives 丙寅 for the 寅 month of a 甲 year (1994)", () => {
    // Just after 立春 1994: year 甲戌 (stem 甲), 寅 month → tiger 甲→丙.
    const instant = utcInstant("1994-02-06T00:00:00Z");
    expect(render(yearPillar(instant, "Asia/Shanghai"))).toBe("甲戌");
    expect(render(monthPillar(instant, "Asia/Shanghai"))).toBe("丙寅");
  });
});

describe("Five Rats hour stem", () => {
  const zone = "UTC";
  const midnight = utcInstant("2000-01-01T00:30:00Z"); // 子 hour

  it("gives 甲子 for a 甲 day at the 子 hour", () => {
    expect(render(hourPillar(midnight, zone, "甲"))).toBe("甲子");
  });

  it("gives 丙子 for a 乙 day at the 子 hour", () => {
    expect(render(hourPillar(midnight, zone, "乙"))).toBe("丙子");
  });

  it("assigns branches across the 12 two-hour slots", () => {
    const slots: Array<[string, string]> = [
      ["2000-01-01T23:30:00Z", "子"],
      ["2000-01-01T01:30:00Z", "丑"],
      ["2000-01-01T03:30:00Z", "寅"],
      ["2000-01-01T15:30:00Z", "申"],
      ["2000-01-01T21:30:00Z", "亥"],
    ];
    for (const [iso, branch] of slots) {
      expect(hourPillar(utcInstant(iso), zone, "甲").branch).toBe(branch);
    }
  });
});

describe("annualPillar and dailyPillar", () => {
  it("annualPillar(1984) is 甲子", () => {
    expect(render(annualPillar(1984))).toBe("甲子");
  });

  it("dailyPillar anchors 1949-10-01 to 甲子", () => {
    expect(render(dailyPillar("1949-10-01", "UTC"))).toBe("甲子");
  });

  it("dailyPillar matches the day pillar of Fixture A", () => {
    expect(render(dailyPillar("1994-12-08", "Asia/Jakarta"))).toBe("戊辰");
  });
});
