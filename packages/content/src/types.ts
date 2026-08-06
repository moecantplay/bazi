/**
 * Public shapes returned by the content layer.
 *
 * A ReadingLine is the atom every reading is built from: user-facing text plus
 * an optional short citation of the fact it came from (null for pure-voice
 * lines that cite nothing).
 */

import type { Palace } from "@daymaster/bazi-engine";
import { textRun, type TokenLine } from "./tokens.js";

/**
 * One rendered line plus its citation, as a run sequence: a system term and
 * its gloss are typed data (`{kind:"term", term, gloss, han?}`), never a
 * substring embedded in prose for a UI presenter to regex-strip. A line with
 * no embedded terms (most dos/donts suggestions, generic fallbacks) is a
 * single `{kind:"text"}` run — that's not a migration shim, it's the correct
 * shape for prose that has nothing to gloss.
 *
 * M19: this used to carry parallel `text: string`/`factTag: string | null`
 * fields (the pre-token-run representation, kept alongside `runs` while the
 * still-deployed old apps/web read them via `stripHanCharacters`). Retired
 * once that app was retired at cutover — `runs`/`factTagRuns` are now the
 * only representation.
 */
export interface ReadingLine {
  runs: TokenLine;
  /** Structured citation, e.g. term runs for "子午" + " clash · career palace". Null for pure-voice lines that cite nothing. */
  factTagRuns: TokenLine | null;
  /**
   * Glossary key for the concept the citation names (e.g. "interaction:trine",
   * "ten-god:Friend"), when one exists — the UI turns the caption into a link
   * to that explainer. Absent for pure-voice lines.
   */
  topic?: string;
  /**
   * The life area the line belongs to, for Co-Star-style area grouping: the
   * natal palace a transit touches, or "overall" for day-level lines
   * (element, ten god, star, stage). Absent on lines that never joined an
   * area-grouped reading.
   */
  area?: Palace | "overall";
}

/**
 * A line mid-authoring, before it's finalized into a public `ReadingLine`.
 * Bank/assembler functions build this shape internally — `text`/`factTag` are
 * always plain-English authoring fields; `runs`/`factTagRuns` are populated
 * directly by banks that have real terms to structure (most banks do, for
 * their fact tag at least), and left absent otherwise. `finalizeLine` is the
 * one place a `DraftLine` becomes the public shape, wrapping bare text as a
 * single text run wherever a bank didn't author real runs.
 */
export interface DraftLine {
  /** Required only when `runs` isn't provided directly — see finalizeLine. */
  text?: string;
  factTag?: string | null;
  runs?: TokenLine;
  factTagRuns?: TokenLine;
  topic?: string;
  area?: Palace | "overall";
}

/** The one place a DraftLine becomes the public ReadingLine shape. */
export function finalizeLine(draft: DraftLine): ReadingLine {
  const line: ReadingLine = {
    runs: draft.runs ?? textRun(draft.text ?? ""),
    factTagRuns: draft.factTagRuns ?? (draft.factTag ? textRun(draft.factTag) : null),
  };
  if (draft.topic) {
    line.topic = draft.topic;
  }
  if (draft.area) {
    line.area = draft.area;
  }
  return line;
}

/** Stable machine identifiers for natal sections; display titles may change. */
export type ReadingSectionKey = "day-master" | "elements" | "favorable" | "structure" | "stars";

/** A titled group of lines within a natal reading. */
export interface ReadingSection {
  /** Stable key for programmatic lookup — consumers must not match on title. */
  key: ReadingSectionKey;
  title: string;
  lines: ReadingLine[];
}

/** The full natal reading: ordered sections, each with lines. */
export interface NatalReading {
  sections: ReadingSection[];
}

/** A daily reading: headline, body lines, suggestions, and the agency line. */
export interface DailyReading {
  /** Display-type hook that opens the reading; pure voice, cites nothing. */
  headline: ReadingLine;
  lines: ReadingLine[];
  /** Small actions the day's grain makes cheaper (1–2, always present). */
  dos: ReadingLine[];
  /** Things worth postponing today (1–2, always present), never prohibitions. */
  donts: ReadingLine[];
  /** One concrete thing to do today, always present, rendered last. */
  agency: ReadingLine;
}

/** A two-chart comparison reading: ordered lines, no agency line. */
export interface CompareReading {
  lines: ReadingLine[];
}
