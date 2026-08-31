/**
 * Horizon content: the year/month/decade outlook reads as a theme line, an
 * element line, and (when a pillar touches a palace) one transit line — 2–3
 * lines, fact-tagged, deterministic, and strip-safe. Fixtures are hand-built
 * period facts so every ten-god theme and element weather is exercised.
 */

import { describe, expect, it } from "vitest";
import type { Element, ReadingFact } from "@daymaster/bazi-engine";
import { annualReading, monthlyReading } from "../src/index.js";
import { TEN_GOD_PERIOD_THEMES } from "../src/banks/horizons.js";
import { ELEMENTS, TEN_GODS } from "./collect.js";
import { assertGlossed, lineFactTag, lineText } from "./token-utils.js";

const CLASH: ReadingFact = {
  kind: "transit-interaction",
  interaction: "six-clash",
  branches: ["子", "午"],
  natalPalaces: ["month"],
  transitPalace: "annual",
  transitBranch: "午",
};

function themeFact(period: "annual" | "monthly", english: string, god = "測試"): ReadingFact {
  return { kind: "ten-god-period", period, god, english };
}

function elementFact(period: "annual" | "monthly", element: Element, favorable: boolean): ReadingFact {
  return { kind: "element-period", period, element, favorable };
}

const FULL_ANNUAL: ReadingFact[] = [
  themeFact("annual", "Eating God", "食神"),
  elementFact("annual", "fire", true),
  CLASH,
];

const FULL_MONTHLY: ReadingFact[] = [
  themeFact("monthly", "Direct Officer", "正官"),
  elementFact("monthly", "wood", false),
  { ...CLASH, transitPalace: "monthly", interaction: "six-combine" },
];

describe("annualReading / monthlyReading structure", () => {
  it("reads a theme, an element, and a transit line per period", () => {
    expect(annualReading(FULL_ANNUAL, "seed")).toHaveLength(3);
    expect(monthlyReading(FULL_MONTHLY, "seed")).toHaveLength(3);
  });

  it("reads two lines when no pillar touches a palace", () => {
    const annual = [themeFact("annual", "Eating God", "食神"), elementFact("annual", "fire", true)];
    const monthly = [themeFact("monthly", "Direct Officer", "正官"), elementFact("monthly", "wood", false)];
    expect(annualReading(annual, "seed")).toHaveLength(2);
    expect(monthlyReading(monthly, "seed")).toHaveLength(2);
  });

  it("gives every line a non-null factTag", () => {
    for (const line of [...annualReading(FULL_ANNUAL, "seed"), ...monthlyReading(FULL_MONTHLY, "seed")]) {
      expect(lineFactTag(line), lineText(line)).not.toBeNull();
    }
  });

  it("speaks each period in its own tense", () => {
    expect(lineText(annualReading(FULL_ANNUAL, "seed")[0]!)).toMatch(/year/);
    expect(lineText(monthlyReading(FULL_MONTHLY, "seed")[0]!)).toMatch(/month/);
  });
});

describe("annualReading / monthlyReading coverage", () => {
  it("every ten-god english opens on the classic and translates it in full", () => {
    for (const english of TEN_GODS) {
      const reading = annualReading([themeFact("annual", english)], "seed");
      const line = reading[0]!;
      const runs = line.runs;
      // The classical name is a term run (gloss-rendered, never its literal
      // english label) — structurally assert it exists and precedes the theme.
      const termIndex = runs.findIndex((run) => run.kind === "term" && run.term === english);
      expect(termIndex, `${english} term run`).toBeGreaterThanOrEqual(0);
      const themeIndex = runs.findIndex(
        (run) => run.kind === "text" && run.text.includes(TEN_GOD_PERIOD_THEMES[english]!),
      );
      expect(themeIndex, `${english} theme text`).toBeGreaterThanOrEqual(0);
      expect(lineText(line)).not.toMatch(/distinct ten-god note/);
      // Classic first, modern understanding after: the term run precedes the theme run.
      expect(termIndex, `classic must lead: "${lineText(line)}"`).toBeLessThan(themeIndex);
    }
  });

  it("an unknown ten-god english falls back to a safe generic theme", () => {
    const reading = annualReading([themeFact("annual", "Nonsense God")], "seed");
    expect(lineText(reading[0]!)).toMatch(/distinct ten-god note/);
    expect(lineFactTag(reading[0]!)).toBe("ten-god note · this year");
  });

  it("every element yields a favourable and an unfavourable line", () => {
    for (const element of ELEMENTS) {
      for (const favorable of [true, false]) {
        const reading = annualReading([elementFact("annual", element, favorable)], "seed");
        expect(lineText(reading[0]!).length, `${element}/${favorable}`).toBeGreaterThan(0);
        expect(lineFactTag(reading[0]!)).toContain("year");
      }
    }
  });
});

describe("annualReading / monthlyReading determinism", () => {
  it("is byte-identical for the same facts and seedKey", () => {
    expect(annualReading(FULL_ANNUAL, "same")).toEqual(annualReading(FULL_ANNUAL, "same"));
  });

  it("is runs-complete, with every term run glossed", () => {
    for (const line of [...annualReading(FULL_ANNUAL, "seed"), ...monthlyReading(FULL_MONTHLY, "seed")]) {
      expect(line.runs, lineText(line)).toBeDefined();
      assertGlossed(line.runs!);
      expect(line.factTagRuns, lineText(line)).toBeDefined();
      assertGlossed(line.factTagRuns!);
    }
  });
});
