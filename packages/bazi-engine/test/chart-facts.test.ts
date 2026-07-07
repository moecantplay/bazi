import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { computeChart } from "../src/chart.js";
import { dailyFacts, natalFacts, type ReadingFact } from "../src/facts.js";
import type { Chart } from "../src/types.js";

function fixtureA(hourKnown = true): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();
  return computeChart({ instant, zone: "Asia/Jakarta", sex: "male", hourKnown });
}

describe("computeChart — Fixture A full derivation", () => {
  const chart = fixtureA();

  it("assembles the four pillars and day master", () => {
    expect(`${chart.year.stem}${chart.year.branch}`).toBe("甲戌");
    expect(`${chart.month.stem}${chart.month.branch}`).toBe("丙子");
    expect(`${chart.day.stem}${chart.day.branch}`).toBe("戊辰");
    expect(`${chart.hour?.stem}${chart.hour?.branch}`).toBe("庚申");
    expect(chart.dayMaster).toBe("戊");
  });

  it("labels ten gods 甲=七杀, 丙=偏印, 庚=食神", () => {
    expect(chart.tenGods.year.chinese).toBe("七杀");
    expect(chart.tenGods.month.chinese).toBe("偏印");
    expect(chart.tenGods.hour?.chinese).toBe("食神");
  });

  it("carries principal-first hidden stems per pillar", () => {
    expect(chart.hiddenStems.month).toEqual(["癸"]); // 子
    expect(chart.hiddenStems.day).toEqual(["戊", "乙", "癸"]); // 辰
    expect(chart.hiddenStems.hour).toEqual(["庚", "壬", "戊"]); // 申
  });

  it("finds the full 申子辰 water trine across month/day/hour", () => {
    const trine = chart.interactions.find(
      (interaction) => interaction.type === "trine" && interaction.completeness === "full",
    );
    expect(trine).toBeDefined();
    if (trine && trine.type === "trine") {
      expect(trine.element).toBe("water");
      expect([...trine.palaces].sort()).toEqual(["day", "hour", "month"]);
    }
  });

  it("is a weak day master favouring Fire and Earth", () => {
    expect(chart.strength.value).toBe("weak");
    expect(chart.favorableElements).toContain("fire");
    expect(chart.favorableElements).toContain("earth");
  });

  it("produces the forward luck sequence starting at age 9 in 2004", () => {
    expect(chart.luckPillars.map((l) => `${l.pillar.stem}${l.pillar.branch}`)).toEqual([
      "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申",
    ]);
    expect(chart.luckPillars[0]!.startAge).toBe(9);
    expect(chart.luckPillars[0]!.startYear).toBe(2004);
  });

  it("counts five elements over visible stems and branches", () => {
    expect(chart.fiveElementCounts).toEqual({
      wood: 1, // 甲 stem
      fire: 1, // 丙 stem
      earth: 3, // 戊 stem, 戌 branch, 辰 branch
      metal: 2, // 庚 stem, 申 branch
      water: 1, // 子 branch
    });
  });
});

describe("natalFacts — Fixture A", () => {
  const facts = natalFacts(fixtureA());

  it("leads with day-master, strength, and element-balance", () => {
    expect(facts[0]).toMatchObject({ kind: "day-master", stem: "戊", element: "earth" });
    expect(facts.find((f) => f.kind === "strength")).toMatchObject({ value: "weak" });
    const balance = facts.find((f) => f.kind === "element-balance");
    expect(balance).toMatchObject({ dominant: "earth" });
  });

  it("emits a favorable fact including Fire and Earth", () => {
    const favorable = facts.find((f) => f.kind === "favorable");
    expect(favorable && favorable.kind === "favorable" && favorable.elements).toEqual(
      expect.arrayContaining(["fire", "earth"]),
    );
  });
});

describe("dailyFacts — Fixture A on a 2026 date", () => {
  const facts = dailyFacts(fixtureA(), "2026-06-15", "Asia/Jakarta");

  it("reports the annual 子午 clash touching the month palace", () => {
    // annualPillar(2026) = 丙午; 午 clashes the natal month branch 子.
    const clash = facts.find(
      (f): f is Extract<ReadingFact, { kind: "transit-interaction" }> =>
        f.kind === "transit-interaction" &&
        f.interaction === "six-clash" &&
        f.transitPalace === "annual",
    );
    expect(clash).toBeDefined();
    expect([...(clash?.branches ?? [])].sort()).toEqual(["午", "子"].sort());
    expect(clash?.natalPalaces).toContain("month");
  });

  it("is deterministic: same chart + date yields identical facts", () => {
    const again = dailyFacts(fixtureA(), "2026-06-15", "Asia/Jakarta");
    expect(again).toEqual(facts);
  });

  it("emits an element-day and a ten-god-day fact", () => {
    expect(facts.some((f) => f.kind === "element-day")).toBe(true);
    expect(facts.some((f) => f.kind === "ten-god-day")).toBe(true);
  });
});

describe("unknown-time chart — nothing hour-derived appears", () => {
  const chart = fixtureA(false);

  it("omits the hour pillar and its derivations", () => {
    expect(chart.hour).toBeNull();
    expect(chart.hiddenStems.hour).toBeNull();
    expect(chart.tenGods.hour).toBeNull();
    // The 申 hour branch is gone, so the water trine can no longer be full.
    expect(
      chart.interactions.some(
        (i) => i.type === "trine" && i.completeness === "full",
      ),
    ).toBe(false);
    // No interaction references the hour palace.
    expect(chart.interactions.every((i) => !i.palaces.includes("hour"))).toBe(true);
  });

  it("still computes luck pillars (unaffected by hour)", () => {
    expect(chart.luckPillars).toHaveLength(8);
    expect(chart.luckPillars[0]!.startAge).toBe(9);
  });

  it("keeps hour out of natal and daily facts", () => {
    const natal = natalFacts(chart);
    for (const fact of natal) {
      if (fact.kind === "natal-interaction") {
        expect(fact.palaces).not.toContain("hour");
      }
    }
    const daily = dailyFacts(chart, "2026-06-15", "Asia/Jakarta");
    for (const fact of daily) {
      if (fact.kind === "transit-interaction") {
        expect(fact.natalPalaces).not.toContain("hour");
      }
    }
  });
});
