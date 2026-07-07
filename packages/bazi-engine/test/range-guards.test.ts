import { describe, expect, it } from "vitest";
import {
  annualPillar,
  dailyPillar,
  findGoverningTerm,
  monthPillar,
  yearPillar,
} from "../src/index.js";

// The embedded solar-term table spans 小寒 1900 (1900-01-05) through 大雪 2100
// (2100-12-07). Instants past the final jié must fail rather than silently clamp
// to the last entry, symmetrically with the pre-1900 lower bound.
const PAST_TABLE = new Date("2101-06-15T00:00:00Z");
const BEFORE_TABLE = new Date("1850-01-01T00:00:00Z");
const IN_RANGE = new Date("2100-06-15T00:00:00Z"); // before 大雪 2100

describe("solar-term upper bound", () => {
  it("throws RangeError past the final 2100 jié", () => {
    expect(() => findGoverningTerm(PAST_TABLE)).toThrow(RangeError);
    expect(() => yearPillar(PAST_TABLE, "UTC")).toThrow(RangeError);
    expect(() => monthPillar(PAST_TABLE, "UTC")).toThrow(RangeError);
  });

  it("still throws RangeError below the 1900 lower bound", () => {
    expect(() => findGoverningTerm(BEFORE_TABLE)).toThrow(RangeError);
    expect(() => yearPillar(BEFORE_TABLE, "UTC")).toThrow(RangeError);
    expect(() => monthPillar(BEFORE_TABLE, "UTC")).toThrow(RangeError);
  });

  it("still resolves an in-range 2100 instant", () => {
    expect(() => yearPillar(IN_RANGE, "UTC")).not.toThrow();
    expect(() => monthPillar(IN_RANGE, "UTC")).not.toThrow();
  });
});

describe("annualPillar range guard", () => {
  it("throws for years outside 1900–2100", () => {
    expect(() => annualPillar(2101)).toThrow(RangeError);
    expect(() => annualPillar(1899)).toThrow(RangeError);
  });

  it("accepts the inclusive bounds", () => {
    expect(() => annualPillar(1900)).not.toThrow();
    expect(() => annualPillar(2100)).not.toThrow();
  });
});

describe("dailyPillar range guard", () => {
  it("throws for dates outside 1900–2100", () => {
    expect(() => dailyPillar("2101-01-01", "UTC")).toThrow(RangeError);
    expect(() => dailyPillar("1899-12-31", "UTC")).toThrow(RangeError);
  });

  it("accepts an in-range date", () => {
    expect(() => dailyPillar("2100-06-01", "UTC")).not.toThrow();
  });
});
