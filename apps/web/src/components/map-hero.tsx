/**
 * The Today hero, rebuilt as a map (DESIGN.md §Surfaces "Map hero"): a fixed
 * decorative contour background, the compass/orbit mark top-left, and a
 * dashed route from "YOU ARE HERE" through up to two waypoints to an
 * "EVENING" arrow. Per-day data drives only what DESIGN.md calls out: the
 * waypoints (the same relation facts feeding the waypoint rail), whether
 * each gets a crossing mark, the route's highlight color/label (dayTone),
 * and the two animal glyphs (today's own, and each waypoint's).
 *
 * The route geometry is a reasonable-effort port of the reference mockup
 * (docs/design-system/src/cards/trail.mjs) rather than a pixel-identical
 * copy: the two waypoint slots are literal vertices of the same reused
 * dashed-path string, so both data and decoration stay anchored to one path.
 *
 * The crossing count and aria-label are derived by presentation's
 * `mapHeroSummary` (Phase 5) so this component only renders it.
 *
 * The "what the marks mean" link below it mirrors ElevationProfile's own
 * legend button — same pattern, its own ROUTE_TOPIC glossary entry.
 */

"use client";

import { useState } from "react";
import type { Pillar } from "@daymaster/bazi-engine";
import { ROUTE_TOPIC, glossaryEntry } from "@daymaster/content";
import { describeBranch, mapHeroSummary, type DayTone, type RouteWaypoint } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import { CompassMark } from "@/components/compass-mark";
import { GlossarySheet } from "@/components/glossary-sheet";

/** Six fixed contour paths, decorative and terrain-recolored only — never
 * regenerated per day (DESIGN.md: "the squiggled paths themselves never
 * change"). Reused verbatim from the reference mockup. */
const CONTOURS = [
  "M-8 44 C36 30 84 16 132 26 C180 36 190 66 156 78 C118 92 52 84 22 66 C4 55 -6 50 -8 44",
  "M26 52 C58 40 104 34 128 42 C152 50 152 62 126 68 C96 75 48 68 26 52",
  "M198 96 C238 78 292 90 300 120 C308 150 264 172 226 164 C188 156 162 112 198 96",
  "M216 108 C244 96 278 106 282 124 C286 142 256 152 232 146 C208 140 196 118 216 108",
  "M-8 178 C52 160 116 196 188 186 C248 178 296 194 338 180",
  "M-8 206 C70 190 150 214 240 204 C280 200 312 208 338 202"
];

/** The full dashed route, start (YOU ARE HERE) to end (EVENING). */
const ROUTE_D =
  "M20 204 C58 196 74 172 94 154 C114 136 146 148 170 132 C194 116 198 88 228 74 C252 63 274 54 292 46";

/** The middle stretch of the same route — the highlight segment, colored by dayTone. */
const HIGHLIGHT_D = "M94 154 C114 136 146 148 170 132";

const START = { x: 20, y: 204 };
const WAYPOINT_SLOTS = [
  { x: 94, y: 154 },
  { x: 170, y: 132 }
];
const END = { x: 292, y: 46 };

const TONE_COLOR: Record<DayTone, string> = {
  favoured: "var(--element-wood)",
  friction: "var(--signal-amber)",
  even: "var(--ink)"
};

interface Props {
  /** Present pillars (year/month/day/hour), for the compass rose's geometry. */
  pillars: (Pillar | null)[];
  /** Today's own day-pillar branch gloss ("dragon"), shown at YOU ARE HERE. */
  dayBranchGloss: string;
  tone: DayTone;
  waypoints: RouteWaypoint[];
}

function CrossingMark({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r="9" fill="var(--surface)" stroke={color} strokeWidth="1.6" />
      <path
        d={`M${x - 3.5} ${y - 3.5} L${x + 3.5} ${y + 3.5} M${x + 3.5} ${y - 3.5} L${x - 3.5} ${y + 3.5}`}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  );
}

export function MapHero({ pillars, dayBranchGloss, tone, waypoints }: Props) {
  const toneColor = TONE_COLOR[tone];
  const { ariaLabel } = mapHeroSummary(waypoints, tone);
  const [legendOpen, setLegendOpen] = useState(false);
  const legendEntry = glossaryEntry(ROUTE_TOPIC);

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-hero bg-surface shadow-hero">
        <svg viewBox="0 0 330 238" role="img" aria-label={ariaLabel} className="block h-auto w-full">
          <g aria-hidden="true" fill="none" stroke="var(--hairline)" strokeWidth="1">
            {CONTOURS.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>

          <CompassMark
            pillars={pillars}
            size={26}
            className="text-ink-soft"
            x={14}
            y={12}
          />

          {/* The dashed route, start to end. */}
          <path
            d={ROUTE_D}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.4"
            strokeDasharray="7 6"
            strokeLinecap="round"
            aria-hidden="true"
          />
          {/* The highlight segment: today's overall lean, in color. */}
          <path
            d={HIGHLIGHT_D}
            fill="none"
            stroke={toneColor}
            strokeWidth="3.4"
            strokeLinecap="round"
            aria-hidden="true"
          />
          {tone === "favoured" && (
            <text x="112" y="122" fontSize="7" fontWeight={700} fill={toneColor} aria-hidden="true">
              CLEAR
            </text>
          )}

          {waypoints.map((waypoint, index) => {
            const slot = WAYPOINT_SLOTS[index];
            if (!slot) {
              return null;
            }
            const branch = describeBranch(waypoint.transitBranch);
            const hue = `var(--element-${branch.element})`;
            return (
              <g key={index}>
                <g style={{ color: hue }} aria-hidden="true">
                  <AnimalGlyphMark
                    animal={branch.gloss}
                    transform={`translate(${slot.x - 10}, ${slot.y - 38}) scale(0.85)`}
                  />
                </g>
                {waypoint.crossing ? (
                  <CrossingMark x={slot.x} y={slot.y} color={hue} />
                ) : (
                  <circle cx={slot.x} cy={slot.y} r="4.6" fill={hue} aria-hidden="true" />
                )}
              </g>
            );
          })}

          {/* YOU ARE HERE: today's own animal, over the start of the route. */}
          <g style={{ color: "var(--ink)" }} aria-hidden="true">
            <AnimalGlyphMark
              animal={dayBranchGloss}
              transform={`translate(${START.x - 10}, ${START.y - 42}) scale(0.85)`}
            />
          </g>
          <circle cx={START.x} cy={START.y} r="4" fill="var(--ink)" aria-hidden="true" />
          <text x={START.x + 8} y={START.y - 6} fontSize="7" fill="var(--ink-soft)" aria-hidden="true">
            MORNING
          </text>
          <rect
            x={START.x}
            y={START.y + 4}
            width="84"
            height="16"
            rx="8"
            fill="var(--anchor)"
            aria-hidden="true"
          />
          <text
            x={START.x + 42}
            y={START.y + 15}
            textAnchor="middle"
            fontSize="7"
            fontWeight={700}
            fill="var(--paper)"
            aria-hidden="true"
          >
            YOU ARE HERE
          </text>

          {/* EVENING: the fixed bookend arrow at the route's end. */}
          <path d={`M${END.x} ${END.y} L${END.x} ${END.y - 18}`} stroke="var(--ink)" strokeWidth="1.8" aria-hidden="true" />
          <path
            d={`M${END.x} ${END.y - 18} L${END.x + 15} ${END.y - 13.5} L${END.x} ${END.y - 9} Z`}
            fill={toneColor}
            aria-hidden="true"
          />
          <text
            x={END.x + 14}
            y={END.y + 14}
            textAnchor="end"
            fontSize="7"
            fill="var(--ink-soft)"
            aria-hidden="true"
          >
            EVENING
          </text>
        </svg>
      </div>
      {legendEntry && (
        <>
          <button
            type="button"
            data-route-legend
            onClick={() => setLegendOpen(true)}
            className="tap-target mx-auto block px-3 py-2 text-[12px] text-ink-soft hover:text-ink active:text-ink"
          >
            What the marks mean &rsaquo;
          </button>
          {legendOpen && <GlossarySheet entry={legendEntry} onClose={() => setLegendOpen(false)} />}
        </>
      )}
    </div>
  );
}
