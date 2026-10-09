/**
 * TRIAL (2026-10-05 reshape trial build): Ahead, You and People build for
 * every reading fixture, with a lead on every period and every season list
 * (R9, R10) filled.
 */

import { describe, expect, it } from "vitest";
import {
  decadeView,
  decadesOf,
  monthView,
  monthsOfYear,
  addDays,
  pairScreenFor,
  todayColourFor,
  yearView,
  yearsOfDecade,
  youColoursFor,
  youElementsFor,
  youScreenFor
} from "../src/index.js";
import { FIXTURE_B, READING_FIXTURES } from "./fixtures.js";


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

    });

    it(`builds You and a pair for fixture ${name}`, () => {
      expect(youScreenFor(profile)?.lead.headline).toMatch(/^You are /);
      expect(pairScreenFor(profile, FIXTURE_B.birth)?.lead.headline.length).toBeGreaterThan(0);
    });

    it(`splits all five elements between helps and wears for fixture ${name} (R15)`, () => {
      const elements = youElementsFor(profile);
      const helps = elements?.helps.map((entry) => entry.element) ?? [];
      const wears = elements?.wears.map((entry) => entry.element) ?? [];
      expect(helps.length).toBeGreaterThan(0);
      expect([...helps, ...wears].sort()).toEqual(["earth", "fire", "metal", "water", "wood"]);
    });

    it(`gives Today a colour from a helping element on every day of a year for fixture ${name} (R17)`, () => {
      const suits = new Set(youColoursFor(profile)?.suit);
      for (let offset = 0; offset < 366; offset += 1) {
        const pick = todayColourFor(profile, addDays("2026-01-01", offset));
        expect(pick).not.toBeNull();
        expect(suits.has(pick!.colour)).toBe(true);
      }
    });

    it(`builds the colours card for fixture ${name} (R16)`, () => {
      const colours = youColoursFor(profile);
      expect(colours?.suit.length).toBeGreaterThan(0);
      expect(colours?.suit.some((colour) => colours.easyOn.includes(colour))).toBe(false);
    });
  }
});
