/**
 * The day's twelve two-hour blocks, each with its animal, clock window and
 * whether it is the day's rough or easy hour. Onboarding's sample reads it
 * (welcome-sample.ts); it moved here from the retired Conditions screen (M24-12).
 */

import { BRANCHES, hourBlockWindow, hourInteractionFacts, type Branch } from "@daymaster/bazi-engine";
import { hourWindowLabel } from "@daymaster/content";
import { describeBranch } from "./display.js";

/** The rough hour (its branch clashes with the day's) or the easy hour (combines). */
export type HourMark = "rough" | "easy";

export interface HourBlock {
  branch: Branch;
  animal: string;
  /** Clock window like "9–11 am". */
  label: string;
  startHour: number;
  mark: HourMark | null;
}

/** The twelve two-hour blocks of a day whose branch is `dayBranch`, 子 (11 pm) first. */
export function hourBlocks(dayBranch: Branch): HourBlock[] {
  const facts = hourInteractionFacts(dayBranch);
  return BRANCHES.map((branch) => {
    const window = hourBlockWindow(branch);
    const fact = facts.find((entry) => entry.kind === "hour-interaction" && entry.hourBranch === branch);
    const mark: HourMark | null =
      fact && fact.kind === "hour-interaction" ? (fact.interaction === "six-clash" ? "rough" : "easy") : null;
    return {
      branch,
      animal: describeBranch(branch).gloss,
      label: hourWindowLabel(window.startHour, window.endHour),
      startHour: window.startHour,
      mark
    };
  });
}
