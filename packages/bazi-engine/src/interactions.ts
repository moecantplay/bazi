/**
 * Branch interactions: combines, clashes, trines, punishments, and harms.
 *
 * The engine takes palace-tagged branches (natal pillars, and optionally luck /
 * annual / daily transit branches) and reports every relation present together
 * with the palaces involved, so callers can describe which pillars interact.
 */

import {
  HARMS,
  PUNISHMENTS,
  SIX_CLASHES,
  SIX_COMBINES,
  TRINES,
} from "../data/interactions-tables.js";
import type { Branch, Interaction, PalacedBranch } from "./types.js";

type PairKind = "six-combine" | "six-clash" | "harm";

/** Every combination that takes one entry from each list (Cartesian product). */
function cartesian<T>(lists: T[][]): T[][] {
  return lists.reduce<T[][]>(
    (acc, list) => acc.flatMap((prefix) => list.map((item) => [...prefix, item])),
    [[]],
  );
}

function entriesFor(entries: PalacedBranch[], branch: Branch): PalacedBranch[] {
  return entries.filter((entry) => entry.branch === branch);
}

/** Detect two-branch relations (combine / clash / harm) across distinct branches. */
function detectPairs(
  entries: PalacedBranch[],
  pairs: readonly (readonly [Branch, Branch])[],
  kind: PairKind,
): Interaction[] {
  const results: Interaction[] = [];
  for (const [first, second] of pairs) {
    for (const a of entriesFor(entries, first)) {
      for (const b of entriesFor(entries, second)) {
        // `kind` is one of the three pair discriminants; the shape matches.
        results.push({
          type: kind,
          branches: [first, second],
          palaces: [a.palace, b.palace],
        } as Interaction);
      }
    }
  }
  return results;
}

function detectTrines(entries: PalacedBranch[]): Interaction[] {
  const results: Interaction[] = [];
  for (const { branches, element } of TRINES) {
    const present = branches.filter((branch) => entriesFor(entries, branch).length > 0);
    if (present.length < 2) {
      continue;
    }
    const completeness = present.length === 3 ? "full" : "half";
    const lists = present.map((branch) => entriesFor(entries, branch));
    for (const combo of cartesian(lists)) {
      results.push({
        type: "trine",
        element,
        completeness,
        branches: present.map((branch) => branch),
        palaces: combo.map((entry) => entry.palace),
      });
    }
  }
  return results;
}

function detectPunishments(entries: PalacedBranch[]): Interaction[] {
  const results: Interaction[] = [];
  for (const { branches, kind } of PUNISHMENTS) {
    if (kind === "self") {
      const branch = branches[0]!;
      const matches = entriesFor(entries, branch);
      for (let i = 0; i < matches.length; i += 1) {
        for (let j = i + 1; j < matches.length; j += 1) {
          results.push({
            type: "punishment",
            kind,
            branches: [branch, branch],
            palaces: [matches[i]!.palace, matches[j]!.palace],
          });
        }
      }
      continue;
    }
    const lists = branches.map((branch) => entriesFor(entries, branch));
    if (lists.some((list) => list.length === 0)) {
      continue;
    }
    for (const combo of cartesian(lists)) {
      results.push({
        type: "punishment",
        kind,
        branches: branches.map((branch) => branch),
        palaces: combo.map((entry) => entry.palace),
      });
    }
  }
  return results;
}

/**
 * All interactions present among the supplied palace-tagged branches. Mutual
 * (multi-branch) punishments and full trines require every listed branch to be
 * present; half trines require exactly two of three.
 */
export function interactions(entries: PalacedBranch[]): Interaction[] {
  return [
    ...detectPairs(entries, SIX_COMBINES, "six-combine"),
    ...detectPairs(entries, SIX_CLASHES, "six-clash"),
    ...detectTrines(entries),
    ...detectPunishments(entries),
    ...detectPairs(entries, HARMS, "harm"),
  ];
}

/** Convenience: build palace-tagged branches from a natal chart's pillars. */
export function natalPalacedBranches(
  branches: { year: Branch; month: Branch; day: Branch; hour: Branch | null },
): PalacedBranch[] {
  const entries: PalacedBranch[] = [
    { branch: branches.year, palace: "year" },
    { branch: branches.month, palace: "month" },
    { branch: branches.day, palace: "day" },
  ];
  if (branches.hour !== null) {
    entries.push({ branch: branches.hour, palace: "hour" });
  }
  return entries;
}
