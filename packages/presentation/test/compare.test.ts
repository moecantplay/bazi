import { describe, expect, it } from "vitest";
import { compareBundleFor } from "../src/compare.js";
import { FIXTURE_A, JAKARTA } from "./fixtures.js";

const COMPANION = { date: "1996-03-14", time: "08:15", city: JAKARTA, sex: "female" as const };

describe("compareBundleFor", () => {
  it("returns a companion chart, comparison facts, and a reading", () => {
    const bundle = compareBundleFor(FIXTURE_A, COMPANION);
    expect(bundle.companionChart.day.stem.length).toBeGreaterThan(0);
    expect(Array.isArray(bundle.facts)).toBe(true);
    expect(bundle.reading).toBeDefined();
  });

  it("is deterministic for the same profile and companion", () => {
    const first = compareBundleFor(FIXTURE_A, COMPANION);
    const second = compareBundleFor(FIXTURE_A, COMPANION);
    expect(first.facts).toEqual(second.facts);
    expect(first.reading).toEqual(second.reading);
  });

  it("computes the companion under the primary profile's engine config", () => {
    const unknownTimeCompanion = { ...COMPANION, time: null };
    const bundle = compareBundleFor(FIXTURE_A, unknownTimeCompanion);
    expect(bundle.companionChart.hour).toBeNull();
  });
});
