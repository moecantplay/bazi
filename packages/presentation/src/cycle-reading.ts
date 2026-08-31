/**
 * The bridge from a stored profile to an arbitrarily *selected* year or
 * month's own reading — the luck timeline's decade → year → month picker.
 *
 * Deterministic in a seedKey built from the natal seed and the selected
 * pillar's own stem/branch (not the calendar year/month), matching
 * luck-reading.ts's luckPillarReadingsFor convention: the reading is stable
 * for as long as that pillar recurs, and turns over only when the pillar
 * itself does.
 */

import { annualPillarFacts, monthlyPillarFactsForCalendarMonth, type Pillar } from "@daymaster/bazi-engine";
import { annualReading, monthlyReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";

export interface AnnualCycleReading {
  year: number;
  pillar: Pillar;
  lines: ReadingLine[];
}

/** The reading for one arbitrarily selected calendar year's annual (流年) pillar. */
export function annualReadingFor(profile: StoredProfile, year: number): AnnualCycleReading {
  const chart = chartFor(profile);
  const { pillar, facts } = annualPillarFacts(chart, year);
  const seedKey = `${natalSeedKey(profile)}|annual|${pillar.stem}${pillar.branch}`;
  return { year, pillar, lines: annualReading(facts, seedKey) };
}

export interface MonthlyCycleReading {
  year: number;
  month: number;
  pillar: Pillar;
  lines: ReadingLine[];
}

/** The reading for one arbitrarily selected calendar month's monthly (流月) pillar. */
export function monthlyReadingFor(
  profile: StoredProfile,
  year: number,
  month: number,
): MonthlyCycleReading {
  const chart = chartFor(profile);
  const zone = profile.birth.city.tz;
  const { pillar, facts } = monthlyPillarFactsForCalendarMonth(chart, year, month, zone);
  const seedKey = `${natalSeedKey(profile)}|monthly|${pillar.stem}${pillar.branch}`;
  return { year, month, pillar, lines: monthlyReading(facts, seedKey) };
}
