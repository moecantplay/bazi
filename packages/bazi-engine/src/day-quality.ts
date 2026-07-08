/**
 * Per-activity day quality: the generic almanac layer (the day's officer)
 * personalised against a natal chart.
 *
 * Scoring — interpretive, one school, kept deliberately small and explainable
 * (same doctrine as `strength`/`favorableElements`):
 *   - officer 宜 (favors) +2 / 忌 (avoids) −2 — the Tong Shu base layer;
 *   - transit day stem's element in the chart's favourable elements: +1 to all;
 *   - transit day branch clashing the natal day branch — the personal breaker
 *     day (日破) — dents major undertakings (see DAY_BREAKER_MODIFIER);
 *   - transit day branch six-combining the natal day branch eases the home
 *     palace (commit/gather/rest +1);
 *   - a clash on the natal month branch (career palace) dents launch/sign/ask;
 *   - a clash on the natal year branch (roots) dents move/travel.
 * Leaning: score ≥ +2 favors, ≤ −2 friction, else neutral. Unknown-time charts
 * never consult the hour pillar.
 */

import {
  ACTIVITIES,
  CAREER_CLASH_MODIFIER,
  DAY_BREAKER_MODIFIER,
  DAY_COMBINE_MODIFIER,
  ROOTS_CLASH_MODIFIER,
  type ActivityKey,
  type BranchRelationModifier,
  type DayOfficerDefinition,
} from "../data/day-officer-tables.js";
import { SIX_CLASHES, SIX_COMBINES } from "../data/interactions-tables.js";
import { elementOfStem } from "./attributes.js";
import { dayOfficer } from "./day-officers.js";
import { dailyPillar } from "./pillars.js";
import type { Branch, Chart, Element, Pillar } from "./types.js";

/** How a day leans for one activity. */
export type ActivityLeaning = "favors" | "neutral" | "friction";

/** A typed, citable contribution to an activity's score. */
export type ActivityReason =
  | { source: "officer"; chinese: string; english: string; direction: 1 | -1 }
  | { source: "element-day"; element: Element }
  | { source: "day-breaker"; transitBranch: Branch; natalBranch: Branch }
  | { source: "day-combine"; transitBranch: Branch; natalBranch: Branch }
  | {
      source: "palace-clash";
      palace: "month" | "year";
      transitBranch: Branch;
      natalBranch: Branch;
    };

/** One activity's verdict for the day. */
export interface ActivityAssessment {
  activity: ActivityKey;
  /** Classical category (嫁娶 …) for the surface gloss. */
  chinese: string;
  classical: string;
  leaning: ActivityLeaning;
  score: number;
  reasons: ActivityReason[];
}

/** The full day read: transit pillar, officer, and all activity verdicts. */
export interface DayQuality {
  date: string;
  pillar: Pillar;
  officer: DayOfficerDefinition;
  assessments: ActivityAssessment[];
}

function pairMatches(
  table: readonly (readonly [Branch, Branch])[],
  a: Branch,
  b: Branch,
): boolean {
  return table.some(
    ([first, second]) => (first === a && second === b) || (first === b && second === a),
  );
}

interface ScoredContribution {
  reason: ActivityReason;
  modifier: BranchRelationModifier;
}

function leaningOf(score: number): ActivityLeaning {
  if (score >= 2) {
    return "favors";
  }
  if (score <= -2) {
    return "friction";
  }
  return "neutral";
}

/** Assess every modelled activity for a chart on a calendar date. */
export function dayQuality(chart: Chart, date: string, zone: string): DayQuality {
  const pillar = dailyPillar(date, zone);
  const officer = dayOfficer(date, zone);
  const dayElement = elementOfStem(pillar.stem);
  const elementFavorable = chart.favorableElements.includes(dayElement);

  // Branch relations against the natal chart. Only year/month/day natal
  // branches participate — the hour pillar is never consulted, so unknown-time
  // charts get the identical treatment.
  const contributions: ScoredContribution[] = [];
  if (pairMatches(SIX_CLASHES, pillar.branch, chart.day.branch)) {
    contributions.push({
      reason: {
        source: "day-breaker",
        transitBranch: pillar.branch,
        natalBranch: chart.day.branch,
      },
      modifier: DAY_BREAKER_MODIFIER,
    });
  }
  if (pairMatches(SIX_COMBINES, pillar.branch, chart.day.branch)) {
    contributions.push({
      reason: {
        source: "day-combine",
        transitBranch: pillar.branch,
        natalBranch: chart.day.branch,
      },
      modifier: DAY_COMBINE_MODIFIER,
    });
  }
  if (pairMatches(SIX_CLASHES, pillar.branch, chart.month.branch)) {
    contributions.push({
      reason: {
        source: "palace-clash",
        palace: "month",
        transitBranch: pillar.branch,
        natalBranch: chart.month.branch,
      },
      modifier: CAREER_CLASH_MODIFIER,
    });
  }
  if (pairMatches(SIX_CLASHES, pillar.branch, chart.year.branch)) {
    contributions.push({
      reason: {
        source: "palace-clash",
        palace: "year",
        transitBranch: pillar.branch,
        natalBranch: chart.year.branch,
      },
      modifier: ROOTS_CLASH_MODIFIER,
    });
  }

  const assessments = ACTIVITIES.map((activity): ActivityAssessment => {
    let score = 0;
    const reasons: ActivityReason[] = [];

    if (officer.favors.includes(activity.key)) {
      score += 2;
      reasons.push({
        source: "officer",
        chinese: officer.chinese,
        english: officer.english,
        direction: 1,
      });
    } else if (officer.avoids.includes(activity.key)) {
      score -= 2;
      reasons.push({
        source: "officer",
        chinese: officer.chinese,
        english: officer.english,
        direction: -1,
      });
    }

    if (elementFavorable) {
      score += 1;
      reasons.push({ source: "element-day", element: dayElement });
    }

    for (const { reason, modifier } of contributions) {
      const delta = modifier[activity.key];
      if (delta !== undefined && delta !== 0) {
        score += delta;
        reasons.push(reason);
      }
    }

    return {
      activity: activity.key,
      chinese: activity.chinese,
      classical: activity.classical,
      leaning: leaningOf(score),
      score,
      reasons,
    };
  });

  return { date, pillar, officer, assessments };
}
