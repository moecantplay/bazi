import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { interactions, natalPalacedBranches } from "../src/interactions.js";
import { luckPillars } from "../src/luck-pillars.js";
import type { Interaction, PalacedBranch } from "../src/types.js";

function render(pillar: { stem: string; branch: string }): string {
  return `${pillar.stem}${pillar.branch}`;
}

function ofType(list: Interaction[], type: Interaction["type"]): Interaction[] {
  return list.filter((entry) => entry.type === type);
}

describe("interactions", () => {
  it("detects a six-clash and reports both palaces", () => {
    const entries: PalacedBranch[] = [
      { branch: "子", palace: "month" },
      { branch: "午", palace: "annual" },
    ];
    const clashes = ofType(interactions(entries), "six-clash");
    expect(clashes).toHaveLength(1);
    expect(clashes[0]!.branches).toEqual(["子", "午"]);
    expect([...clashes[0]!.palaces].sort()).toEqual(["annual", "month"]);
  });

  it("detects a full water trine 申子辰 across month/day/hour (Fixture A)", () => {
    // Fixture A branches: 戌(year) 子(month) 辰(day) 申(hour).
    const entries = natalPalacedBranches({ year: "戌", month: "子", day: "辰", hour: "申" });
    const trines = ofType(interactions(entries), "trine");
    const full = trines.find((t) => t.type === "trine" && t.completeness === "full");
    expect(full).toBeDefined();
    if (full && full.type === "trine") {
      expect(full.element).toBe("water");
      expect(full.branches).toEqual(["申", "子", "辰"]);
      expect([...full.palaces].sort()).toEqual(["day", "hour", "month"]);
    }
  });

  it("detects a half trine when only two of three are present", () => {
    const entries: PalacedBranch[] = [
      { branch: "申", palace: "year" },
      { branch: "子", palace: "day" },
    ];
    const trines = ofType(interactions(entries), "trine");
    expect(trines).toHaveLength(1);
    expect(trines[0]!.type === "trine" && trines[0]!.completeness).toBe("half");
  });

  it("detects a self-punishment only when the branch repeats", () => {
    const single: PalacedBranch[] = [{ branch: "辰", palace: "day" }];
    expect(ofType(interactions(single), "punishment")).toHaveLength(0);
    const doubled: PalacedBranch[] = [
      { branch: "辰", palace: "day" },
      { branch: "辰", palace: "hour" },
    ];
    expect(ofType(interactions(doubled), "punishment")).toHaveLength(1);
  });

  it("detects the 寅巳申 mutual punishment only when all three present", () => {
    const two: PalacedBranch[] = [
      { branch: "寅", palace: "year" },
      { branch: "巳", palace: "day" },
    ];
    expect(ofType(interactions(two), "punishment")).toHaveLength(0);
    const three: PalacedBranch[] = [
      ...two,
      { branch: "申", palace: "hour" },
    ];
    expect(ofType(interactions(three), "punishment")).toHaveLength(1);
  });
});

describe("luck pillars — Fixture A (male, forward)", () => {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();

  const pillars = luckPillars({
    instant,
    zone: "Asia/Jakarta",
    yearStem: "甲", // yang → male → forward
    monthPillar: { stem: "丙", branch: "子" },
    sex: "male",
  });

  it("produces 8 pillars stepping forward from 丙子", () => {
    expect(pillars.map((p) => render(p.pillar))).toEqual([
      "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申",
    ]);
  });

  it("starts at age 9 (gap to 小寒 1995 ≈ 28.42 days → 114 months → floor 9)", () => {
    expect(pillars[0]!.startAge).toBe(9);
    // 1994-12 + 114 months = 2004-06, so the first pillar takes effect in 2004.
    expect(pillars[0]!.startYear).toBe(2004);
  });

  it("advances start age and year by 10 each pillar", () => {
    expect(pillars[1]!.startAge).toBe(pillars[0]!.startAge + 10);
    expect(pillars[1]!.startYear).toBe(pillars[0]!.startYear + 10);
  });
});

describe("luck pillars — backward case (yin year, male)", () => {
  const instant = DateTime.fromObject(
    { year: 1995, month: 6, day: 15, hour: 12 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();

  it("steps backward from the month pillar", () => {
    const pillars = luckPillars({
      instant,
      zone: "Asia/Jakarta",
      yearStem: "乙", // yin → male → backward
      monthPillar: { stem: "壬", branch: "午" },
      sex: "male",
    });
    // 壬午 index 18; backward → 辛巳(17), 庚辰(16), ...
    expect(render(pillars[0]!.pillar)).toBe("辛巳");
    expect(render(pillars[1]!.pillar)).toBe("庚辰");
  });

  it("starts at age 3 in 1998 (gap to previous 芒种 1995-06-06)", () => {
    // Backward → measure to the previous jié 芒种 (1995-06-06T03:42Z).
    // gap ≈ 9.05 days → round(9.05 × 4) = 36 months → floor(36/12) = 3.
    // 1995-06 + 36 months = 1998-06, so the first pillar takes effect in 1998.
    const pillars = luckPillars({
      instant,
      zone: "Asia/Jakarta",
      yearStem: "乙",
      monthPillar: { stem: "壬", branch: "午" },
      sex: "male",
    });
    expect(pillars[0]!.startAge).toBe(3);
    expect(pillars[0]!.startYear).toBe(1998);
  });
});
