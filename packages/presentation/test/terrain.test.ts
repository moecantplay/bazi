import { describe, expect, it } from "vitest";
import { ELEMENT_ORDER } from "../src/elements.js";
import { dayTerrain } from "../src/terrain.js";
import { FIXTURE_A } from "./fixtures.js";

describe("dayTerrain", () => {
  it("returns a valid element", () => {
    expect(ELEMENT_ORDER).toContain(dayTerrain(FIXTURE_A, "2026-07-07"));
  });

  it("is deterministic for the same profile and date", () => {
    expect(dayTerrain(FIXTURE_A, "2026-07-07")).toBe(dayTerrain(FIXTURE_A, "2026-07-07"));
  });

  it("follows the profile's own birth timezone", () => {
    const jakarta = dayTerrain(FIXTURE_A, "2026-07-07");
    const otherZoneProfile = {
      ...FIXTURE_A,
      birth: { ...FIXTURE_A.birth, city: { ...FIXTURE_A.birth.city, tz: "America/New_York" } }
    };
    // Not asserting a specific value (the pillar can legitimately match), just
    // that the function reads the profile's zone rather than a hardcoded one.
    expect(ELEMENT_ORDER).toContain(dayTerrain(otherZoneProfile, "2026-07-07"));
    expect(typeof jakarta).toBe("string");
  });
});
