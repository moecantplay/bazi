import { describe, expect, it } from "vitest";
import { mapHeroSummary } from "../src/map-hero.js";
import type { RouteWaypoint } from "../src/route-waypoints.js";

const ALL_DAY = { kind: "all-day" } as const;
const CROSSING: RouteWaypoint = { interaction: "six-clash", transitBranch: "子", crossing: true, timing: ALL_DAY };
const PLAIN: RouteWaypoint = { interaction: "six-combine", transitBranch: "丑", crossing: false, timing: ALL_DAY };
const ROUGH_HOUR: RouteWaypoint = {
  interaction: "six-clash",
  transitBranch: "寅",
  crossing: true,
  timing: { kind: "hours", startHour: 3, endHour: 5, label: "3–5 am", progress: 0.2 }
};
const EASY_HOUR: RouteWaypoint = {
  interaction: "six-combine",
  transitBranch: "巳",
  crossing: false,
  timing: { kind: "hours", startHour: 9, endHour: 11, label: "9–11 am", progress: 0.25 }
};

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
    expect(mapHeroSummary([CROSSING], "even").ariaLabel).toContain("1 day-long crossing");
    expect(mapHeroSummary([CROSSING, CROSSING], "even").ariaLabel).toContain("2 day-long crossings");
  });

  it("counts only day-long crossings — a timed rough hour is named by its clock window instead", () => {
    const summary = mapHeroSummary([CROSSING, ROUGH_HOUR, EASY_HOUR], "even");
    expect(summary.crossingCount).toBe(1);
    expect(summary.ariaLabel).toBe(
      "Today's route: an even stretch, 1 day-long crossing, rough hour 3–5 am, easy hour 9–11 am"
    );
  });
});
