import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { ACTIVITIES } from "../data/day-officer-tables.js";
import { computeChart } from "../src/chart.js";
import { dayQuality } from "../src/day-quality.js";
import type { Chart } from "../src/types.js";

/** Fixture A: 1994-12-08 16:30 Asia/Jakarta — 甲戌 丙子 戊辰 庚申, weak 戊, favours fire+earth. */
function fixtureA(hourKnown = true): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone: "Asia/Jakarta" },
  ).toJSDate();
  return computeChart({ instant, zone: "Asia/Jakarta", sex: "male", hourKnown });
}

const ZONE = "Asia/Jakarta";

describe("dayQuality — Fixture A", () => {
  const chart = fixtureA();

  it("is deterministic and covers every activity once, in table order", () => {
    const first = dayQuality(chart, "2026-06-21", ZONE);
    const second = dayQuality(chart, "2026-06-21", ZONE);
    expect(first).toEqual(second);
    expect(first.assessments.map((a) => a.activity)).toEqual(
      ACTIVITIES.map((activity) => activity.key),
    );
  });

  it("2026-06-21 (丙寅, 成 day, fire favourable): commit scores +3 and leans favors", () => {
    const quality = dayQuality(chart, "2026-06-21", ZONE);
    expect(quality.officer.chinese).toBe("成");
    expect(`${quality.pillar.stem}${quality.pillar.branch}`).toBe("丙寅");
    const commit = quality.assessments.find((a) => a.activity === "commit");
    expect(commit).toMatchObject({ leaning: "favors", score: 3 });
    expect(commit?.reasons).toContainEqual(
      expect.objectContaining({ source: "officer", direction: 1 }),
    );
    expect(commit?.reasons).toContainEqual(
      expect.objectContaining({ source: "element-day", element: "fire" }),
    );
  });

  it("2026-06-21: clear is officer-avoided (成忌) but element softens it to neutral", () => {
    const quality = dayQuality(chart, "2026-06-21", ZONE);
    const clear = quality.assessments.find((a) => a.activity === "clear");
    expect(clear).toMatchObject({ leaning: "neutral", score: -1 });
  });

  it("2026-06-29 (甲戌, 定 day) is the personal breaker: 戌 clashes natal 辰", () => {
    const quality = dayQuality(chart, "2026-06-29", ZONE);
    expect(quality.officer.chinese).toBe("定");
    expect(`${quality.pillar.stem}${quality.pillar.branch}`).toBe("甲戌");
    const commit = quality.assessments.find((a) => a.activity === "commit");
    // 定 favours commit (+2) but the breaker (−2) cancels it; 甲 wood is not favourable.
    expect(commit).toMatchObject({ leaning: "neutral", score: 0 });
    expect(commit?.reasons).toContainEqual(
      expect.objectContaining({
        source: "day-breaker",
        transitBranch: "戌",
        natalBranch: "辰",
      }),
    );
    const move = quality.assessments.find((a) => a.activity === "move");
    expect(move).toMatchObject({ leaning: "friction", score: -2 });
  });

  it("combine days ease the home palace: a 酉 day combines natal 辰", () => {
    // 2026-06-28 = 癸酉 (day before 甲戌). 酉 six-combines the natal day branch 辰.
    const quality = dayQuality(chart, "2026-06-28", ZONE);
    expect(quality.pillar.branch).toBe("酉");
    const commit = quality.assessments.find((a) => a.activity === "commit");
    expect(commit?.reasons).toContainEqual(
      expect.objectContaining({
        source: "day-combine",
        transitBranch: "酉",
        natalBranch: "辰",
      }),
    );
  });

  it("career-palace clash dents work moves: an 午 day clashes natal month 子", () => {
    // 2026-07-01 = 丙子? No — need an 午 day: 2026-06-25 (寅+4 → 午, 庚午).
    const quality = dayQuality(chart, "2026-06-25", ZONE);
    expect(quality.pillar.branch).toBe("午");
    const launch = quality.assessments.find((a) => a.activity === "launch");
    expect(launch?.reasons).toContainEqual(
      expect.objectContaining({ source: "palace-clash", palace: "month" }),
    );
  });
});

describe("dayQuality — unknown-time chart", () => {
  it("computes without any hour-derived input", () => {
    const chart = fixtureA(false);
    expect(chart.hour).toBeNull();
    const quality = dayQuality(chart, "2026-06-21", ZONE);
    expect(quality.assessments).toHaveLength(ACTIVITIES.length);
    // 寅 clashes 申 — Fixture A's hour branch. With the hour unknown no such
    // relation may appear anywhere in the reasons.
    const allReasons = quality.assessments.flatMap((a) => a.reasons);
    for (const reason of allReasons) {
      if (
        reason.source === "day-breaker" ||
        reason.source === "day-combine" ||
        reason.source === "palace-clash"
      ) {
        expect(reason.natalBranch).not.toBe("申");
      }
    }
  });
});
