/**
 * Runtime access to the embedded solar-term table.
 *
 * This module reads ONLY `data/solar-terms.json` (generated offline). It never
 * performs astronomy computation, so month/year boundaries are deterministic
 * and dependency-free at runtime.
 */

import rawSolarTerms from "../data/solar-terms.json" with { type: "json" };
import type { SolarTermEntry } from "./types.js";

/** All embedded jié, in strictly increasing instant order. */
export const SOLAR_TERMS: readonly SolarTermEntry[] =
  rawSolarTerms as SolarTermEntry[];

/** Epoch-millis of each entry, index-aligned with {@link SOLAR_TERMS}. */
const EPOCHS: readonly number[] = SOLAR_TERMS.map((term) => Date.parse(term.iso));

/** Indices of the 立春 entries within {@link SOLAR_TERMS}. */
const LI_CHUN_INDICES: readonly number[] = SOLAR_TERMS.reduce<number[]>(
  (indices, term, index) => {
    if (term.name === "立春") {
      indices.push(index);
    }
    return indices;
  },
  [],
);

/**
 * Index into a sorted-ascending array of the last element `≤ target`, or -1 if
 * every element is greater. `at(index)` maps a position in `indices` to the
 * comparable value.
 */
function lastAtOrBefore(
  length: number,
  target: number,
  at: (index: number) => number,
): number {
  let low = 0;
  let high = length - 1;
  let result = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (at(mid) <= target) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}

// The following accessors are only ever called with indices produced by the
// binary search or the 立春-index list, so the lookups are always defined.
function epochAt(index: number): number {
  return EPOCHS[index]!;
}

function termAt(index: number): SolarTermEntry {
  return SOLAR_TERMS[index]!;
}

/** Epoch-millis of the first and last jié the embedded table covers. */
const FIRST_INSTANT = epochAt(0);
const LAST_INSTANT = epochAt(SOLAR_TERMS.length - 1);

/** Throw if `instant` falls outside the table's coverage on either side. */
function assertInRange(instant: Date): void {
  const target = instant.getTime();
  if (target < FIRST_INSTANT) {
    throw new RangeError(
      `Instant ${instant.toISOString()} precedes the solar-term table (from ${termAt(0).iso})`,
    );
  }
  if (target > LAST_INSTANT) {
    throw new RangeError(
      `Instant ${instant.toISOString()} is past the final solar term (${termAt(SOLAR_TERMS.length - 1).iso})`,
    );
  }
}

/** The jié governing `instant`: the most recent term at or before it. */
export function findGoverningTerm(instant: Date): SolarTermEntry {
  assertInRange(instant);
  const target = instant.getTime();
  const position = lastAtOrBefore(SOLAR_TERMS.length, target, epochAt);
  return termAt(position);
}

/** The first jié strictly after `instant` (the next month boundary). */
export function findNextTerm(instant: Date): SolarTermEntry {
  assertInRange(instant);
  const target = instant.getTime();
  const position = lastAtOrBefore(SOLAR_TERMS.length, target, epochAt);
  const next = position + 1;
  if (next >= SOLAR_TERMS.length) {
    throw new RangeError(
      `Instant ${instant.toISOString()} is at or past the end of the solar-term table`,
    );
  }
  return termAt(next);
}

/**
 * The solar year (立春-bounded) that `instant` falls in, as its Gregorian year
 * label. 立春 always lands in early February, so the UTC year of the governing
 * 立春 is the intended solar-year number.
 */
export function findSolarYear(instant: Date): number {
  assertInRange(instant);
  const target = instant.getTime();
  const position = lastAtOrBefore(
    LI_CHUN_INDICES.length,
    target,
    (index) => epochAt(liChunIndexAt(index)),
  );
  if (position < 0) {
    throw new RangeError(
      `Instant ${instant.toISOString()} precedes 立春 ${new Date(epochAt(liChunIndexAt(0))).toISOString()}`,
    );
  }
  const iso = termAt(liChunIndexAt(position)).iso;
  return Number.parseInt(iso.slice(0, 4), 10);
}

function liChunIndexAt(index: number): number {
  return LI_CHUN_INDICES[index]!;
}
