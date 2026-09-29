/**
 * How far through the day the device's clock currently sits (0–1), for the
 * map hero's "you are here" marker. The fraction math itself (`dayProgress`)
 * is pure and lives in presentation; the clock wiring is `useNow`.
 */

"use client";

import { dayProgress } from "@daymaster/presentation";
import { useNow } from "@/lib/use-now";

export function useDayProgress(): number {
  return dayProgress(useNow());
}
