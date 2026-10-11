/** M24-06: every fixture gets a colour on every day of a year, always one of the colours that suit it. */

import { describe, expect, it } from "vitest";
import { addDays, todayColourFor, youColoursFor } from "../src/index.js";
import { READING_FIXTURES } from "./fixtures.js";

describe("Today's colour", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`always has a suiting colour for fixture ${name}`, () => {
      const suits = new Set(youColoursFor(profile)?.suit);
      for (let offset = 0; offset < 366; offset += 1) {
        const pick = todayColourFor(profile, addDays("2026-01-01", offset));
        expect(pick).not.toBeNull();
        expect(suits.has(pick!.colour)).toBe(true);
      }
    });
  }
});
