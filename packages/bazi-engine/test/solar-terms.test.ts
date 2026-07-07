import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { SOLAR_TERMS } from "../src/index.js";
import { solarTermsForRange, solarTermsForYear } from "../src/solar-term-search.js";

/** Absolute difference in whole days between two calendar dates. */
function daysApart(isoA: string, isoB: string): number {
  const a = DateTime.fromISO(isoA, { zone: "utc" }).startOf("day");
  const b = DateTime.fromISO(isoB, { zone: "utc" }).startOf("day");
  return Math.abs(a.diff(b, "days").days);
}

/** The China-local calendar date (YYYY-MM-DD) of a UTC instant. */
function chinaDate(iso: string): string {
  return DateTime.fromISO(iso, { zone: "Asia/Shanghai" }).toISODate() ?? "";
}

function termInYear(year: number, name: string): string {
  const entry = solarTermsForYear(year).find((term) => term.name === name);
  if (entry === undefined) {
    throw new Error(`Missing ${name} in ${year}`);
  }
  return entry.iso;
}

describe("solar-term search anchors (±1 day, local sense)", () => {
  it("立春 1994 falls on 1994-02-04", () => {
    expect(daysApart(chinaDate(termInYear(1994, "立春")), "1994-02-04")).toBeLessThanOrEqual(1);
  });

  it("大雪 1994 falls on 1994-12-07", () => {
    expect(daysApart(chinaDate(termInYear(1994, "大雪")), "1994-12-07")).toBeLessThanOrEqual(1);
  });

  it("立春 2026 falls on 2026-02-04", () => {
    expect(daysApart(chinaDate(termInYear(2026, "立春")), "2026-02-04")).toBeLessThanOrEqual(1);
  });
});

describe("embedded solar-term table", () => {
  it("has 201 years × 12 terms = 2412 entries", () => {
    expect(SOLAR_TERMS.length).toBe(2412);
  });

  it("is strictly increasing in instant", () => {
    for (let index = 1; index < SOLAR_TERMS.length; index += 1) {
      const previous = Date.parse(SOLAR_TERMS[index - 1]!.iso);
      const current = Date.parse(SOLAR_TERMS[index]!.iso);
      expect(current).toBeGreaterThan(previous);
    }
  });

  it("covers the full 1900–2100 range", () => {
    expect(SOLAR_TERMS[0]!.iso.startsWith("1900")).toBe(true);
    expect(SOLAR_TERMS.at(-1)!.iso.startsWith("2100")).toBe(true);
  });
});

describe("solarTermsForRange", () => {
  it("produces 12 terms per year in strictly increasing order", () => {
    const range = solarTermsForRange(2000, 2002);
    expect(range).toHaveLength(36);
    for (let index = 1; index < range.length; index += 1) {
      expect(Date.parse(range[index]!.iso)).toBeGreaterThan(Date.parse(range[index - 1]!.iso));
    }
  });
});
