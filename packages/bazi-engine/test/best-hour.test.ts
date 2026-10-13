import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { elementOfStem } from "../src/attributes.js";
import { computeChart } from "../src/chart.js";
import { bestHourFact } from "../src/best-hour.js";
import { dailyFacts, hourInteractionFacts, type ReadingFact } from "../src/facts.js";
import { dailyPillar } from "../src/pillars.js";
import type { Chart } from "../src/types.js";

type BestHourFact = Extract<ReadingFact, { kind: "best-hour" }>;

const ZONE = "Asia/Jakarta";

/** Fixture A: 戊辰 day master, weak, favourable [fire, earth]; natal day branch 辰 (combines 酉, clashes 戌). */
function fixtureA(hourKnown = true): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: ZONE },
  ).toJSDate();
  return computeChart({ instant, zone: ZONE, sex: "male", hourKnown });
}

function bestHourOn(chart: Chart, date: string): BestHourFact | undefined {
  return dailyFacts(chart, date, ZONE).find((fact): fact is BestHourFact => fact.kind === "best-hour");
}

describe("best hour — Fixture A goldens worked by hand", () => {
  const chart = fixtureA();

  it("has the favourable elements the goldens assume", () => {
    expect(chart.favorableElements).toEqual(["fire", "earth"]);
    expect(chart.day.branch).toBe("辰");
  });

  it("2026-06-15 (庚申 day): 丑 1–3am wins alone — 丁 fire stem +2, 己 earth branch +1", () => {
    // Five Rats 庚→丙: 子丙 丑丁 寅戊 卯己 辰庚 巳辛 午壬 未癸 申甲 酉乙 戌丙 亥丁.
    // 寅 is the rough hour (excluded). Scores: 子2 丑3 卯2 戌1 (natal clash) 亥2; the rest fail the gate.
    expect(bestHourOn(chart, "2026-06-15")).toEqual({
      kind: "best-hour",
      hourBranch: "丑",
      hourStem: "丁",
      element: "fire",
      startHour: 1,
      endHour: 3,
      isEasyHour: false,
      score: 3,
      reasons: [
        { source: "stem-element", element: "fire" },
        { source: "branch-element", element: "earth" },
      ],
    });
  });

  it("2026-06-16 (辛酉 day): 丑 and 酉 tie on 3; fire leads the favourable list, so 酉 5–7pm (丁 fire) beats 丑 (己 earth)", () => {
    // Five Rats 辛→戊: 子戊 丑己 寅庚 卯辛 辰壬 巳癸 午甲 未乙 申丙 酉丁 戌戊 亥己. 卯 rough.
    // 丑: 己 earth +2, 己 earth +1 = 3. 酉: 丁 fire +2, combines natal 辰 +1 = 3.
    const fact = bestHourOn(chart, "2026-06-16");
    expect(fact).toMatchObject({ hourBranch: "酉", hourStem: "丁", element: "fire", startHour: 17, endHour: 19, score: 3 });
    expect(fact?.reasons).toEqual([
      { source: "stem-element", element: "fire" },
      { source: "natal-combine", natalBranch: "辰" },
    ]);
  });

  it("2026-06-17 (壬戌 day): 午, 未 (both fire) and 酉 (earth) tie on 3; fire first, then the earlier block — 午 11am–1pm", () => {
    // Five Rats 壬→庚: 子庚 丑辛 寅壬 卯癸 辰甲 巳乙 午丙 未丁 申戊 酉己 戌庚 亥辛. 辰 rough.
    expect(bestHourOn(chart, "2026-06-17")).toMatchObject({ hourBranch: "午", hourStem: "丙", startHour: 11, endHour: 13, score: 3 });
  });

  it("2026-06-20 (乙丑 day): the day's easy hour 子 ties 丑 on 3 and comes first in the day — isEasyHour", () => {
    // Five Rats 乙→丙: 子丙 丑丁 …. 未 rough, 子 combines 丑 (easy hour).
    // 子: 丙 fire +2, easy hour +1 = 3. 丑: 丁 fire +2, 己 earth +1 = 3. Both fire; 子 is the day's first block.
    const fact = bestHourOn(chart, "2026-06-20");
    expect(fact).toMatchObject({ hourBranch: "子", hourStem: "丙", startHour: 23, endHour: 1, isEasyHour: true, score: 3 });
    expect(fact?.reasons).toEqual([
      { source: "stem-element", element: "fire" },
      { source: "easy-hour", dayBranch: "丑" },
    ]);
  });
});

describe("best hour — rules", () => {
  it("never reads the natal hour pillar: a chart stripped of its hour gets the identical fact", () => {
    const chart = fixtureA();
    const stripped: Chart = { ...chart, hour: null };
    const pillar = dailyPillar("2026-06-16", ZONE);
    expect(bestHourFact(stripped, pillar)).toEqual(bestHourFact(chart, pillar));
  });

  it("works for an unknown-time chart", () => {
    expect(bestHourOn(fixtureA(false), "2026-06-15")).toBeDefined();
  });

  it("gate: no fact when no block's stem element suits the chart (only possible with no favourable elements)", () => {
    const chart: Chart = { ...fixtureA(), favorableElements: [] };
    expect(bestHourFact(chart, dailyPillar("2026-06-15", ZONE))).toBeNull();
  });

  it("is deterministic", () => {
    expect(bestHourOn(fixtureA(), "2026-06-16")).toEqual(bestHourOn(fixtureA(), "2026-06-16"));
  });
});

describe("best hour — 365-day sweep over every day master", () => {
  // The golden fixtures (A, A unknown-time, B, C, D as in presentation's
  // fixtures) plus ten charts born on consecutive days, one per day stem.
  const golden = (date: string, time: string, sex: "male" | "female"): Chart =>
    computeChart({ instant: DateTime.fromISO(`${date}T${time}`, { zone: ZONE }).toJSDate(), zone: ZONE, sex, hourKnown: true });
  const charts: Chart[] = [
    fixtureA(),
    fixtureA(false),
    golden("1994-02-03", "12:00", "female"),
    golden("1949-10-01", "12:00", "male"),
    golden("2000-06-15", "23:30", "female"),
    ...Array.from({ length: 10 }, (_, offset) =>
      computeChart({
        instant: DateTime.fromObject({ year: 1990, month: 3, day: 1 + offset, hour: 12 }, { zone: ZONE }).toJSDate(),
        zone: ZONE,
        sex: offset % 2 === 0 ? "female" : "male",
        hourKnown: true,
      }),
    ),
  ];
  const dates = Array.from({ length: 365 }, (_, offset) =>
    DateTime.fromISO("2026-01-01").plus({ days: offset }).toISODate()!,
  );

  it("covers all ten day masters", () => {
    // Index 1 is Fixture A without its hour.
    expect(charts[1]!.hour).toBeNull();
    expect(new Set(charts.map((chart) => chart.dayMaster)).size).toBe(10);
  });

  it("picks an hour every day, never the rough hour, always with a suiting stem element", () => {
    for (const chart of charts) {
      for (const date of dates) {
        const pillar = dailyPillar(date, ZONE);
        const fact = bestHourFact(chart, pillar);
        const rough = hourInteractionFacts(pillar.branch).find((hour) => hour.kind === "hour-interaction" && hour.interaction === "six-clash");
        expect(fact, `${chart.dayMaster} ${date}`).not.toBeNull();
        expect(fact!.hourBranch).not.toBe(rough && rough.kind === "hour-interaction" ? rough.hourBranch : undefined);
        expect(chart.favorableElements).toContain(elementOfStem(fact!.hourStem));
        expect(fact!.element).toBe(elementOfStem(fact!.hourStem));
      }
    }
  });
});
