import { describe, expect, it } from "vitest";
import { conditionDays, currentHourBlockIndex } from "../src/conditions-screen.js";
import { FIXTURE_A } from "./fixtures.js";

describe("currentHourBlockIndex", () => {
  it("puts 11 pm and 12:30 am in the rat block, 5 pm in the rooster block", () => {
    expect(currentHourBlockIndex(new Date(2026, 8, 10, 23, 5))).toBe(0);
    expect(currentHourBlockIndex(new Date(2026, 8, 10, 0, 30))).toBe(0);
    expect(currentHourBlockIndex(new Date(2026, 8, 10, 17, 7))).toBe(9);
    expect(currentHourBlockIndex(new Date(2026, 8, 10, 22, 59))).toBe(11);
  });
});

describe("conditionDays", () => {
  const profile = { ...FIXTURE_A, readingZone: "Asia/Jakarta" };

  it("returns ten consecutive days starting today", () => {
    const days = conditionDays(profile, "2026-09-10");
    expect(days).toHaveLength(10);
    expect(days.map((day) => day.iso).slice(0, 3)).toEqual(["2026-09-10", "2026-09-11", "2026-09-12"]);
  });

  it("summarises each day by officer, stem element and lead activity", () => {
    const [today] = conditionDays(profile, "2026-09-10", 1);
    expect(today).toMatchObject({
      officerKey: "man",
      officerName: "Full",
      element: "fire",
      polarity: "yin",
      animal: "pig",
      tone: "favoured",
      lead: { label: "Launches", leaning: "favors" }
    });
    expect(today?.gloss).toContain("cup filled to the brim");
  });

  it("leaves lead empty on a day where nothing leans", () => {
    const days = conditionDays(profile, "2026-09-10", 30);
    const even = days.find((day) => day.lead === null);
    if (even) {
      expect(even.tone).toBe("even");
    }
  });
});
