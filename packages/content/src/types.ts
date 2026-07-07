/**
 * Public shapes returned by the content layer.
 *
 * A ReadingLine is the atom every reading is built from: user-facing text plus
 * an optional short citation of the fact it came from (null for pure-voice
 * lines that cite nothing).
 */

/** One rendered line plus its citation. */
export interface ReadingLine {
  text: string;
  /** Short human-readable citation, e.g. "子午 clash · career palace". */
  factTag: string | null;
}

/** Stable machine identifiers for natal sections; display titles may change. */
export type ReadingSectionKey = "day-master" | "elements" | "favorable" | "structure";

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

/** A daily reading: the body lines plus the always-present agency line. */
export interface DailyReading {
  lines: ReadingLine[];
  /** One concrete thing to do today, always present, rendered last. */
  agency: ReadingLine;
}
