/**
 * The Twelve Day Officers (建除十二神): the generic almanac layer under date
 * selection. The officer of a day depends only on the month branch and the day
 * branch — see data/day-officer-tables.ts for the rule, sources, and the
 * conservative activity table.
 */

import { DateTime } from "luxon";
import {
  DAY_OFFICERS,
  type DayOfficerDefinition,
} from "../data/day-officer-tables.js";
import { dailyPillar, monthPillar } from "./pillars.js";
import { branchIndex } from "./sexagenary.js";
import type { Branch } from "./types.js";

/**
 * The officer for a day branch under a governing month branch: the day whose
 * branch equals the month branch is 建 (index 0), advancing one officer per
 * branch step.
 */
export function officerForBranches(
  monthBranch: Branch,
  dayBranch: Branch,
): DayOfficerDefinition {
  const offset = (branchIndex(dayBranch) - branchIndex(monthBranch) + 12) % 12;
  return DAY_OFFICERS[offset] as DayOfficerDefinition;
}

/**
 * The officer governing a calendar date (`YYYY-MM-DD`) in a zone. The month is
 * keyed at local noon, matching how `dailyFacts` reads transit pillars; on the
 * jié boundary the officer repeats, per the classical rule.
 */
export function dayOfficer(date: string, zone: string): DayOfficerDefinition {
  const noon = DateTime.fromISO(date, { zone }).set({ hour: 12 });
  if (!noon.isValid) {
    throw new Error(
      `Invalid date "${date}" or zone "${zone}": ${noon.invalidReason ?? "unknown"}`,
    );
  }
  const day = dailyPillar(date, zone);
  const month = monthPillar(noon.toJSDate(), zone);
  return officerForBranches(month.branch, day.branch);
}
