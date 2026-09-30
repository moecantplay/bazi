/**
 * Topic pages for the five sign links (M20-21 R11): what it tends to feel
 * like, how to work with it, and where the old name comes from. The lived
 * paragraphs adapt the earlier read-more dives into everyday words.
 */

import type { InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";

export interface InteractionTopic {
  /** The old name with its article, for "The old calendars call this a clash." */
  oldName: string;
  /** How today's sign meets the chart's, for the plain mechanics sentence. */
  verb: string;
  /** Title stem; the life area's phrase follows it. */
  title: string;
  how: readonly string[];
  work: readonly string[];
  nameOrigin: string;
}

const SIGNS_LEAD = "Every day carries one of twelve animal signs, and your birth chart holds four, one for each part of life.";

export const INTERACTION_TOPICS: Record<InteractionType, InteractionTopic> = {
  "six-clash": {
    oldName: "a clash",
    verb: "sits opposite",
    title: "Something has to give",
    how: [
      "It tends to show up as friction you can see: a meeting that moves, two plans that collide, something you postponed refusing to stay postponed.",
      "Left alone, it usually settles in the least convenient direction. Handled early, you get to choose what moves.",
    ],
    work: ["Pick which of the two gives way, and say so early.", "Holding on to both is what makes it grind."],
    nameOrigin: `${SIGNS_LEAD} When today's sign sits directly opposite one of yours, the two pull against each other.`,
  },
  punishment: {
    oldName: "a punishment",
    verb: "rubs against",
    title: "The same small snag",
    how: [
      "It feels like a stone in your shoe: small, familiar, and more annoying each time it comes back.",
      "It rarely gets worse on its own, and it rarely goes away on its own either. Naming it is usually half the fix.",
    ],
    work: ["Deal with the cause once instead of working around it again.", "Say what keeps happening, calmly, to whoever can change it."],
    nameOrigin: `${SIGNS_LEAD} Some signs rub against each other in a repeating way; the old books count these as small, recurring frictions rather than collisions.`,
  },
  harm: {
    oldName: "a harm",
    verb: "is at odds with",
    title: "A slow leak",
    how: [
      "It rarely looks like a problem. It shows up as small misreadings, a tone that's slightly off, a detail that slips.",
      "Each one is minor. Over a few days they add up if nobody notices.",
    ],
    work: ["Give important messages a second read.", "Ask the clarifying question now rather than later."],
    nameOrigin: `${SIGNS_LEAD} When today's sign sits at an awkward angle to one of yours, not head-on, the result is a quiet rub rather than a collision.`,
  },
  "six-combine": {
    oldName: "a combine",
    verb: "pairs with",
    title: "Easy agreement",
    how: [
      "Conversations go more smoothly than usual, and asks land softly. Replies come back warmer.",
      "It's a good window for agreements, and windows close, so it rewards using it today.",
    ],
    work: ["Make the ask you've been saving for a good moment.", "Settle something that needs two people to agree."],
    nameOrigin: `${SIGNS_LEAD} Some pairs of signs fit together naturally. When today's sign pairs with one of yours, that part of life gets easier to move.`,
  },
  trine: {
    oldName: "a trine",
    verb: "makes a set with",
    title: "Pulling the same way",
    how: [
      "Things line up without you arranging them: people agree faster, and pieces you've been holding separately start to fit.",
      "The help is real but quiet. It makes doing things together cheaper; it doesn't do them for you.",
    ],
    work: ["Bring in the people already leaning your way.", "Start the thing that needs more than one pair of hands."],
    nameOrigin: `${SIGNS_LEAD} Three of the twelve signs belong together as a set. When today's sign completes a set with signs in your birth chart, those parts of life pull the same way.`,
  },
};

/** How a title names the life area ("Something has to give at work"). */
export const AREA_TITLE_PHRASE: Record<LifeArea, string> = {
  work: "at work",
  family: "in the family",
  home: "at home",
  plans: "in your bigger plans",
};

/** What each area's sign stands for, joined into the mechanics sentence. */
export const AREA_SIGN_SUBJECT: Record<LifeArea, string> = {
  work: "work",
  family: "family",
  home: "home and partner",
  plans: "what you're building toward",
};
