/**
 * The day's own hours: one line naming the two-hour block whose sign clashes
 * with today's (the rough hour) and the one that combines with it (the easy
 * hour) — the almanac's 時辰吉凶 read, belonging to the day itself rather
 * than to the reader's chart. These are the only timed facts in a daily
 * reading; everything else holds from midnight to midnight, and the map
 * hero draws the distinction (day-long marks off the route, these on it).
 *
 * Templates substitute {day} (today's glossed sign), {clashHour}/{clashWindow}
 * and {combineHour}/{combineWindow} (the glossed hour signs and their
 * wall-clock windows).
 */

import type { Branch } from "@daymaster/bazi-engine";
import type { DraftLine } from "../types.js";
import { fillRuns, textRun, type TokenLine } from "../tokens.js";
import { pick } from "../hash.js";
import { HOURS_TOPIC } from "../glossary.js";
import { branchTokenRuns, hourWindowLabel } from "../vocab.js";

export interface HourInteractionInput {
  dayBranch: Branch;
  clash: { hourBranch: Branch; startHour: number; endHour: number };
  combine: { hourBranch: Branch; startHour: number; endHour: number };
}

export const HOUR_TEMPLATES: readonly string[] = [
  "The day has its own rhythm: today's sign, the {day}, meets the {clashHour} hour ({clashWindow}) head-on — the rough patch, where plans jostle — and settles into the {combineHour} hour ({combineWindow}), the easiest stretch to get something agreed.",
  "Two hours stand out on today's route. The {clashHour} hour ({clashWindow}) pulls opposite the {day}, today's sign — expect things to shift there — while the {combineHour} hour ({combineWindow}) leans the same way it does, a quieter window for anything that needs a yes.",
  "Today's sign, the {day}, has a rough hour and an easy one: the {clashHour} hour ({clashWindow}) runs against it, so give whatever lands then a little slack, and the {combineHour} hour ({combineWindow}) runs with it, a fair time to settle something.",
];

/** Build the day's hours line, seeded and voice-compliant. */
export function hourInteractionLine(input: HourInteractionInput, seedKey: string): DraftLine {
  const template = pick(HOUR_TEMPLATES, seedKey, `hours:${input.dayBranch}`);
  const clashWindow = hourWindowLabel(input.clash.startHour, input.clash.endHour);
  const combineWindow = hourWindowLabel(input.combine.startHour, input.combine.endHour);
  const runs = fillRuns(template, {
    day: branchTokenRuns(input.dayBranch),
    clashHour: branchTokenRuns(input.clash.hourBranch),
    clashWindow: textRun(clashWindow),
    combineHour: branchTokenRuns(input.combine.hourBranch),
    combineWindow: textRun(combineWindow),
  });
  const factTagRuns: TokenLine = [
    ...branchTokenRuns(input.clash.hourBranch),
    { kind: "text", text: ` hour clash · ${clashWindow} — ` },
    ...branchTokenRuns(input.combine.hourBranch),
    { kind: "text", text: ` hour combine · ${combineWindow}` },
  ];
  return { runs, factTagRuns, topic: HOURS_TOPIC };
}
