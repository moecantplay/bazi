/**
 * TRIAL (2026-10-05 reshape trial build): Ahead, You and People build for
 * every reading fixture, across a year of months, with a lead on every period.
 */

import { describe, expect, it } from "vitest";
import { aheadPeriodsFor, pairScreenFor, youScreenFor } from "../src/index.js";
import { FIXTURE_B, READING_FIXTURES } from "./fixtures.js";

describe("trial screens", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`builds Ahead for fixture ${name} across a year`, () => {
      for (let month = 1; month <= 12; month += 1) {
        const periods = aheadPeriodsFor(profile, `2026-${`${month}`.padStart(2, "0")}-15`);
        expect(periods.month.reading.lead.headline.length).toBeGreaterThan(0);
        expect(periods.year.reading.lead.body.length).toBeGreaterThan(0);
        expect(periods.decades.filter((decade) => decade.current).length).toBeLessThanOrEqual(1);
      }
    });

    it(`builds You and a pair for fixture ${name}`, () => {
      expect(youScreenFor(profile)?.lead.headline).toMatch(/^You are /);
      expect(pairScreenFor(profile, FIXTURE_B.birth)?.lead.headline.length).toBeGreaterThan(0);
    });
  }
});
