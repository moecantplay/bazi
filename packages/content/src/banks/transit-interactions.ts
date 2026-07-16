/**
 * Transit interaction lines: how a passing day or year touches a natal palace.
 * Every line answers what/why/how in one breath: which sign the period brought
 * and which of yours it meets (the why), the interaction named and glossed in
 * ordinary life (the what), and the mood to work with (the how).
 *
 * The plumbing — that every day and year carries one of the twelve animal
 * signs, and that the chart holds signs of its own — lives one tap away in the
 * glossary entry the caption links to (VOICE.md §11), so lines stay compact
 * and spend their words on the day itself.
 *
 * Templates substitute {period} (day/year), {periodPossCap} (Today's/This
 * year's), {transit} (the glossed sign the transit brought), {natal} (the
 * glossed sign(s) of yours it meets), {palace}, and {when}, so a line exists
 * for every interaction type against every palace without inventing math.
 */

import type { InteractionType, Palace } from "@daymaster/bazi-engine";
import type { ReadingLine } from "../types.js";
import { branchToken, interactionTag, palaceWord, transitWhen } from "../vocab.js";
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
    "{periodPossCap} sign, the {transit}, runs straight at the {natal} in your chart's {palace} — a clash, two schedules booked for the same hour. Something has to move, and you get to pick which.",
    "A clash {when}: the {period}'s sign, the {transit}, pulls opposite the {natal} in your chart's {palace} — a door and a draft. Good weather for cutting a knot you've been avoiding.",
  ],
  "six-combine": [
    "{periodPossCap} sign, the {transit}, falls into combine with the {natal} in your chart's {palace} — two people finishing each other's sentences. Doors there open with a push instead of a shove.",
    "A combine {when}: the {period}'s sign, the {transit}, meets the {natal} in your chart's {palace} like neighbors who already get along. A fair window for mending or agreeing.",
  ],
  trine: [
    "{periodPossCap} sign, the {transit}, completes a trine with the {natal} in your chart's {palace} — signs rowing one direction, a crew that has rowed together for years. Easier to build there than to start cold.",
    "A trine {when}: the {period}'s sign, the {transit}, joins the {natal} already in your chart's {palace} — three friends planning one surprise without a group chat. Support gathers in that room.",
  ],
  punishment: [
    "{periodPossCap} sign, the {transit}, rubs against the {natal} in your chart's {palace} — a punishment, the stone in your shoe that keeps announcing itself. Naming it plainly takes most of its sting.",
    "A punishment {when}: the {period}'s sign, the {transit}, grates on the {natal} in your chart's {palace} — friction that repeats, the squeaky stair you keep stepping on. Awkward more than harmful; slow down and it loosens.",
  ],
  harm: [
    "{periodPossCap} sign, the {transit}, sits at odds with the {natal} in your chart's {palace} — a harm, a slow leak rather than a burst pipe. Worth a second look before you commit to anything there.",
    "A harm {when}: the {period}'s sign, the {transit}, brushes the {natal} in your chart's {palace} — small erosions, like the overnight drip of a kitchen tap. Catch them early and they stay small.",
  ],
};

const GENERIC: readonly string[] = [
  "The {period}'s sign, the {transit}, touches the {natal} in your chart's {palace}. Read it as passing weather in that room — something to work with, not against.",
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
  const others = input.branches
    .filter((branch) => branch !== input.transitBranch)
    .map(branchToken);
  if (others.length === 0) {
    // Self-punishment: the transit meets its own branch in the chart.
    return branchToken(input.transitBranch);
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
  const period = when === "today" ? "day" : "year";
  const periodPossCap = when === "today" ? "Today's" : "This year's";
  const salt = `tr:${input.interaction}:${input.natalPalaces.join("")}:${input.transitPalace}:${input.branches.join("")}`;
  const template = pick(templatesFor(input.interaction), seedKey, salt);
  const text = template
    .replaceAll("{period}", period)
    .replaceAll("{periodPossCap}", periodPossCap)
    .replaceAll("{transit}", branchToken(input.transitBranch))
    .replaceAll("{natal}", natalBranchPhrase(input))
    .replaceAll("{palace}", palaceWord(roomPalace))
    .replaceAll("{when}", when);
  const line: ReadingLine = {
    text,
    factTag: interactionTag(input.branches, input.interaction, roomPalace),
  };
  if (TEMPLATES[input.interaction]) {
    line.topic = `interaction:${input.interaction}`;
  }
  return line;
}
