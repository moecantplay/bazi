/** M24-10: the first-week notes are plain (VOICE.md rule 11) and each names its part by the words on screen. */

import { describe, expect, it } from "vitest";
import { FIRST_WEEK_NOTES, firstWeekKicker } from "../src/index.js";
import { assertPlain } from "./plain-terms.js";

/** The words each part carries on Today, which its note must use. */
const ON_SCREEN_NAME: Record<keyof typeof FIRST_WEEK_NOTES, string> = {
  hours: "Hours",
  character: "The day's character",
  pace: "Your pace",
  element: "The day's element",
  "also-today": "Also today",
  "small-signs": "Small signs",
  suits: "What the day suits",
  colour: "Today's colour",
  journal: "rang true or didn't fit",
};

describe("first-week notes", () => {
  for (const [part, note] of Object.entries(FIRST_WEEK_NOTES)) {
    it(`${part}: plain, and names the part as Today shows it`, () => {
      assertPlain(note);
      expect(note).toContain(ON_SCREEN_NAME[part as keyof typeof FIRST_WEEK_NOTES]);
    });
  }

  it("the kicker counts the day", () => {
    expect(firstWeekKicker(3)).toBe("Your first week · day 3");
  });
});
