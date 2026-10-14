/**
 * M24-03: every fact says what it is about (the birth chart, a day, a month,
 * a year or a decade), and each producer stamps its own scope.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import { DateTime } from "luxon";
import { computeChart } from "../src/chart.js";
import {
  dailyFacts,
  hourInteractionFacts,
  natalFacts,
  type DayFact,
  type FactScope,
  type NatalFact,
  type PeriodFact,
  type ReadingFact,
} from "../src/facts.js";
import { annualPillarFacts, luckPillarFacts, monthlyPillarFactsForCalendarMonth } from "../src/horizons.js";
import type { Chart } from "../src/types.js";

function fixtureA(): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();
  return computeChart({ instant, zone: "Asia/Jakarta", sex: "male", hourKnown: true });
}

function scopesOf(facts: readonly ReadingFact[]): Set<FactScope> {
  return new Set(facts.map((fact) => fact.scope));
}

describe("fact scope types", () => {
  it("names five scopes, and every fact carries one", () => {
    expectTypeOf<FactScope>().toEqualTypeOf<"natal" | "day" | "month" | "year" | "decade">();
    expectTypeOf<ReadingFact["scope"]>().toEqualTypeOf<FactScope>();
    expectTypeOf<ReadingFact>().toMatchTypeOf<{ scope: FactScope }>();
  });

  it("narrows each producer's facts to its own scope", () => {
    expectTypeOf<DayFact["scope"]>().toEqualTypeOf<"day">();
    expectTypeOf<PeriodFact["scope"]>().toEqualTypeOf<"month" | "year" | "decade">();
    expectTypeOf<NatalFact["scope"]>().toEqualTypeOf<"natal">();
    expectTypeOf(dailyFacts).returns.toEqualTypeOf<DayFact[]>();
    expectTypeOf(natalFacts).returns.toEqualTypeOf<NatalFact[]>();
    expectTypeOf(luckPillarFacts).returns.toEqualTypeOf<PeriodFact[]>();
  });

  it("keeps a year's facts out of a day's", () => {
    const yearFacts: PeriodFact[] = annualPillarFacts(fixtureA(), 2026).facts;
    // @ts-expect-error a year fact is not a day fact
    const asDay: DayFact[] = yearFacts;
    expect(asDay).toBe(yearFacts);
  });
});

describe("fact scope at run time — Fixture A", () => {
  const chart = fixtureA();

  it("stamps the birth chart's facts natal", () => {
    expect(scopesOf(natalFacts(chart))).toEqual(new Set(["natal"]));
  });

  it("stamps a day's facts day, hours and best hour included", () => {
    const facts = dailyFacts(chart, "2026-06-15", "Asia/Jakarta");
    expect(facts.some((fact) => fact.kind === "transit-interaction")).toBe(true);
    expect(facts.some((fact) => fact.kind === "best-hour")).toBe(true);
    expect(scopesOf(facts)).toEqual(new Set(["day"]));
    expect(scopesOf(hourInteractionFacts("申"))).toEqual(new Set(["day"]));
  });

  it("stamps a month's facts month, a year's year and a decade's decade", () => {
    expect(scopesOf(monthlyPillarFactsForCalendarMonth(chart, 2026, 7, "Asia/Jakarta").facts)).toEqual(new Set(["month"]));
    expect(scopesOf(annualPillarFacts(chart, 2026).facts)).toEqual(new Set(["year"]));
    const luck = chart.luckPillars[2]!;
    expect(scopesOf(luckPillarFacts(chart, luck))).toEqual(new Set(["decade"]));
  });

  it("carries no period field: scope is the one vocabulary", () => {
    for (const fact of annualPillarFacts(chart, 2026).facts) {
      expect(fact).not.toHaveProperty("period");
    }
  });
});
