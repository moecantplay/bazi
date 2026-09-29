/**
 * The Chart's element paragraph says one thing about balance (M20-17): a
 * dominant-element line only when the top element leads the next by 2 or
 * more, a balanced line only when it leads by at most 1 and nothing is
 * missing — never both (owner, 2026-09-29).
 */

import { describe, expect, it } from "vitest";
import { computeChart, natalFacts, type Element, type ReadingFact } from "@daymaster/bazi-engine";
import { BALANCED_LINES, DOMINANT_LINES, MISSING_LINES } from "../src/banks/elements.js";
import { natalReading } from "../src/index.js";
import { ELEMENTS } from "./collect.js";
import { lineText } from "./token-utils.js";

const SEED = "element-balance-seed";

type Counts = Record<Element, number>;

function elementLines(facts: ReadingFact[]): string[] {
  const section = natalReading(facts, SEED).sections.find((current) => current.key === "elements");
  return (section?.lines ?? []).map((line) => lineText(line));
}

function linesFor(counts: Counts): string[] {
  const dominant = ELEMENTS.reduce((best, element) => (counts[element] > counts[best] ? element : best));
  const missing = ELEMENTS.filter((element) => counts[element] === 0);
  return elementLines([{ kind: "element-balance", counts, dominant, missing }]);
}

const ALL_DOMINANT = new Set(Object.values(DOMINANT_LINES).flat());
const ALL_MISSING = new Set(Object.values(MISSING_LINES).flat());
const ALL_BALANCED = new Set(BALANCED_LINES);

const hasDominant = (lines: string[]) => lines.some((line) => ALL_DOMINANT.has(line));
const hasBalanced = (lines: string[]) => lines.some((line) => ALL_BALANCED.has(line));
const hasMissing = (lines: string[]) => lines.some((line) => ALL_MISSING.has(line));

function lead(counts: Counts): number {
  const sorted = Object.values(counts).sort((a, b) => b - a);
  return (sorted[0] ?? 0) - (sorted[1] ?? 0);
}

/** Every count vector with 0–5 of each element (6^5 = 7,776), excluding all-zero. */
function* everyCountVector(): Generator<Counts> {
  for (let n = 1; n < 6 ** 5; n += 1) {
    const digits = ELEMENTS.map((_, index) => Math.floor(n / 6 ** index) % 6);
    yield Object.fromEntries(ELEMENTS.map((element, index) => [element, digits[index]])) as Counts;
  }
}

describe("element balance (M20-17)", () => {
  it("never renders a dominant and a balanced line together, over every count vector", () => {
    for (const counts of everyCountVector()) {
      const lines = linesFor(counts);
      const label = JSON.stringify(counts);
      expect(hasDominant(lines) && hasBalanced(lines), label).toBe(false);
      expect(hasDominant(lines), label).toBe(lead(counts) >= 2);
      const nothingMissing = ELEMENTS.every((element) => counts[element] > 0);
      expect(hasBalanced(lines), label).toBe(nothingMissing && lead(counts) <= 1);
      expect(hasMissing(lines), label).toBe(!nothingMissing);
    }
  });

  it("a tie at the top is not a dominant element", () => {
    const lines = linesFor({ wood: 2, fire: 2, earth: 1, metal: 1, water: 1 });
    expect(hasDominant(lines)).toBe(false);
    expect(hasBalanced(lines)).toBe(true);
  });

  it("a clear leader with a missing element keeps both of its lines", () => {
    const lines = linesFor({ wood: 0, fire: 1, earth: 4, metal: 2, water: 1 });
    expect(hasDominant(lines)).toBe(true);
    expect(hasMissing(lines)).toBe(true);
  });

  it("Fixture A (Earth 3, Metal 2, the rest 1) reads balanced", () => {
    const chart = computeChart({
      instant: new Date("1994-12-08T09:30:00Z"), // 16:30 Asia/Jakarta
      zone: "Asia/Jakarta",
      sex: "male",
      hourKnown: true
    });
    const balance = natalFacts(chart).find((fact) => fact.kind === "element-balance");
    expect(balance).toMatchObject({ counts: { wood: 1, fire: 1, earth: 3, metal: 2, water: 1 } });

    const lines = elementLines(natalFacts(chart));
    expect(hasBalanced(lines)).toBe(true);
    expect(hasDominant(lines)).toBe(false);
  });
});
