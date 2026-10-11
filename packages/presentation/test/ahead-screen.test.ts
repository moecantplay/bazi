/**
 * M24-07: Ahead's seasons build for every reading fixture — a month, a year
 * with its twelve months, every ten-year stretch with its ten years — and the
 * engine's 2100 edge is reachable without a throw.
 */

import { describe, expect, it } from "vitest";
import { decadeView, decadesOf, monthView, monthsOfYear, yearView, yearsOfDecade } from "../src/index.js";
import { READING_FIXTURES } from "./fixtures.js";

describe("Ahead", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`builds every season for fixture ${name}`, () => {
      const month = monthView(profile, 2026, 10);
      expect(month?.label).toBe("October 2026");
      expect(month?.reading.lead.headline.length).toBeGreaterThan(0);

      expect(yearView(profile, 2026).label).toBe("2026");
      const months = monthsOfYear(profile, 2026);
      expect(months).toHaveLength(12);
      expect(months.every((entry) => entry.headline.length > 0)).toBe(true);

      const { decades, currentIndex } = decadesOf(profile, 2026);
      expect(decades.length).toBeGreaterThan(0);
      for (const decade of decades.filter((luck) => luck.startYear + 9 <= 2100)) {
        expect(decadeView(profile, decade).reading.lead.body.length).toBeGreaterThan(0);
        expect(yearsOfDecade(profile, decade)).toHaveLength(10);
      }
      expect(currentIndex).not.toBeNull();
    });
  }

  it("lists a stretch running past 2100 only up to 2100, for a reader born in 2020", () => {
    const [, base] = READING_FIXTURES[0]!;
    const young = { ...base, birth: { ...base.birth, date: "2020-05-05" } };
    for (const decade of decadesOf(young, 2026).decades) {
      expect(() => decadeView(young, decade)).not.toThrow();
      const years = yearsOfDecade(young, decade);
      expect(years.length).toBe(Math.min(10, 2100 - decade.startYear + 1));
    }
  });

  it("offers only the months the engine can read at its 1900 and 2100 edges", () => {
    const [, profile] = READING_FIXTURES[0]!;
    expect(monthView(profile, 2100, 11)?.reading.lead.headline.length).toBeGreaterThan(0);
    expect(monthView(profile, 2100, 12)).toBeNull();
    expect(monthView(profile, 1900, 1)).toBeNull();
    expect(monthsOfYear(profile, 2100).map((month) => month.key)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(monthsOfYear(profile, 1900).map((month) => month.key)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(yearView(profile, 2100).reading.lead.headline.length).toBeGreaterThan(0);
    expect(yearView(profile, 1900).reading.lead.headline.length).toBeGreaterThan(0);
  });
});
