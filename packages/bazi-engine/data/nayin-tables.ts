/**
 * Na Yin (納音, "melodic elements") reference table.
 *
 * The sixty sexagenary pairs group into thirty named sounds, two consecutive
 * pillars per name (甲子+乙丑 = 海中金, …). Canonical list from 三命通會 卷一
 * (論納音取象); the element of each name is the final character (金木水火土).
 * Index = floor(sexagenaryIndex / 2).
 */

import type { Element } from "../src/types.js";

export interface NaYinDefinition {
  chinese: string;
  english: string;
  element: Element;
}

/** The thirty Na Yin names in sexagenary order (index 0 = 甲子/乙丑). */
export const NAYIN: readonly NaYinDefinition[] = [
  { chinese: "海中金", english: "Gold in the Sea", element: "metal" },
  { chinese: "爐中火", english: "Fire in the Furnace", element: "fire" },
  { chinese: "大林木", english: "Great Forest Wood", element: "wood" },
  { chinese: "路旁土", english: "Roadside Earth", element: "earth" },
  { chinese: "劍鋒金", english: "Sword-Edge Metal", element: "metal" },
  { chinese: "山頭火", english: "Fire on the Mountain", element: "fire" },
  { chinese: "澗下水", english: "Stream in the Ravine", element: "water" },
  { chinese: "城頭土", english: "City-Wall Earth", element: "earth" },
  { chinese: "白蠟金", english: "White-Wax Metal", element: "metal" },
  { chinese: "楊柳木", english: "Willow Wood", element: "wood" },
  { chinese: "泉中水", english: "Spring Water", element: "water" },
  { chinese: "屋上土", english: "Rooftop Earth", element: "earth" },
  { chinese: "霹靂火", english: "Thunderbolt Fire", element: "fire" },
  { chinese: "松柏木", english: "Pine and Cypress Wood", element: "wood" },
  { chinese: "長流水", english: "Long River Water", element: "water" },
  { chinese: "沙中金", english: "Gold in the Sand", element: "metal" },
  { chinese: "山下火", english: "Fire Below the Mountain", element: "fire" },
  { chinese: "平地木", english: "Plainland Wood", element: "wood" },
  { chinese: "壁上土", english: "Plaster-Wall Earth", element: "earth" },
  { chinese: "金箔金", english: "Gold-Foil Metal", element: "metal" },
  { chinese: "覆燈火", english: "Lamp-Flame Fire", element: "fire" },
  { chinese: "天河水", english: "Sky-River Water", element: "water" },
  { chinese: "大驛土", english: "Highway Earth", element: "earth" },
  { chinese: "釵釧金", english: "Hairpin Metal", element: "metal" },
  { chinese: "桑柘木", english: "Mulberry Wood", element: "wood" },
  { chinese: "大溪水", english: "Great-Stream Water", element: "water" },
  { chinese: "沙中土", english: "Earth in the Sand", element: "earth" },
  { chinese: "天上火", english: "Fire in the Sky", element: "fire" },
  { chinese: "石榴木", english: "Pomegranate Wood", element: "wood" },
  { chinese: "大海水", english: "Ocean Water", element: "water" },
];
