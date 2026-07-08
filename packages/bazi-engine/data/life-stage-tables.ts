/**
 * Twelve life stages (十二長生) reference tables.
 *
 * The cycle order and the 長生 (Growth) anchor branch of each stem are the
 * classical 子平 tables (三命通會 卷二 / 淵海子平 論長生): yang stems walk the
 * twelve branches forward from their anchor, yin stems walk backward.
 * Verified against a professional BaZi app reading for chart 甲戌 丙子 戊辰 庚申
 * (test/master-reading.test.ts): 戊 at 戌=墓, 子=胎, 辰=冠帶, 申=病; self-sitting
 * 甲@戌=養, 丙@子=胎, 庚@申=臨官, 己@卯=病, 乙@巳=沐浴.
 */

import type { Branch, Stem } from "../src/types.js";

/** One of the twelve stages, in cycle order starting at 長生. */
export interface LifeStageDefinition {
  chinese: string;
  english: string;
}

/** The twelve stages in canonical cycle order (index 0 = 長生). */
export const LIFE_STAGES: readonly LifeStageDefinition[] = [
  { chinese: "長生", english: "Growth" },
  { chinese: "沐浴", english: "Bath" },
  { chinese: "冠帶", english: "Coming of Age" },
  { chinese: "臨官", english: "Taking Office" },
  { chinese: "帝旺", english: "Peak" },
  { chinese: "衰", english: "Decline" },
  { chinese: "病", english: "Illness" },
  { chinese: "死", english: "Stillness" },
  { chinese: "墓", english: "Storage" },
  { chinese: "絕", english: "Severance" },
  { chinese: "胎", english: "Conception" },
  { chinese: "養", english: "Nurture" },
];

/**
 * Branch where each stem's 長生 (Growth) stage sits. Yang stems then advance
 * forward through the branches; yin stems advance backward. 戊 follows 丙 and
 * 己 follows 丁 (fire-earth shared palace, 火土同宮). Source: 三命通會 卷二.
 */
export const GROWTH_ANCHOR: Readonly<Record<Stem, Branch>> = {
  甲: "亥",
  乙: "午",
  丙: "寅",
  丁: "酉",
  戊: "寅",
  己: "酉",
  庚: "巳",
  辛: "子",
  壬: "申",
  癸: "卯",
};
