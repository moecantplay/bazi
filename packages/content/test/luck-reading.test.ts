/**
 * Luck-pillar content: `luckPillarReading` delegates to horizon-reading's
 * shared `periodLines`, keyed to the "luck" period. The theme/element/transit
 * template selection itself is already exhaustively covered for every
 * ten-god and element via horizons.test.ts (annual/monthly exercise the same
 * generic builder `luckPillarReading` calls) — these tests only check the
 * "luck" period's own wording ("This decade"/"decade") and the new export's
 * wiring, not re-prove template coverage that's already proven period-agnostic.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { luckPillarReading } from "../src/index.js";
import { assertGlossed, lineFactTag, lineText } from "./token-utils.js";

const THEME: ReadingFact = { kind: "ten-god-period", period: "luck", god: "劫财", english: "Rob Wealth" };
const ELEMENT: ReadingFact = { kind: "element-period", period: "luck", element: "earth", favorable: true };
const TRANSIT: ReadingFact = {
  kind: "transit-interaction",
  interaction: "six-combine",
  branches: ["卯", "戌"],
  natalPalaces: ["year"],
  transitPalace: "luck",
  transitBranch: "卯",
};

describe("luckPillarReading", () => {
  it("reads a theme, an element, and a transit line", () => {
    const lines = luckPillarReading([THEME, ELEMENT, TRANSIT], "seed");
    expect(lines).toHaveLength(3);
  });

  it("speaks in the decade's own tense — 'This decade'/'decade', not year or month", () => {
    const lines = luckPillarReading([THEME, ELEMENT], "seed");
    expect(lineText(lines[0]!)).toMatch(/decade/);
    expect(lineText(lines[1]!)).toMatch(/decade/);
    expect(lineFactTag(lines[0]!)).toContain("decade");
  });

  it("reads two lines when no pillar touches a natal palace", () => {
    const lines = luckPillarReading([THEME, ELEMENT], "seed");
    expect(lines).toHaveLength(2);
  });

  it("gives every line a non-null factTag and fully glossed runs", () => {
    const lines = luckPillarReading([THEME, ELEMENT, TRANSIT], "seed");
    for (const line of lines) {
      expect(lineFactTag(line), lineText(line)).not.toBeNull();
      assertGlossed(line.runs);
      assertGlossed(line.factTagRuns!);
    }
  });

  it("is deterministic for the same facts and seedKey", () => {
    const facts = [THEME, ELEMENT, TRANSIT];
    expect(luckPillarReading(facts, "same")).toEqual(luckPillarReading(facts, "same"));
  });
});
