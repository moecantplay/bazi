/**
 * "What the marks mean" (M24-15): one sheet per link, each naming exactly the
 * marks its look draws. Today's plain words apply: no system terms, and the
 * rough hour always comes with what to do with it. No mark is named by how
 * dark it is (the anchor pair flips between themes) or as grey (the even
 * mark's hairline takes the terrain's tint).
 */

import type { GlossaryEntry } from "./glossary.js";

export const MARKS_TOPIC = {
  /** Instrument: the week rings and the dial, from the one link under the rings. */
  dial: "marks:dial",
  /** Editorial: the week calendar's dots. */
  almanac: "marks:almanac",
  /** Explorer: the seven-day elevation strip at the foot of the page. */
  trailWeek: "marks:trail-week",
  /** Explorer: the route hero. */
  trailRoute: "marks:trail-route",
} as const;

export type MarksTopic = (typeof MARKS_TOPIC)[keyof typeof MARKS_TOPIC];

function roughAndEasy(roughMark: string, easyMark: string): string {
  return `The amber ${roughMark} is the day's rough hour, when small things tend to jostle: keep it for routine work. The green ${easyMark} is the easy hour, when plans tend to settle without a fuss: put the conversation that matters there.`;
}

const BEST_HOUR_IS_YOURS =
  "Unlike the rough and easy hours, which everyone shares, that one is yours alone.";

export const MARKS_ENTRIES: Record<string, GlossaryEntry> = {
  [MARKS_TOPIC.dial]: {
    title: "The week and the day",
    body: [
      "The seven rings are the days ahead, and the filled one is the day on screen: tap any ring to open its day. A solid green ring leans your way, a dashed amber ring is a day to take slower, and a faint ring sits even.",
      "The dial below is the whole day, noon at the top and midnight at the bottom. When you're looking at today, the hand points at now.",
      roughAndEasy("arc", "arc"),
      `The thin arc just outside the ring is your best hour, labelled Suits you: the two hours whose element your birth chart runs better with. ${BEST_HOUR_IS_YOURS}`,
      "The animals round the edge mark the day's twelve two-hour blocks. The lit ones are the hours above and the one you're in now, and your best hour's animal wears a star.",
    ],
  },
  [MARKS_TOPIC.almanac]: {
    title: "The week",
    body: [
      "Each day carries a dot: green leans your way, amber is a day to take slower, and a faint dot sits even.",
      "The highlighted cell is the day on screen; its dot turns plain. Tap any day to open it.",
    ],
  },
  [MARKS_TOPIC.trailWeek]: {
    title: "The week ahead",
    body: [
      "A high day leans your way, a low day is one to take slower, and the middle is even. Each point carries that day's animal.",
      "Today is the filled disc, and a ringed day is the one on screen. Tap any day to open it.",
    ],
  },
  [MARKS_TOPIC.trailRoute]: {
    title: "Today's route",
    body: [
      "The route is the day, from morning on the left to evening at the flag. The solid stretch is the part you've already walked, and the disc labelled NOW is where you are.",
      roughAndEasy("circle with an X", "circle"),
      `The star marks your best hour, labelled Suits you: the two hours whose element your birth chart runs better with. ${BEST_HOUR_IS_YOURS}`,
      "When now falls inside one of these hours, the NOW disc wears its colour as a ring. Each mark's label gives its time.",
    ],
  },
};
