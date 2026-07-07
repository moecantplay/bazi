/**
 * Reference constants for the Daymaster BaZi engine.
 *
 * Every value here is transcribed directly from the project brief §11.
 * No values are invented: anything not stated in the brief must instead be
 * derived from astronomy-engine or from sexagenary-cycle arithmetic.
 *
 * Source: project brief §11
 */

import type { Branch, Element, Polarity, Stem } from "../src/types.js";

/** The ten Heavenly Stems in canonical order. Source: project brief §11 */
export const STEMS: readonly Stem[] = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
];

/**
 * Element of each stem, index-aligned with {@link STEMS}:
 * Wood Wood Fire Fire Earth Earth Metal Metal Water Water.
 * Source: project brief §11
 */
export const STEM_ELEMENTS: readonly Element[] = [
  "wood",
  "wood",
  "fire",
  "fire",
  "earth",
  "earth",
  "metal",
  "metal",
  "water",
  "water",
];

/**
 * Polarity of each stem, index-aligned with {@link STEMS}: yang/yin alternating,
 * starting yang (甲 = yang). Source: project brief §11
 */
export const STEM_POLARITIES: readonly Polarity[] = [
  "yang",
  "yin",
  "yang",
  "yin",
  "yang",
  "yin",
  "yang",
  "yin",
  "yang",
  "yin",
];

/** The twelve Earthly Branches in canonical order. Source: project brief §11 */
export const BRANCHES: readonly Branch[] = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];

/**
 * Element of each branch, index-aligned with {@link BRANCHES}:
 * Water Earth Wood Wood Earth Fire Fire Earth Metal Metal Earth Water.
 * Source: project brief §11
 */
export const BRANCH_ELEMENTS: readonly Element[] = [
  "water",
  "earth",
  "wood",
  "wood",
  "earth",
  "fire",
  "fire",
  "earth",
  "metal",
  "metal",
  "earth",
  "water",
];

/**
 * Five Tigers rule (五虎遁): the stem of the 寅 month, keyed by the year stem.
 * 甲/己→丙 · 乙/庚→戊 · 丙/辛→庚 · 丁/壬→壬 · 戊/癸→甲.
 * Subsequent months advance the stem by one through the 10-stem cycle.
 * Source: project brief §11
 */
export const FIVE_TIGERS: Readonly<Record<Stem, Stem>> = {
  甲: "丙",
  己: "丙",
  乙: "戊",
  庚: "戊",
  丙: "庚",
  辛: "庚",
  丁: "壬",
  壬: "壬",
  戊: "甲",
  癸: "甲",
};

/**
 * Five Rats rule (五鼠遁): the stem of the 子 hour, keyed by the day stem.
 * 甲/己→甲 · 乙/庚→丙 · 丙/辛→戊 · 丁/壬→庚 · 戊/癸→壬.
 * Subsequent 2-hour slots advance the stem by one through the 10-stem cycle.
 * Source: project brief §11
 */
export const FIVE_RATS: Readonly<Record<Stem, Stem>> = {
  甲: "甲",
  己: "甲",
  乙: "丙",
  庚: "丙",
  丙: "戊",
  辛: "戊",
  丁: "庚",
  壬: "庚",
  戊: "壬",
  癸: "壬",
};

/**
 * The twelve jié (月建 month-boundary solar terms) in seasonal order starting
 * from 立春, with the apparent ecliptic longitude that defines each and the
 * Earthly Branch of the month it opens. The month opening at 立春 is 寅; each
 * subsequent jié advances the branch by one. Source: project brief §11
 */
export interface JieDefinition {
  name: string;
  longitude: number;
  branch: Branch;
  /** Ordinal from 立春 (0) through 小寒 (11), i.e. months since the 寅 month. */
  monthOrdinal: number;
}

export const JIE: readonly JieDefinition[] = [
  { name: "立春", longitude: 315, branch: "寅", monthOrdinal: 0 },
  { name: "惊蛰", longitude: 345, branch: "卯", monthOrdinal: 1 },
  { name: "清明", longitude: 15, branch: "辰", monthOrdinal: 2 },
  { name: "立夏", longitude: 45, branch: "巳", monthOrdinal: 3 },
  { name: "芒种", longitude: 75, branch: "午", monthOrdinal: 4 },
  { name: "小暑", longitude: 105, branch: "未", monthOrdinal: 5 },
  { name: "立秋", longitude: 135, branch: "申", monthOrdinal: 6 },
  { name: "白露", longitude: 165, branch: "酉", monthOrdinal: 7 },
  { name: "寒露", longitude: 195, branch: "戌", monthOrdinal: 8 },
  { name: "立冬", longitude: 225, branch: "亥", monthOrdinal: 9 },
  { name: "大雪", longitude: 255, branch: "子", monthOrdinal: 10 },
  { name: "小寒", longitude: 285, branch: "丑", monthOrdinal: 11 },
];

/** Lookup of jié definition by term name. */
export const JIE_BY_NAME: Readonly<Record<string, JieDefinition>> =
  Object.fromEntries(JIE.map((jie) => [jie.name, jie]));

/**
 * Hidden stems (藏干) concealed within each branch, principal stem first.
 * Source: project brief §11
 */
export const HIDDEN_STEMS: Readonly<Record<Branch, readonly Stem[]>> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

/**
 * The five elements in generating-cycle order (相生): each element produces the
 * next, and the cycle wraps (Wood→Fire→Earth→Metal→Water→Wood). The controlling
 * cycle (相克, Wood→Earth→Water→Fire→Metal→Wood) is this order stepped by two.
 * Source: project brief §11
 */
export const ELEMENT_PRODUCTION_ORDER: readonly Element[] = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
];
