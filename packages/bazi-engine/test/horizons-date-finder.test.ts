import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { computeChart } from "../src/chart.js";
import { findDates } from "../src/date-finder.js";
import { horizonFacts } from "../src/horizons.js";
import type { ReadingFact } from "../src/facts.js";
import type { Chart } from "../src/types.js";

function fixtureA(hourKnown = true): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();
  return computeChart({ instant, zone: "Asia/Jakarta", sex: "male", hourKnown });
}

/** The 甲子-anchor person: 1949-10-01 12:00 Asia/Jakarta. */
function anchorChart(): Chart {
  const instant = DateTime.fromObject(
    { year: 1949, month: 10, day: 1, hour: 12 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();
  return computeChart({ instant, zone: "Asia/Jakarta", sex: "female", hourKnown: true });
}

const ZONE = "Asia/Jakarta";

describe("horizonFacts — Fixture A at 2026-06-21", () => {
  const chart = fixtureA();
  const horizons = horizonFacts(chart, "2026-06-21", ZONE);

  it("carries the 丙午 annual and 甲午 monthly pillars", () => {
    expect(`${horizons.annualPillar.stem}${horizons.annualPillar.branch}`).toBe("丙午");
    expect(`${horizons.monthlyPillar.stem}${horizons.monthlyPillar.branch}`).toBe("甲午");
  });

  it("reads the annual stem as favourable fire, 偏印 to the 戊 day master", () => {
    expect(horizons.annual).toContainEqual({
      kind: "element-period",
      period: "annual",
      element: "fire",
      favorable: true,
    });
    const tenGod = horizons.annual.find(
      (fact): fact is Extract<ReadingFact, { kind: "ten-god-period" }> =>
        fact.kind === "ten-god-period",
    );
    expect(tenGod).toMatchObject({ period: "annual", god: "偏印" });
  });

  it("reads the monthly stem as unfavourable wood, 七杀 to the day master", () => {
    expect(horizons.monthly).toContainEqual({
      kind: "element-period",
      period: "monthly",
      element: "wood",
      favorable: false,
    });
    const tenGod = horizons.monthly.find(
      (fact): fact is Extract<ReadingFact, { kind: "ten-god-period" }> =>
        fact.kind === "ten-god-period",
    );
    expect(tenGod).toMatchObject({ period: "monthly", god: "七杀" });
  });

  it("finds the 午 transit clashing the natal 子 career palace in both horizons", () => {
    for (const [facts, palace] of [
      [horizons.annual, "annual"],
      [horizons.monthly, "monthly"],
    ] as const) {
      const clash = facts.find(
        (fact) =>
          fact.kind === "transit-interaction" &&
          fact.interaction === "six-clash" &&
          fact.transitPalace === palace,
      );
      expect(clash).toMatchObject({
        transitBranch: "午",
        natalPalaces: ["month"],
      });
    }
  });

  it("is deterministic", () => {
    expect(horizonFacts(chart, "2026-06-21", ZONE)).toEqual(horizons);
  });
});

describe("findDates — Fixture A, commit, 2026-06-15..30", () => {
  const chart = fixtureA();
  const candidates = findDates([chart], "commit", "2026-06-15", "2026-06-30", ZONE);

  it("covers every day of the range, sorted by combined score then date", () => {
    expect(candidates).toHaveLength(16);
    for (let i = 1; i < candidates.length; i += 1) {
      const previous = candidates[i - 1] as (typeof candidates)[number];
      const current = candidates[i] as (typeof candidates)[number];
      const ordered =
        previous.combined > current.combined ||
        (previous.combined === current.combined && previous.date < current.date);
      expect(ordered).toBe(true);
    }
  });

  it("ranks 2026-06-21 (成 day, +3) first — the Sinarmas wedding date", () => {
    const top = candidates[0] as (typeof candidates)[number];
    expect(top.date).toBe("2026-06-21");
    expect(top.combined).toBe(3);
    expect(top.officer.chinese).toBe("成");
    expect(`${top.pillar.stem}${top.pillar.branch}`).toBe("丙寅");
  });

  it("ranks the 破 day (2026-06-19) last at −2", () => {
    const bottom = candidates[candidates.length - 1] as (typeof candidates)[number];
    expect(bottom.date).toBe("2026-06-19");
    expect(bottom.combined).toBe(-2);
    expect(bottom.officer.chinese).toBe("破");
  });
});

describe("findDates — two charts", () => {
  it("combines as the minimum of the per-chart scores (a day must work for both)", () => {
    const charts = [fixtureA(), anchorChart()];
    const candidates = findDates(charts, "commit", "2026-06-15", "2026-06-30", ZONE);
    for (const candidate of candidates) {
      expect(candidate.perChart).toHaveLength(2);
      const scores = candidate.perChart.map((assessment) => assessment.score);
      expect(candidate.combined).toBe(Math.min(...scores));
    }
  });
});

describe("findDates — validation", () => {
  const chart = fixtureA();

  it("rejects an empty chart list", () => {
    expect(() => findDates([], "commit", "2026-06-15", "2026-06-30", ZONE)).toThrow(
      /at least one chart/,
    );
  });

  it("rejects a range that ends before it starts", () => {
    expect(() => findDates([chart], "commit", "2026-06-30", "2026-06-15", ZONE)).toThrow(
      /ends before/,
    );
  });

  it("rejects a range longer than 366 days", () => {
    expect(() => findDates([chart], "commit", "2026-01-01", "2027-06-01", ZONE)).toThrow(
      /366/,
    );
  });
});
