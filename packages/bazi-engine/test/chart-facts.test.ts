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

  it("never reports an annual transit-interaction — Today is day-only, the year lives on Cycles", () => {
    // annualPillar(2026) = 丙午; 午 clashes the natal month branch 子, but that
    // belongs to the year's own reading (Cycles' annualReading), not Today's.
    const annualInteraction = facts.find(
      (f): f is Extract<ReadingFact, { kind: "transit-interaction" }> =>
        f.kind === "transit-interaction" && f.transitPalace === "annual",
    );
    expect(annualInteraction).toBeUndefined();
  });

  it("still reports the daily transit-interaction facts (day pillar only)", () => {
    const dailyInteractions = facts.filter(
      (f): f is Extract<ReadingFact, { kind: "transit-interaction" }> =>
        f.kind === "transit-interaction",
    );
    expect(dailyInteractions.every((f) => f.transitPalace === "daily")).toBe(true);
  });

  it("never reports a star hit triggered by the annual pillar — 2026's 將星/羊刃/災煞 stay off Today", () => {
    // Confirmed present with transitPalace "annual" before this fix (將星
    // General Star, 羊刃 Goat Blade, 災煞 Calamity Star, all lit by 丙午).
    const starDays = facts.filter((f): f is Extract<ReadingFact, { kind: "star-day" }> => f.kind === "star-day");
    expect(starDays.every((f) => f.transitPalace === "daily")).toBe(true);
  });

  it("is deterministic: same chart + date yields identical facts", () => {
    const again = dailyFacts(fixtureA(), "2026-06-15", "Asia/Jakarta");
    expect(again).toEqual(facts);
  });

  it("emits an element-day and a ten-god-day fact", () => {
    expect(facts.some((f) => f.kind === "element-day")).toBe(true);
    expect(facts.some((f) => f.kind === "ten-god-day")).toBe(true);
  });

  it("marks the two-hour blocks whose sign clashes and combines with the day's own — 申 day: 寅 3–5am, 巳 9–11am", () => {
    const hours = facts.filter((f): f is Extract<ReadingFact, { kind: "hour-interaction" }> => f.kind === "hour-interaction");
    expect(hours).toEqual([
      { kind: "hour-interaction", interaction: "six-clash", hourBranch: "寅", dayBranch: "申", startHour: 3, endHour: 5 },
      { kind: "hour-interaction", interaction: "six-combine", hourBranch: "巳", dayBranch: "申", startHour: 9, endHour: 11 },
    ]);
  });

  it("moves the marked hours with the day branch — 酉 day: 卯 5–7am clash, 辰 7–9am combine", () => {
    const next = dailyFacts(fixtureA(), "2026-06-16", "Asia/Jakarta");
    const hours = next.filter((f): f is Extract<ReadingFact, { kind: "hour-interaction" }> => f.kind === "hour-interaction");
    expect(hours.map((f) => `${f.interaction}:${f.hourBranch}:${f.startHour}-${f.endHour}`)).toEqual([
      "six-clash:卯:5-7",
      "six-combine:辰:7-9",
    ]);
  });

  it("wraps the 子 hour across midnight — 午 day clashes 子, 11pm–1am", () => {
    // 2026-06-25 is a 庚午 day (dailyPillar confirmed).
    const wuDay = dailyFacts(fixtureA(), "2026-06-25", "Asia/Jakarta");
    const clash = wuDay.find(
      (f): f is Extract<ReadingFact, { kind: "hour-interaction" }> =>
        f.kind === "hour-interaction" && f.interaction === "six-clash",
    );
    expect(clash).toMatchObject({ dayBranch: "午", hourBranch: "子", startHour: 23, endHour: 1 });
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
