import { describe, expect, it } from "vitest";
import { plainGloss } from "@daymaster/content";
import { dailyBundleFor, dailySeedKey, natalReadingFor } from "../src/reading.js";
import { natalSeedKey } from "../src/seed-key.js";
import { FIXTURE_A } from "./fixtures.js";

describe("dailySeedKey", () => {
  it("appends the date to the natal seed key", () => {
    expect(dailySeedKey(FIXTURE_A, "2026-07-07")).toBe(`${natalSeedKey(FIXTURE_A)}|2026-07-07`);
  });
});

describe("natalReadingFor", () => {
  it("returns a natal reading with sections", () => {
    const reading = natalReadingFor(FIXTURE_A);
    expect(reading.sections.length).toBeGreaterThan(0);
  });

  it("is deterministic for the same profile", () => {
    expect(natalReadingFor(FIXTURE_A)).toEqual(natalReadingFor(FIXTURE_A));
  });
});

describe("dailyBundleFor", () => {
  it("bundles the day pillar, facts, and reading for one date", () => {
    const bundle = dailyBundleFor(FIXTURE_A, "2026-07-07");
    expect(bundle.dayPillar.stem.length).toBeGreaterThan(0);
    expect(Array.isArray(bundle.facts)).toBe(true);
    expect(plainGloss(bundle.reading.headline.runs).length).toBeGreaterThan(0);
  });

  it("is deterministic for the same profile and date", () => {
    const first = dailyBundleFor(FIXTURE_A, "2026-07-07");
    const second = dailyBundleFor(FIXTURE_A, "2026-07-07");
    expect(first.reading).toEqual(second.reading);
    expect(first.facts).toEqual(second.facts);
  });

  it("varies the reading by date", () => {
    const first = dailyBundleFor(FIXTURE_A, "2026-07-07");
    const second = dailyBundleFor(FIXTURE_A, "2026-08-01");
    expect(first.dayPillar).not.toEqual(second.dayPillar);
  });
});
