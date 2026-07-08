/**
 * Shensha (神煞, symbolic stars) reference tables.
 *
 * Each table is the classical 子平 rule as given in 三命通會 (卷四–卷六) /
 * 淵海子平 (論神煞), transcribed without modification. Placements are verified
 * against a professional BaZi app reading for the chart 甲戌 丙子 戊辰 庚申 in
 * test/master-reading.test.ts (文昌→申, 祿神→巳, 飛刃→子, 驛馬→申, 咸池→卯,
 * 將星→子, 災煞→子, 天德→巳, 天德合→申, 太極貴人→辰戌, 紅艷→辰, 紅鸞→巳,
 * 喪門→子, 空亡→戌亥).
 *
 * Stars whose school the reference app uses could not be determined (學堂,
 * 詞館, 血刃) are deliberately absent — see PROGRESS.md flags.
 */

import type { Branch, Stem } from "../src/types.js";

/** Stable machine keys for the implemented stars. */
export type ShenshaKey =
  | "tianyi-nobleman"
  | "wenchang-scholar"
  | "lushen-emolument"
  | "yangren-blade"
  | "feiren-flying-blade"
  | "yima-travel-horse"
  | "taohua-peach-blossom"
  | "jiangxing-general"
  | "huagai-canopy"
  | "zaisha-calamity"
  | "tiande-virtue"
  | "tiande-companion"
  | "yuede-virtue"
  | "taiji-nobleman"
  | "hongyan-charm"
  | "hongluan-phoenix"
  | "tianxi-joy"
  | "sangmen-mourning"
  | "kongwang-void";

export interface ShenshaDefinition {
  key: ShenshaKey;
  chinese: string;
  english: string;
}

/** Display names, in the order hits are reported for a pillar. */
export const SHENSHA_DEFINITIONS: readonly ShenshaDefinition[] = [
  { key: "tianyi-nobleman", chinese: "天乙貴人", english: "Nobleman" },
  { key: "tiande-virtue", chinese: "天德", english: "Heavenly Virtue" },
  { key: "tiande-companion", chinese: "天德合", english: "Virtue's Companion" },
  { key: "yuede-virtue", chinese: "月德", english: "Monthly Virtue" },
  { key: "taiji-nobleman", chinese: "太極貴人", english: "Taiji Nobleman" },
  { key: "wenchang-scholar", chinese: "文昌", english: "Scholar Star" },
  { key: "lushen-emolument", chinese: "祿神", english: "Emolument Star" },
  { key: "jiangxing-general", chinese: "將星", english: "General Star" },
  { key: "huagai-canopy", chinese: "華蓋", english: "Canopy Star" },
  { key: "yima-travel-horse", chinese: "驛馬", english: "Travel Horse" },
  { key: "taohua-peach-blossom", chinese: "咸池", english: "Peach Blossom" },
  { key: "hongluan-phoenix", chinese: "紅鸞", english: "Red Phoenix" },
  { key: "tianxi-joy", chinese: "天喜", english: "Heavenly Joy" },
  { key: "hongyan-charm", chinese: "紅艷", english: "Rosy Charm" },
  { key: "yangren-blade", chinese: "羊刃", english: "Goat Blade" },
  { key: "feiren-flying-blade", chinese: "飛刃", english: "Flying Blade" },
  { key: "zaisha-calamity", chinese: "災煞", english: "Calamity Star" },
  { key: "sangmen-mourning", chinese: "喪門", english: "Mourning Gate" },
  { key: "kongwang-void", chinese: "空亡", english: "Void" },
];

/**
 * 天乙貴人 by day stem: 甲戊→丑未 · 乙己→子申 · 丙丁→亥酉 · 庚辛→午寅 · 壬癸→巳卯.
 * Source: 淵海子平 論天乙貴人 ("甲戊庚牛羊" school for 庚 is a known variant;
 * this table follows 三命通會: 庚辛逢馬虎).
 */
export const TIANYI_BRANCHES: Readonly<Record<Stem, readonly Branch[]>> = {
  甲: ["丑", "未"],
  戊: ["丑", "未"],
  乙: ["子", "申"],
  己: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  庚: ["午", "寅"],
  辛: ["午", "寅"],
  壬: ["巳", "卯"],
  癸: ["巳", "卯"],
};

/**
 * 文昌 by day stem: 甲→巳 乙→午 丙→申 丁→酉 戊→申 己→酉 庚→亥 辛→子 壬→寅 癸→卯.
 * Source: 三命通會 論文昌.
 */
export const WENCHANG_BRANCH: Readonly<Record<Stem, Branch>> = {
  甲: "巳",
  乙: "午",
  丙: "申",
  丁: "酉",
  戊: "申",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯",
};

/**
 * 祿神 (the stem's own 臨官 seat) by day stem:
 * 甲→寅 乙→卯 丙→巳 丁→午 戊→巳 己→午 庚→申 辛→酉 壬→亥 癸→子.
 * Source: 淵海子平 論祿.
 */
export const LUSHEN_BRANCH: Readonly<Record<Stem, Branch>> = {
  甲: "寅",
  乙: "卯",
  丙: "巳",
  丁: "午",
  戊: "巳",
  己: "午",
  庚: "申",
  辛: "酉",
  壬: "亥",
  癸: "子",
};

/**
 * 羊刃 (the stem's 帝旺 seat) for the five yang stems: 甲→卯 丙→午 戊→午 庚→酉 壬→子.
 * Yin stems carry no 羊刃 in this school. 飛刃 is the six-clash opposite of the
 * 羊刃 branch. Source: 三命通會 論羊刃.
 */
export const YANGREN_BRANCH: Readonly<Partial<Record<Stem, Branch>>> = {
  甲: "卯",
  丙: "午",
  戊: "午",
  庚: "酉",
  壬: "子",
};

/**
 * Trine-group stars, keyed by a reference branch (applied from BOTH the year
 * branch and the day branch, per classical practice):
 * 驛馬: 申子辰→寅 寅午戌→申 巳酉丑→亥 亥卯未→巳
 * 咸池: 申子辰→酉 寅午戌→卯 巳酉丑→午 亥卯未→子
 * 將星: 申子辰→子 寅午戌→午 巳酉丑→酉 亥卯未→卯
 * 華蓋: 申子辰→辰 寅午戌→戌 巳酉丑→丑 亥卯未→未
 * 災煞: 申子辰→午 寅午戌→子 巳酉丑→卯 亥卯未→酉
 * Source: 三命通會 論驛馬/論咸池/論將星/論華蓋/論災煞.
 */
function byTrineGroup(shenZiChen: Branch, yinWuXu: Branch, siYouChou: Branch, haiMaoWei: Branch): Readonly<Record<Branch, Branch>> {
  return {
    申: shenZiChen,
    子: shenZiChen,
    辰: shenZiChen,
    寅: yinWuXu,
    午: yinWuXu,
    戌: yinWuXu,
    巳: siYouChou,
    酉: siYouChou,
    丑: siYouChou,
    亥: haiMaoWei,
    卯: haiMaoWei,
    未: haiMaoWei,
  };
}

export const YIMA_BRANCH = byTrineGroup("寅", "申", "亥", "巳");
export const TAOHUA_BRANCH = byTrineGroup("酉", "卯", "午", "子");
export const JIANGXING_BRANCH = byTrineGroup("子", "午", "酉", "卯");
export const HUAGAI_BRANCH = byTrineGroup("辰", "戌", "丑", "未");
export const ZAISHA_BRANCH = byTrineGroup("午", "子", "卯", "酉");

/**
 * 天德 by month branch — the mark is a stem for four months and a branch for
 * the rest: 寅→丁 卯→申 辰→壬 巳→辛 午→亥 未→甲 申→癸 酉→寅 戌→丙 亥→乙 子→巳 丑→庚.
 * 天德合 is the five-combine partner when the mark is a stem, the six-combine
 * partner when it is a branch. Source: 三命通會 論天月德.
 */
export const TIANDE_MARK: Readonly<Record<Branch, Stem | Branch>> = {
  寅: "丁",
  卯: "申",
  辰: "壬",
  巳: "辛",
  午: "亥",
  未: "甲",
  申: "癸",
  酉: "寅",
  戌: "丙",
  亥: "乙",
  子: "巳",
  丑: "庚",
};

/** Five combines (五合) stem partners: 甲己 乙庚 丙辛 丁壬 戊癸. Source: brief §11 cycle. */
export const STEM_COMBINE: Readonly<Record<Stem, Stem>> = {
  甲: "己",
  己: "甲",
  乙: "庚",
  庚: "乙",
  丙: "辛",
  辛: "丙",
  丁: "壬",
  壬: "丁",
  戊: "癸",
  癸: "戊",
};

/**
 * 月德 by month trine group (always a stem): 寅午戌→丙 申子辰→壬 巳酉丑→庚 亥卯未→甲.
 * Source: 三命通會 論天月德.
 */
export const YUEDE_STEM: Readonly<Record<Branch, Stem>> = {
  寅: "丙",
  午: "丙",
  戌: "丙",
  申: "壬",
  子: "壬",
  辰: "壬",
  巳: "庚",
  酉: "庚",
  丑: "庚",
  亥: "甲",
  卯: "甲",
  未: "甲",
};

/**
 * 太極貴人 by day stem: 甲乙→子午 · 丙丁→卯酉 · 戊己→辰戌丑未 · 庚辛→寅亥 · 壬癸→巳申.
 * Source: 三命通會 論太極貴人.
 */
export const TAIJI_BRANCHES: Readonly<Record<Stem, readonly Branch[]>> = {
  甲: ["子", "午"],
  乙: ["子", "午"],
  丙: ["卯", "酉"],
  丁: ["卯", "酉"],
  戊: ["辰", "戌", "丑", "未"],
  己: ["辰", "戌", "丑", "未"],
  庚: ["寅", "亥"],
  辛: ["寅", "亥"],
  壬: ["巳", "申"],
  癸: ["巳", "申"],
};

/**
 * 紅艷 by day stem: 甲→午 乙→申 丙→寅 丁→未 戊→辰 己→辰 庚→戌 辛→酉 壬→子 癸→申.
 * Source: 三命通會 論紅艷.
 */
export const HONGYAN_BRANCH: Readonly<Record<Stem, Branch>> = {
  甲: "午",
  乙: "申",
  丙: "寅",
  丁: "未",
  戊: "辰",
  己: "辰",
  庚: "戌",
  辛: "酉",
  壬: "子",
  癸: "申",
};

/**
 * 紅鸞 by year branch: 子→卯 丑→寅 寅→丑 卯→子 辰→亥 巳→戌 午→酉 未→申 申→未
 * 酉→午 戌→巳 亥→辰 (counting backward from 卯). 天喜 is its six-clash opposite.
 * Source: 三命通會 論紅鸞天喜.
 */
export const HONGLUAN_BRANCH: Readonly<Record<Branch, Branch>> = {
  子: "卯",
  丑: "寅",
  寅: "丑",
  卯: "子",
  辰: "亥",
  巳: "戌",
  午: "酉",
  未: "申",
  申: "未",
  酉: "午",
  戌: "巳",
  亥: "辰",
};
