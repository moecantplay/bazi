/**
 * Comparison reading: coverage across every fact kind/variant, factTag shape,
 * cap on interaction lines, and determinism.
 */

import { describe, expect, it } from "vitest";
import type { CompareFact } from "@daymaster/bazi-engine";
import { compareReading } from "../src/index.js";
import { compareFactSet } from "./collect.js";

const SEED = "compare-seed";

describe("compareReading", () => {
  it("leads with three day-master lines: relation, then both ten-god directions", () => {
    const reading = compareReading(compareFactSet(), SEED);
    expect(reading.lines[0]?.factTag).toBe("戊 × 甲 · day-masters");
    expect(reading.lines[1]?.text).toContain("they read as Seven Killings");
    expect(reading.lines[1]?.text).toContain("pressure that trains you");
    expect(reading.lines[2]?.text).toContain("you read as Indirect Wealth");
  });

  it("caps interaction lines and keeps support lines last", () => {
    const reading = compareReading(compareFactSet(), SEED);
    const interactionLines = reading.lines.filter((line) => line.factTag?.includes("×"));
    // day-masters tag also contains ×; interactions carry "your ... × their ..."
    const crossLines = reading.lines.filter((line) => line.factTag?.includes("your "));
    expect(crossLines.length).toBe(3);
    expect(interactionLines.length).toBeGreaterThanOrEqual(3);
    const last = reading.lines[reading.lines.length - 1];
    expect(last?.factTag).toContain("support");
  });

  it("tags cross interactions with both people's palaces", () => {
    const facts: CompareFact[] = [
      {
        kind: "compare-interaction",
        interaction: "six-clash",
        branches: ["子", "午"],
        aPalace: "month",
        bPalace: "hour",
      },
    ];
    const reading = compareReading(facts, SEED);
    expect(reading.lines[0]?.factTag).toBe("子午 clash · your career palace × their horizon");
    expect(reading.lines[0]?.text).not.toMatch(/\{a|\{b|\{element/);
  });

  it("gives the mirror punishment its own phrasing", () => {
    const facts: CompareFact[] = [
      {
        kind: "compare-interaction",
        interaction: "punishment",
        punishmentKind: "self",
        branches: ["辰", "辰"],
        aPalace: "day",
        bPalace: "day",
      },
    ];
    const reading = compareReading(facts, SEED);
    expect(reading.lines[0]?.text).toMatch(/mirror|both carry/);
  });

  it("renders every template placeholder (no braces leak)", () => {
    for (const seed of ["s1", "s2", "s3"]) {
      for (const line of compareReading(compareFactSet(), seed).lines) {
        expect(line.text).not.toMatch(/[{}]/);
        expect(line.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("is deterministic in (facts, seedKey)", () => {
    const first = compareReading(compareFactSet(), SEED);
    const second = compareReading(compareFactSet(), SEED);
    expect(second).toEqual(first);
    const other = compareReading(compareFactSet(), "another-seed");
    expect(other.lines.length).toBe(first.lines.length);
  });
});
