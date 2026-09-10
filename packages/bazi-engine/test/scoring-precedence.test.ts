/**
 * Two precedence rules in the interpretive scoring layer:
 *  - the day's favourable-element bonus never lifts an activity the officer
 *    avoids out of friction (it breaks ties upward, never softens an avoid);
 *  - the strength verdict decides the favourable elements, and the seasonal
 *    climate corrector joins only when it agrees with that verdict.
 */
import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { computeChart } from "../src/chart.js";
import { dayQuality } from "../src/day-quality.js";
import { favorableElements } from "../src/favorable-elements.js";
import { strength } from "../src/strength.js";

const ZONE = "Asia/Jakarta";
function fixtureA() {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: ZONE },
  ).toJSDate();
  return computeChart({ instant, zone: ZONE, sex: "male", hourKnown: true });
}

describe("element-day bonus vs the officer's avoid list", () => {
  it("2026-06-21 (成 day, fire favourable): clear stays friction, bonus withheld", () => {
    const quality = dayQuality(fixtureA(), "2026-06-21", ZONE);
    const clear = quality.assessments.find((a) => a.activity === "clear");
    expect(clear).toMatchObject({ leaning: "friction", score: -2 });
    expect(clear?.reasons.map((r) => r.source)).not.toContain("element-day");
  });

  it("the same day's favoured activities still carry the bonus", () => {
    const quality = dayQuality(fixtureA(), "2026-06-21", ZONE);
    const commit = quality.assessments.find((a) => a.activity === "commit");
    expect(commit).toMatchObject({ leaning: "favors", score: 3 });
    expect(commit?.reasons.map((r) => r.source)).toContain("element-day");
  });
});

describe("favourable elements: strength first, climate only when it agrees", () => {
  it("a weak Water day master born in winter is not told Fire suits it", () => {
    // Fire is Water's wealth element — it drains a weak 壬. Winter's call for
    // warmth must not override the support a weak day master needs.
    const favorable = favorableElements({ dayMaster: "壬", monthBranch: "子", strength: "weak" });
    expect(favorable).not.toContain("fire");
    expect(favorable).toEqual(["water", "metal"]);
  });

  it("a strong Fire day master born in summer is drained by Water — climate agrees, so it leads", () => {
    const favorable = favorableElements({ dayMaster: "丙", monthBranch: "午", strength: "strong" });
    expect(favorable[0]).toBe("water");
  });

  it("Fixture A (weak 戊, winter): Fire is Earth's resource, so climate agrees and stays", () => {
    const chart = fixtureA();
    expect(chart.favorableElements).toEqual(["fire", "earth"]);
  });
});

describe("strength margin", () => {
  it("reports the supporter-minus-drainer margin and flags a narrow call", () => {
    const result = strength({
      dayMaster: "戊",
      year: { stem: "甲", branch: "戌" },
      month: { stem: "丙", branch: "子" },
      day: { stem: "戊", branch: "辰" },
      hour: { stem: "庚", branch: "申" },
    });
    expect(result.margin).toBe(result.supporterScore - result.drainerScore);
    expect(result.narrow).toBe(Math.abs(result.margin) <= 1);
  });

  it("an all-supporting chart is a wide margin", () => {
    const result = strength({
      dayMaster: "甲",
      year: { stem: "甲", branch: "寅" },
      month: { stem: "乙", branch: "卯" },
      day: { stem: "甲", branch: "子" },
      hour: { stem: "癸", branch: "亥" },
    });
    expect(result.margin).toBeGreaterThan(1);
    expect(result.narrow).toBe(false);
  });
});
