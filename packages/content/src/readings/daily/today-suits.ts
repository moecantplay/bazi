/**
 * "What the day suits" on Today (VOICE.md rule 12, M20-21 R6): a plain heading
 * for the day type, the Favors and Watch chips, and one reason for the Watch
 * group. The reason never restates the first screen, so it names the part of
 * life or the day type, not the sign link.
 */

import type { ActivityReason, DayQuality } from "@daymaster/bazi-engine";
import { buildChips, type GuidanceChip } from "../../day-guidance.js";
import { textRun, type TokenLine } from "../../tokens.js";
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

function watchReason(quality: DayQuality, watch: readonly GuidanceChip[]): string | null {
  if (watch.length === 0) {
    return null;
  }
  const acts = joinActs(watch.map((chip) => chip.label));
  const top = quality.assessments.find((assessment) => assessment.activity === watch[0]?.activity);
  const reasons: readonly ActivityReason[] = top?.reasons ?? [];
  const clash = reasons.find((reason) => reason.source === "day-breaker" || reason.source === "palace-clash");
  if (clash) {
    const area = lifeAreaOf(clash.source === "palace-clash" ? clash.palace : "day");
    return WATCH_REASONS.unsettled.replace("{area}", WATCH_AREA_PHRASE[area]).replace("{acts}", acts);
  }
  const officer = OFFICER_PLAIN[quality.officer.key];
  if (officer && reasons.some((reason) => reason.source === "officer" && reason.direction === -1)) {
    return WATCH_REASONS.officer.replace("{favours}", officer.favours).replace("{acts}", acts);
  }
  return WATCH_REASONS.plain.replace("{Acts}", `${acts.charAt(0).toUpperCase()}${acts.slice(1)}`);
}

/** Today's "What the day suits". */
export function todaySuits(quality: DayQuality): TodaySuits {
  const chips = buildChips(quality.assessments);
  const watch = chips.filter((chip) => chip.leaning === "friction");
  const reason = watchReason(quality, watch);
  const heading = OFFICER_PLAIN[quality.officer.key]?.heading ?? "The day's grain";
  return { heading: textRun(heading), chips, watchReason: reason ? textRun(reason) : null };
}
