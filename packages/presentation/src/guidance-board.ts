/**
 * The day's merged guidance board: the almanac chips split by leaning, and
 * the guidance prose grouped so consecutive lines citing the same fact render
 * as one block instead of a card per line.
 */

import type { ReadingLine } from "@daymaster/content";
import type { GuidanceChip } from "./guidance.js";

export interface GuidanceBoard {
  favors: GuidanceChip[];
  watch: GuidanceChip[];
}

/** Splits the day's chips into the two board tiles: favors and friction. */
export function guidanceBoardFor(chips: readonly GuidanceChip[]): GuidanceBoard {
  return {
    favors: chips.filter((chip) => chip.leaning === "favors"),
    watch: chips.filter((chip) => chip.leaning === "friction")
  };
}

/**
 * Consecutive prose lines that cite the same fact grouped into one block —
 * caption once, sentences as paragraphs — so an officer day reads as one
 * block instead of three sibling cards all captioned e.g. "Success day".
 */
export function groupGuidanceByFactTag(lines: readonly ReadingLine[]): ReadingLine[][] {
  const groups: ReadingLine[][] = [];
  let current: ReadingLine[] | null = null;
  let currentKey: string | null = null;
  for (const line of lines) {
    // factTagRuns is structured data, not a primitive — compare by
    // serialized shape (both are plain, serializable TokenLines).
    const key = line.factTagRuns ? JSON.stringify(line.factTagRuns) : null;
    if (current && currentKey === key) {
      current.push(line);
    } else {
      current = [line];
      currentKey = key;
      groups.push(current);
    }
  }
  return groups;
}
