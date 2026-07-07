/**
 * Hidden stems (藏干): the concealed stems carried within each branch.
 */

import { HIDDEN_STEMS } from "../data/tables.js";
import type { Branch, Stem } from "./types.js";

/**
 * The hidden stems of a branch, principal stem first. Returns a fresh array so
 * callers cannot mutate the reference table.
 */
export function hiddenStems(branch: Branch): Stem[] {
  return [...HIDDEN_STEMS[branch]];
}
