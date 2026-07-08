/**
 * Horizon facts: the year (流年) and month (流月) currents read against a natal
 * chart — the same treatment `dailyFacts` gives the day, lifted to the two
 * longer periods. Both pillars are keyed at local noon of the given date, so a
 * date near a jié boundary reads the month actually in force that day.
 */

import { DateTime } from "luxon";
import { elementOfStem } from "./attributes.js";
import { transitInteractionFacts, type ReadingFact } from "./facts.js";
import { monthPillar, yearPillar } from "./pillars.js";
import { tenGods } from "./ten-gods.js";
import type { Chart, Pillar } from "./types.js";

/** The year and month currents for one date, with their pillars. */
export interface HorizonFacts {
  annualPillar: Pillar;
  monthlyPillar: Pillar;
  annual: ReadingFact[];
  monthly: ReadingFact[];
}

function periodFacts(
  chart: Chart,
  pillar: Pillar,
  period: "annual" | "monthly",
): ReadingFact[] {
  const element = elementOfStem(pillar.stem);
  const tenGod = tenGods(chart.dayMaster, pillar.stem);
  return [
    ...transitInteractionFacts(chart, pillar.branch, period),
    {
      kind: "element-period",
      period,
      element,
      favorable: chart.favorableElements.includes(element),
    },
    { kind: "ten-god-period", period, god: tenGod.chinese, english: tenGod.english },
  ];
}

/** Year and month currents for a calendar date (`YYYY-MM-DD`) in a zone. */
export function horizonFacts(chart: Chart, date: string, zone: string): HorizonFacts {
  const noon = DateTime.fromISO(date, { zone }).set({ hour: 12 });
  if (!noon.isValid) {
    throw new Error(
      `Invalid date "${date}" or zone "${zone}": ${noon.invalidReason ?? "unknown"}`,
    );
  }
  const instant = noon.toJSDate();
  const annualPillar = yearPillar(instant, zone);
  const monthlyPillar = monthPillar(instant, zone);
  return {
    annualPillar,
    monthlyPillar,
    annual: periodFacts(chart, annualPillar, "annual"),
    monthly: periodFacts(chart, monthlyPillar, "monthly"),
  };
}
