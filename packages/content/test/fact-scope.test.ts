/**
 * M24-03: Today's reading takes a day's facts only. A year's facts are a type
 * error, so they can't leak onto Today again (2026-08-21).
 */

import { describe, expect, it } from "vitest";
import { annualPillarFacts, computeChart, dailyFacts } from "@daymaster/bazi-engine";
import { dailyReading } from "../src/index.js";

const chart = computeChart({
  instant: new Date("1994-12-08T16:30:00+07:00"),
  zone: "Asia/Jakarta",
  sex: "male",
  hourKnown: true
});
const SEED = { chart: "chart-seed", date: "2026-06-15" };

describe("dailyReading's input", () => {
  it("takes a day's facts", () => {
    expect(dailyReading(dailyFacts(chart, "2026-06-15", "Asia/Jakarta"), SEED).headline.runs.length).toBeGreaterThan(0);
  });

  it("refuses a year's facts at compile time", () => {
    const yearFacts = annualPillarFacts(chart, 2026).facts;
    // @ts-expect-error a year fact is not a day fact
    expect(() => dailyReading(yearFacts, SEED)).not.toThrow();
  });
});
