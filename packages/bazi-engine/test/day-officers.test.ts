import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  ACTIVITIES,
  ACTIVITY_KEYS,
  DAY_OFFICERS,
} from "../data/day-officer-tables.js";
import { dayOfficer, officerForBranches } from "../src/day-officers.js";
import { dailyPillar, monthPillar } from "../src/pillars.js";

describe("day-officer tables", () => {
  it("carries exactly twelve officers in the classical sequence", () => {
    expect(DAY_OFFICERS.map((officer) => officer.chinese).join("")).toBe(
      "建除滿平定執破危成收開閉",
    );
  });

  it("keeps favors and avoids disjoint, over valid activity keys", () => {
    for (const officer of DAY_OFFICERS) {
      const overlap = officer.favors.filter((key) => officer.avoids.includes(key));
      expect(overlap).toEqual([]);
      for (const key of [...officer.favors, ...officer.avoids]) {
        expect(ACTIVITY_KEYS).toContain(key);
      }
      expect(officer.favors.length).toBeGreaterThan(0);
    }
  });

  it("gives every activity at least one favouring officer", () => {
    for (const activity of ACTIVITIES) {
      const favoredSomewhere = DAY_OFFICERS.some((officer) =>
        officer.favors.includes(activity.key),
      );
      expect(favoredSomewhere).toBe(true);
    }
  });
});

describe("officerForBranches", () => {
  it("names 建 when the day branch equals the month branch", () => {
    expect(officerForBranches("午", "午").chinese).toBe("建");
    expect(officerForBranches("寅", "寅").chinese).toBe("建");
  });

  it("advances one officer per branch step from the month branch", () => {
    expect(officerForBranches("午", "未").chinese).toBe("除");
    expect(officerForBranches("午", "巳").chinese).toBe("閉");
  });
});

describe("dayOfficer — golden anchors", () => {
  it("2026-06-21 (丙寅 day, 甲午 month) is 成 Success — Sinarmas 2026 almanac page", () => {
    const officer = dayOfficer("2026-06-21", "Asia/Jakarta");
    expect(officer.chinese).toBe("成");
    expect(officer.english).toBe("Success");
    // The printed page lists Engagement/Wedding, Grand Opening, Trading,
    // Start Learning, Moving, Travelling as favourable. Burial/Worship/Stove
    // Set-up/Fishing/Hunting are outside the modelled category set.
    for (const key of ["commit", "launch", "sign", "study", "move", "travel"] as const) {
      expect(officer.favors).toContain(key);
    }
  });

  it("repeats the officer across a jié boundary (month branch advances with the day)", () => {
    // 小暑 falls in early July 2026. Scan the window for the day pair where
    // the governing month branch (as dayOfficer keys it, at noon) flips, and
    // assert the officer repeats across exactly that pair.
    const zone = "Asia/Jakarta";
    const dates: string[] = [];
    for (let day = 1; day <= 12; day += 1) {
      dates.push(`2026-07-${String(day).padStart(2, "0")}`);
    }
    const monthBranchAtNoon = (date: string) =>
      monthPillar(DateTime.fromISO(date, { zone }).set({ hour: 12 }).toJSDate(), zone)
        .branch;
    const flipIndex = dates.findIndex(
      (date, index) =>
        index + 1 < dates.length &&
        monthBranchAtNoon(date) !== monthBranchAtNoon(dates[index + 1] as string),
    );
    expect(flipIndex).toBeGreaterThanOrEqual(0);
    const before = dates[flipIndex] as string;
    const after = dates[flipIndex + 1] as string;
    expect(dayOfficer(after, zone).chinese).toBe(dayOfficer(before, zone).chinese);
    // And away from the boundary the cycle advances normally.
    const later = dates[flipIndex + 2] as string;
    expect(dayOfficer(later, zone).chinese).not.toBe(dayOfficer(after, zone).chinese);
  });

  it("is deterministic and consistent with the pillar functions", () => {
    const zone = "Asia/Jakarta";
    const date = "2026-06-21";
    const day = dailyPillar(date, zone);
    const month = monthPillar(
      DateTime.fromISO(date, { zone }).set({ hour: 12 }).toJSDate(),
      zone,
    );
    expect(dayOfficer(date, zone)).toEqual(officerForBranches(month.branch, day.branch));
  });
});
