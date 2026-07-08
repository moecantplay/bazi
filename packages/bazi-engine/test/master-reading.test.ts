/**
 * Golden fixtures transcribed from a professional BaZi charting app's reading
 * of Fixture A (1994-12-08 16:30, male): pillars 甲戌 丙子 戊辰 庚申, weak day
 * master (失令 得地 失勢), luck start 9y5m25d (at UTC+8), forward luck pillars
 * 丁丑 2004 → 壬午 2054, twelve life stages, and per-pillar 神煞 placements.
 * Where the app's screen was cropped, only what was legible is asserted.
 */

import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  computeChart,
  lifeStage,
  luckStart,
  naYin,
  shensha,
  taiYuan,
  voidBranches,
  type Chart,
  type Pillar,
  type ShenshaContext,
} from "../src/index.js";

function chartFor(zone: string): Chart {
  const instant = DateTime.fromObject(
    { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
    { zone },
  ).toJSDate();
  return computeChart({ instant, zone, sex: "male", hourKnown: true });
}

const chart = chartFor("Asia/Jakarta");

const MASTER_CONTEXT: ShenshaContext = {
  dayStem: "戊",
  dayPillar: { stem: "戊", branch: "辰" },
  yearBranch: "戌",
  monthBranch: "子",
};

function starsAt(pillar: Pillar): string[] {
  return shensha(MASTER_CONTEXT, [{ palace: "year", pillar }]).map((hit) => hit.chinese);
}

describe("master reading — twelve life stages", () => {
  it("day master 戊 stages across the natal branches match the app row", () => {
    expect(chart.lifeStages.year.dayMaster.chinese).toBe("墓");
    expect(chart.lifeStages.month.dayMaster.chinese).toBe("胎");
    expect(chart.lifeStages.day.dayMaster.chinese).toBe("冠帶");
    expect(chart.lifeStages.hour?.dayMaster.chinese).toBe("病");
  });

  it("self-sitting (自坐) stages match the app row", () => {
    expect(chart.lifeStages.year.self.chinese).toBe("養"); // 甲@戌
    expect(chart.lifeStages.month.self.chinese).toBe("胎"); // 丙@子
    expect(chart.lifeStages.day.self.chinese).toBe("冠帶"); // 戊@辰
    expect(chart.lifeStages.hour?.self.chinese).toBe("臨官"); // 庚@申
  });

  it("transit stages: 大運 己卯 = 沐浴坐病, 流年 乙巳 = 臨官坐沐浴", () => {
    expect(lifeStage("戊", "卯").chinese).toBe("沐浴");
    expect(lifeStage("己", "卯").chinese).toBe("病");
    expect(lifeStage("戊", "巳").chinese).toBe("臨官");
    expect(lifeStage("乙", "巳").chinese).toBe("沐浴");
  });
});

describe("master reading — shensha placements", () => {
  it("hour 庚申: 文昌, 天德合, 驛馬", () => {
    const stars = starsAt({ stem: "庚", branch: "申" });
    expect(stars).toContain("文昌");
    expect(stars).toContain("天德合");
    expect(stars).toContain("驛馬");
  });

  it("day 戊辰: 太極貴人, 紅艷", () => {
    const stars = starsAt({ stem: "戊", branch: "辰" });
    expect(stars).toContain("太極貴人");
    expect(stars).toContain("紅艷");
  });

  it("month 丙子: 將星, 災煞, 飛刃, 喪門", () => {
    const stars = starsAt({ stem: "丙", branch: "子" });
    expect(stars).toContain("將星");
    expect(stars).toContain("災煞");
    expect(stars).toContain("飛刃");
    expect(stars).toContain("喪門");
  });

  it("year 甲戌: 太極貴人 and void (空亡)", () => {
    const stars = starsAt({ stem: "甲", branch: "戌" });
    expect(stars).toContain("太極貴人");
    expect(stars).toContain("空亡");
  });

  it("annual 乙巳 (2025): 祿神, 天德, 紅鸞", () => {
    const stars = starsAt({ stem: "乙", branch: "巳" });
    expect(stars).toContain("祿神");
    expect(stars).toContain("天德");
    expect(stars).toContain("紅鸞");
  });

  it("luck 己卯 (2024): 咸池", () => {
    expect(starsAt({ stem: "己", branch: "卯" })).toContain("咸池");
  });

  it("void branches of the 甲子 decade are 戌亥 (app marks 年柱 and 流月 丙戌/丁亥 as 空)", () => {
    expect(voidBranches({ stem: "戊", branch: "辰" })).toEqual(["戌", "亥"]);
  });

  it("natal chart carries the star hits", () => {
    const byPalace = (palace: string) =>
      chart.shensha.filter((hit) => hit.palace === palace).map((hit) => hit.chinese);
    expect(byPalace("hour")).toContain("文昌");
    expect(byPalace("month")).toContain("將星");
    expect(byPalace("year")).toContain("空亡");
  });
});

describe("master reading — strength breakdown 失令 得地 失勢", () => {
  it("weak overall, out of season, rooted, not backed", () => {
    expect(chart.strength.value).toBe("weak");
    expect(chart.strength.seasonalSupport).toBe(false); // 失令
    expect(chart.strength.rooted).toBe(true); // 得地
    expect(chart.strength.backed).toBe(false); // 失勢
  });
});

describe("master reading — luck start 起運 9年5個月25天", () => {
  const input = (zone: string) => {
    const instant = DateTime.fromObject(
      { year: 1994, month: 12, day: 8, hour: 16, minute: 30 },
      { zone },
    ).toJSDate();
    return {
      instant,
      zone,
      yearStem: "甲" as const,
      monthPillar: { stem: "丙", branch: "子" } as Pillar,
      sex: "male" as const,
    };
  };

  it("matches the app to the day at UTC+8 wall time (Asia/Makassar)", () => {
    expect(luckStart(input("Asia/Makassar"))).toMatchObject({ years: 9, months: 5, days: 25 });
  });

  it("is 9y 5m 20d at Asia/Jakarta (UTC+7) — same rule, one wall-clock hour earlier", () => {
    expect(luckStart(input("Asia/Jakarta"))).toMatchObject({ years: 9, months: 5, days: 20 });
  });

  it("first pillar takes effect mid-2004 (app: 逢甲己年 立夏後28天)", () => {
    expect(luckStart(input("Asia/Makassar")).startISO).toBe("2004-06-02");
  });
});

describe("master reading — luck and annual pillars", () => {
  it("forward sequence 丁丑 戊寅 己卯 庚辰 辛巳 壬午 starting 2004", () => {
    const rendered = chart.luckPillars.map(
      (lp) => `${lp.pillar.stem}${lp.pillar.branch}:${lp.startYear}`,
    );
    expect(rendered.slice(0, 6)).toEqual([
      "丁丑:2004",
      "戊寅:2014",
      "己卯:2024",
      "庚辰:2034",
      "辛巳:2044",
      "壬午:2054",
    ]);
  });
});

describe("master reading — na yin and 胎元", () => {
  it("na yin of the four pillars (canonical table)", () => {
    expect(naYin({ stem: "甲", branch: "戌" }).chinese).toBe("山頭火");
    expect(naYin({ stem: "丙", branch: "子" }).chinese).toBe("澗下水");
    expect(naYin({ stem: "戊", branch: "辰" }).chinese).toBe("大林木");
    expect(naYin({ stem: "庚", branch: "申" }).chinese).toBe("石榴木");
  });

  it("胎元 of month 丙子 is 丁卯", () => {
    expect(taiYuan({ stem: "丙", branch: "子" })).toEqual({ stem: "丁", branch: "卯" });
  });
});
