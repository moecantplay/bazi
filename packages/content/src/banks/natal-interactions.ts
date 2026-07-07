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
  "A six-combine ties your {palaces} together: {branches} pull toward each other and cooperate. Things in those rooms tend to move as a pair.",
  "{branches} sit in combine across your {palaces}. Where they meet, cooperation comes easily; the only risk is comfort settling into inertia.",
];

const CLASH: readonly string[] = [
  "{branches} clash across your {palaces}. Friction lives here, and friction is movement — this is a hinge, not a wound.",
  "A six-clash runs between your {palaces}: {branches} facing off. Expect some restlessness there, and read it as a prompt to act rather than a verdict.",
];

const TRINE_FULL: readonly string[] = [
  "A full {element} trine sits in your chart — {branches} locking into a complete frame. It's a strong, self-reinforcing current of {element} you can lean on.",
  "{branches} form a complete {element} trine. That frame gives you a dependable reserve of {element} to draw from.",
];

const TRINE_HALF: readonly string[] = [
  "A half {element} trine forms in your chart — {branches}, two of the three. The frame is there in outline; the missing piece is a room worth watching for.",
  "{branches} make a half {element} trine. The current is real but partial — it strengthens whenever the third branch turns up in transit.",
];

const PUNISHMENT_MUTUAL: readonly string[] = [
  "A punishment pattern ({branches}) crosses your {palaces}. It tends to show up as friction that repeats until it's named — awkward, workable, not fated.",
  "{branches} form a punishment between your {palaces}. The knot here loosens when you meet it head-on instead of working around it.",
];

const PUNISHMENT_SELF: readonly string[] = [
  "A self-punishment sits on {branches} in your {palaces}. The pressure here is often self-directed; the work is easing the grip you keep on yourself.",
  "{branches} carry a self-punishment in your {palaces}. When this room aches, look first at the standards you're holding yourself to.",
];

const HARM: readonly string[] = [
  "A harm links {branches} across your {palaces} — a quieter undermining than a clash. It rewards attention before it rewards force.",
  "{branches} form a harm between your {palaces}. Small erosions rather than big collisions; catch them early and they stay small.",
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
  return { text, factTag: interactionTag(input.branches, input.interaction, roomPalace) };
}
