/** M24-06: Today's colour is a shade of the given element, deterministic, and phrased plainly (VOICE.md rules 11, 12). */

import { describe, expect, it } from "vitest";
import { ELEMENT_COLOURS, dayColour } from "../src/index.js";
import { ELEMENTS } from "./collect.js";
import { assertPlain } from "./plain-terms.js";

const SEED = { chart: "seed", date: "2026-10-10" };

describe("dayColour", () => {
  it("picks a shade of the element, the same each time, in plain words", () => {
    for (const element of ELEMENTS) {
      for (const mode of ["lean", "steady"] as const) {
        const pick = dayColour(element, mode, SEED);
        expect(ELEMENT_COLOURS[element]).toContain(pick.colour);
        expect(dayColour(element, mode, SEED)).toEqual(pick);
        assertPlain(pick.line);
      }
    }
    const fire = dayColour("fire", "lean", SEED);
    expect(fire.line).toBe(`It matches the mood. Wear it, or carry one ${fire.colour} item.`);
  });
});
