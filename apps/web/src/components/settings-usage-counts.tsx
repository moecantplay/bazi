/**
 * Settings' usage-counts switch (M19.8-06), inside "Your data". Hidden when
 * the build doesn't count at all; replaced by a plain note when the browser
 * sends Global Privacy Control or Do Not Track, which always wins.
 */

"use client";

import { useState } from "react";
import { Toggle } from "@/components/toggle";
import { analyticsConfig, browserAsksNotToTrack, dropPending, startUsageCounts } from "@/lib/analytics";
import { loadUsageCountsPreference, saveUsageCountsPreference } from "@/lib/store";

const LABEL = "Share anonymous usage counts";

export function SettingsUsageCounts() {
  const [allowed, setAllowed] = useState(() => loadUsageCountsPreference());

  if (analyticsConfig() === null) {
    return null;
  }

  if (browserAsksNotToTrack()) {
    return (
      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
        Your browser asks sites not to track you, so nothing is counted.
      </p>
    );
  }

  function choose(next: boolean) {
    setAllowed(next);
    saveUsageCountsPreference(next);
    if (next) {
      startUsageCounts();
    } else {
      dropPending();
    }
  }

  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-[15px] text-ink">{LABEL}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Counts which screens and looks get used, so the app can get better. Never your birth
          details, notes, or anything that identifies you. No cookies.
        </p>
      </div>
      <Toggle checked={allowed} onChange={choose} label={LABEL} />
    </div>
  );
}
