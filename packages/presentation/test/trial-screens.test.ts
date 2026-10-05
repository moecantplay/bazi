/**
 * TRIAL (2026-10-05 reshape trial build): Ahead, You and People build for
 * every reading fixture, with a lead on every period and every new Ahead
 * section (R9) filled.
 */

import { describe, expect, it } from "vitest";
import {
  bestAndBumpiest,
  comingUp,
  decadeView,
  decadesOf,
  monthView,
  monthsOfYear,
  pairScreenFor,
  yearView,
  yearsOfDecade,
  youScreenFor
} from "../src/index.js";
import { FIXTURE_B, READING_FIXTURES } from "./fixtures.js";

const TODAY = "2026-10-05";

describe("trial screens", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`builds every Ahead section for fixture ${name}`, () => {
      expect(monthView(profile, 2026, 10).reading.lead.headline.length).toBeGreaterThan(0);
      expect(yearView(profile, 2026).label).toBe("2026");

      const months = monthsOfYear(profile, 2026);
      expect(months).toHaveLength(12);
      expect(months.every((month) => month.headline.length > 0)).toBe(true);

      const { decades, currentIndex } = decadesOf(profile, 2026);
      expect(decades.length).toBeGreaterThan(0);
      const decade = decades[currentIndex ?? 0]!;
      expect(decadeView(profile, decade).reading.lead.body.length).toBeGreaterThan(0);
      expect(yearsOfDecade(profile, decade)).toHaveLength(10);

      const upcoming = comingUp(profile, TODAY);
      expect(upcoming.length).toBeLessThanOrEqual(8);
      expect(upcoming.every((day) => day.iso > TODAY && day.openable && day.lean !== "even")).toBe(true);

      const { best, bumpiest } = bestAndBumpiest(profile, TODAY, 2026, 10);
      expect(best.length + bumpiest.length).toBeGreaterThan(0);
      expect([...best, ...bumpiest].every((day) => day.iso.startsWith("2026-10-"))).toBe(true);
      // A best day never opens with a grinding headline, nor a bumpiest day with a helpful one.
      expect(best.every((day) => day.lean === "good")).toBe(true);
      expect(bumpiest.every((day) => day.lean === "rough")).toBe(true);
    });

    it(`builds You and a pair for fixture ${name}`, () => {
      expect(youScreenFor(profile)?.lead.headline).toMatch(/^You are /);
      expect(pairScreenFor(profile, FIXTURE_B.birth)?.lead.headline.length).toBeGreaterThan(0);
    });
  }

  it("marks days beyond Today's 30-day reach as not openable", () => {
    const [, profile] = READING_FIXTURES[0]!;
    const { best, bumpiest } = bestAndBumpiest(profile, TODAY, 2027, 3);
    expect([...best, ...bumpiest].every((day) => !day.openable)).toBe(true);
  });
});
