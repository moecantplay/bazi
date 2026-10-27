/**
 * M24-11 R12, VOICE.md rule 6: no word or two-word phrase carries a window
 * of screens, over 90 days and every fixture.
 */

import { describe, expect, it } from "vitest";
import { READING_FIXTURES } from "./fixtures.js";
import { WORD_VARIETY_KNOWN } from "./word-variety-known.js";
import { overCaps, termsOf, wordPeaks } from "./word-variety.js";

describe("word variety", () => {
  it("keeps every word under its cap, but for the rewrite's worklist", () => {
    expect(overCaps(wordPeaks(READING_FIXTURES))).toEqual(WORD_VARIETY_KNOWN);
  });

  it("counts words with \"-s\" folded and function words skipped, and two-word phrases", () => {
    expect(termsOf("Plans tend to shift this month.")).toEqual(["plan", "tend", "shift", "month", "plans tend", "tend to", "to shift", "shift this", "this month"]);
  });
});
