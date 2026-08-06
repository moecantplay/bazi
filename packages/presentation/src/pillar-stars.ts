/** Groups natal star hits by the palace they land on, for the pillar grid. */

import type { ShenshaHit } from "@daymaster/bazi-engine";

export function starsForPalace(
  stars: readonly ShenshaHit[] | undefined,
  palace: string
): ShenshaHit[] | undefined {
  return stars?.filter((hit) => hit.palace === palace);
}
