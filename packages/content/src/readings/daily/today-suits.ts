/**
 * "What the day suits" on Today (VOICE.md rule 12, M20-21 R6): a plain heading
 * for the day type, the Favors and Watch chips, and one reason for the Watch
 * group. The reason never restates the first screen, so it names the part of
 * life or the day type, not the sign link.
 */

import type { ActivityReason, DayQuality } from "@daymaster/bazi-engine";
import { buildChips, type GuidanceChip } from "../../day-guidance.js";
import { fillSlots, pickerFor, type Picker, type RotationSlot } from "../../rotation.js";
import { textRun, type TokenLine } from "../../tokens.js";
import type { DailySeed } from "../../types.js";
import { OFFICER_PLAIN, WATCH_AREA_PHRASE, WATCH_REASONS } from "../../banks/daily/suits.js";
import { lifeAreaOf } from "./life-areas.js";

export interface TodaySuits {
  heading: TokenLine;
  chips: GuidanceChip[];
  /** One reason for every Watch chip; null when nothing is on watch. */
  watchReason: TokenLine | null;
}

function joinActs(labels: readonly string[]): string {
  const lower = labels.map((label) => label.toLowerCase());
  if (lower.length <= 1) {
    return lower[0] ?? "";
  }
  return `${lower.slice(0, -1).join(", ")} and ${lower[lower.length - 1] as string}`;
}

function watchReason(quality: DayQuality, watch: readonly GuidanceChip[], pick: Picker): string | null {
  if (watch.length === 0) {
    return null;
  }
  const acts = joinActs(watch.map((chip) => chip.label));
  const top = quality.assessments.find((assessment) => assessment.activity === watch[0]?.activity);
  const reasons: readonly ActivityReason[] = top?.reasons ?? [];
  const clash = reasons.find((reason) => reason.source === "day-breaker" || reason.source === "palace-clash");
  if (clash) {
    const area = lifeAreaOf(clash.source === "palace-clash" ? clash.palace : "day");
    return fillSlots(pick(WATCH_REASONS.unsettled, "watch:unsettled"), { area: WATCH_AREA_PHRASE[area], acts });
  }
  const officer = OFFICER_PLAIN[quality.officer.key];
  if (officer && reasons.some((reason) => reason.source === "officer" && reason.direction === -1)) {
    return fillSlots(pick(WATCH_REASONS.officer, "watch:officer"), { favours: officer.favours, acts });
  }
  return fillSlots(pick(WATCH_REASONS.plain, "watch:plain"), { Acts: `${acts.charAt(0).toUpperCase()}${acts.slice(1)}` });
}

/**
 * Today's "What the day suits". The heading and reason step by day number:
 * `seed` carries no visits for them, because the day type follows the solar
 * month and has no fixed cycle to count over.
 */
export function todaySuits(quality: DayQuality, seed: Pick<DailySeed, "chart" | "date">): TodaySuits {
  return composeSuits(quality, pickerFor(seed));
}

/** The slots "What the day suits" picks under on a day, with their pool sizes (for the pool-minimum test). */
export function todaySuitsSlots(quality: DayQuality): RotationSlot[] {
  const slots: RotationSlot[] = [];
  composeSuits(quality, pickerFor({ chart: "", date: "1970-01-01" }, slots));
  return slots;
}

function composeSuits(quality: DayQuality, pick: Picker): TodaySuits {
  const chips = buildChips(quality.assessments);
  const watch = chips.filter((chip) => chip.leaning === "friction");
  const reason = watchReason(quality, watch, pick);
  const officer = OFFICER_PLAIN[quality.officer.key];
  const heading = officer ? pick(officer.headings, `suits-heading:${quality.officer.key}`) : "The day's grain";
  return { heading: textRun(heading), chips, watchReason: reason ? textRun(reason) : null };
}
