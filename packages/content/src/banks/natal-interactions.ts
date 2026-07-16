/**
 * Natal branch-interaction lines: how a pattern baked into the birth chart is
 * described. Friction (clash, punishment, harm) is texture with a use, never a
 * curse (VOICE.md §8).
 *
 * Templates carry placeholders the builder fills from the fact — this package
 * never computes an interaction, it only phrases one the engine already found.
 */

import type { Element, InteractionType, Palace } from "@daymaster/bazi-engine";
import type { ReadingLine } from "../types.js";
import { elementWord, interactionTag, palacePhrase } from "../vocab.js";
import { pick } from "../hash.js";

/** Everything the builder needs, already extracted from a natal-interaction fact. */
export interface NatalInteractionInput {
  interaction: InteractionType;
  branches: readonly string[];
  palaces: readonly Palace[];
  element?: Element;
  completeness?: "full" | "half";
  punishmentKind?: "mutual" | "self";
}

const COMBINE: readonly string[] = [
  "A six-combine ties your {palaces} together — {branches} pulling toward each other like two people finishing each other's sentences. Things in those rooms tend to move as a pair.",
  "{branches} sit in combine across your {palaces}, cooperating the way old colleagues do without a meeting. The only risk is comfort settling into inertia.",
];

const CLASH: readonly string[] = [
  "{branches} clash across your {palaces} — two schedules permanently booked for the same hour. Friction lives here, and friction is movement: a hinge, not a wound.",
  "A six-clash runs between your {palaces}: {branches} facing off, furniture that never quite fits the same room. Read the restlessness there as a prompt to act, not a verdict.",
];

const TRINE_FULL: readonly string[] = [
  "A full {element} trine sits in your chart — {branches} locking together like a three-legged stool, the steadiest shape there is. It gives you a dependable reserve of {element} to lean on.",
  "{branches} form a complete {element} trine: three branches pulling one direction, a crew that has rowed together for years. That current of {element} is yours to draw from.",
];

const TRINE_HALF: readonly string[] = [
  "A half {element} trine forms in your chart — {branches}, two legs of a three-legged stool. The frame holds in outline; it steadies whenever the third branch turns up in passing.",
  "{branches} make a half {element} trine — two friends waiting on a third before the plan really moves. The current of {element} is real but partial.",
];

const PUNISHMENT_MUTUAL: readonly string[] = [
  "A punishment pattern ({branches}) crosses your {palaces} — a stone in your shoe, small but insistent. It tends to repeat until it's named; named, it mostly quiets.",
  "{branches} form a punishment between your {palaces}, the squeaky stair you keep stepping on. The knot loosens when you meet it head-on instead of working around it.",
];

const PUNISHMENT_SELF: readonly string[] = [
  "A self-punishment sits on {branches} in your {palaces} — the bar you keep raising on yourself after everyone else has gone home. When this room aches, look first at your own grip.",
  "{branches} carry a self-punishment in your {palaces}: pressure from inside, like re-grading your own finished work at midnight. Easing that grip is the work here.",
];

const HARM: readonly string[] = [
  "A harm links {branches} across your {palaces} — a slow leak rather than a burst pipe. It rewards attention before it rewards force.",
  "{branches} form a harm between your {palaces}: small erosions, the overnight drip of a kitchen tap. Catch them early and they stay small.",
];

const GENERIC: readonly string[] = [
  "A distinct pattern sits between your {palaces} ({branches}). Read it as one of your chart's textures — something to work with, not against.",
];

/** Every natal-interaction template, for exhaustive voice checking. */
export const NATAL_INTERACTION_TEMPLATES: readonly string[] = [
  ...COMBINE,
  ...CLASH,
  ...TRINE_FULL,
  ...TRINE_HALF,
  ...PUNISHMENT_MUTUAL,
  ...PUNISHMENT_SELF,
  ...HARM,
  ...GENERIC,
];

function templatesFor(input: NatalInteractionInput): readonly string[] {
  switch (input.interaction) {
    case "six-combine":
      return COMBINE;
    case "six-clash":
      return CLASH;
    case "trine":
      return input.completeness === "half" ? TRINE_HALF : TRINE_FULL;
    case "punishment":
      return input.punishmentKind === "self" ? PUNISHMENT_SELF : PUNISHMENT_MUTUAL;
    case "harm":
      return HARM;
    default:
      return GENERIC;
  }
}

/** Build one natal-interaction line, seeded and voice-compliant. */
export function natalInteractionLine(
  input: NatalInteractionInput,
  seedKey: string,
): ReadingLine {
  const salt = `nat:${input.interaction}:${input.branches.join("")}:${input.palaces.join("")}`;
  const template = pick(templatesFor(input), seedKey, salt);
  const element = input.element ? elementWord(input.element) : "";
  const text = template
    .replaceAll("{branches}", input.branches.join(""))
    .replaceAll("{palaces}", palacePhrase(input.palaces))
    .replaceAll("{element}", element);
  const roomPalace = input.palaces[0] ?? "day";
  return {
    text,
    factTag: interactionTag(input.branches, input.interaction, roomPalace),
    topic: `interaction:${input.interaction}`,
  };
}
