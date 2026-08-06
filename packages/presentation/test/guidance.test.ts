import { describe, expect, it } from "vitest";
import { dayGuidanceFor } from "../src/guidance.js";
import { FIXTURE_A } from "./fixtures.js";

describe("dayGuidanceFor", () => {
  it("bundles quality, chips, and lines for one date", () => {
    const guidance = dayGuidanceFor(FIXTURE_A, "2026-07-07");
    expect(Array.isArray(guidance.quality.assessments)).toBe(true);
    expect(Array.isArray(guidance.chips)).toBe(true);
    expect(Array.isArray(guidance.lines)).toBe(true);
  });

  it("is deterministic for the same profile and date", () => {
    const first = dayGuidanceFor(FIXTURE_A, "2026-07-07");
    const second = dayGuidanceFor(FIXTURE_A, "2026-07-07");
    expect(first.chips).toEqual(second.chips);
    expect(first.lines).toEqual(second.lines);
  });
});
