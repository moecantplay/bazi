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
   * natal palace a transit touches, "overall" for day-level lines (element,
   * ten god, star, stage), or "hours" for the day's timed line. Absent on
   * lines that never joined an area-grouped reading.
   */
  area?: ReadingArea;
}

/** The sections a daily reading groups into, in the UI's waypoint rail. */
export type ReadingArea = Palace | "overall" | "hours";

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
  area?: ReadingArea;
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

/** What a daily reading is seeded by: the chart (fixed) and the displayed date. */
export interface DailySeed {
  /** The chart's seed, the same every day (natal seed key). */
  chart: string;
  /** The displayed date, "YYYY-MM-DD". */
  date: string;
  /**
   * How many times the day's lead situation has come up before (presentation
   * counts it). Each visit steps the first-screen pools to their next entry,
   * so a situation never reads the same on two visits in a row. Absent: the
   * day number steps them instead.
   */
  visit?: number;
}

/**
 * One plain card below Today's first screen: a fact that isn't the lead,
 * said in everyday words (VOICE.md rule 11). Its "Read more" opens the page
 * for `topic`.
 */
export interface TopicCard {
  /** Topic-page key, unique within the day, e.g. "interaction:trine:year", "stage:Peak", "stars". */
  topic: string;
  /** Small label above the title ("Also today", "Your pace"). */
  kicker: string;
  /** One plain title; the small-signs card has one per star. */
  titles: TokenLine[];
  /** One plain sentence, or null when the titles say it all. */
  line: TokenLine | null;
}

/**
 * Today's reading, composed around one lead fact (VOICE.md rule 13): the
 * first screen is headline → body → agency, and every other fact is a card.
 */
export interface DailyReading {
  /** The day's consequence in the reader's terms. */
  headline: ReadingLine;
  /** How it could show up and how to ease it, 2–3 sentences. */
  body: ReadingLine;
  /** One concrete thing to do today; closes the first screen. */
  agency: ReadingLine;
  /** Topic-page key of the lead fact: the body's "Read more". */
  leadTopic: string;
  /** Topic key of the element when it joined the body, else null. */
  modifierTopic: string | null;
  cards: TopicCard[];
}

/** One star on the small-signs topic page. */
export interface StarEntry {
  title: TokenLine;
  line: TokenLine;
  oldName: TokenLine;
}

/**
 * A topic page: the long form behind a card. Plain first, then the old name
 * once, framed as a name, then the plumbing (VOICE.md rule 11).
 */
export interface TopicPage {
  title: TokenLine;
  /** "The old calendars call this a clash." Null where the topic has no single old name. */
  oldName: TokenLine | null;
  /** How it applies to this chart on this date, sign mechanics in plain words. */
  forYou: TokenLine | null;
  how: TokenLine[];
  work: TokenLine[];
  nameOrigin: TokenLine;
  /** Only the small-signs page lists stars. */
  stars: StarEntry[];
}

/** A two-chart comparison reading: ordered lines, no agency line. */
export interface CompareReading {
  lines: ReadingLine[];
}
