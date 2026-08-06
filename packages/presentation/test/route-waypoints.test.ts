import { describe, expect, it } from "vitest";
import { textRun } from "@daymaster/content";
import { dailyBundleFor } from "../src/reading.js";
import { routeWaypointsFor } from "../src/route-waypoints.js";
import { FIXTURE_A } from "./fixtures.js";

describe("routeWaypointsFor", () => {
  it("returns no waypoints for a reading with no interaction lines", () => {
    expect(routeWaypointsFor([], [])).toEqual([]);
  });

  it("skips a line whose topic carries no interaction type", () => {
    const lines = [{ runs: textRun("x"), factTagRuns: null, topic: "interaction:" }];
    expect(routeWaypointsFor(lines, [])).toEqual([]);
  });

  it("skips an interaction line with no matching transit-interaction fact", () => {
    const lines = [
      { runs: textRun("x"), factTagRuns: textRun("no such tag"), topic: "interaction:six-clash" }
    ];
    expect(routeWaypointsFor(lines, [])).toEqual([]);
  });

  it("matches interaction lines back to their originating transit-interaction fact", () => {
    let matchedAny = false;
    for (let day = 1; day <= 28; day += 1) {
      const iso = `2026-07-${String(day).padStart(2, "0")}`;
      const bundle = dailyBundleFor(FIXTURE_A, iso);
      const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts);
      const interactionLineCount = bundle.reading.lines.filter((line) =>
        line.topic?.startsWith("interaction:")
      ).length;
      if (interactionLineCount === 0) {
        continue;
      }
      matchedAny = true;
      expect(waypoints.length).toBeGreaterThan(0);
      expect(waypoints.length).toBeLessThanOrEqual(2);
      for (const waypoint of waypoints) {
        expect(waypoint.transitBranch.length).toBeGreaterThan(0);
        expect(typeof waypoint.crossing).toBe("boolean");
      }
    }
    expect(matchedAny).toBe(true);
  });

  it("caps waypoints at two even when more interaction lines exist", () => {
    const results: number[] = [];
    for (let day = 1; day <= 60; day += 1) {
      const iso = `2026-0${day <= 31 ? 7 : 8}-${String(day <= 31 ? day : day - 31).padStart(2, "0")}`;
      const bundle = dailyBundleFor(FIXTURE_A, iso);
      const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts);
      results.push(waypoints.length);
    }
    expect(Math.max(...results)).toBeLessThanOrEqual(2);
  });
});
