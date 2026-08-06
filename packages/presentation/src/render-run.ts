/**
 * The one place a UI component turns a content TokenLine into renderable
 * runs — every future screen imports this instead of writing its own
 * `runs.map(...)`. Adds a stable `key` (every consumer needs one to render a
 * list) but leaves the register decision (plain text vs. term + gloss vs.
 * term + han) to the caller: this package has no React/JSX dependency, so
 * the actual element choice happens in apps/web.
 */

import type { ContentRun, TokenLine } from "@daymaster/content";

export type RenderedRun = ContentRun & { key: number };

/** Normalizes a TokenLine into keyed runs ready for a component to map over. */
export function renderRun(line: TokenLine): RenderedRun[] {
  return line.map((run, key) => ({ ...run, key }));
}
