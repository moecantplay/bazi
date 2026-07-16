/**
 * Headline hooks: the single display-type line that opens the Today screen.
 * One short thought pitched from the day's leading fact — the first transit
 * interaction the reading shows, else the element of the day, else a quiet
 * generic. Pure voice: a headline cites nothing (the body cards carry the
 * citations) and never uses a system term, so it needs no gloss.
 */

import type { InteractionType } from "@daymaster/bazi-engine";

/** Hooks keyed by the leading transit interaction's kind. */
export const INTERACTION_HEADLINES: Record<InteractionType, readonly string[]> = {
  "six-clash": [
    "Two things want the same hour today.",
    "Something has to move today; better if you choose which.",
    "The day runs crosswise. Movement, not misfortune.",
  ],
  "six-combine": [
    "Things click today without being pushed.",
    "The day fits together more easily than most.",
    "Doors sit ajar today; a light touch opens them.",
  ],
  trine: [
    "Three currents, one direction. The day moves.",
    "The day pulls one way, and it's a useful way.",
    "Momentum arrives from more than one side today.",
  ],
  punishment: [
    "Old friction surfaces today. It's information, not a verdict.",
    "A knot from way back asks for attention today.",
    "The day rubs where it has rubbed before. Worth a look, not a fight.",
  ],
  harm: [
    "A small snag under a smooth surface today.",
    "The day reads friendlier than it runs; light steps carry.",
    "An easy-looking day with one quiet catch in it.",
  ],
};

/** Hooks for days with no interaction, split by whether the element suits you. */
export const ELEMENT_HEADLINES: Record<"favorable" | "unfavorable", readonly string[]> = {
  favorable: [
    "The day runs with your grain.",
    "Today leans your way; let it.",
    "A day cut along your grain — most things cost a little less.",
  ],
  unfavorable: [
    "The day leans a little against you. Pack light.",
    "Not your weather today, which is fine — not every day is.",
    "The day runs against the grain; slower strokes go further.",
  ],
};

/** Hooks for days where nothing in the chart raises its voice. */
export const GENERIC_HEADLINES: readonly string[] = [
  "An ordinary day, which is its own kind of room.",
  "A quiet day by the chart. What you bring is the story.",
  "Nothing loud in the day's grain. That's usable.",
];

/** Every headline, for exhaustive voice checking. */
export const HEADLINE_TEMPLATES: readonly string[] = [
  ...Object.values(INTERACTION_HEADLINES).flat(),
  ...Object.values(ELEMENT_HEADLINES).flat(),
  ...GENERIC_HEADLINES,
];
