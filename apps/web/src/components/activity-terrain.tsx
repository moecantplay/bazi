/**
 * Today's terrain across all 10 almanac activities: the shipped 7-day
 * ElevationProfile's exact dashed-line/tone-height grammar, replotted across
 * activities instead of days. A "Show all 10 in detail" disclosure (matching
 * chart-view.tsx's existing pattern) opens the full manifest below.
 *
 * Only the dashed line lives inside the SVG's stretched (preserveAspectRatio
 * "none") coordinate space — dots are ordinary HTML elements positioned by
 * percentage on top, same split ElevationProfile uses. Putting circles inside
 * that stretched space instead turns them into ellipses, since the viewBox
 * scales x and y non-uniformly to fill a wide, short container.
 *
 * Labels live in their own axis lane under the plot, horizontal, staggered
 * onto two rows (odd activities drop a row). An earlier cut hung each label
 * off its own dot at an upward angle; whenever the route climbed to the next
 * node the label ran straight across the line and into that node — the same
 * collision the map hero hit, fixed the same way: text stacks below, in the
 * one direction the route never occupies. Ten labels at 360px are ~29px
 * apart, narrower than a six-letter word, hence the stagger.
 *
 * Cell layout (leaning/label/classical/x/y) comes from presentation's
 * `activityTerrain` — this component only renders it.
 */

"use client";

import { useMemo, useState } from "react";
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-2.5 w-2.5 flex-none transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
    >
      <path d="M4 1.5L9 6L4 10.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  assessments: ActivityAssessment[];
}

export function ActivityTerrain({ assessments }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const cells = useMemo(() => activityTerrain(assessments), [assessments]);
  const pathD = useMemo(() => elevationPath(cells), [cells]);

  return (
    <div data-activity-terrain className="flex flex-col gap-2">
      <p className="kicker">Today&rsquo;s terrain &middot; by activity</p>
      <div className="rounded-card bg-surface p-4 shadow-card">
        <div className="flex h-32 flex-col" role="img" aria-label={summarize(cells)}>
          <div className="relative flex-1">
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
                <li
                  key={cell.key}
                  className={`absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName(cell.leaning)}`}
                  style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
                />
              ))}
            </ul>
          </div>
          <ul className="relative mt-2 h-6 list-none" aria-hidden="true">
            {cells.map((cell, index) => (
              <li
                key={cell.key}
                className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[7.5px] font-bold uppercase tracking-wide text-ink-soft"
                style={{ left: `${cell.x}%`, top: index % 2 === 0 ? 0 : "12px" }}
              >
                {cell.key}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap gap-3.5">
          <span className="flex items-center gap-1.5 caption">
            <span className="h-2 w-2 rounded-full bg-ink" />
            Favors
          </span>
          <span className="flex items-center gap-1.5 caption">
            <span className="h-2 w-2 rounded-full border-[1.5px] border-ink-soft bg-surface" />
            Steady
          </span>
          <span className="flex items-center gap-1.5 caption">
            <span className="h-2 w-2 rounded-full bg-signal-amber" />
            Watch
          </span>
        </div>

        <button
          type="button"
          aria-expanded={detailOpen}
          onClick={() => setDetailOpen((open) => !open)}
          className="tap-target mt-3 flex w-full items-center justify-between border-t border-hairline pt-3 text-[12px] font-bold uppercase tracking-wide text-ink"
        >
          {detailOpen ? "Hide details" : "Show all 10 in detail"}
          <ChevronIcon open={detailOpen} />
        </button>

        {detailOpen && (
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
        )}
      </div>
    </div>
  );
}
