import { describe, expect, it } from "vitest";
import { controlledBy, controls, producedBy, produces, relate } from "../src/five-elements.js";
import { hiddenStems } from "../src/hidden-stems.js";
import { tenGods } from "../src/ten-gods.js";
import { strength } from "../src/strength.js";
import { favorableElements } from "../src/favorable-elements.js";

describe("five-element cycles", () => {
  it("follows the generating cycle", () => {
    expect(produces("wood")).toBe("fire");
    expect(produces("water")).toBe("wood");
    expect(producedBy("earth")).toBe("fire");
  });

  it("follows the controlling cycle (order + 2)", () => {
    expect(controls("wood")).toBe("earth");
    expect(controls("water")).toBe("fire");
    expect(controlledBy("wood")).toBe("metal");
  });

  it("classifies relations from the day-master element", () => {
    expect(relate("earth", "earth")).toBe("same");
    expect(relate("earth", "metal")).toBe("output"); // earth generates metal
    expect(relate("earth", "water")).toBe("wealth"); // earth controls water
    expect(relate("earth", "wood")).toBe("officer"); // wood controls earth
    expect(relate("earth", "fire")).toBe("resource"); // fire generates earth
  });
});

describe("hidden stems", () => {
  it("returns principal-first stems for every branch", () => {
    expect(hiddenStems("子")).toEqual(["癸"]);
    expect(hiddenStems("丑")).toEqual(["己", "癸", "辛"]);
    expect(hiddenStems("戌")).toEqual(["戊", "辛", "丁"]);
    expect(hiddenStems("亥")).toEqual(["壬", "甲"]);
  });

  it("returns a fresh array that cannot mutate the table", () => {
    const first = hiddenStems("寅");
    first.push("癸");
    expect(hiddenStems("寅")).toEqual(["甲", "丙", "戊"]);
  });
});

describe("ten gods", () => {
  // Day master 戊 (yang earth). Fixture A stems verified against brief §11.
  it("labels Fixture A visible stems against 戊", () => {
    expect(tenGods("戊", "甲").chinese).toBe("七杀"); // yang wood controls earth
    expect(tenGods("戊", "丙").chinese).toBe("偏印"); // yang fire generates earth
    expect(tenGods("戊", "庚").chinese).toBe("食神"); // earth generates yang metal
  });

  it("distinguishes polarity: 戊 vs 己 is Rob Wealth, 戊 vs 戊 is Friend", () => {
    expect(tenGods("戊", "戊")).toEqual({ chinese: "比肩", english: "Friend" });
    expect(tenGods("戊", "己")).toEqual({ chinese: "劫财", english: "Rob Wealth" });
  });
});

describe("strength and favorable elements — strong day master", () => {
  // 甲 wood day master in an all wood/water chart: every element supports it.
  const strongInput = {
    dayMaster: "甲" as const,
    year: { stem: "甲" as const, branch: "寅" as const },
    month: { stem: "乙" as const, branch: "卯" as const },
    day: { stem: "甲" as const, branch: "子" as const },
    hour: { stem: "癸" as const, branch: "亥" as const },
  };

  it("scores an all-supporting chart as strong", () => {
    const result = strength(strongInput);
    expect(result.value).toBe("strong");
    expect(result.drainerScore).toBe(0);
    expect(result.seasonalSupport).toBe(true); // 卯 is wood, same as 甲
  });

  it("favours draining elements (output/wealth/officer) when strong", () => {
    // 甲 wood, month 卯 (neither winter nor summer): drain-the-strong applies.
    const favorable = favorableElements({
      dayMaster: "甲",
      monthBranch: "卯",
      strength: "strong",
    });
    expect(favorable).toEqual(["fire", "earth", "metal"]);
  });

  it("seeds Water first for a summer month", () => {
    // 午 is summer → Water leads; a weak 甲 then adds wood (self) and water (resource).
    const favorable = favorableElements({
      dayMaster: "甲",
      monthBranch: "午",
      strength: "weak",
    });
    expect(favorable[0]).toBe("water");
    expect(favorable).toContain("wood");
  });
});
