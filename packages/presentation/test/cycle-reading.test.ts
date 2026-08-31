import { describe, expect, it } from "vitest";
import { annualReadingFor, monthlyReadingFor } from "../src/cycle-reading.js";
import { FIXTURE_A } from "./fixtures.js";

describe("annualReadingFor", () => {
  it("reads the 丙午 pillar for the selected year 2026", () => {
    const reading = annualReadingFor(FIXTURE_A, 2026);
    expect(`${reading.pillar.stem}${reading.pillar.branch}`).toBe("丙午");
    expect(reading.year).toBe(2026);
    expect(reading.lines.length).toBeGreaterThanOrEqual(2);
  });

  it("is deterministic for the same profile and year", () => {
    expect(annualReadingFor(FIXTURE_A, 2026)).toEqual(annualReadingFor(FIXTURE_A, 2026));
  });

  it("reads a different pillar (and can read differently) for a different year", () => {
    const first = annualReadingFor(FIXTURE_A, 2026);
    const second = annualReadingFor(FIXTURE_A, 2027);
    expect(`${second.pillar.stem}${second.pillar.branch}`).not.toBe(
      `${first.pillar.stem}${first.pillar.branch}`,
    );
  });
});

describe("monthlyReadingFor", () => {
  it("reads the 甲午 pillar for June 2026", () => {
    const reading = monthlyReadingFor(FIXTURE_A, 2026, 6);
    expect(`${reading.pillar.stem}${reading.pillar.branch}`).toBe("甲午");
    expect(reading.year).toBe(2026);
    expect(reading.month).toBe(6);
    expect(reading.lines.length).toBeGreaterThanOrEqual(2);
  });

  it("is deterministic for the same profile, year, and month", () => {
    expect(monthlyReadingFor(FIXTURE_A, 2026, 6)).toEqual(monthlyReadingFor(FIXTURE_A, 2026, 6));
  });
});
