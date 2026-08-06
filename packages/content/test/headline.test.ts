/**
 * Headline hooks: keyed to the same fact the reading leads with (first shown
 * transit, else the element day, else generic), pure voice (no factTag, no Han),
 * deterministic in the seedKey, with variety across seeds.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading } from "../src/index.js";
import {
  ELEMENT_HEADLINES,
  GENERIC_HEADLINES,
  INTERACTION_HEADLINES,
} from "../src/banks/headlines.js";
import { INTERACTIONS, dailyFactSet } from "./collect.js";
import { lineFactTag, lineText } from "./token-utils.js";

function elementOnlyFacts(favorable: boolean): ReadingFact[] {
  return [{ kind: "element-day", element: "wood", favorable }];
}

describe("daily reading headline", () => {
  it("keys off the leading transit interaction's kind", () => {
    for (const interaction of INTERACTIONS) {
      const reading = dailyReading(dailyFactSet(interaction, "day", "daily"), "seed");
      expect(
        INTERACTION_HEADLINES[interaction],
        `headline pool for ${interaction}`,
      ).toContain(lineText(reading.headline));
    }
  });

  it("prefers a transit of the day itself over a year theme", () => {
    const annualClash: ReadingFact = {
      kind: "transit-interaction",
      interaction: "six-clash",
      branches: ["子", "午"],
      natalPalaces: ["month"],
      transitPalace: "annual",
      transitBranch: "午",
    };
    const dailyCombine: ReadingFact = {
      kind: "transit-interaction",
      interaction: "six-combine",
      branches: ["子", "丑"],
      natalPalaces: ["day"],
      transitPalace: "daily",
      transitBranch: "丑",
    };
    const reading = dailyReading([annualClash, dailyCombine], "seed");
    expect(INTERACTION_HEADLINES["six-combine"]).toContain(lineText(reading.headline));
  });

  it("falls back to the element day when no transit interaction lands", () => {
    const favorable = dailyReading(elementOnlyFacts(true), "seed");
    expect(ELEMENT_HEADLINES.favorable).toContain(lineText(favorable.headline));
    const unfavorable = dailyReading(elementOnlyFacts(false), "seed");
    expect(ELEMENT_HEADLINES.unfavorable).toContain(lineText(unfavorable.headline));
  });

  it("falls back to a generic hook when nothing in the chart raises its voice", () => {
    const reading = dailyReading([], "seed");
    expect(GENERIC_HEADLINES).toContain(lineText(reading.headline));
  });

  it("cites nothing — headlines are pure voice", () => {
    const reading = dailyReading(dailyFactSet("six-clash", "day", "daily"), "seed");
    expect(lineFactTag(reading.headline)).toBeNull();
    expect(reading.headline.topic).toBeUndefined();
  });

  it("contains no Han characters, so the Han toggle never changes it", () => {
    const pools = [
      ...Object.values(INTERACTION_HEADLINES).flat(),
      ...Object.values(ELEMENT_HEADLINES).flat(),
      ...GENERIC_HEADLINES,
    ];
    for (const text of pools) {
      expect(text).not.toMatch(/[㐀-鿿]/);
    }
  });

  it("is deterministic in the seedKey and varies across seeds", () => {
    const facts = dailyFactSet("six-combine", "month", "daily");
    expect(dailyReading(facts, "same").headline).toEqual(dailyReading(facts, "same").headline);
    const seen = new Set<string>();
    for (let index = 0; index < 20; index += 1) {
      seen.add(lineText(dailyReading(facts, `seed-${index}`).headline));
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});
