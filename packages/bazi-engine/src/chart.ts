/**
 * Chart assembly: turn a birth event into a fully derived natal chart.
 *
 * `hourKnown: false` omits the hour pillar and everything derived from it — no
 * hour hidden stems, no hour ten god, no hour palace in interactions, and the
 * hour contributes nothing to element counts or strength.
 */

import { elementOfBranch, elementOfStem } from "./attributes.js";
import { favorableElements } from "./favorable-elements.js";
import { hiddenStems } from "./hidden-stems.js";
import { interactions, natalPalacedBranches } from "./interactions.js";
import { luckPillars } from "./luck-pillars.js";
import { dayPillar, hourPillar, monthPillar, yearPillar } from "./pillars.js";
import { strength } from "./strength.js";
import { tenGods } from "./ten-gods.js";
import { DEFAULT_CONFIG, type Chart, type ChartInput, type Element, type Pillar } from "./types.js";

/** A zeroed count for every element. */
function emptyElementCounts(): Record<Element, number> {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

/**
 * Five-element counts over the visible chart: one point per visible stem's
 * element (year/month/day/hour) plus one per branch's own element. The hour
 * pillar contributes only when the birth hour is known.
 */
function countElements(pillars: Pillar[]): Record<Element, number> {
  const counts = emptyElementCounts();
  for (const pillar of pillars) {
    counts[elementOfStem(pillar.stem)] += 1;
    counts[elementOfBranch(pillar.branch)] += 1;
  }
  return counts;
}

export function computeChart(input: ChartInput): Chart {
  const { instant, zone, sex, hourKnown, longitude } = input;
  const config = input.config ?? DEFAULT_CONFIG;

  const year = yearPillar(instant, zone);
  const month = monthPillar(instant, zone);
  const day = dayPillar(instant, zone, config, longitude);
  const dayMaster = day.stem;
  const hour = hourKnown ? hourPillar(instant, zone, dayMaster, config, longitude) : null;

  const visiblePillars = [year, month, day, ...(hour ? [hour] : [])];
  const strengthResult = strength({ dayMaster, year, month, day, hour });

  return {
    year,
    month,
    day,
    hour,
    dayMaster,
    hiddenStems: {
      year: hiddenStems(year.branch),
      month: hiddenStems(month.branch),
      day: hiddenStems(day.branch),
      hour: hour ? hiddenStems(hour.branch) : null,
    },
    tenGods: {
      year: tenGods(dayMaster, year.stem),
      month: tenGods(dayMaster, month.stem),
      hour: hour ? tenGods(dayMaster, hour.stem) : null,
    },
    fiveElementCounts: countElements(visiblePillars),
    strength: strengthResult,
    favorableElements: favorableElements({
      dayMaster,
      monthBranch: month.branch,
      strength: strengthResult.value,
    }),
    interactions: interactions(
      natalPalacedBranches({
        year: year.branch,
        month: month.branch,
        day: day.branch,
        hour: hour ? hour.branch : null,
      }),
    ),
    luckPillars: luckPillars({ instant, zone, yearStem: year.stem, monthPillar: month, sex }),
    meta: { zone, sex, hourKnown, config },
  };
}
