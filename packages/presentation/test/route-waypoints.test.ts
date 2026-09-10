import { describe, expect, it } from "vitest";
import { textRun } from "@daymaster/content";
import { dailyBundleFor } from "../src/reading.js";
import { routeWaypointsFor } from "../src/route-waypoints.js";
import { FIXTURE_A } from "./fixtures.js";

describe("routeWaypointsFor", () => {
  it("returns no waypoints for a reading with no interaction lines and no hour facts", () => {
    expect(routeWaypointsFor([], [])).toEqual([]);
  });

  it("marks day-long relation waypoints as all-day and the hour facts as timed, in clock order", () => {
    // 2026-06-15 is a 申 day: rough hour 寅 3–5am (clamped to the MORNING end),
    // easy hour 巳 9–11am (0.25, within the gap, so nudged to 0.34).
    const bundle = dailyBundleFor(FIXTURE_A, "2026-06-15");
    const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts);
    const dayLong = waypoints.filter((waypoint) => waypoint.timing.kind === "all-day");
    const timed = waypoints.filter((waypoint) => waypoint.timing.kind === "hours");
    expect(dayLong.length).toBeLessThanOrEqual(2);
    expect(waypoints.slice(0, dayLong.length)).toEqual(dayLong);
    expect(timed.map((waypoint) => [waypoint.transitBranch, waypoint.crossing, waypoint.timing])).toEqual([
      ["寅", true, { kind: "hours", startHour: 3, endHour: 5, label: "3–5 am", progress: 0.2 }],
      ["巳", false, { kind: "hours", startHour: 9, endHour: 11, label: "9–11 am", progress: 0.34 }]
    ]);
  });

  it("nudges two timed marks apart when their blocks land on the same stretch", () => {
    // 2026-06-16 is a 酉 day: 卯 5–7am and 辰 7–9am both resolve near the MORNING end.
    const bundle = dailyBundleFor(FIXTURE_A, "2026-06-16");
    const timed = routeWaypointsFor(bundle.reading.lines, bundle.facts).filter(
      (waypoint) => waypoint.timing.kind === "hours"
    );
    const progresses = timed.map((waypoint) => (waypoint.timing.kind === "hours" ? waypoint.timing.progress : -1));
    expect(timed.map((waypoint) => waypoint.transitBranch)).toEqual(["卯", "辰"]);
    expect(progresses[0]).toBe(0.2);
    expect(progresses[1]).toBeCloseTo(0.34, 5);
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
      const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts).filter(
        (waypoint) => waypoint.timing.kind === "all-day"
      );
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

  it("caps day-long waypoints at two even when more interaction lines exist", () => {
    const results: number[] = [];
    for (let day = 1; day <= 60; day += 1) {
      const iso = `2026-0${day <= 31 ? 7 : 8}-${String(day <= 31 ? day : day - 31).padStart(2, "0")}`;
      const bundle = dailyBundleFor(FIXTURE_A, iso);
      const waypoints = routeWaypointsFor(bundle.reading.lines, bundle.facts).filter(
        (waypoint) => waypoint.timing.kind === "all-day"
      );
      results.push(waypoints.length);
    }
    expect(Math.max(...results)).toBeLessThanOrEqual(2);
  });
});
