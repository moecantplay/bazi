/** M24-06: Today's colour is a shade of the given element, deterministic, and phrased plainly (VOICE.md rules 11, 12). */

import { describe, expect, it } from "vitest";
import { ELEMENT_COLOURS, dayColour } from "../src/index.js";
import { dayColourLine } from "../src/banks/colours.js";
import { ELEMENTS } from "./collect.js";
import { assertPlain } from "./plain-terms.js";

describe("dayColour", () => {
  it("picks a shade of the element, the same each time, in plain words", () => {
    for (const element of ELEMENTS) {
      for (const mode of ["lean", "steady"] as const) {
        const pick = dayColour(element, mode, "seed|2026-10-10");
        expect(ELEMENT_COLOURS[element]).toContain(pick.colour);
        expect(dayColour(element, mode, "seed|2026-10-10")).toEqual(pick);
        assertPlain(pick.line);
      }
    }
    expect(dayColourLine("lean", "pink")).toBe("It matches the day. Wear it, or keep something pink close.");
  });
});
