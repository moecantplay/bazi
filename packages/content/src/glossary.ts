/**
 * The glossary: plain-language explainers behind every reading caption, plus
 * the "how this reading works" overview. Entries are assembled from the same
 * canonical glosses the reading lines draw on (VOICE.md §11), so a concept is
 * always explained the same way everywhere. Zero chart math.
 *
 * Topics are namespaced strings carried on ReadingLine.topic:
 * "interaction:trine", "ten-god:Friend", "star:<key>", "stage:<english>",
 * "officer:<key>", plus standalone keys like "elements" and "reading".
 */

import type { InteractionType } from "@daymaster/bazi-engine";
import type { TokenLine } from "./tokens.js";
import { TEN_GOD_PERIOD_THEMES } from "./banks/horizons.js";
import {
  LIFE_STAGE_GLOSSES,
  OFFICER_GLOSSES,
  STAR_GLOSSES,
  TEN_GOD_CHINESE,
} from "./vocab.js";

/** One explainer: a heading and short paragraphs (1–2 sentences each). */
export interface GlossaryEntry {
  title: string;
  body: readonly string[];
  /**
   * Structured equivalent of `title`, additive and optional like
   * `ReadingLine.runs` — every entry gets one, either authored (where a real
   * system term is embedded, e.g. "ten gods") or a mechanical single text run.
   */
  titleRuns?: TokenLine;
  /** Structured equivalent of `body`, one TokenLine per paragraph. */
  bodyRuns?: readonly TokenLine[];
}

/** The overview entry every "read more" link opens. */
export const READING_TOPIC = "reading";

const READING_ENTRY: GlossaryEntry = {
  title: "How this reading works",
  body: [
    "Your birth date and time set four pairs of characters — the Four Pillars — and that fixed chart is the instrument this app reads. Nothing about it changes day to day.",
    "Each day, month, and year carries a pair of its own: one of ten stems and one of twelve animal signs. A reading is what happens when a passing pair meets your chart — where they pull together, where they grind.",
    "Your chart's pillars double as rooms: roots (family, origins), the career palace, the home palace (partnership), and the horizon (what you're building toward). When a line names a room, that's where the weather sits.",
    "Read every line as weather, not verdict — what the pattern tends to make cheaper or costlier, with the wheel staying in your hands. The same birth details and date always produce the same words; nothing here is random.",
  ],
};

/** The entry behind the week strip's "what the marks mean" link. */
export const WEEK_TOPIC = "week";

const WEEK_ENTRY: GlossaryEntry = {
  title: "The week ahead",
  body: [
    "Each day in the strip carries a small mark summed from that day's activity leanings. A filled dot leans favorable, an open ring leans toward friction, and a short dash means the day sits even — no strong pull either way.",
    "The mark is weather at a glance, never a verdict — a friction day simply favors a different kind of work. Tap any day to read it in full.",
  ],
};

const INTERACTION_SIGNS_LEAD =
  "Every day, month, and year carries one of the twelve animal signs, and your chart holds signs of its own — one in each pillar.";

const INTERACTION_LEAD =
  "The old calendars mapped how the signs relate — some pairs pull together, others pull apart. When a passing sign meets one of yours, the line names the pattern.";

const INTERACTION_MEANINGS: Record<InteractionType, string> = {
  "six-clash":
    "A clash is two schedules booked for the same hour — something has to move. It reads as movement, not misfortune: fair weather for cutting a knot or shifting what's been stuck.",
  "six-combine":
    "A combine is two people finishing each other's sentences — signs that pull toward each other. Doors in that room tend to open with a push instead of a shove.",
  trine:
    "A trine is three signs pulling one direction — a crew that has rowed together for years. Two of the three is a frame waiting on its third; all three is the steadiest shape there is.",
  punishment:
    "A punishment is a stone in your shoe — small, recurring, quieter once named. Awkward more than harmful; it tends to repeat until it's faced plainly.",
  harm: "A harm is a slow leak rather than a burst pipe. It rewards attention before force — caught early, the erosions stay small.",
};

const INTERACTION_TITLES: Record<InteractionType, string> = {
  "six-clash": "The clash",
  "six-combine": "The combine",
  trine: "The trine",
  punishment: "The punishment",
  harm: "The harm",
};

const TEN_GOD_LEAD =
  "The ten gods (十神) are the old calendars' names for the ten ways a passing stem can meet yours — the same cast of ten relations, rotating with the days, months, and years.";

/**
 * Structured equivalent of {@link TEN_GOD_LEAD}: "ten gods" as a term run
 * glossed with its plain meaning and its classical characters. Reused
 * wherever the lead paragraph itself is reused (the "ten-gods" summary entry
 * and every `ten-god:<english>` entry's opening paragraph).
 */
const TEN_GOD_LEAD_RUNS: TokenLine = [
  { kind: "text", text: "The " },
  {
    kind: "term",
    term: "ten gods",
    gloss: "the ten ways a passing stem can meet yours",
    han: "十神",
  },
  {
    kind: "text",
    text:
      " are the old calendars' names for the ten ways a passing stem can meet yours — the same cast of ten relations, rotating with the days, months, and years.",
  },
];

const TEN_GODS_TITLE_RUNS: TokenLine = [
  { kind: "text", text: "The " },
  {
    kind: "term",
    term: "ten gods",
    gloss: "the ten ways a passing stem can meet yours",
    han: "十神",
  },
];

const TEN_GOD_CLOSE =
  "A god names the flavor of a period, not an instruction — texture to work with.";

function interactionEntries(): Record<string, GlossaryEntry> {
  const entries: Record<string, GlossaryEntry> = {};
  for (const key of Object.keys(INTERACTION_MEANINGS) as InteractionType[]) {
    entries[`interaction:${key}`] = {
      title: INTERACTION_TITLES[key],
      body: [INTERACTION_SIGNS_LEAD, INTERACTION_LEAD, INTERACTION_MEANINGS[key]],
    };
  }
  return entries;
}

function tenGodEntries(): Record<string, GlossaryEntry> {
  const entries: Record<string, GlossaryEntry> = {
    "ten-gods": {
      title: "The ten gods (十神)",
      body: [
        TEN_GOD_LEAD,
        "This one is a rarer label — the line's own words carry its flavor. The shape is always the same: a relation between the period's stem and yours.",
      ],
    },
  };
  for (const [english, theme] of Object.entries(TEN_GOD_PERIOD_THEMES)) {
    const chinese = TEN_GOD_CHINESE[english];
    entries[`ten-god:${english}`] = {
      title: chinese ? `${english} (${chinese})` : english,
      body: [TEN_GOD_LEAD, `${english}${chinese ? ` (${chinese})` : ""} is ${theme}.`, TEN_GOD_CLOSE],
    };
  }
  return entries;
}

const STAR_LEAD =
  "Symbolic stars are named patterns the old calendars watched for — motifs a chart keeps returning to. Seasoning rather than structure, and never a prediction.";

function starEntries(): Record<string, GlossaryEntry> {
  const entries: Record<string, GlossaryEntry> = {};
  for (const [key, gloss] of Object.entries(STAR_GLOSSES)) {
    entries[`star:${key}`] = {
      title: "Symbolic stars",
      body: [STAR_LEAD, `This one: ${gloss}.`],
    };
  }
  return entries;
}

const STAGE_LEAD =
  "The twelve life stages track where a stem stands in its cycle — first growth through peak to rest and back — the way a day moves through morning, noon, and night.";

function stageEntries(): Record<string, GlossaryEntry> {
  const entries: Record<string, GlossaryEntry> = {};
  for (const [english, gloss] of Object.entries(LIFE_STAGE_GLOSSES)) {
    entries[`stage:${english}`] = {
      title: "The twelve life stages",
      body: [
        STAGE_LEAD,
        `Today's stage: ${gloss}. A stage is a season, not a verdict — even the quiet ones are part of the turning.`,
      ],
    };
  }
  return entries;
}

const OFFICER_LEAD =
  "The twelve Day Officers are the old almanac's rotation: each day takes the next of twelve roles in a fixed cycle, from setting stakes to drawing the shutters.";

function officerEntries(): Record<string, GlossaryEntry> {
  const entries: Record<string, GlossaryEntry> = {};
  for (const [key, gloss] of Object.entries(OFFICER_GLOSSES)) {
    entries[`officer:${key}`] = {
      title: "The twelve Day Officers",
      body: [
        OFFICER_LEAD,
        `This one: ${gloss}. Officers lean, they never sentence — they say what kind of work the day likes, not what you may do.`,
      ],
    };
  }
  return entries;
}

/** Every glossary entry, keyed by topic, before runs are attached. */
const RAW_GLOSSARY: Record<string, GlossaryEntry> = {
  [READING_TOPIC]: READING_ENTRY,
  [WEEK_TOPIC]: WEEK_ENTRY,
  ...interactionEntries(),
  ...tenGodEntries(),
  ...starEntries(),
  ...stageEntries(),
  ...officerEntries(),
  elements: {
    title: "The five elements",
    body: [
      "Everything in the system sorts into five elements — Wood, Fire, Earth, Metal, Water — and so do you: the stem that stands for you carries one.",
      "Each day and season carries an element too. When it feeds or matches yours, the line says it suits you; when it drains or crowds yours, the day runs against your grain and asks a gentler pace.",
      "Neither direction is good or bad — grain is just grain. The reading only tells you which way it runs, and you choose how to work with it.",
    ],
  },
  "day-master": {
    title: "Your day-master",
    body: [
      "Your day-master is the stem of the day you were born — the character that stands for you in the chart.",
      "Every other note is measured against it: elements feed or drain it, passing stems meet it as one of the ten gods, and strong or weak describes its backing. When a reading says 'you', this is the you it means.",
    ],
  },
  strength: {
    title: "Strong and weak",
    body: [
      "Strong or weak describes how much backing your day-master has — season, ground, and allies — not how capable you are.",
      "A strong chart carries momentum and can afford to spend it; a weak one travels light and picks its moments. Both are complete ways to move through the same weather.",
    ],
  },
  favorable: {
    title: "Favorable elements",
    body: [
      "Favorable elements are the ones that balance your chart — the fuel it runs best on.",
      "Days and seasons carrying them tend to suit you. The reading points them out so you can lean in when they come around — and pace yourself when they don't.",
    ],
  },
  "luck-pillar": {
    title: "Luck pillars",
    body: [
      "A luck pillar is a ten-year stretch of prevailing weather — the decade's own pair of characters, read against your chart.",
      "The timeline walks those decades in order; the highlighted one is where you stand now. A decade's weather shifts the backdrop, never the instrument.",
    ],
  },
  "na-yin": {
    title: "Na Yin",
    body: [
      "Na Yin is each pillar's 'sound' — an old poetic name for the flavor a stem-and-branch pair carries, like 'Great Forest Wood'.",
      "It adds color to a pillar rather than weight; enjoy it as the chart's poetry.",
    ],
  },
};

/**
 * A paragraph's structured equivalent: the authored run when one exists (the
 * shared ten-god lead), else a single mechanical text run — the same
 * fallback shape `withRunsFallback` gives an unmigrated `ReadingLine`.
 */
function paragraphRuns(paragraph: string): TokenLine {
  return paragraph === TEN_GOD_LEAD ? TEN_GOD_LEAD_RUNS : [{ kind: "text", text: paragraph }];
}

/** Every glossary entry, keyed by topic, runs-complete. */
export const GLOSSARY: Record<string, GlossaryEntry> = Object.fromEntries(
  Object.entries(RAW_GLOSSARY).map(([topic, entry]) => [
    topic,
    {
      ...entry,
      titleRuns: topic === "ten-gods" ? TEN_GODS_TITLE_RUNS : [{ kind: "text", text: entry.title }],
      bodyRuns: entry.body.map(paragraphRuns),
    },
  ]),
);

/** The entry behind a topic, or undefined when none exists. */
export function glossaryEntry(topic: string): GlossaryEntry | undefined {
  return GLOSSARY[topic];
}
