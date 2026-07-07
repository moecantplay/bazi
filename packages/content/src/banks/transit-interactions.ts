/**
 * Transit interaction lines: how a passing day or year touches a natal palace.
 * The transitPalace decides the time frame ("today" vs "this year"); the natal
 * palace decides which room is touched.
 *
 * Templates substitute {branches}, {palace}, and {when} so a line exists for
 * every interaction type against every natal palace without inventing math.
 */

import type { InteractionType, Palace } from "@daymaster/bazi-engine";
import type { ReadingLine } from "../types.js";
import { interactionTag, palaceWord, transitWhen } from "../vocab.js";
import { pick } from "../hash.js";

/** Everything the builder needs, already extracted from a transit-interaction fact. */
export interface TransitInteractionInput {
  interaction: InteractionType;
  branches: readonly string[];
  natalPalaces: readonly Palace[];
  transitPalace: Palace;
}

const TEMPLATES: Record<InteractionType, readonly string[]> = {
  "six-clash": [
    "{branches} clash in your {palace} {when}. Friction — but friction is movement, not damage.",
    "A clash touches your {palace} {when}: {branches} pulling opposite ways. Good weather for cutting a knot you've been avoiding.",
  ],
  "six-combine": [
    "{branches} fall into combine with your {palace} {when}. Things there want to cooperate; doors open with a push instead of a shove.",
    "A combine warms your {palace} {when} — {branches} meeting easily. A fair window for mending or agreeing.",
  ],
  trine: [
    "{branches} form a trine reaching your {palace} {when}. Support gathers around that room — a low-drag, cooperative stretch.",
    "A trine links {branches} to your {palace} {when}. Momentum is on your side there; easier to build than to start cold.",
  ],
  punishment: [
    "A punishment pattern touches your {palace} {when} — {branches}. Some friction that repeats; naming it plainly takes most of its sting.",
    "{branches} bring a punishment to your {palace} {when}. Awkward more than harmful; slow down and it loosens.",
  ],
  harm: [
    "{branches} form a harm with your {palace} {when} — a quiet undermining rather than a clash. Worth a second look before you commit.",
    "A harm brushes your {palace} {when}: {branches}. Small erosions; catch them early and they stay small.",
  ],
};

const GENERIC: readonly string[] = [
  "{branches} touch your {palace} {when}. Read it as passing weather in that room — something to work with, not against.",
];

/** Every transit-interaction template, for exhaustive voice checking. */
export const TRANSIT_INTERACTION_TEMPLATES: readonly string[] = [
  ...Object.values(TEMPLATES).flat(),
  ...GENERIC,
];

function templatesFor(interaction: InteractionType): readonly string[] {
  return TEMPLATES[interaction] ?? GENERIC;
}

/** Build one transit-interaction line, seeded and voice-compliant. */
export function transitInteractionLine(
  input: TransitInteractionInput,
  seedKey: string,
): ReadingLine {
  const roomPalace = input.natalPalaces[0] ?? "day";
  const salt = `tr:${input.interaction}:${input.natalPalaces.join("")}:${input.transitPalace}:${input.branches.join("")}`;
  const template = pick(templatesFor(input.interaction), seedKey, salt);
  const text = template
    .replaceAll("{branches}", input.branches.join(""))
    .replaceAll("{palace}", palaceWord(roomPalace))
    .replaceAll("{when}", transitWhen(input.transitPalace));
  return { text, factTag: interactionTag(input.branches, input.interaction, roomPalace) };
}
