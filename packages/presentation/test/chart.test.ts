import { describe, expect, it } from "vitest";
import { chartFor, chartForBirth } from "../src/chart.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

describe("chartFor", () => {
  it("derives a chart whose natal day pillar matches Fixture A's golden pillars", () => {
    const chart = chartFor(FIXTURE_A);
    expect(chart.day.stem).toBe("戊");
    expect(chart.day.branch).toBe("辰");
  });

  it("returns the same result for repeated calls (memoized)", () => {
    const first = chartFor(FIXTURE_A);
    const second = chartFor(FIXTURE_A);
    expect(second).toBe(first);
  });

  it("recomputes when the profile's birth details change", () => {
    const first = chartFor(FIXTURE_A);
    const second = chartFor(FIXTURE_UNKNOWN_TIME);
    expect(second).not.toBe(first);
    expect(second.hour).toBeNull();
  });
});

describe("chartForBirth", () => {
  it("computes a standalone chart for an arbitrary birth under a given config", () => {
    const chart = chartForBirth(FIXTURE_A.birth, FIXTURE_A.config);
    expect(chart.day.stem).toBe("戊");
    expect(chart.day.branch).toBe("辰");
  });

  it("is not memoized across calls", () => {
    const first = chartForBirth(FIXTURE_A.birth, FIXTURE_A.config);
    const second = chartForBirth(FIXTURE_A.birth, FIXTURE_A.config);
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });
});
