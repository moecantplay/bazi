/**
 * The date-finder bridge: run the engine's date selection for the primary
 * profile and (optionally) one saved person, over a range the user chose. The
 * range is clamped to the engine's supported years and to its one-year maximum
 * before the call, so a wide or out-of-bounds request never throws — it comes
 * back trimmed with a note explaining what changed.
 */

import {
  findDates,
  type ActivityKey,
  type ActivityLeaning,
  type DateCandidate
} from "@daymaster/bazi-engine";
import { chartFor, chartForBirth } from "./chart";
import { addDays, daysBetween } from "./dates";
import type { StoredPerson } from "./people";
import type { StoredProfile } from "./profile";

/** Inclusive bounds of the engine's solar-term tables; also the input min/max. */
export const MIN_DATE = "1900-01-01";
export const MAX_DATE = "2100-12-31";
/** The engine's own maximum window, mirrored here so we clamp before it throws. */
const MAX_RANGE_DAYS = 366;
/** How many ranked days the results list shows. */
const TOP_RESULTS = 10;

/** The finished search: the ranked top days plus a note if the range moved. */
export interface DateSearch {
  candidates: DateCandidate[];
  /** Set when the requested range was trimmed to fit; null when untouched. */
  clampedNote: string | null;
}

function clampToBounds(iso: string): string {
  if (iso < MIN_DATE) {
    return MIN_DATE;
  }
  if (iso > MAX_DATE) {
    return MAX_DATE;
  }
  return iso;
}

/**
 * Rank the days in [start, end] for `activity` against the profile and, when
 * given, one person. Best days first; at most ten. The zone is the profile's
 * birth zone, consistent with every other reading surface.
 */
export function findDatesFor(
  profile: StoredProfile,
  activity: ActivityKey,
  start: string,
  end: string,
  person: StoredPerson | null
): DateSearch {
  const notes: string[] = [];

  const from = clampToBounds(start);
  let to = clampToBounds(end);
  if (from !== start || to !== end) {
    notes.push("The range was trimmed to the supported years (1900–2100).");
  }
  if (to < from) {
    to = from;
  }
  if (daysBetween(from, to) + 1 > MAX_RANGE_DAYS) {
    to = addDays(from, MAX_RANGE_DAYS - 1);
    notes.push("A search covers at most one year, so the range was shortened.");
  }

  const charts = [chartFor(profile)];
  if (person !== null) {
    charts.push(chartForBirth(person.birth, profile.config));
  }

  const zone = profile.birth.city.tz;
  const ranked = findDates(charts, activity, from, to, zone);
  return {
    candidates: ranked.slice(0, TOP_RESULTS),
    clampedNote: notes.length > 0 ? notes.join(" ") : null
  };
}

/**
 * Cell background per leaning — a low-opacity element hue mixed toward the card
 * surface, so ink text stays AA in both themes. Favours reads as leaf-green
 * (Wood), friction as flame-orange (Fire, deliberately not the seal's
 * cinnabar); neutral carries no hue. Fills may carry hue (DESIGN.md); text stays ink.
 */
export const LEANING_TINT: Record<ActivityLeaning, string> = {
  favors: "color-mix(in srgb, var(--element-wood) 24%, var(--paper-raised))",
  neutral: "var(--paper-raised)",
  friction: "color-mix(in srgb, var(--element-fire) 24%, var(--paper-raised))"
};

/** Plain word for a leaning, for swatch aria labels. */
export const LEANING_WORD: Record<ActivityLeaning, string> = {
  favors: "favours",
  neutral: "neutral",
  friction: "friction"
};
