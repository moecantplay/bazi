/**
 * How far through the day the device's clock currently sits (0–1), for the
 * map hero's "you are here" marker. Re-checked on a timer and whenever the
 * app regains focus/visibility, same triggers as `useTodayLabel` — a PWA
 * left open overnight or backgrounded through the afternoon should still
 * find the marker where the clock actually is. The fraction math itself
 * (`dayProgress`) is pure and lives in presentation; this hook is only the
 * browser-event wiring around it.
 */

"use client";

import { useEffect, useState } from "react";
import { dayProgress } from "@daymaster/presentation";

const REFRESH_INTERVAL_MS = 60_000;

export function useDayProgress(): number {
  const [progress, setProgress] = useState(() => dayProgress());

  useEffect(() => {
    function refresh() {
      if (document.visibilityState === "hidden") {
        return;
      }
      setProgress(dayProgress());
    }
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return progress;
}
