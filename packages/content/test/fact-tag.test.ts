/**
 * factTag correctness: transit lines carry a tag containing the branch pair and
 * the palace word; pure-voice lines (agency, luck) carry null.
 */

import { describe, expect, it } from "vitest";
import type { Palace, ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading, luckTransitionLines, natalReading } from "../src/index.js";
import { INTERACTIONS, NATAL_PALACES, dailyFactSet } from "./collect.js";

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
        const transitLine = reading.lines.find((line) => line.factTag?.includes("·"));
        expect(transitLine, `${interaction}/${palace}`).toBeDefined();
        const tag = transitLine!.factTag as string;
        expect(tag, "contains branch pair").toContain("子午");
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
      },
    ];
    const reading = dailyReading(facts, "seed");
    expect(reading.lines[0]?.factTag).toBe("子午 clash · career palace");
  });

  it("agency lines carry a null factTag", () => {
    const reading = dailyReading(dailyFactSet("six-clash", "month", "daily"), "seed");
    expect(reading.agency.factTag).toBeNull();
  });

  it("luck lines carry a null factTag and substitute the ages", () => {
    const lines = luckTransitionLines({ fromAge: 33, toAge: 43 }, "seed");
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines.length).toBeLessThanOrEqual(2);
    for (const line of lines) {
      expect(line.factTag).toBeNull();
      expect(line.text).not.toMatch(/\{from\}|\{to\}/);
      expect(line.text).toMatch(/33|43/);
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
    expect(line?.factTag).toContain("子午");
    expect(line?.factTag).toContain("clash");
  });
});
