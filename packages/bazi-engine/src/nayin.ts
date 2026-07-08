/**
 * Na Yin (納音): the "melodic element" name shared by each consecutive pair of
 * sexagenary pillars (data/nayin-tables.ts).
 */

import { NAYIN } from "../data/nayin-tables.js";
import { pillarToSexagenaryIndex } from "./sexagenary.js";
import type { NaYin, Pillar } from "./types.js";

/** The Na Yin of a pillar (甲戌 → 山頭火 "Fire on the Mountain", fire). */
export function naYin(pillar: Pillar): NaYin {
  const definition = NAYIN[Math.floor(pillarToSexagenaryIndex(pillar) / 2)]!;
  return { ...definition };
}
