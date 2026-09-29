/**
 * The device clock, re-read every minute and whenever the app regains
 * focus/visibility — a PWA left open overnight or backgrounded through the
 * afternoon should still show where the clock actually is. The single source
 * for Today's live marks (the route's NOW, the dial's hand, day progress).
 */

"use client";

import { useEffect, useState } from "react";

const REFRESH_INTERVAL_MS = 60_000;

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    function refresh() {
      if (document.visibilityState === "hidden") {
        return;
      }
      setNow(new Date());
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

  return now;
}
