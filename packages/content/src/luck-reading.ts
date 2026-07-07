/**
 * Decade luck-pillar handover lines. The caller supplies the ages; this layer
 * does no pillar math and no date arithmetic. Returns 1–2 seeded lines.
 */

import type { ReadingLine } from "./types.js";
import { pickDistinct, pickInt } from "./hash.js";
import { LUCK_TEMPLATES } from "./banks/luck.js";

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
  return templates.map((template) => ({
    text: template
      .replaceAll("{from}", String(params.fromAge))
      .replaceAll("{to}", String(params.toAge)),
    factTag: null,
  }));
}
