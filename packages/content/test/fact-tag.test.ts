/**
 * factTag correctness: pure-voice lines (agency) carry null.
 */

import { describe, expect, it } from "vitest";
import { dailyReading, natalReading } from "../src/index.js";
import { dailyFactSet } from "./collect.js";
import { lineFactTag } from "./token-utils.js";

describe("factTag correctness", () => {
  it("agency lines carry a null factTag", () => {
    const reading = dailyReading(dailyFactSet("six-clash", "month", "daily"), { chart: "seed", date: "2026-09-29" });
    expect(lineFactTag(reading.agency)).toBeNull();
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
