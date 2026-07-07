/**
 * Sexagenary cycle (六十甲子) utilities.
 *
 * The 60-cycle pairs the 10 stems and 12 branches: cycle index `n` has
 * stem `n mod 10` and branch `n mod 12`. Because gcd(10, 12) = 2, only the 60
 * combinations whose stem and branch share parity actually occur.
 */

import { BRANCHES, STEMS } from "../data/tables.js";
import type { Branch, Pillar, Stem } from "./types.js";

/** Non-negative modulo (unlike `%`, never returns a negative result). */
function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

/** The stem at cycle position `n` (wraps every 10). */
export function stemAt(n: number): Stem {
  // `mod` keeps the index within 0–9, so the lookup is always defined.
  return STEMS[mod(n, 10)]!;
}

/** The branch at cycle position `n` (wraps every 12). */
export function branchAt(n: number): Branch {
  // `mod` keeps the index within 0–11, so the lookup is always defined.
  return BRANCHES[mod(n, 12)]!;
}

/** The 0-based index (0–9) of a stem within the 10-stem cycle. */
export function stemIndex(stem: Stem): number {
  return STEMS.indexOf(stem);
}

/** The 0-based index (0–11) of a branch within the 12-branch cycle. */
export function branchIndex(branch: Branch): number {
  return BRANCHES.indexOf(branch);
}

/** The pillar at sexagenary cycle index `n` (any integer; wraps every 60). */
export function sexagenaryPillar(n: number): Pillar {
  return { stem: stemAt(n), branch: branchAt(n) };
}

/**
 * The 0-based sexagenary index (0–59) of a pillar.
 *
 * Solves `index ≡ stemIndex (mod 10)` and `index ≡ branchIndex (mod 12)`.
 * The closed form `(stemIndex·6 − branchIndex·5) mod 60` satisfies both.
 * Throws if the stem/branch parity is inconsistent (an impossible pillar).
 */
export function pillarToSexagenaryIndex(pillar: Pillar): number {
  const stem = stemIndex(pillar.stem);
  const branch = branchIndex(pillar.branch);
  const index = mod(stem * 6 - branch * 5, 60);
  if (mod(index, 10) !== stem || mod(index, 12) !== branch) {
    throw new Error(
      `Invalid pillar ${pillar.stem}${pillar.branch}: stem and branch parity disagree`,
    );
  }
  return index;
}
