import { describe, expect, it } from "vitest";
import {
  SOLAR_TERMS,
  dayPillar,
  hourPillar,
  monthPillar,
  pillarToSexagenaryIndex,
  yearPillar,
  type EngineConfig,
} from "../src/index.js";

function render(pillar: { stem: string; branch: string }): string {
  return `${pillar.stem}${pillar.branch}`;
}

function utcNoon(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

const MIDNIGHT: EngineConfig = { lateZiHour: "midnight", trueSolarTime: false };
const SHIFT_DAY: EngineConfig = { lateZiHour: "shift-day", trueSolarTime: false };

describe("jié boundary — ±2 minutes around 立春 2000", () => {
  const liChun2000 = SOLAR_TERMS.find((t) => t.name === "立春" && t.iso.startsWith("2000"));
  const epoch = Date.parse(liChun2000!.iso);
  const before = new Date(epoch - 2 * 60_000);
  const after = new Date(epoch + 2 * 60_000);
  const zone = "Asia/Shanghai";

  it("flips the year pillar 己卯 → 庚辰 exactly at 立春", () => {
    expect(render(yearPillar(before, zone))).toBe("己卯"); // solar year 1999
    expect(render(yearPillar(after, zone))).toBe("庚辰"); // solar year 2000
  });

  it("flips the month branch 丑 → 寅 exactly at 立春", () => {
    expect(monthPillar(before, zone).branch).toBe("丑"); // 小寒 still governs
    expect(monthPillar(after, zone).branch).toBe("寅"); // 立春 opens 寅
  });
});

describe("leap day — 2000-02-29 keeps the day cycle continuous", () => {
  it("increments the sexagenary index by one across the leap day", () => {
    const feb28 = pillarToSexagenaryIndex(dayPillar(utcNoon("2000-02-28"), "UTC"));
    const feb29 = pillarToSexagenaryIndex(dayPillar(utcNoon("2000-02-29"), "UTC"));
    const mar01 = pillarToSexagenaryIndex(dayPillar(utcNoon("2000-03-01"), "UTC"));
    expect((feb28 + 1) % 60).toBe(feb29);
    expect((feb29 + 1) % 60).toBe(mar01);
  });
});

describe("hour boundaries", () => {
  const zone = "UTC";

  it("puts exactly 23:00 in 子 and exactly 01:00 in 丑", () => {
    expect(hourPillar(new Date("2001-05-10T23:00:00Z"), zone, "甲").branch).toBe("子");
    expect(hourPillar(new Date("2001-05-10T01:00:00Z"), zone, "甲").branch).toBe("丑");
  });

  it("keeps 11:59 and 12:00 both in the 午 hour", () => {
    expect(hourPillar(new Date("2001-05-10T11:59:00Z"), zone, "甲").branch).toBe("午");
    expect(hourPillar(new Date("2001-05-10T12:00:00Z"), zone, "甲").branch).toBe("午");
  });

  it("shifts the day pillar for a 23:00 birth only under shift-day", () => {
    const instant = new Date("2001-05-10T23:00:00Z");
    const midnight = pillarToSexagenaryIndex(dayPillar(instant, zone, MIDNIGHT));
    const shifted = pillarToSexagenaryIndex(dayPillar(instant, zone, SHIFT_DAY));
    expect((midnight + 1) % 60).toBe(shifted);
  });
});
