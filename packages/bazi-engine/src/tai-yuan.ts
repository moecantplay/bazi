/**
 * 胎元 (conception pillar): the month pillar's stem advanced one and branch
 * advanced three — the classical estimate of the conception month.
 * Source: 淵海子平 論胎元 (丙子 → 丁卯).
 */

import { branchAt, branchIndex, stemAt, stemIndex } from "./sexagenary.js";
import type { Pillar } from "./types.js";

export function taiYuan(monthPillar: Pillar): Pillar {
  return {
    stem: stemAt(stemIndex(monthPillar.stem) + 1),
    branch: branchAt(branchIndex(monthPillar.branch) + 3),
  };
}
