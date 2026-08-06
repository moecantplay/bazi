/**
 * factTag correctness: transit lines carry a tag containing the branch pair and
 * the palace word; pure-voice lines (agency, luck) carry null.
 */

import { describe, expect, it } from "vitest";
import type { Palace, ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading, luckTransitionLines, natalReading } from "../src/index.js";
import { INTERACTIONS, NATAL_PALACES, dailyFactSet } from "./collect.js";
import { lineFactTag, lineText } from "./token-utils.js";

const PALACE_WORD: Record<string, string> = {
  year: "roots",
  month: "career palace",
  day: "home palace",
  hour: "horizon",
};

describe("factTag correctness", () => {
  it("transit lines tag the branch pair and the palace word", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        const reading = dailyReading(dailyFactSet(interaction, palace, "daily"), "tag-seed");
        const transitLine = reading.lines.find((line) => lineFactTag(line)?.includes("·"));
        expect(transitLine, `${interaction}/${palace}`).toBeDefined();
        const tag = lineFactTag(transitLine!) as string;
        expect(tag, "contains branch pair").toContain("rat–horse");
        expect(tag, "contains palace word").toContain(PALACE_WORD[palace as Palace] as string);
      }
    }
  });

  it("the calibration example produces the expected tag", () => {
    const facts: ReadingFact[] = [
      {
        kind: "transit-interaction",
        interaction: "six-clash",
        branches: ["子", "午"],
        natalPalaces: ["month"],
        transitPalace: "daily",
        transitBranch: "午",
      },
    ];
    const reading = dailyReading(facts, "seed");
    expect(lineFactTag(reading.lines[0]!)).toBe("rat–horse clash · career palace");
  });

  it("agency lines carry a null factTag", () => {
    const reading = dailyReading(dailyFactSet("six-clash", "month", "daily"), "seed");
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
