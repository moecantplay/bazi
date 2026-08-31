/**
 * The bridge from a stored profile to its luck-pillar readings — one per
 * decade, the whole sequence at once (the luck timeline shows every pillar,
 * not just the current one). Deterministic in a seedKey built from the
 * natal seed and each pillar's own stem/branch, so a pillar's reading is
 * stable for as long as that pillar itself is — same shape as
 * cycle-reading.ts's annualReadingFor/monthlyReadingFor, one seedKey per
 * period instance.
 */

import type { LuckPillar } from "@daymaster/bazi-engine";
import { luckPillarFacts } from "@daymaster/bazi-engine";
import { luckPillarReading, type ReadingLine } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";

export interface LuckPillarReading {
  luck: LuckPillar;
  lines: ReadingLine[];
}

/** Every luck pillar's own reading, in chart order. */
export function luckPillarReadingsFor(profile: StoredProfile): LuckPillarReading[] {
  const chart = chartFor(profile);
  return chart.luckPillars.map((luck) => {
    const facts = luckPillarFacts(chart, luck);
    const seedKey = `${natalSeedKey(profile)}|luck|${luck.pillar.stem}${luck.pillar.branch}`;
    return { luck, lines: luckPillarReading(facts, seedKey) };
  });
}
