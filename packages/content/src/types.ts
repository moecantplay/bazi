/**
 * Public shapes returned by the content layer.
 *
 * A ReadingLine is the atom every reading is built from: user-facing text plus
 * an optional short citation of the fact it came from (null for pure-voice
 * lines that cite nothing).
 */

import type { Palace } from "@daymaster/bazi-engine";

/** One rendered line plus its citation. */
export interface ReadingLine {
  text: string;
  /** Short human-readable citation, e.g. "子午 clash · career palace". */
  factTag: string | null;
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
