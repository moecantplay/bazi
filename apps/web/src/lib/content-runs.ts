/**
 * Bridges a content entry's plain string field to its structured TokenLine
 * for rendering. `ReadingLine.runs` is required as of M19's content cleanup
 * (Phase 11) — this fallback only remains for `GlossaryEntry`/`ReadMoreEntry`,
 * whose `titleRuns`/`bodyRuns`/`adviceRuns` fields stayed additive (both are
 * already confirmed Han-clean in their plain-string form, so no stripping is
 * needed here — see packages/content's Phase 2-era research).
 */

import { plainGloss, type TokenLine } from "@daymaster/content";

export function runsOrText(runs: TokenLine | undefined, text: string): TokenLine {
  return runs ?? [{ kind: "text", text }];
}

/** A TokenLine flattened to a plain string, for attributes (aria-label, title) that can't hold JSX. */
export function plainText(line: TokenLine): string {
  return plainGloss(line);
}
