/**
 * Agency lines: always present, concrete, imperative, rendered last, and biased
 * toward the palace a transit touches (VOICE.md §6).
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading } from "../src/index.js";
import { AGENCY_POOLS, agencyTagForPalace } from "../src/banks/agency.js";
import { dailyFactSet } from "./collect.js";

describe("agency", () => {
  it("is always present, even with no facts", () => {
    const reading = dailyReading([], "seed");
    expect(reading.agency.text.length).toBeGreaterThan(0);
    expect(reading.agency.factTag).toBeNull();
  });

  it("draws from the pool that echoes the transit's natal palace", () => {
    // A career-palace (month) transit should draw a career-shaped action.
    const facts = dailyFactSet("six-clash", "month", "daily");
    const reading = dailyReading(facts, "career-echo");
    expect(AGENCY_POOLS.career).toContain(reading.agency.text);
  });

  it("falls back to the general pool when no transit is present", () => {
    const facts: ReadingFact[] = [
      { kind: "element-day", element: "wood", favorable: true },
      { kind: "ten-god-day", god: "比肩", english: "Friend" },
    ];
    const reading = dailyReading(facts, "general-echo");
    expect(AGENCY_POOLS.general).toContain(reading.agency.text);
  });

  it("maps each natal palace to its expected pool", () => {
    expect(agencyTagForPalace("year")).toBe("roots");
    expect(agencyTagForPalace("month")).toBe("career");
    expect(agencyTagForPalace("day")).toBe("home");
    expect(agencyTagForPalace("hour")).toBe("horizon");
    expect(agencyTagForPalace("annual")).toBe("general");
  });

  it("every agency line reads as a concrete instruction", () => {
    for (const pool of Object.values(AGENCY_POOLS)) {
      for (const line of pool) {
        expect(line.length).toBeGreaterThan(0);
        expect(line.at(-1), `ends with punctuation: "${line}"`).toBe(".");
        // Imperative: starts with a capitalised verb, not "You".
        expect(line, `not second-person declarative: "${line}"`).not.toMatch(/^You\b/);
      }
    }
  });
});
