/**
 * The reader's best hour (M24-13): of a day's twelve two-hour blocks, the one
 * that suits the natal chart most. It sits beside the day's easy and rough
 * hours (hour-interaction facts), which stay the almanac's and the same for
 * everyone.
 *
 * Each block's pillar follows the Five Rats rule from the day stem, so its
 * element changes day to day. Scoring and gate: data/best-hour-tables.ts.
 * Never picks the day's rough hour. Ties go to the stem element earlier in
 * `favorableElements` (already ordered, climate first), then to the earlier
 * block in the day (子 first). The natal hour pillar is never read, so an
 * unknown-time chart is treated the same.
 */

import { BEST_HOUR_WEIGHTS } from "../data/best-hour-tables.js";
import { SIX_CLASHES, SIX_COMBINES } from "../data/interactions-tables.js";
import { FIVE_RATS } from "../data/tables.js";
import { elementOfStem } from "./attributes.js";
import { hiddenStems } from "./hidden-stems.js";
import { hourBlockWindow } from "./pillars.js";
import { branchAt, stemAt, stemIndex } from "./sexagenary.js";
import type { Branch, Chart, Element, Pillar, Stem } from "./types.js";

/** A typed, citable contribution to a block's score. */
export type BestHourReason =
  | { source: "stem-element"; element: Element }
  | { source: "branch-element"; element: Element }
  | { source: "easy-hour"; dayBranch: Branch }
  | { source: "natal-combine"; natalBranch: Branch }
  | { source: "natal-clash"; natalBranch: Branch };

export interface BestHour {
  kind: "best-hour";
  hourBranch: Branch;
  hourStem: Stem;
  /** The block stem's element — always one the chart favours. */
  element: Element;
  /** Block start, 0–23 (子 starts at 23 and wraps past midnight). */
  startHour: number;
  /** Block end, exclusive, 0–23. */
  endHour: number;
  /** Same block as the day's easy hour. */
  isEasyHour: boolean;
  score: number;
  reasons: BestHourReason[];
}

interface ScoredBlock {
  fact: BestHour;
  slot: number;
  /** Position of the stem element in favorableElements (lower ranks higher). */
  elementRank: number;
}

function pairMatches(pairs: readonly (readonly [Branch, Branch])[], a: Branch, b: Branch): boolean {
  return pairs.some(([first, second]) => (first === a && second === b) || (first === b && second === a));
}

function scoreBlock(chart: Chart, day: Pillar, slot: number): ScoredBlock | null {
  const hourStem = stemAt(stemIndex(FIVE_RATS[day.stem]) + slot);
  const hourBranch = branchAt(slot);
  const element = elementOfStem(hourStem);
  const elementRank = chart.favorableElements.indexOf(element);
  if (elementRank < 0) {
    return null;
  }

  let score = BEST_HOUR_WEIGHTS.stemElement;
  const reasons: BestHourReason[] = [{ source: "stem-element", element }];

  const branchElement = elementOfStem(hiddenStems(hourBranch)[0]!);
  if (chart.favorableElements.includes(branchElement)) {
    score += BEST_HOUR_WEIGHTS.branchElement;
    reasons.push({ source: "branch-element", element: branchElement });
  }
  const isEasyHour = pairMatches(SIX_COMBINES, hourBranch, day.branch);
  if (isEasyHour) {
    score += BEST_HOUR_WEIGHTS.easyHour;
    reasons.push({ source: "easy-hour", dayBranch: day.branch });
  }
  if (pairMatches(SIX_COMBINES, hourBranch, chart.day.branch)) {
    score += BEST_HOUR_WEIGHTS.natalCombine;
    reasons.push({ source: "natal-combine", natalBranch: chart.day.branch });
  }
  if (pairMatches(SIX_CLASHES, hourBranch, chart.day.branch)) {
    score += BEST_HOUR_WEIGHTS.natalClash;
    reasons.push({ source: "natal-clash", natalBranch: chart.day.branch });
  }

  return {
    fact: { kind: "best-hour", hourBranch, hourStem, element, ...hourBlockWindow(hourBranch), isEasyHour, score, reasons },
    slot,
    elementRank,
  };
}

function ranksAbove(candidate: ScoredBlock, best: ScoredBlock): boolean {
  if (candidate.fact.score !== best.fact.score) {
    return candidate.fact.score > best.fact.score;
  }
  if (candidate.elementRank !== best.elementRank) {
    return candidate.elementRank < best.elementRank;
  }
  return candidate.slot < best.slot;
}

/** The chart's best hour on a day, or null when no block's stem element suits the chart. */
export function bestHourFact(chart: Chart, day: Pillar): BestHour | null {
  let best: ScoredBlock | null = null;
  for (let slot = 0; slot < 12; slot += 1) {
    if (pairMatches(SIX_CLASHES, branchAt(slot), day.branch)) {
      continue;
    }
    const block = scoreBlock(chart, day, slot);
    if (block && (!best || ranksAbove(block, best))) {
      best = block;
    }
  }
  return best ? best.fact : null;
}
