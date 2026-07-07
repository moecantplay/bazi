/**
 * Branch-relationship reference groups for the interactions engine.
 *
 * Every group is transcribed directly from the project brief §11; no relation is
 * invented. Order within a pair/group is preserved as the brief gives it.
 *
 * Source: project brief §11
 */

import type { Branch, Element } from "../src/types.js";

/** Six Combines (六合): harmonising branch pairs. Source: project brief §11 */
export const SIX_COMBINES: readonly (readonly [Branch, Branch])[] = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
];

/** Six Clashes (六冲): opposing branch pairs. Source: project brief §11 */
export const SIX_CLASHES: readonly (readonly [Branch, Branch])[] = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
];

/** A Three-Harmony trine (三合) and the element it forms. */
export interface TrineDefinition {
  branches: readonly [Branch, Branch, Branch];
  element: Element;
}

/** Trines (三合局): 3-branch elemental frames. Source: project brief §11 */
export const TRINES: readonly TrineDefinition[] = [
  { branches: ["申", "子", "辰"], element: "water" },
  { branches: ["寅", "午", "戌"], element: "fire" },
  { branches: ["巳", "酉", "丑"], element: "metal" },
  { branches: ["亥", "卯", "未"], element: "wood" },
];

/** A Punishment (刑) group and its variety. */
export interface PunishmentDefinition {
  branches: readonly Branch[];
  /** `"mutual"` = distinct branches punish; `"self"` = the branch repeated. */
  kind: "mutual" | "self";
}

/**
 * Punishments (刑): the three-branch mutual groups 寅巳申 and 丑戌未, the
 * two-branch group 子卯, and the self-punishments 辰 午 酉 亥 (branch repeated).
 * Source: project brief §11
 */
export const PUNISHMENTS: readonly PunishmentDefinition[] = [
  { branches: ["寅", "巳", "申"], kind: "mutual" },
  { branches: ["丑", "戌", "未"], kind: "mutual" },
  { branches: ["子", "卯"], kind: "mutual" },
  { branches: ["辰", "辰"], kind: "self" },
  { branches: ["午", "午"], kind: "self" },
  { branches: ["酉", "酉"], kind: "self" },
  { branches: ["亥", "亥"], kind: "self" },
];

/** Harms (六害): undermining branch pairs. Source: project brief §11 */
export const HARMS: readonly (readonly [Branch, Branch])[] = [
  ["子", "未"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["酉", "戌"],
];
