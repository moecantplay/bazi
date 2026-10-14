/**
 * The full manifest of the 10 almanac activities behind "What the day suits"
 * (today-suits.tsx): each activity with its leaning on a short dashed track,
 * modern name over classical category. Cell layout (leaning/label/classical)
 * comes from presentation's `activityTerrain`; this only renders it.
 */

"use client";

import { useMemo } from "react";
import type { ActivityAssessment } from "@daymaster/bazi-engine";
import { activityTerrain, type ActivityTerrainCell } from "@daymaster/presentation";

function trackDotFill(leaning: ActivityTerrainCell["leaning"]): string {
  if (leaning === "favors") {
    return "var(--ink)";
  }
  if (leaning === "friction") {
    return "var(--signal-amber)";
  }
  return "var(--paper)";
}

function trackX(leaning: ActivityTerrainCell["leaning"]): number {
  if (leaning === "favors") {
    return 86;
  }
  if (leaning === "friction") {
    return 14;
  }
  return 50;
}

/** The cells for a day's assessments, memoized for the manifest. */
export function useActivityTerrain(assessments: ActivityAssessment[]): ActivityTerrainCell[] {
  return useMemo(() => activityTerrain(assessments), [assessments]);
}

interface ManifestProps {
  cells: ActivityTerrainCell[];
}

/** Every activity with its leaning on a short track, modern name over classical category. */
export function ActivityManifest({ cells }: ManifestProps) {
  return (
    <ul data-activity-manifest className="mt-3 flex flex-col gap-0.5" aria-label="All 10 activities in detail">
      {cells.map((cell, index) => (
        <li
          key={cell.key}
          className={`flex items-center gap-3 bg-paper px-3 py-2.5 ${
            index === 0 ? "rounded-t-[14px]" : ""
          } ${index === cells.length - 1 ? "rounded-b-[14px]" : ""}`}
        >
          <svg viewBox="0 0 100 30" aria-hidden="true" className="h-4 w-12 flex-none">
            <line x1="6" x2="94" y1="15" y2="15" stroke="var(--ink-soft)" strokeWidth="1.6" strokeDasharray="2.6 3.2" opacity="0.55" />
            <circle
              cx={trackX(cell.leaning)}
              cy="15"
              r="5.4"
              fill={trackDotFill(cell.leaning)}
              stroke={cell.leaning === "neutral" ? "var(--ink-soft)" : "none"}
              strokeWidth="1.8"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-[13.5px] font-semibold text-ink">{cell.label}</span>
            <span className="text-[11.5px] text-ink-soft">{cell.classical}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
