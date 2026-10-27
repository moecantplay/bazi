/**
 * M24-11 R12, VOICE.md rule 6: no word or two-word phrase carries a window
 * of screens, over 90 days and every fixture.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { overCaps, termsOf, wordPeaks } from "./word-variety.js";

describe("word variety", () => {
  it("keeps every word under its cap", () => {
    expect(overCaps(wordPeaks(READING_FIXTURES))).toEqual([]);
  });

  it("counts words with \"-s\" folded and function words skipped, and two-word phrases", () => {
    expect(termsOf("Plans tend to shift this month.")).toEqual(["plan", "tend", "shift", "month", "plan tend", "tend to", "to shift", "shift this", "this month"]);
    expect(termsOf("Good news, always.")).toEqual(["good", "news", "always", "good news", "news always"]);
  });
});
