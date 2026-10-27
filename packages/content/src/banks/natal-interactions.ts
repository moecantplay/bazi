/**
 * Natal branch-interaction lines: how a pattern baked into the birth chart is
 * described. Friction (clash, punishment, harm) is something to use, never a
 * curse (VOICE.md §8). Each template names the pattern once, framed as a name
 * ("known as a clash", or the old books' name), and says it plainly (rule 11);
 * few templates say "old", so a page with several patterns doesn't lean on the
 * word (Plain writing rule 6). No two templates share a 4-word
 * phrase, so several patterns on one chart page never echo each other (Plain
 * writing rule 5).
 *
 * Templates carry placeholders the builder fills from the fact — this package
 * never computes an interaction, it only phrases one the engine already found.
 */

import type { Element, InteractionType, Palace } from "@daymaster/bazi-engine";
import type { DraftLine } from "../types.js";
import type { ContentRun, TokenLine } from "../tokens.js";
import { fillRuns } from "../tokens.js";
import { branchTokenRuns, elementWord, interactionTagRuns, palacePhrase } from "../vocab.js";
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
  "Your {branches} draw close like two people finishing each other's sentences, a bond known as a combine. Your {palaces} often move as a pair.",
  "In the old books, {branches} make a combine: old colleagues who cooperate without needing a meeting. The one risk for your {palaces} is comfort settling into inertia.",
];

const CLASH: readonly string[] = [
  "Your {branches} face off across the {palaces}, which the old calendars name a clash. It's two schedules booked for the same hour, and the friction stops anything going stale.",
  "When {branches} face off, the result is called a clash, like furniture that never quite fits the same room. Treat the restlessness in the {palaces} as a prompt to act.",
];

const TRINE_FULL: readonly string[] = [
  "Your {branches} lock together like the three legs of a stool, known to the old calendars as a full {element} trine. It gives you a dependable reserve of {element} to lean on.",
  "Three signs, {branches}, row in one direction like a crew that has worked together for years. Its old name is a complete {element} trine, and that current of {element} is yours to draw from.",
];

const TRINE_HALF: readonly string[] = [
  "Your {branches} are two legs of a three-legged stool, a shape called a half {element} trine. The frame holds in outline and steadies whenever the third sign turns up in passing.",
  "The old books call {branches} half of a {element} trine: two friends waiting on a third before the plan really moves. Its {element} strength is real but partial.",
];

const PUNISHMENT_MUTUAL: readonly string[] = [
  "This one goes by the name of a punishment, a stone in your shoe across your own {palaces}. The {branches} keep catching until the snag is named, and once named it mostly quiets.",
  "The old books name {branches} a punishment: the squeaky stair you keep stepping on. In your own {palaces}, the knot loosens once you meet it head-on.",
];

const PUNISHMENT_SELF: readonly string[] = [
  "The old books know this as a self-punishment: your {branches}, the same sign twice, in your chart's {palaces}. It's the bar you keep raising on yourself, so when it aches, look first at your own grip.",
  "Known as a self-punishment, this is {branches} pressing from inside your chart's {palaces}. It's like re-grading your own finished work at midnight, and easing that grip is the work here.",
];

const HARM: readonly string[] = [
  "Your {branches} form what is called a harm between {palaces}: a slow leak, small and easy to miss. It rewards attention before it rewards force.",
  "The old books' name for {branches} here is a harm: small erosions between {palaces}, like a dripping tap. Catch them early and they stay small.",
];

const GENERIC: readonly string[] = [
  "Your chart holds a pattern of its own linking {palaces} ({branches}). Treat it as one more part of you to work with.",
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

/**
 * The branches as a spoken list ("rat and horse", "monkey, rat and dragon"):
 * a line's prose keeps en-dashes for numbers only (Plain writing rule 1). The
 * fact tag keeps vocab's compact "rat–horse".
 */
function branchListRuns(branches: readonly string[]): TokenLine {
  const runs: ContentRun[] = [];
  branches.forEach((branch, index) => {
    if (index > 0) {
      runs.push({ kind: "text", text: index === branches.length - 1 ? " and " : ", " });
    }
    runs.push(...branchTokenRuns(branch));
  });
  return runs;
}

/** Build one natal-interaction line, seeded and voice-compliant. */
export function natalInteractionLine(
  input: NatalInteractionInput,
  seedKey: string,
): DraftLine {
  const salt = `nat:${input.interaction}:${input.branches.join("")}:${input.palaces.join("")}`;
  const template = pick(templatesFor(input), seedKey, salt);
  const element = input.element ? elementWord(input.element) : "";
  const runs: TokenLine = fillRuns(template, {
    branches: branchListRuns(input.branches),
    palaces: [{ kind: "text", text: palacePhrase(input.palaces) }],
    element: [{ kind: "text", text: element }],
  });
  const roomPalace = input.palaces[0] ?? "day";
  return {
    runs,
    factTagRuns: interactionTagRuns(input.branches, input.interaction, roomPalace),
    topic: `interaction:${input.interaction}`,
  };
}
