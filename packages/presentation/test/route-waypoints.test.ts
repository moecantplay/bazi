import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { dailyBundleFor } from "../src/reading.js";
import { bestHourMarkFor, routeWaypointsFor } from "../src/route-waypoints.js";
import { addDays } from "../src/dates.js";
import { FIXTURE_A, READING_FIXTURES } from "./fixtures.js";

describe("routeWaypointsFor", () => {
  it("returns no waypoints when the day has no transit or hour facts", () => {
    expect(routeWaypointsFor([])).toEqual([]);
  });

  it("marks day-long relation waypoints as all-day and the hour facts as timed, in clock order", () => {
    // 2026-06-15 is a 申 day: Fixture A's best hour 丑 1–3am and the rough hour
    // 寅 3–5am both clamp to the MORNING end (0.2); the best hour comes first
    // in the day, so the rough hour is nudged to 0.34 and the easy hour 巳
    // 9–11am (0.25) on to 0.48 (M24-13: three marks spread together).
    const bundle = dailyBundleFor(FIXTURE_A, "2026-06-15");
    const waypoints = routeWaypointsFor(bundle.facts);
    const dayLong = waypoints.filter((waypoint) => waypoint.timing.kind === "all-day");
    const timed = waypoints.filter((waypoint) => waypoint.timing.kind === "hours");
    expect(dayLong.length).toBeLessThanOrEqual(2);
    expect(waypoints.slice(0, dayLong.length)).toEqual(dayLong);
    expect(timed.map((waypoint) => [waypoint.transitBranch, waypoint.crossing, waypoint.timing])).toEqual([
      ["寅", true, { kind: "hours", startHour: 3, endHour: 5, label: "3–5 am", progress: 0.34 }],
      ["巳", false, { kind: "hours", startHour: 9, endHour: 11, label: "9–11 am", progress: expect.closeTo(0.48, 5) }]
    ]);
    expect(timed.every((waypoint) => waypoint.area === "hours")).toBe(true);
  });

  it("nudges two timed marks apart when their blocks land on the same stretch", () => {
    // 2026-06-16 is a 酉 day: 卯 5–7am and 辰 7–9am both resolve near the MORNING end.
    // Fixture A's best hour that day is 酉 5–7pm, far from both.
    const bundle = dailyBundleFor(FIXTURE_A, "2026-06-16");
    const timed = routeWaypointsFor(bundle.facts).filter((waypoint) => waypoint.timing.kind === "hours");
    const progresses = timed.map((waypoint) => (waypoint.timing.kind === "hours" ? waypoint.timing.progress : -1));
    expect(timed.map((waypoint) => waypoint.transitBranch)).toEqual(["卯", "辰"]);
    expect(progresses[0]).toBe(0.2);
    expect(progresses[1]).toBeCloseTo(0.34, 5);
  });

  it("leads with the strongest relation, the same one Today's reading leads with", () => {
    const facts: ReadingFact[] = [
      { kind: "transit-interaction", interaction: "trine", branches: ["午", "戌"], natalPalaces: ["year"], transitPalace: "daily", transitBranch: "午" },
      { kind: "transit-interaction", interaction: "six-clash", branches: ["子", "午"], natalPalaces: ["month"], transitPalace: "daily", transitBranch: "午" }
    ];
    const dayLong = routeWaypointsFor(facts);
    expect(dayLong.map((waypoint) => [waypoint.interaction, waypoint.area, waypoint.crossing])).toEqual([
      ["six-clash", "month", true],
      ["trine", "year", false]
    ]);
  });

  it("caps day-long waypoints at two", () => {
    for (let day = 1; day <= 60; day += 1) {
      const iso = `2026-0${day <= 31 ? 7 : 8}-${String(day <= 31 ? day : day - 31).padStart(2, "0")}`;
      const dayLong = routeWaypointsFor(dailyBundleFor(FIXTURE_A, iso).facts).filter(
        (waypoint) => waypoint.timing.kind === "all-day"
      );
      expect(dayLong.length).toBeLessThanOrEqual(2);
    }
  });
});

describe("bestHourMarkFor (M24-13)", () => {
  it("places the reader's best hour on the route with its element", () => {
    // 2026-06-15: Fixture A's best hour is 丑 1–3am, Fire, before the rough hour in the day.
    expect(bestHourMarkFor(dailyBundleFor(FIXTURE_A, "2026-06-15").facts)).toEqual({
      branch: "丑",
      element: "fire",
      startHour: 1,
      endHour: 3,
      label: "1–3 am",
      progress: 0.2,
      isEasyHour: false
    });
  });

  it("rides the easy hour's position when the two are the same block", () => {
    // 2026-06-20 is a 丑 day: its easy hour 子 is Fixture A's best hour.
    const facts = dailyBundleFor(FIXTURE_A, "2026-06-20").facts;
    const mark = bestHourMarkFor(facts);
    const easy = routeWaypointsFor(facts).find((waypoint) => waypoint.timing.kind === "hours" && !waypoint.crossing);
    expect(mark).toMatchObject({ branch: "子", isEasyHour: true });
    expect(easy?.transitBranch).toBe("子");
    expect(mark?.progress).toBe(easy?.timing.kind === "hours" ? easy.timing.progress : -1);
  });

  it("is null without a best-hour fact", () => {
    expect(bestHourMarkFor([])).toBeNull();
  });

  it("keeps every timed mark on the route and apart, every fixture, a year of days", () => {
    for (const [name, profile] of READING_FIXTURES) {
      for (let offset = 0; offset < 365; offset += 1) {
        const date = addDays("2026-01-01", offset);
        const facts = dailyBundleFor(profile, date).facts;
        const mark = bestHourMarkFor(facts);
        const progresses = routeWaypointsFor(facts)
          .flatMap((waypoint) => (waypoint.timing.kind === "hours" ? [waypoint.timing.progress] : []))
          .concat(mark && !mark.isEasyHour ? [mark.progress] : [])
          .sort((a, b) => a - b);
        expect(progresses.length, `${name} ${date}`).toBeGreaterThanOrEqual(2);
        for (const progress of progresses) {
          expect(progress, `${name} ${date}`).toBeGreaterThanOrEqual(0.2);
          expect(progress, `${name} ${date}`).toBeLessThanOrEqual(0.86 + 1e-9);
        }
        for (let index = 1; index < progresses.length; index += 1) {
          expect(progresses[index]! - progresses[index - 1]!, `${name} ${date}`).toBeGreaterThanOrEqual(0.14 - 1e-9);
        }
      }
    }
  });
});
