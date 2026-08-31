/**
 * Decade luck-pillar content: `luckTransitionLines` phrases the handover
 * between two ages (the caller supplies them; no pillar math, no date
 * arithmetic). `luckPillarReading` is the decade's own reading — ten-god
 * theme, element weather, one transit line — delegating to horizon-reading's
 * `periodLines`, the same builder annual/monthly already share, keyed to the
 * "luck" period so it reads "This decade..." instead of "This year...".
 */

import type { ReadingFact } from "@daymaster/bazi-engine";
import type { ReadingLine } from "./types.js";
import { finalizeLine } from "./types.js";
import { pickDistinct, pickInt } from "./hash.js";
import { LUCK_TEMPLATES } from "./banks/luck.js";
import { periodLines } from "./horizon-reading.js";

interface LuckTransitionParams {
  fromAge: number;
  toAge: number;
}

/** Build 1–2 decade-transition lines for a handover between two ages. */
export function luckTransitionLines(
  params: LuckTransitionParams,
  seedKey: string,
): ReadingLine[] {
  const count = pickInt(1, 2, seedKey, "luckn");
  const templates = pickDistinct(LUCK_TEMPLATES, count, seedKey, "luck");
  return templates
    .map((template) => ({
      text: template
        .replaceAll("{from}", String(params.fromAge))
        .replaceAll("{to}", String(params.toAge)),
      factTag: null,
      topic: "luck-pillar",
    }))
    .map(finalizeLine);
}

/** The decade's own reading: ten-god theme, element weather, one transit line. */
export function luckPillarReading(facts: readonly ReadingFact[], seedKey: string): ReadingLine[] {
  return periodLines(facts, "luck", seedKey).map(finalizeLine);
}
