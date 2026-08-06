/**
 * Read-more deep dives: the long-form layer behind a reading card's
 * "Read more" link (Co-Star's read-more is the model). Where the glossary
 * explains a *category* in the abstract, a dive is about the *reading* — how
 * the pattern tends to show up lived, what it makes cheap or costly, and how
 * to work with it. It never re-teaches the category; that stays one tap away
 * behind the caption. Keyed by ReadingLine.topic. Zero chart math.
 */

import type { InteractionType } from "@daymaster/bazi-engine";
import type { TokenLine } from "./tokens.js";

/** One deep dive: the essay paragraphs, then "Working with it" advice. */
export interface ReadMoreEntry {
  title: string;
  body: readonly string[];
  /** Soft directives for small unregulated acts only (VOICE.md rule 12). */
  advice: readonly string[];
  /**
   * Structured equivalents of `title`/`body`/`advice`, additive and optional
   * like `ReadingLine.runs`. No dive currently embeds a real system term
   * (confirmed Han-clean), so every entry gets the mechanical single-text-run
   * fallback — carried for structural uniformity with the other entry types.
   */
  titleRuns?: TokenLine;
  bodyRuns?: readonly TokenLine[];
  adviceRuns?: readonly TokenLine[];
}

const INTERACTION_DIVES: Record<InteractionType, ReadMoreEntry> = {
  "six-clash": {
    title: "Inside the clash",
    body: [
      "A clash day tends to arrive as scheduling friction made visible: the meeting that moves, the plan that collides with a better one, the thing you postponed refusing to stay postponed.",
      "It reads as pressure, but the pressure is honest — it lands exactly where something was already overdue to move. Days like this run cheap for endings and expensive for holding patterns.",
      "Left alone, a clash tends to resolve itself in the least convenient direction. Handled early, you get to choose what moves — which is the whole difference between a disruption and a decision.",
    ],
    advice: [
      "Pick which of the two commitments gives way and say so plainly — the friction eases the moment something actually moves. What grinds is trying to hold both.",
    ],
  },
  "six-combine": {
    title: "Inside the combine",
    body: [
      "A combine day tends to feel like traction: replies come back warmer, the introduction takes, the ask that felt heavy turns out to weigh nothing.",
      "The pull is real but quiet — it doesn't do the work, it lowers the cost of starting it.",
      "Openness like this has a shelf life measured in days, not seasons. It favors whatever you've been waiting on a good moment for; this is what a good moment looks like.",
    ],
    advice: [
      "Ask while the door is open: send the request, make the introduction, float the idea you've been sitting on. Ease is a resource — spend it on something you actually want.",
    ],
  },
  trine: {
    title: "Inside the trine",
    body: [
      "A trine reads as alignment you didn't have to arrange: the group agrees faster than usual, the pieces you've been holding separately admit they belong together.",
      "Its gift is momentum in company — things move because several forces lean the same way at once, not because you pushed harder.",
      "With two of the three signs present, the shape is a standing invitation: the frame is built and waiting on its third. Notice what's missing; it's often nearer than it looks.",
    ],
    advice: [
      "This is weather for joint work — loop the others in rather than pushing alone. If the frame is two of three, notice what the missing third might be; sometimes it's a person, sometimes it's simply time.",
    ],
  },
  punishment: {
    title: "Inside the punishment",
    body: [
      "A punishment rarely announces itself as an event — it shows up as a mood with a return ticket: the same small irritation, the same conversation you keep almost having.",
      "Its habit is repetition. What it touches isn't dangerous, just unresolved, and unresolved things bill you in small installments.",
      "The pattern loses most of its force in daylight. Once you've said plainly what keeps pinching, it stops being weather and becomes a chore — boring, finite, doable.",
    ],
    advice: [
      "Name it in one plain sentence — to yourself first, to the person involved if the matter is small. What repeats is what stays unspoken; once the stone has a name, taking it out of the shoe is ordinary work.",
    ],
  },
  harm: {
    title: "Inside the harm",
    body: [
      "A harm works quietly: nothing breaks, something erodes. It's the tone that cooled without a fight, the detail that slipped without anyone deciding it would.",
      "Because nothing announces it, it rewards the people who check — the reread thread, the recounted assumption, the question asked a week before it's urgent.",
      "Caught early it's maintenance; left long enough, it can become a story about how things drifted. Early is cheap.",
    ],
    advice: [
      "It rewards the quiet check, not the confrontation: reread the thread, ask the question you've been assuming the answer to. Small maintenance is the whole move — nothing here calls for force.",
    ],
  },
};

function textRuns(text: string): TokenLine {
  return [{ kind: "text", text }];
}

/** Every deep dive, keyed by the same topics reading lines carry, runs-complete. */
export const READ_MORE: Record<string, ReadMoreEntry> = Object.fromEntries(
  Object.entries(INTERACTION_DIVES).map(([key, entry]) => [
    `interaction:${key}`,
    {
      ...entry,
      titleRuns: textRuns(entry.title),
      bodyRuns: entry.body.map(textRuns),
      adviceRuns: entry.advice.map(textRuns),
    },
  ]),
);

/** The deep dive behind a topic, or undefined when none exists. */
export function readMoreEntry(topic: string): ReadMoreEntry | undefined {
  return READ_MORE[topic];
}
