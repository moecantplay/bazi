/**
 * Template banks for the year (流年) and month (流月) outlook. Each period reads
 * in three notes: the ten-god theme, the element weather, and how a passing
 * pillar touches a natal palace. Every line is a current to work with, never a
 * verdict (VOICE.md §4), and every system term is translated in the same breath
 * (§11).
 *
 * Branches never sit inline (the Han toggle would strip them to nothing); the
 * branch citation rides the factTag as a pair. Prose leans on palace words.
 *
 * Placeholders: {periodCap} ("This year"/"This month"), {periodNoun}
 * ("year"/"month"), {tgEn} {tgCn} {tgGloss} the ten-god theme, {element} the
 * period element, {palace} the touched palace word.
 */

import type { Element } from "@daymaster/bazi-engine";

/** Theme frames for a known ten-god period (article-free before {tgEn}). */
export const THEME_FRAMES: readonly string[] = [
  "{periodCap} carries the {tgEn} note ({tgCn}) — {tgGloss}. Read it as the season's prevailing grain, yours to work with.",
  "The {periodNoun}'s theme is the {tgEn} note ({tgCn}) — {tgGloss}, a current more than a command.",
  "{periodCap} leans on the {tgEn} note ({tgCn}) — {tgGloss}.",
];

/** Fallback theme frame for a ten-god label with no specific gloss. */
export const THEME_GENERIC =
  "{periodCap} carries a distinct ten-god note ({tgCn}) — one of ten flavours of how the season's stem meets yours. Read it as texture, not instruction.";

/** Element weather for a period that suits the reader. */
export const ELEMENT_PERIOD_FAVORABLE: Record<Element, string> = {
  wood: "A Wood {periodNoun}, and Wood tends to suit you — a long stretch for starting and tending, the wind mostly at your back.",
  fire: "A Fire {periodNoun}, and Fire tends to suit you — warmth on your side, a fair season to be seen and to share.",
  earth: "An Earth {periodNoun}, and Earth tends to suit you — steady ground underfoot, good for building rather than rushing.",
  metal: "A Metal {periodNoun}, and Metal tends to suit you — clarity comes easier, a fair season to finish and refine.",
  water: "A Water {periodNoun}, and Water tends to suit you — things flow more freely, good for connecting and going deep.",
};

/** Element weather for a period that runs against the reader's grain. */
export const ELEMENT_PERIOD_UNFAVORABLE: Record<Element, string> = {
  wood: "A Wood {periodNoun}, which runs a little against your grain — beginnings may feel effortful, so pace them rather than force them.",
  fire: "A Fire {periodNoun}, which isn't quite your grain — the tempo runs fast and bright, best let pass through without chasing.",
  earth: "An Earth {periodNoun}, which sits a little heavy for you — things may feel slow, ballast more than a wall.",
  metal: "A Metal {periodNoun}, which cuts against your grain slightly — edges feel sharper, so softer handling goes further.",
  water: "A Water {periodNoun}, which runs a bit against your grain — focus can drift, so give it a channel and it settles.",
};

/** How a period's pillar touches a natal palace, one frame set per interaction. */
export const TRANSIT_PERIOD_FRAMES: Record<string, readonly string[]> = {
  "six-clash": [
    "{periodCap} brings a clash to your {palace} — two schedules booked for the same hour, something has to move. Good weather for cutting a knot you've kept.",
  ],
  "six-combine": [
    "{periodCap} sets a combine on your {palace} — two who finish each other's sentences. Doors there give with a push.",
  ],
  trine: [
    "{periodCap} completes a trine around your {palace} — a crew that has rowed together for years. Easier to build there than to start cold.",
  ],
  punishment: [
    "{periodCap} rubs at your {palace} — a punishment, the stone in the shoe that keeps announcing itself. Named plainly, it loses most of its sting.",
  ],
  harm: [
    "{periodCap} sits at odds with your {palace} — a harm, a slow leak rather than a burst pipe. Worth a second look before you lean on it.",
  ],
};

/** Fallback transit frame for an unknown interaction. */
export const TRANSIT_PERIOD_GENERIC =
  "{periodCap} touches your {palace} — passing weather in that room, something to work with rather than against.";

/** Every horizon line template, rendered for the exhaustive voice sweep. */
export const HORIZON_TEMPLATES: readonly string[] = [
  ...THEME_FRAMES,
  THEME_GENERIC,
  ...Object.values(ELEMENT_PERIOD_FAVORABLE),
  ...Object.values(ELEMENT_PERIOD_UNFAVORABLE),
  ...Object.values(TRANSIT_PERIOD_FRAMES).flat(),
  TRANSIT_PERIOD_GENERIC,
];
