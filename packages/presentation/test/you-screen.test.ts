/**
 * M24-08: the You screen builds for every reading fixture — the portrait lead,
 * all five elements split between helping and wearing, and colours that never
 * sit on both lists.
 */

import { describe, expect, it } from "vitest";
import { COLOUR_SWATCH, youColoursFor, youElementsFor, youScreenFor } from "../src/index.js";
import { READING_FIXTURES } from "./fixtures.js";

describe("You", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`builds the portrait, elements and colours for fixture ${name}`, () => {
      expect(youScreenFor(profile)?.lead.headline).toMatch(/^You are /);

      const elements = youElementsFor(profile);
      const helps = elements?.helps.map((entry) => entry.element) ?? [];
      const wears = elements?.wears.map((entry) => entry.element) ?? [];
      expect(helps.length).toBeGreaterThan(0);
      expect([...helps, ...wears].sort()).toEqual(["earth", "fire", "metal", "water", "wood"]);

      const colours = youColoursFor(profile);
      expect(colours?.suit.length).toBeGreaterThan(0);
      expect(colours?.suit.some((colour) => colours.easyOn.includes(colour))).toBe(false);
      for (const colour of [...(colours?.suit ?? []), ...(colours?.easyOn ?? [])]) {
        expect(COLOUR_SWATCH[colour]).toMatch(/^#[0-9A-F]{6}$/);
      }
    });
  }
});
