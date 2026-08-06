/**
 * The one place a TokenLine becomes rendered text (DESIGN.md's "one presenter
 * decides register"): a term run shows its gloss, a text run shows itself,
 * concatenated with no visual distinction between them. Presentation's
 * `renderRun` supplies the stable keys; this component only picks the string.
 *
 * M19 Phase 7 flagged a real content-package gap here (dos/donts suggestion
 * fact tags built from raw fact data, never authoring `factTagRuns`, so their
 * text runs could carry unstripped Han) and worked around it with a defensive
 * strip. Phase 11 fixed the gap at the source (`daily-reading.ts`'s
 * `suggestionCandidates()` now authors real `factTagRuns`) — every text run
 * this component ever sees is authored English prose, so the defensive strip
 * is gone along with `stripHanCharacters` itself (retired this same phase).
 */

import { Fragment } from "react";
import type { TokenLine } from "@daymaster/content";
import { renderRun } from "@daymaster/presentation";

interface Props {
  line: TokenLine;
}

export function TokenText({ line }: Props) {
  return (
    <>
      {renderRun(line).map((run) => (
        <Fragment key={run.key}>{run.kind === "term" ? run.gloss : run.text}</Fragment>
      ))}
    </>
  );
}
