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
  monthly: "this month's current",
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

/** What a life stage is, for headings and captions. */
export const LIFE_STAGE_GLOSS =
  "where your stem stands in a twelve-step cycle of a life — from first growth to rest and back";

/** What Na Yin is, for the chart screen. */
export const NAYIN_GLOSS =
  "each pillar's 'sound' — an old poetic name for the flavor its pair carries";

/**
 * Everyday translation of each of the twelve life stages, keyed by the
 * engine's english label. Stages are seasons of a cycle, never verdicts.
 */
export const LIFE_STAGE_GLOSSES: Record<string, string> = {
  Growth: "first shoots — new, eager, unproven",
  Bath: "freshly washed — open, impressionable, a little exposed",
  "Coming of Age": "putting on the graduation robe — ready to be taken seriously",
  "Taking Office": "first day at the new desk — capable and in motion",
  Peak: "noon sun — full power, nothing left in reserve",
  Decline: "just past the summit — still high, starting to descend",
  Illness: "a head cold, not a diagnosis — running at half speed",
  Stillness: "the pause between out-breath and in-breath",
  Storage: "the harvest in the barn — quiet, kept, not gone",
  Severance: "the field after clearing — empty so something new can start",
  Conception: "an idea that exists but isn't visible yet",
  Nurture: "the seedling under glass — growing where no one sees",
};

/**
 * Everyday translation of each symbolic star, keyed by the engine's star key.
 * A star is a motif the chart keeps returning to, never a prediction.
 */
export const STAR_GLOSSES: Record<string, string> = {
  "tianyi-nobleman": "helpful people show up for you — the stranger who holds the door at the right moment",
  "tiande-virtue": "a quiet tailwind of goodwill — trouble tends to shrink near it",
  "tiande-companion": "the tailwind's echo — goodwill answered in kind",
  "yuede-virtue": "a soft moon-lit version of the same tailwind",
  "taiji-nobleman": "a pull toward the deep questions — philosophy, patterns, the why under the why",
  "wenchang-scholar": "the study lamp — learning, writing, and exams come a shade easier",
  "lushen-emolument": "bread on the table — your effort converts to keep",
  "jiangxing-general": "the one the room turns to when a call needs making",
  "huagai-canopy": "the artist's parasol — solitude that feeds craft and reflection",
  "yima-travel-horse": "packed bags by the door — movement, travel, changes of scene",
  "taohua-peach-blossom": "charm in bloom — you get noticed whether or not you try",
  "hongluan-phoenix": "the romance bell — connection knocks more often",
  "tianxi-joy": "small good news — occasions, celebrations, glad tidings",
  "hongyan-charm": "magnetism of the softer kind — attraction that precedes words",
  "yangren-blade": "a drawn blade — decisive force that needs a sheath",
  "feiren-flying-blade": "the blade's shadow — sharpness that can nick when rushed",
  "zaisha-calamity": "a pothole sign on the road — slow down through this stretch",
  "sangmen-mourning": "a room where grief once sat — tenderness worth honoring",
  "kongwang-void": "an empty seat at the table — what's booked there lands lighter than expected",
};

/**
 * The three checks behind strong/weak, in plain terms (令 season, 地 ground,
 * 勢 numbers). Each phrase completes "you ..." — used to explain the verdict.
 */
export const STRENGTH_CHECK_GLOSSES = {
  seasonal: {
    yes: "were born in a season that feeds your element (得令 — in season)",
    no: "were born in a season that doesn't feed your element (失令 — out of season)",
  },
  rooted: {
    yes: "have ground under you — your own element hides inside your branches (得地 — rooted)",
    no: "stand on borrowed ground — no root of your element hides in your branches (失地 — unrooted)",
  },
  backed: {
    yes: "have allies — most of the visible stems are on your side (得勢 — backed)",
    no: "field a small team — few of the visible stems are on your side (失勢 — outnumbered)",
  },
} as const;
