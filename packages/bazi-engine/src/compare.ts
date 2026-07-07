/**
 * Two-chart comparison (M8): cross-chart branch interactions and the
 * day-master relationship, as typed CompareFacts for the content layer.
 *
 * Only PAIR relations across the two charts are reported — one branch from
 * each person. Patterns living inside a single chart belong to that chart's
 * own reading, and three-branch groups (full trines, the 寅巳申/丑戌未
 * punishments) are represented by their cross pairs: two trine members across
 * charts read as a trine affinity, and the three-branch punishments are
 * intentionally not reduced to pairs (no pair in those groups punishes on its
 * own per brief §11).
 */

import {
  HARMS,
  PUNISHMENTS,
  SIX_CLASHES,
  SIX_COMBINES,
  TRINES,
} from "../data/interactions-tables.js";
import { ELEMENT_PRODUCTION_ORDER } from "../data/tables.js";
import { elementOfStem } from "./attributes.js";
import { relate, type ElementRelation } from "./five-elements.js";
import { tenGods } from "./ten-gods.js";
import type {
  Branch,
  Chart,
  Element,
  InteractionType,
  Palace,
  PalacedBranch,
  Stem,
  TenGod,
} from "./types.js";

/** One relation between a branch of chart A and a branch of chart B. */
export interface CompareInteraction {
  type: InteractionType;
  /** Always [A's branch, B's branch]. */
  branches: [Branch, Branch];
  aPalace: Palace;
  bPalace: Palace;
  element?: Element;
  punishmentKind?: "mutual" | "self";
}

/** A structured observation about the pair of charts. */
export type CompareFact =
  | {
      kind: "compare-day-masters";
      aStem: Stem;
      bStem: Stem;
      aElement: Element;
      bElement: Element;
      /** How A's element relates to B's ("output" = A feeds B, ...). */
      relation: ElementRelation;
      /** B's day stem as seen from A's day master, and the reverse. */
      aSeesB: TenGod;
      bSeesA: TenGod;
    }
  | ({ kind: "compare-interaction"; interaction: InteractionType } & Omit<
      CompareInteraction,
      "type"
    >)
  | { kind: "compare-element-support"; direction: "a-to-b" | "b-to-a"; element: Element };

function entriesFor(entries: PalacedBranch[], branch: Branch): PalacedBranch[] {
  return entries.filter((entry) => entry.branch === branch);
}

/** Cross matches for one branch pair, in both orientations, branches as [A's, B's]. */
function crossPair(
  a: PalacedBranch[],
  b: PalacedBranch[],
  pair: readonly [Branch, Branch],
  build: (aBranch: Branch, bBranch: Branch, aPalace: Palace, bPalace: Palace) => CompareInteraction,
): CompareInteraction[] {
  const [first, second] = pair;
  const results: CompareInteraction[] = [];
  const orientations: readonly [Branch, Branch][] =
    first === second ? [[first, second]] : [[first, second], [second, first]];
  for (const [aBranch, bBranch] of orientations) {
    for (const aEntry of entriesFor(a, aBranch)) {
      for (const bEntry of entriesFor(b, bBranch)) {
        results.push(build(aBranch, bBranch, aEntry.palace, bEntry.palace));
      }
    }
  }
  return results;
}

/** All pair interactions with one branch from each person. */
export function compareInteractions(
  a: PalacedBranch[],
  b: PalacedBranch[],
): CompareInteraction[] {
  const results: CompareInteraction[] = [];

  const pairKinds: [readonly (readonly [Branch, Branch])[], InteractionType][] = [
    [SIX_COMBINES, "six-combine"],
    [SIX_CLASHES, "six-clash"],
  ];
  for (const [table, type] of pairKinds) {
    for (const pair of table) {
      results.push(
        ...crossPair(a, b, pair, (aBranch, bBranch, aPalace, bPalace) => ({
          type,
          branches: [aBranch, bBranch],
          aPalace,
          bPalace,
        })),
      );
    }
  }

  for (const { branches, element } of TRINES) {
    for (const first of branches) {
      for (const second of branches) {
        if (first === second) {
          continue;
        }
        // Ordered member pairs: orientation is fixed, so pass a one-way pair.
        for (const aEntry of entriesFor(a, first)) {
          for (const bEntry of entriesFor(b, second)) {
            results.push({
              type: "trine",
              element,
              branches: [first, second],
              aPalace: aEntry.palace,
              bPalace: bEntry.palace,
            });
          }
        }
      }
    }
  }

  for (const { branches, kind } of PUNISHMENTS) {
    if (branches.length !== 2) {
      continue; // three-branch groups have no punishing pair
    }
    const pair = [branches[0]!, branches[1]!] as const;
    results.push(
      ...crossPair(a, b, pair, (aBranch, bBranch, aPalace, bPalace) => ({
        type: "punishment",
        punishmentKind: kind,
        branches: [aBranch, bBranch],
        aPalace,
        bPalace,
      })),
    );
  }

  for (const pair of HARMS) {
    results.push(
      ...crossPair(a, b, pair, (aBranch, bBranch, aPalace, bPalace) => ({
        type: "harm",
        branches: [aBranch, bBranch],
        aPalace,
        bPalace,
      })),
    );
  }

  return results;
}

function palacedBranches(chart: Chart): PalacedBranch[] {
  const entries: PalacedBranch[] = [
    { branch: chart.year.branch, palace: "year" },
    { branch: chart.month.branch, palace: "month" },
    { branch: chart.day.branch, palace: "day" },
  ];
  if (chart.hour) {
    entries.push({ branch: chart.hour.branch, palace: "hour" });
  }
  return entries;
}

/** Same dominant rule as facts.ts: highest count, production order breaks ties. */
function dominantElement(counts: Record<Element, number>): Element {
  return ELEMENT_PRODUCTION_ORDER.reduce((best, element) =>
    counts[element] > counts[best] ? element : best,
  );
}

/** Structured facts about how chart A and chart B meet. Deterministic. */
export function compareFacts(a: Chart, b: Chart): CompareFact[] {
  const facts: CompareFact[] = [
    {
      kind: "compare-day-masters",
      aStem: a.dayMaster,
      bStem: b.dayMaster,
      aElement: elementOfStem(a.dayMaster),
      bElement: elementOfStem(b.dayMaster),
      relation: relate(elementOfStem(a.dayMaster), elementOfStem(b.dayMaster)),
      aSeesB: tenGods(a.dayMaster, b.dayMaster),
      bSeesA: tenGods(b.dayMaster, a.dayMaster),
    },
  ];

  for (const interaction of compareInteractions(palacedBranches(a), palacedBranches(b))) {
    const { type, ...rest } = interaction;
    facts.push({ kind: "compare-interaction", interaction: type, ...rest });
  }

  if (a.favorableElements.includes(dominantElement(b.fiveElementCounts))) {
    facts.push({
      kind: "compare-element-support",
      direction: "b-to-a",
      element: dominantElement(b.fiveElementCounts),
    });
  }
  if (b.favorableElements.includes(dominantElement(a.fiveElementCounts))) {
    facts.push({
      kind: "compare-element-support",
      direction: "a-to-b",
      element: dominantElement(a.fiveElementCounts),
    });
  }

  return facts;
}
