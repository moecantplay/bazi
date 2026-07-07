/**
 * Shared vocabulary: the fixed words the voice uses for palaces, elements, and
 * interactions, plus the verbatim disclaimer. Formatting only — no chart math.
 */

import type { Element, InteractionType, Palace } from "@daymaster/bazi-engine";

/** Verbatim from VOICE.md — do not edit without editing VOICE.md. */
export const DISCLAIMER =
  "Daymaster is for reflection and entertainment, not advice. BaZi is a living tradition with many schools; this app implements one reading of it, with its assumptions documented. Nothing here predicts your future or diagnoses anything about you. You remain the author.";

/**
 * Palace names as the voice speaks them (VOICE.md §Palace vocabulary):
 * year = roots, month = career palace, day = home palace, hour = horizon.
 */
const PALACE_WORDS: Record<Palace, string> = {
  year: "roots",
  month: "career palace",
  day: "home palace",
  hour: "horizon",
  annual: "this year's current",
  daily: "today's current",
  luck: "this decade",
};

/** The voice word for a palace. */
export function palaceWord(palace: Palace): string {
  return PALACE_WORDS[palace];
}

/** Join several palaces into one readable phrase ("roots and career palace"). */
export function palacePhrase(palaces: readonly Palace[]): string {
  const words = palaces.map(palaceWord);
  if (words.length === 0) {
    return "chart";
  }
  if (words.length === 1) {
    return words[0] as string;
  }
  const head = words.slice(0, -1).join(", ");
  return `${head} and ${words[words.length - 1] as string}`;
}

/** Title-cased element name for display ("water" -> "Water"). */
export function elementWord(element: Element): string {
  return `${element.charAt(0).toUpperCase()}${element.slice(1)}`;
}

/** The voice word for an interaction type ("six-clash" -> "clash"). */
const INTERACTION_WORDS: Record<InteractionType, string> = {
  "six-combine": "combine",
  "six-clash": "clash",
  trine: "trine",
  punishment: "punishment",
  harm: "harm",
};

export function interactionWord(interaction: InteractionType): string {
  return INTERACTION_WORDS[interaction];
}

/** The time-frame word a transit palace speaks in. */
export function transitWhen(transitPalace: Palace): string {
  return transitPalace === "annual" ? "this year" : "today";
}

/** Build a transit/interaction fact tag: "子午 clash · career palace". */
export function interactionTag(
  branches: readonly string[],
  interaction: InteractionType,
  roomPalace: Palace,
): string {
  return `${branches.join("")} ${interactionWord(interaction)} · ${palaceWord(roomPalace)}`;
}

/**
 * Plain-meaning glosses (VOICE.md §11). The single source of truth for what
 * each system term means in ordinary life; banks and UI captions draw from
 * here so a term is always translated the same way. Short fragments, no
 * terminal punctuation — they render as captions and inline asides.
 */
export const INTERACTION_GLOSSES: Record<InteractionType, string> = {
  "six-clash": "two schedules booked for the same hour — something has to move",
  "six-combine": "two people who finish each other's sentences",
  trine: "three branches pulling one direction, a crew that has rowed together for years",
  punishment: "a stone in your shoe — small, recurring, quieter once named",
  harm: "a slow leak rather than a burst pipe",
};

/** Everyday translation of each ten god, keyed by the engine's english label. */
export const TEN_GOD_GLOSSES: Record<string, string> = {
  Friend: "peers at your table",
  "Rob Wealth": "friendly rivalry",
  "Eating God": "making for the joy of it",
  "Hurting Officer": "the witty rule-bender",
  "Indirect Wealth": "the lucky find",
  "Direct Wealth": "the earned paycheck",
  "Seven Killings": "pressure that trains you",
  "Direct Officer": "the dependable rule-keeper",
  "Indirect Resource": "insight from the odd angle",
  "Direct Resource": "being looked after",
};

/** What "day-master" means, for headings and captions. */
export const DAY_MASTER_GLOSS = "the stem that stands for you";

/** What a luck pillar is, for the cycles screen. */
export const LUCK_PILLAR_GLOSS = "a ten-year stretch of prevailing weather";
