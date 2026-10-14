/**
 * The Welcome screen's sample of today (M24-05), built only from chart-free
 * facts: the day officer and its almanac activities, and the easy/rough hours,
 * which depend on the day's sign alone. Nothing here needs a birth chart.
 */

import { dailyPillar, dayOfficer } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS, welcomeHeadline } from "@daymaster/content";
import { hourBlocks } from "./hour-blocks.js";

export interface WelcomeSample {
  headline: string;
  /** Modern labels of the activities the almanac favours today. */
  favors: string[];
  /** Clock window of the easiest hour, e.g. "1–3 am". */
  easiest: string | null;
  /** Clock window of the roughest hour. */
  roughest: string | null;
}

export function welcomeSample(todayISO: string, zone: string): WelcomeSample {
  const officer = dayOfficer(todayISO, zone);
  const blocks = hourBlocks(dailyPillar(todayISO, zone).branch);
  return {
    headline: welcomeHeadline(officer.key),
    favors: officer.favors.map((activity) => ACTIVITY_LABELS[activity].label),
    easiest: blocks.find((block) => block.mark === "easy")?.label ?? null,
    roughest: blocks.find((block) => block.mark === "rough")?.label ?? null
  };
}
