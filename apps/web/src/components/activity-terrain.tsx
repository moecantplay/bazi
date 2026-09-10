/**
 * The skyline plot across all 10 almanac activities and its full manifest —
 * the two halves of Today's trail-signs card (trail-signs.tsx composes them
 * with the sign rows in between). The shipped 7-day ElevationProfile's exact
 * dashed-line/tone-height grammar, replotted across activities instead of days.
 *
 * Only the dashed line lives inside the SVG's stretched (preserveAspectRatio
 * "none") coordinate space — dots are ordinary HTML elements positioned by
 * percentage on top, same split ElevationProfile uses. Putting circles inside
 * that stretched space instead turns them into ellipses, since the viewBox
 * scales x and y non-uniformly to fill a wide, short container.
 *
 * Names hang below a baseline under the plot, one per activity, angled 45°
 * downhill the way a crowded chart axis is labelled, with a hairline stake
 * from each dot down to the base so dot and name read as one object. Below
 * the base is the one place the route can never be, so no word crosses it;
 * the 45° hang keeps ten six-letter names clear of each other at the ~29px
 * slot a phone gives them. The activities the sign rows call out (the day's
 * strongest leanings) are set in full ink; the rest stay soft, so the eye
 * lands on the same three or four names the rows name.
 *
 * Cell layout (leaning/label/classical/x/y) comes from presentation's
 * `activityTerrain` — these components only render it.
 */

"use client";

import { useMemo } from "react";
import type { ActivityAssessment } from "@daymaster/bazi-engine";
import { activityTerrain, elevationPath, type ActivityTerrainCell } from "@daymaster/presentation";

function dotClassName(leaning: ActivityTerrainCell["leaning"]): string {
  if (leaning === "favors") {
    return "bg-ink";
  }
  if (leaning === "friction") {
    return "bg-signal-amber";
  }
  return "border-[1.5px] border-ink-soft bg-surface";
}

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

function summarize(cells: ActivityTerrainCell[]): string {
  const favors = cells.filter((cell) => cell.leaning === "favors").length;
  const friction = cells.filter((cell) => cell.leaning === "friction").length;
  const steady = cells.length - favors - friction;
  return `Today across ${cells.length} activities: ${favors} favors, ${steady} steady, ${friction} watch.`;
}

/** The plotted cells for a day's assessments, memoized for the plot and the manifest. */
export function useActivityTerrain(assessments: ActivityAssessment[]): ActivityTerrainCell[] {
  return useMemo(() => activityTerrain(assessments), [assessments]);
}

interface PlotProps {
  cells: ActivityTerrainCell[];
  /** Activities the sign rows call out; their names render in full ink. */
  calledOut: ReadonlySet<string>;
}

export function ActivityTerrainPlot({ cells, calledOut }: PlotProps) {
  const pathD = useMemo(() => elevationPath(cells), [cells]);

  return (
    <div className="relative h-[150px]" role="img" aria-label={summarize(cells)}>
      <div className="absolute inset-x-0 top-0 h-[104px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <path
            d={pathD}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.6"
            strokeDasharray="3 3.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ul className="relative h-full list-none" aria-hidden="true">
          {cells.map((cell) => (
            <li key={cell.key} className="absolute h-full" style={{ left: `${cell.x}%` }}>
              <span
                className="absolute w-px -translate-x-1/2 bg-hairline"
                style={{ top: `calc(${cell.y}% + 5px)`, bottom: 0 }}
              />
              <span
                className={`absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName(cell.leaning)}`}
                style={{ top: `${cell.y}%` }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-x-0 top-[104px] h-px bg-hairline" aria-hidden="true" />
      <ul className="absolute inset-x-0 top-[111px] list-none" aria-hidden="true">
        {cells.map((cell) => (
          <li
            key={cell.key}
            data-terrain-label
            className={`absolute origin-top-left rotate-45 whitespace-nowrap font-mono text-[8px] font-bold uppercase leading-none tracking-wide ${
              calledOut.has(cell.key) ? "text-ink" : "text-ink-soft"
            }`}
            style={{ left: `${cell.x}%` }}
          >
            {cell.key}
          </li>
        ))}
      </ul>
    </div>
  );
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
