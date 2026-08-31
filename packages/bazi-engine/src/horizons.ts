/**
 * Horizon facts: the year (流年) and month (流月) currents read against a natal
 * chart — the same treatment `dailyFacts` gives the day, lifted to the two
 * longer periods, but for an arbitrarily *selected* year/month/decade (the
 * Cycles decade → year → month picker) rather than "the date happening now".
 *
 * `annualPillarFacts` takes a bare Gregorian year — the sexagenary year
 * boundary is 立春, not a date, so `annualPillar` never needed one.
 * `monthlyPillarFactsForCalendarMonth` resolves at local noon on the 15th of
 * the given Gregorian month: centered in the month so the jié boundary
 * (which can land a few days either side of the 1st) never misclassifies it.
 * `luckPillarFacts` reuses the same period-fact shape for a luck pillar
 * (大运) — a decade rather than a transiting date, so it takes the pillar
 * directly instead of a date/zone to resolve one.
 */

import { DateTime } from "luxon";
import { elementOfStem } from "./attributes.js";
import { transitInteractionFacts, type ReadingFact } from "./facts.js";
import { annualPillar, monthPillar } from "./pillars.js";
import { tenGods } from "./ten-gods.js";
import type { Chart, LuckPillar, Pillar } from "./types.js";

function periodFacts(
  chart: Chart,
  pillar: Pillar,
  period: "annual" | "monthly" | "luck",
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

/** The current a luck pillar (大运) brings, read against the natal chart. */
export function luckPillarFacts(chart: Chart, luck: LuckPillar): ReadingFact[] {
  return periodFacts(chart, luck.pillar, "luck");
}

/** One arbitrary calendar year's or month's pillar and facts, e.g. for a selected year. */
export interface PillarFacts {
  pillar: Pillar;
  facts: ReadingFact[];
}

/** The current an arbitrary selected year (流年) brings, independent of any date. */
export function annualPillarFacts(chart: Chart, year: number): PillarFacts {
  const pillar = annualPillar(year);
  return { pillar, facts: periodFacts(chart, pillar, "annual") };
}

/** The current an arbitrary selected calendar month (流月) brings. */
export function monthlyPillarFactsForCalendarMonth(
  chart: Chart,
  year: number,
  month: number,
  zone: string,
): PillarFacts {
  const noon = DateTime.fromObject({ year, month, day: 15 }, { zone }).set({ hour: 12 });
  if (!noon.isValid) {
    throw new Error(
      `Invalid year/month "${year}-${month}" or zone "${zone}": ${noon.invalidReason ?? "unknown"}`,
    );
  }
  const pillar = monthPillar(noon.toJSDate(), zone);
  return { pillar, facts: periodFacts(chart, pillar, "monthly") };
}
