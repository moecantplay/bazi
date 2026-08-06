/**
 * Compute a chart preview for onboarding/edit-birth flows, converting the
 * engine's thrown RangeError (birth year outside 1900-2100) into a result
 * shape the UI can render without a try/catch of its own at every call site.
 */

import { computePillars, type ChartPillars } from "./pillars.js";
import type { StoredBirth, StoredConfig } from "./types.js";

export interface ChartPreviewResult {
  pillars: ChartPillars | null;
  /** True when the engine rejected the birth details (out-of-range year). */
  error: boolean;
}

export function chartPreviewFor(birth: StoredBirth, config: StoredConfig): ChartPreviewResult {
  try {
    return { pillars: computePillars(birth, config), error: false };
  } catch {
    return { pillars: null, error: true };
  }
}
