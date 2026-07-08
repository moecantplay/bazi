/**
 * Transit interaction lines: how a passing day or year touches a natal palace.
 * Every line answers what/why/how in one breath: which branch the day brought
 * and which of yours it meets (the why), the interaction named and glossed in
 * ordinary life (the what), and the mood to work with (the how).
 *
 * Templates substitute {whose} (Today's/This year's), {transit} (the branch
 * the transit brought), {natal} (your branch(es) it meets), {palace}, and
 * {when}, so a line exists for every interaction type against every palace
 * without inventing math.
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
  /** The branch the transit itself brought; the others in `branches` are natal. */
  transitBranch: string;
}

const TEMPLATES: Record<InteractionType, readonly string[]> = {
  "six-clash": [
    "{whose} {transit} runs straight at the {natal} in your {palace} — a clash, two schedules booked for the same hour, and something has to move. You get to pick which.",
    "A clash {when}: {whose} {transit} pulls opposite the {natal} in your {palace}, a door and a draft. Good weather for cutting a knot you've been avoiding.",
  ],
  "six-combine": [
    "{whose} {transit} falls into combine with the {natal} in your {palace} — two people finishing each other's sentences. Doors there open with a push instead of a shove.",
    "A combine {when}: {whose} {transit} meets the {natal} in your {palace} like neighbors who already get along. A fair window for mending or agreeing.",
  ],
  trine: [
    "{whose} {transit} completes a trine with {natal} in your {palace} — branches rowing one direction, a crew that has rowed together for years. Easier to build there than to start cold.",
    "A trine {when}: {whose} {transit} joins {natal} around your {palace}, three friends planning one surprise without a group chat. Support gathers in that room.",
  ],
  punishment: [
    "{whose} {transit} rubs against the {natal} in your {palace} — a punishment, the stone in your shoe that keeps announcing itself. Naming it plainly takes most of its sting.",
    "A punishment {when}: {whose} {transit} grates on the {natal} in your {palace} — friction that repeats, the squeaky stair you keep stepping on. Awkward more than harmful; slow down and it loosens.",
  ],
  harm: [
    "{whose} {transit} sits at odds with the {natal} in your {palace} — a harm, a slow leak rather than a burst pipe. Worth a second look before you commit to anything there.",
    "A harm {when}: {whose} {transit} brushes the {natal} in your {palace}, small erosions like the overnight drip of a kitchen tap. Catch them early and they stay small.",
  ],
};

const GENERIC: readonly string[] = [
  "{whose} {transit} touches the {natal} in your {palace}. Read it as passing weather in that room — something to work with, not against.",
];

/** Every transit-interaction template, for exhaustive voice checking. */
export const TRANSIT_INTERACTION_TEMPLATES: readonly string[] = [
  ...Object.values(TEMPLATES).flat(),
  ...GENERIC,
];

function templatesFor(interaction: InteractionType): readonly string[] {
  return TEMPLATES[interaction] ?? GENERIC;
}

/** The natal branch(es) of the pattern, i.e. everything the transit didn't bring. */
function natalBranchPhrase(input: TransitInteractionInput): string {
  const others = input.branches.filter((branch) => branch !== input.transitBranch);
  if (others.length === 0) {
    // Self-punishment: the transit meets its own branch in the chart.
    return input.transitBranch;
  }
  if (others.length === 1) {
    return others[0] as string;
  }
  return `${others.slice(0, -1).join(", ")} and ${others[others.length - 1] as string}`;
}

/** Build one transit-interaction line, seeded and voice-compliant. */
export function transitInteractionLine(
  input: TransitInteractionInput,
  seedKey: string,
): ReadingLine {
  const roomPalace = input.natalPalaces[0] ?? "day";
  const when = transitWhen(input.transitPalace);
  const whose = when === "today" ? "Today's" : "This year's";
  const salt = `tr:${input.interaction}:${input.natalPalaces.join("")}:${input.transitPalace}:${input.branches.join("")}`;
  const template = pick(templatesFor(input.interaction), seedKey, salt);
  const text = template
    .replaceAll("{whose}", whose)
    .replaceAll("{transit}", input.transitBranch)
    .replaceAll("{natal}", natalBranchPhrase(input))
    .replaceAll("{palace}", palaceWord(roomPalace))
    .replaceAll("{when}", when);
  return { text, factTag: interactionTag(input.branches, input.interaction, roomPalace) };
}
