/**
 * Shared vocabulary: the fixed words the voice uses for palaces, elements, and
 * interactions, plus the verbatim disclaimer. Formatting only — no chart math.
 */

import { ACTIVITIES, type ActivityKey, type Branch, type Element, type InteractionType, type Palace, type Stem } from "@daymaster/bazi-engine";
import type { TokenLine } from "./tokens.js";

/** Verbatim from VOICE.md — do not edit without editing VOICE.md. */
export const DISCLAIMER =
  "Daymaster is for reflection and entertainment, not advice. BaZi is a living tradition with many schools; this app implements one reading of it, with its assumptions documented. Nothing here predicts your future or diagnoses anything about you. You remain the author.";

/** The zodiac animal each branch names — its immediate, familiar translation. */
export const BRANCH_ANIMALS: Record<Branch, string> = {
  子: "rat",
  丑: "ox",
  寅: "tiger",
  卯: "rabbit",
  辰: "dragon",
  巳: "snake",
  午: "horse",
  未: "goat",
  申: "monkey",
  酉: "rooster",
  戌: "dog",
  亥: "pig",
};

/** Each stem's element and polarity in plain words — its everyday translation. */
export const STEM_GLOSSES: Record<Stem, string> = {
  甲: "yang-wood",
  乙: "yin-wood",
  丙: "yang-fire",
  丁: "yin-fire",
  戊: "yang-earth",
  己: "yin-earth",
  庚: "yang-metal",
  辛: "yin-metal",
  壬: "yang-water",
  癸: "yin-water",
};

/** A single stem as a glossed term run, e.g. "戊" -> {term:"戊", gloss:"yang-earth", han:"戊"}. */
export function stemTokenRuns(stem: string): TokenLine {
  const gloss = STEM_GLOSSES[stem as Stem];
  return gloss === undefined ? [{ kind: "text", text: stem }] : [{ kind: "term", term: stem, gloss, han: stem }];
}

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

/**
 * A branch glyph as a term run, glossed with its animal name (VOICE.md §10,
 * "子 (rat)" in the pre-M19 string convention). The glyph doubles as its own
 * `han` — a bare branch character has no separate English name to lead with.
 */
export function branchTokenRuns(branch: string): TokenLine {
  const animal = BRANCH_ANIMALS[branch as Branch];
  if (animal === undefined) {
    return [{ kind: "text", text: branch }];
  }
  return [{ kind: "term", term: branch, gloss: animal, han: branch }];
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

/**
 * Term runs for several branches, en-dash joined — turns a bare glyph run
 * like "子午" into term runs that render "rat–horse". Without the separator,
 * two adjacent term runs rendered gloss-only (TokenText's only render mode)
 * fuse into one word ("rathorse") — caught in M19 Phase 11 review, no test
 * had covered a multi-branch runs-render before.
 */
export function joinBranchRuns(branches: readonly string[]): TokenLine {
  return branches.flatMap((branch, index): TokenLine => [
    ...(index > 0 ? [{ kind: "text", text: "–" } as const] : []),
    ...branchTokenRuns(branch),
  ]);
}

/**
 * A fact-tag citation as term runs: one glossed term per branch (its animal
 * name), en-dash joined, followed by the interaction word and palace phrase
 * as plain text — the structured form of the pre-M19 "子午 clash · career
 * palace" string convention.
 */
export function interactionTagRuns(
  branches: readonly string[],
  interaction: InteractionType,
  roomPalace: Palace,
): TokenLine {
  return [
    ...joinBranchRuns(branches),
    { kind: "text", text: ` ${interactionWord(interaction)} · ${palaceWord(roomPalace)}` },
  ];
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

/** The characters of each ten god, keyed by the engine's english label. */
export const TEN_GOD_CHINESE: Record<string, string> = {
  Friend: "比肩",
  "Rob Wealth": "劫财",
  "Eating God": "食神",
  "Hurting Officer": "伤官",
  "Indirect Wealth": "偏财",
  "Direct Wealth": "正财",
  "Seven Killings": "七杀",
  "Direct Officer": "正官",
  "Indirect Resource": "偏印",
  "Direct Resource": "正印",
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
 * Everyday translation of each of the twelve Day Officers (建除十二神), keyed by
 * the engine's officer key. A plain-life gloss in the register of the other
 * glosses: concrete, no fatalism, weather not verdict. Short fragments with no
 * terminal punctuation — they render as captions and complete "A 成 Success
 * day — {gloss}."
 */
export const OFFICER_GLOSSES: Record<string, string> = {
  jian: "the day the month sets its stake in the ground",
  chu: "sweeping-out day, clearing the old to make room",
  man: "the cup filled to the brim, abundance that wants sharing",
  ping: "the level road, even footing and nothing tipping",
  ding: "the settled day, where things stay put once you set them down",
  zhi: "hands on the tiller, grip and follow-through",
  po: "the day things come apart, better for endings than beginnings",
  wei: "the high ledge, a day to step with care rather than leap",
  cheng: "the day the month's work likes to come together",
  shou: "gathering-in day, taking in what's owed and offered",
  kai: "the door swung wide, fresh starts and open roads",
  bi: "the shutters drawn, a day to seal, store, and settle",
};

/** A modern label for an almanac activity, with its classical category. */
export interface ActivityLabel {
  /** Modern-life words for the activity ("Commitments", "Deals & paperwork"). */
  label: string;
  /** Classical category characters (嫁娶 …), so the Han toggle can hide them. */
  chinese: string;
  /** Literal English of the classical category, for captions. */
  classical: string;
}

/** Modern-life labels for each activity; classical fields track the engine table. */
const ACTIVITY_MODERN_LABELS: Record<ActivityKey, string> = {
  commit: "Commitments",
  launch: "Launches",
  sign: "Deals & paperwork",
  move: "Moving",
  travel: "Travel",
  study: "Learning",
  clear: "Clearing out",
  rest: "Rest",
  ask: "The big ask",
  gather: "Gatherings",
};

/**
 * The modern label plus classical category for every activity. The chinese and
 * classical fields are read from the engine's ACTIVITIES table so they never
 * drift from it; only the modern label lives here.
 */
export const ACTIVITY_LABELS: Record<ActivityKey, ActivityLabel> = Object.fromEntries(
  ACTIVITIES.map((activity) => [
    activity.key,
    {
      label: ACTIVITY_MODERN_LABELS[activity.key],
      chinese: activity.chinese,
      classical: activity.classical,
    },
  ]),
) as Record<ActivityKey, ActivityLabel>;

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

/**
 * Structured equivalent of {@link STRENGTH_CHECK_GLOSSES}: the classical code
 * (得令/失令/得地/失地/得勢/失勢) is the term run — there's no separate English
 * name for it beyond its own gloss — preceded by the leading English clause as
 * a plain text run.
 */
export const STRENGTH_CHECK_GLOSS_RUNS: Record<
  keyof typeof STRENGTH_CHECK_GLOSSES,
  Record<"yes" | "no", TokenLine>
> = {
  seasonal: {
    yes: [
      { kind: "text", text: "were born in a season that feeds your element " },
      { kind: "term", term: "得令", gloss: "in season", han: "得令" },
    ],
    no: [
      { kind: "text", text: "were born in a season that doesn't feed your element " },
      { kind: "term", term: "失令", gloss: "out of season", han: "失令" },
    ],
  },
  rooted: {
    yes: [
      { kind: "text", text: "have ground under you — your own element hides inside your branches " },
      { kind: "term", term: "得地", gloss: "rooted", han: "得地" },
    ],
    no: [
      {
        kind: "text",
        text: "stand on borrowed ground — no root of your element hides in your branches ",
      },
      { kind: "term", term: "失地", gloss: "unrooted", han: "失地" },
    ],
  },
  backed: {
    yes: [
      { kind: "text", text: "have allies — most of the visible stems are on your side " },
      { kind: "term", term: "得勢", gloss: "backed", han: "得勢" },
    ],
    no: [
      { kind: "text", text: "field a small team — few of the visible stems are on your side " },
      { kind: "term", term: "失勢", gloss: "outnumbered", han: "失勢" },
    ],
  },
};
