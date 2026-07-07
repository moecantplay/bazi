/**
 * Test helpers: enumerate every line in the bank (templates rendered with
 * sample values) and build fact fixtures spanning every enum the content layer
 * branches on.
 */

import type { Element, InteractionType, Palace, ReadingFact, Stem } from "@daymaster/bazi-engine";
import { DAY_MASTER_LINES } from "../src/banks/day-master.js";
import {
  BALANCED_LINES,
  CAREER_LINES,
  DOMINANT_LINES,
  FAVORABLE_LINES,
  MISSING_LINES,
  STRONG_LINES,
  WEAK_LINES,
} from "../src/banks/elements.js";
import { NATAL_INTERACTION_TEMPLATES } from "../src/banks/natal-interactions.js";
import { TRANSIT_INTERACTION_TEMPLATES } from "../src/banks/transit-interactions.js";
import { ELEMENT_DAY_TEMPLATES, TEN_GOD_TEMPLATES } from "../src/banks/transit-days.js";
import { AGENCY_POOLS } from "../src/banks/agency.js";
import { COMPARE_TEMPLATES } from "../src/banks/compare.js";
import { LUCK_TEMPLATES } from "../src/banks/luck.js";

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

export const ELEMENTS: readonly Element[] = ["wood", "fire", "earth", "metal", "water"];

export const NATAL_PALACES: readonly Palace[] = ["year", "month", "day", "hour"];

export const INTERACTIONS: readonly InteractionType[] = [
  "six-combine",
  "six-clash",
  "trine",
  "punishment",
  "harm",
];

export const TEN_GODS: readonly string[] = [
  "Friend",
  "Rob Wealth",
  "Eating God",
  "Hurting Officer",
  "Indirect Wealth",
  "Direct Wealth",
  "Seven Killings",
  "Direct Officer",
  "Indirect Resource",
  "Direct Resource",
];

/** Fill every placeholder with a representative value so templates read as real lines. */
function render(template: string): string {
  return template
    .replaceAll("{branches}", "子午")
    .replaceAll("{palaces}", "career palace")
    .replaceAll("{palace}", "career palace")
    .replaceAll("{when}", "today")
    .replaceAll("{element}", "Water")
    .replaceAll("{from}", "33")
    .replaceAll("{to}", "43")
    .replaceAll("{aBranch}", "子")
    .replaceAll("{bBranch}", "午")
    .replaceAll("{aPalace}", "career palace")
    .replaceAll("{bPalace}", "roots")
    .replaceAll("{aElement}", "Water")
    .replaceAll("{bElement}", "Wood")
    .replaceAll("{god}", "Eating God")
    .replaceAll("{chinese}", "食神")
    .replaceAll("{gloss}", "making for the joy of it");
}

/** Every user-facing line in the whole bank, rendered with sample values. */
export function allBankLines(): string[] {
  const raw: string[] = [
    ...Object.values(DAY_MASTER_LINES).flat(),
    ...Object.values(DOMINANT_LINES).flat(),
    ...Object.values(MISSING_LINES).flat(),
    ...BALANCED_LINES,
    ...STRONG_LINES,
    ...WEAK_LINES,
    ...Object.values(FAVORABLE_LINES),
    ...Object.values(CAREER_LINES),
    ...NATAL_INTERACTION_TEMPLATES,
    ...TRANSIT_INTERACTION_TEMPLATES,
    ...ELEMENT_DAY_TEMPLATES,
    ...TEN_GOD_TEMPLATES,
    ...Object.values(AGENCY_POOLS).flat(),
    ...COMPARE_TEMPLATES,
    ...LUCK_TEMPLATES,
  ];
  return raw.map(render);
}

/** A compare fact array with one fact of every kind/variant present. */
export function compareFactSet(): import("@daymaster/bazi-engine").CompareFact[] {
  return [
    {
      kind: "compare-day-masters",
      aStem: "戊",
      bStem: "甲",
      aElement: "earth",
      bElement: "wood",
      relation: "officer",
      aSeesB: { english: "Seven Killings", chinese: "七杀" },
      bSeesA: { english: "Indirect Wealth", chinese: "偏财" },
    },
    {
      kind: "compare-interaction",
      interaction: "six-combine",
      branches: ["子", "丑"],
      aPalace: "month",
      bPalace: "year",
    },
    {
      kind: "compare-interaction",
      interaction: "six-clash",
      branches: ["子", "午"],
      aPalace: "month",
      bPalace: "hour",
    },
    {
      kind: "compare-interaction",
      interaction: "trine",
      element: "water",
      branches: ["申", "子"],
      aPalace: "hour",
      bPalace: "day",
    },
    {
      kind: "compare-interaction",
      interaction: "punishment",
      punishmentKind: "mutual",
      branches: ["子", "卯"],
      aPalace: "day",
      bPalace: "month",
    },
    {
      kind: "compare-interaction",
      interaction: "punishment",
      punishmentKind: "self",
      branches: ["辰", "辰"],
      aPalace: "day",
      bPalace: "day",
    },
    {
      kind: "compare-interaction",
      interaction: "harm",
      branches: ["戌", "酉"],
      aPalace: "year",
      bPalace: "month",
    },
    { kind: "compare-element-support", direction: "b-to-a", element: "fire" },
    { kind: "compare-element-support", direction: "a-to-b", element: "water" },
  ];
}

/** A representative set of complete natal fact arrays covering the enum space. */
export function natalFactSets(): ReadingFact[][] {
  const sets: ReadingFact[][] = [];
  for (const stem of STEMS) {
    for (const dominant of ELEMENTS) {
      const missing: Element[] = ELEMENTS.filter((element) => element !== dominant).slice(0, 1);
      sets.push([
        { kind: "day-master", stem, element: "water", polarity: "yang" },
        {
          kind: "element-balance",
          counts: { wood: 2, fire: 1, earth: 3, metal: 1, water: 2 },
          dominant,
          missing,
        },
        { kind: "strength", value: dominant === "wood" ? "strong" : "weak" },
        { kind: "favorable", elements: [dominant, missing[0] as Element] },
      ]);
    }
  }
  return sets;
}

/** A natal fact array with one interaction of every kind/variant present. */
export function natalWithInteractions(): ReadingFact[] {
  return [
    { kind: "day-master", stem: "戊", element: "earth", polarity: "yang" },
    {
      kind: "element-balance",
      counts: { wood: 1, fire: 1, earth: 4, metal: 1, water: 1 },
      dominant: "earth",
      missing: [],
    },
    { kind: "strength", value: "strong" },
    { kind: "favorable", elements: ["water", "metal"] },
    {
      kind: "natal-interaction",
      interaction: "six-combine",
      branches: ["子", "丑"],
      palaces: ["year", "month"],
    },
    {
      kind: "natal-interaction",
      interaction: "six-clash",
      branches: ["子", "午"],
      palaces: ["month", "day"],
    },
    {
      kind: "natal-interaction",
      interaction: "trine",
      branches: ["申", "子", "辰"],
      palaces: ["year", "month", "day"],
      element: "water",
      completeness: "full",
    },
    {
      kind: "natal-interaction",
      interaction: "trine",
      branches: ["申", "子"],
      palaces: ["year", "month"],
      element: "water",
      completeness: "half",
    },
    {
      kind: "natal-interaction",
      interaction: "punishment",
      branches: ["寅", "巳", "申"],
      palaces: ["year", "month", "day"],
      punishmentKind: "mutual",
    },
    {
      kind: "natal-interaction",
      interaction: "punishment",
      branches: ["辰", "辰"],
      palaces: ["day", "day"],
      punishmentKind: "self",
    },
    {
      kind: "natal-interaction",
      interaction: "harm",
      branches: ["子", "未"],
      palaces: ["year", "day"],
    },
  ];
}

/** A daily fact array with a transit interaction plus the always-present day facts. */
export function dailyFactSet(
  interaction: InteractionType,
  natalPalace: Palace,
  transitPalace: Palace,
  options: { element?: Element; favorable?: boolean; god?: string; english?: string } = {},
): ReadingFact[] {
  return [
    {
      kind: "transit-interaction",
      interaction,
      branches: ["子", "午"],
      natalPalaces: [natalPalace],
      transitPalace,
    },
    { kind: "element-day", element: options.element ?? "wood", favorable: options.favorable ?? true },
    { kind: "ten-god-day", god: options.god ?? "比肩", english: options.english ?? "Friend" },
  ];
}
