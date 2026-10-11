/** M24-09: a plain pair reading builds for every reading fixture against Fixture B. */

import { describe, expect, it } from "vitest";
import { pairScreenFor } from "../src/index.js";
import { FIXTURE_B, READING_FIXTURES } from "./fixtures.js";

describe("People", () => {
  for (const [name, profile] of READING_FIXTURES) {
    it(`reads the pair for fixture ${name}`, () => {
      const reading = pairScreenFor(profile, FIXTURE_B.birth);
      expect(reading?.lead.headline.length).toBeGreaterThan(0);
      expect(reading?.lead.topic).toMatch(/^relation:/);
    });
  }
});
