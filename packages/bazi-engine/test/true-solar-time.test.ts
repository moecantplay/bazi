import { describe, expect, it } from "vitest";
import { applyTrueSolarTime, equationOfTimeMinutes } from "../src/index.js";

function utc(iso: string): Date {
  return new Date(iso);
}

describe("equationOfTimeMinutes", () => {
  it("stays within ±20 minutes all year round", () => {
    for (let month = 1; month <= 12; month += 1) {
      const iso = `2023-${String(month).padStart(2, "0")}-15T12:00:00Z`;
      const eot = equationOfTimeMinutes(utc(iso));
      expect(Math.abs(eot)).toBeLessThanOrEqual(20);
    }
  });

  it("is about +16 minutes in early November (sundial ahead)", () => {
    const eot = equationOfTimeMinutes(utc("2023-11-03T12:00:00Z"));
    expect(eot).toBeGreaterThan(12);
    expect(eot).toBeLessThan(20);
  });

  it("is negative in mid-February (sundial behind)", () => {
    expect(equationOfTimeMinutes(utc("2023-02-11T12:00:00Z"))).toBeLessThan(-10);
  });
});

describe("applyTrueSolarTime", () => {
  it("advances a location east of its timezone meridian", () => {
    // Zone UTC → reference meridian 0°. Longitude 15°E → +60 min of longitude
    // correction; mid-April equation of time is ≈ 0, so the shift is ≈ +60 min.
    const instant = utc("2023-04-15T12:00:00Z");
    const shifted = applyTrueSolarTime(instant, "UTC", 15);
    const shiftMinutes = (shifted.getTime() - instant.getTime()) / 60_000;
    expect(shiftMinutes).toBeGreaterThan(55);
    expect(shiftMinutes).toBeLessThan(65);
  });

  it("retards a location west of its timezone meridian", () => {
    const instant = utc("2023-04-15T12:00:00Z");
    const shifted = applyTrueSolarTime(instant, "UTC", -15);
    expect(shifted.getTime()).toBeLessThan(instant.getTime());
  });
});
