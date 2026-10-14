/**
 * View-model for the Conditions screen (/conditions/): Today read with a
 * weather app's rhythm — current conditions, the day's twelve hours as a
 * strip, and the ten days ahead as a list. Pure derivations over the same
 * engine/content data Today already renders; nothing here is computed from
 * a new source.
 */

import { dailyPillar, dayQuality, type Element } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS, OFFICER_GLOSSES } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { addDays } from "./dates.js";
import { dayTone, type DayTone } from "./day-tone.js";
import { describeBranch, describeStem } from "./display.js";
import { readingZoneOf } from "./reading-zone.js";
import type { StoredProfile } from "./types.js";

export const CONDITION_DAYS_LENGTH = 10;

/** Index into `hourBlocks` of the block containing the device's current hour. */
export function currentHourBlockIndex(now: Date = new Date()): number {
  return Math.floor(((now.getHours() + 1) % 24) / 2);
}

export interface ConditionDay {
  iso: string;
  officerKey: string;
  officerName: string;
  /** OFFICER_GLOSSES' everyday translation of the officer. */
  gloss: string;
  tone: DayTone;
  element: Element;
  polarity: "yang" | "yin";
  animal: string;
  /** The strongest leaning activity's modern label, or null on an even day. */
  lead: { label: string; leaning: "favors" | "friction" } | null;
}

/** The next `length` days (today first), each summarised as one conditions row. */
export function conditionDays(
  profile: StoredProfile,
  todayISO: string,
  length: number = CONDITION_DAYS_LENGTH
): ConditionDay[] {
  const zone = readingZoneOf(profile);
  const chart = chartFor(profile);
  return Array.from({ length }, (_, index) => {
    const iso = addDays(todayISO, index);
    const pillar = dailyPillar(iso, zone);
    const stem = describeStem(pillar.stem);
    const quality = dayQuality(chart, iso, zone);
    const strongest = quality.assessments
      .filter((assessment) => assessment.leaning !== "neutral")
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];
    return {
      iso,
      officerKey: quality.officer.key,
      officerName: quality.officer.english,
      gloss: OFFICER_GLOSSES[quality.officer.key] ?? "the day's own grain",
      tone: dayTone(profile, iso),
      element: stem.element,
      polarity: stem.polarity,
      animal: describeBranch(pillar.branch).gloss,
      lead:
        strongest && strongest.leaning !== "neutral"
          ? { label: ACTIVITY_LABELS[strongest.activity].label, leaning: strongest.leaning }
          : null
    };
  });
}
