import { describe, expect, it } from "vitest";
import { mapHeroSummary } from "../src/map-hero.js";
import type { RouteWaypoint } from "../src/route-waypoints.js";

const CROSSING: RouteWaypoint = { interaction: "six-clash", transitBranch: "子", crossing: true };
const PLAIN: RouteWaypoint = { interaction: "six-combine", transitBranch: "丑", crossing: false };

describe("mapHeroSummary", () => {
  it("counts marked crossings among the waypoints", () => {
    expect(mapHeroSummary([CROSSING, PLAIN], "even").crossingCount).toBe(1);
    expect(mapHeroSummary([PLAIN], "even").crossingCount).toBe(0);
  });

  it("labels a favoured day as a clear stretch", () => {
    expect(mapHeroSummary([], "favoured").ariaLabel).toContain("clear stretch");
  });

  it("labels a friction day as a slower stretch", () => {
    expect(mapHeroSummary([], "friction").ariaLabel).toContain("slower stretch");
  });

  it("labels an even day as an even stretch", () => {
    expect(mapHeroSummary([], "even").ariaLabel).toContain("even stretch");
  });

  it("mentions crossing count only when there are crossings, pluralizing correctly", () => {
    expect(mapHeroSummary([], "even").ariaLabel).not.toContain("crossing");
    expect(mapHeroSummary([CROSSING], "even").ariaLabel).toContain("1 marked crossing");
    expect(mapHeroSummary([CROSSING, CROSSING], "even").ariaLabel).toContain("2 marked crossings");
  });
});
