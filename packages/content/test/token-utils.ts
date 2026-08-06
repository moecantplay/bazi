/**
 * Structural test helpers for the token-run shape (`ContentRun`/`TokenLine`).
 * The new-style version of VOICE.md rule 11's "every term is glossed" check:
 * instead of rendering a line and regex-stripping it, assert directly that
 * every term run in a line's `runs` carries a non-empty gloss.
 */

import { expect } from "vitest";
import type { ReadingLine, TokenLine } from "../src/index.js";
import { plainGloss } from "../src/index.js";

export { plainGloss };

/** Every `{kind:"term"}` run in the sequence has a non-empty gloss. */
export function assertGlossed(runs: TokenLine): void {
  const termRuns = runs.filter((run) => run.kind === "term");
  for (const run of termRuns) {
    expect(run.gloss.length, `term run for "${run.term}" must carry a gloss`).toBeGreaterThan(0);
  }
}

/** A ReadingLine's body, rendered gloss-only — the pre-M19 `.text` equivalent for test assertions. */
export function lineText(line: ReadingLine): string {
  return plainGloss(line.runs);
}

/** A ReadingLine's citation, rendered gloss-only — the pre-M19 `.factTag` equivalent for test assertions. */
export function lineFactTag(line: ReadingLine): string | null {
  return line.factTagRuns ? plainGloss(line.factTagRuns) : null;
}
