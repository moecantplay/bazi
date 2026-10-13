/**
 * "What the marks mean" (M24-15): each link's sheet names exactly the marks
 * its look draws, and none of the retired week strip's.
 */

import { describe, expect, it } from "vitest";
import { MARKS_TOPIC, glossaryEntry } from "../src/index.js";

function sheetText(topic: string): string {
  const entry = glossaryEntry(topic);
  expect(entry, topic).toBeDefined();
  return `${entry!.title} ${entry!.body.join(" ")}`;
}

/** The retired strip's marks: no look draws them any more. */
const RETIRED_MARKS = [/filled dot/i, /open ring/i, /short dash/i];

/** System terms Today keeps off its screens (M20-21). */
const SYSTEM_TERMS = [/\bclash/i, /\bcombine/i, /\bsign\b/i, /old calendars/i];

/** The anchor pair is dark on light and light on dark: no mark is named by it. */
const THEME_BOUND = [/\bdark\b/i, /\bblack\b/i, /\bwhite\b/i];

describe("what the marks mean", () => {
  for (const topic of Object.values(MARKS_TOPIC)) {
    it(`${topic}: no retired marks, no system terms, nothing that flips with the theme`, () => {
      const text = sheetText(topic);
      for (const pattern of [...RETIRED_MARKS, ...SYSTEM_TERMS, ...THEME_BOUND]) {
        expect(pattern.test(text), `${topic} matches ${pattern}`).toBe(false);
      }
    });
  }

  it("Instrument names its rings and every mark on the dial", () => {
    const text = sheetText(MARKS_TOPIC.dial);
    for (const mark of ["solid green ring", "dashed amber ring", "plain grey ring", "noon at the top", "midnight at the bottom", "hand", "amber arc", "green arc", "star", "best hour", "animals round the edge"]) {
      expect(text).toContain(mark);
    }
  });

  it("Editorial names its three dots", () => {
    const text = sheetText(MARKS_TOPIC.almanac);
    for (const mark of ["dot", "green", "amber", "grey", "highlighted cell"]) {
      expect(text).toContain(mark);
    }
  });

  it("Explorer's week names its heights and animals", () => {
    const text = sheetText(MARKS_TOPIC.trailWeek);
    for (const mark of ["higher", "low", "middle", "animal", "filled disc"]) {
      expect(text).toContain(mark);
    }
  });

  it("Explorer's route names every mark on it", () => {
    const text = sheetText(MARKS_TOPIC.trailRoute);
    for (const mark of ["morning", "evening", "solid stretch", "labelled NOW", "amber circle with an X", "green circle", "star", "best hour"]) {
      expect(text).toContain(mark);
    }
  });

  it("every rough mark comes with what to do with it", () => {
    for (const topic of [MARKS_TOPIC.dial, MARKS_TOPIC.trailRoute]) {
      expect(sheetText(topic)).toContain("rough hour, when small things tend to jostle: keep it for routine work");
    }
  });
});
