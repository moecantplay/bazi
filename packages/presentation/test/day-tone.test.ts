import { describe, expect, it } from "vitest";
import { dayTone } from "../src/day-tone.js";
import { FIXTURE_A } from "./fixtures.js";

describe("dayTone", () => {
  it("returns one of the three tone directions", () => {
    expect(["favoured", "friction", "even"]).toContain(dayTone(FIXTURE_A, "2026-07-07"));
  });

  it("is deterministic for the same profile and date", () => {
    expect(dayTone(FIXTURE_A, "2026-07-07")).toBe(dayTone(FIXTURE_A, "2026-07-07"));
  });

  it("can vary across different dates", () => {
    const tones = new Set<string>();
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-07-${String(day).padStart(2, "0")}`;
      tones.add(dayTone(FIXTURE_A, iso));
    }
    expect(tones.size).toBeGreaterThan(1);
  });
});
