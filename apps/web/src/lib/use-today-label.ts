/**
 * The device's current date, re-checked whenever the app regains focus or
 * visibility — a PWA reopened after midnight must show the new day, not the
 * day it was backgrounded on. Shared by TodayView (the date strip) and
 * ProfileGate (the terrain stamp), so both roll over at the same instant.
 */

"use client";

import { useEffect, useState } from "react";
import { todayLabel } from "./dates";

export function useTodayLabel(): string {
  const [today, setToday] = useState(() => todayLabel());

  useEffect(() => {
    function refresh() {
      if (document.visibilityState === "hidden") {
        return;
      }
      const fresh = todayLabel();
      setToday((current) => (current === fresh ? current : fresh));
    }
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
}
