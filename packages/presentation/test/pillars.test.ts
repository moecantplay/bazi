import { describe, expect, it } from "vitest";
import { computePillars, isYearInRange, MAX_BIRTH_YEAR, MIN_BIRTH_YEAR } from "../src/pillars.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

describe("computePillars", () => {
  it("matches Fixture A's golden pillars (甲戌 丙子 戊辰 庚申)", () => {
    const pillars = computePillars(FIXTURE_A.birth, FIXTURE_A.config);
    expect(pillars.year.stem).toBe("甲");
    expect(pillars.year.branch).toBe("戌");
    expect(pillars.month.stem).toBe("丙");
    expect(pillars.month.branch).toBe("子");
    expect(pillars.day.stem).toBe("戊");
    expect(pillars.day.branch).toBe("辰");
    expect(pillars.hour?.stem).toBe("庚");
    expect(pillars.hour?.branch).toBe("申");
  });

  it("produces no hour pillar when the birth time is unknown", () => {
    const pillars = computePillars(FIXTURE_UNKNOWN_TIME.birth, FIXTURE_UNKNOWN_TIME.config);
    expect(pillars.hour).toBeNull();
  });

  it("is deterministic for the same input", () => {
    const a = computePillars(FIXTURE_A.birth, FIXTURE_A.config);
    const b = computePillars(FIXTURE_A.birth, FIXTURE_A.config);
    expect(a).toEqual(b);
  });
});

describe("isYearInRange", () => {
  it("accepts the inclusive table bounds", () => {
    expect(isYearInRange(`${MIN_BIRTH_YEAR}-01-01`)).toBe(true);
    expect(isYearInRange(`${MAX_BIRTH_YEAR}-12-31`)).toBe(true);
  });

  it("rejects years outside the table", () => {
    expect(isYearInRange(`${MIN_BIRTH_YEAR - 1}-12-31`)).toBe(false);
    expect(isYearInRange(`${MAX_BIRTH_YEAR + 1}-01-01`)).toBe(false);
  });
});
