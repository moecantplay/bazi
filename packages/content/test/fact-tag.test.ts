/**
 * factTag correctness: pure-voice lines (agency, luck) carry null.
 */

import { describe, expect, it } from "vitest";
import { dailyReading, luckTransitionLines, natalReading } from "../src/index.js";
import { dailyFactSet } from "./collect.js";
import { lineFactTag, lineText } from "./token-utils.js";

describe("factTag correctness", () => {
  it("agency lines carry a null factTag", () => {
    const reading = dailyReading(dailyFactSet("six-clash", "month", "daily"), { chart: "seed", date: "2026-09-29" });
    expect(lineFactTag(reading.agency)).toBeNull();
  });

  it("luck lines carry a null factTag and substitute the ages", () => {
    const lines = luckTransitionLines({ fromAge: 33, toAge: 43 }, "seed");
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines.length).toBeLessThanOrEqual(2);
    for (const line of lines) {
      expect(lineFactTag(line)).toBeNull();
      expect(lineText(line)).not.toMatch(/\{from\}|\{to\}/);
      expect(lineText(line)).toMatch(/33|43/);
    }
  });

  it("natal interaction lines tag the branches and a palace word", () => {
    const reading = natalReading(
      [
        {
          kind: "natal-interaction",
          interaction: "six-clash",
          branches: ["子", "午"],
          palaces: ["month", "day"],
        },
      ],
      "seed",
    );
    const line = reading.sections.flatMap((section) => section.lines)[0];
    expect(line && lineFactTag(line)).toContain("rat–horse");
    expect(line && lineFactTag(line)).toContain("clash");
  });
});
