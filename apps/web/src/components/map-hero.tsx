/**
 * The Today hero, rebuilt as a map (DESIGN.md §Surfaces "Map hero"): a fixed
 * decorative contour background, the compass/orbit mark top-left, and a
 * dashed route from "MORNING" to an "EVENING" arrow. Per-day data drives
 * only what DESIGN.md calls out: the waypoints, whether each gets a crossing
 * mark, the route's highlight color/label (dayTone), and the animal glyphs
 * (today's own, and each waypoint's).
 *
 * Waypoints are placed by how long they hold, so a mark's position is never
 * a time it doesn't have:
 * - Day-long relation marks (today's sign meeting one in the chart, in force
 *   midnight to midnight) sit in an "ALL DAY" row above the route, next to
 *   the compass — off the timeline, because they never come and go in it.
 * - Timed marks (the day's rough hour and easy hour, each a two-hour block)
 *   sit ON the route at their clock position, measured off the rendered
 *   path the same way the live marker is, and carry their window as a label.
 *
 * The route geometry is a reasonable-effort port of the reference mockup
 * (docs/design-system/src/cards/trail.mjs) rather than a pixel-identical
 * copy.
 *
 * The crossing count and aria-label are derived by presentation's
 * `mapHeroSummary` (Phase 5) so this component only renders it.
 *
 * The "what the marks mean" link below it mirrors ElevationProfile's own
 * legend button — same pattern, its own ROUTE_TOPIC glossary entry.
 *
 * The "YOU ARE HERE" marker (dot + pill) is a live position along the
 * dashed route, driven by `progress` (0 = MORNING, 1 = EVENING; null when
 * viewing a day other than today, where it just sits at the route's start).
 * It's measured off the actual rendered path via getPointAtLength rather
 * than re-deriving the bezier math, so it can never drift from what's
 * drawn. Today's own animal glyph and the MORNING/EVENING labels stay put
 * at the trailhead/summit — only the dot + pill travel.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { Pillar } from "@daymaster/bazi-engine";
import { ROUTE_TOPIC, glossaryEntry, interactionWord } from "@daymaster/content";
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

const VIEWBOX_WIDTH = 330;
const PILL_WIDTH = 84;
const PILL_MARGIN = 6;

const START = { x: 20, y: 204 };
const END = { x: 292, y: 46 };

/** The ALL DAY row: right of the compass mark, one line per day-long waypoint. */
const ALL_DAY_ROW = { x: 62, firstY: 26, rowGap: 20 };

/** The live pill moves above its dot when the dot sits this close to a timed mark's stack. */
const PILL_AVOID_RADIUS = 34;

interface Point {
  x: number;
  y: number;
}

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
  /** 0 (MORNING) to 1 (EVENING) position for the live marker; null parks it
   * at the route's start, for days other than today. */
  progress: number | null;
}

/** A waypoint's mark: crossing (circle + X) or plain node, in its branch's hue. */
function WaypointMark({ x, y, color, crossing }: { x: number; y: number; color: string; crossing: boolean }) {
  if (!crossing) {
    return <circle cx={x} cy={y} r="4.6" fill={color} aria-hidden="true" />;
  }
  return <CrossingMark x={x} y={y} color={color} />;
}

/** Small-caps map annotation with a surface halo so contour lines never cut the letters. */
function MapLabel({ x, y, anchor = "start", color = "var(--ink-soft)", children }: {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="7"
      fontWeight={700}
      fill={color}
      stroke="var(--surface)"
      strokeWidth="3"
      strokeLinejoin="round"
      style={{ paintOrder: "stroke" }}
      aria-hidden="true"
    >
      {children}
    </text>
  );
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

function pointAlong(path: SVGPathElement, progress: number): Point {
  const point = path.getPointAtLength(path.getTotalLength() * progress);
  return { x: point.x, y: point.y };
}

export function MapHero({ pillars, dayBranchGloss, tone, waypoints, progress }: Props) {
  const toneColor = TONE_COLOR[tone];
  const { ariaLabel } = mapHeroSummary(waypoints, tone);
  const [legendOpen, setLegendOpen] = useState(false);
  const legendEntry = glossaryEntry(ROUTE_TOPIC);

  const routePathRef = useRef<SVGPathElement>(null);
  const [marker, setMarker] = useState<Point>(START);

  useEffect(() => {
    const path = routePathRef.current;
    if (progress === null || !path) {
      setMarker(START);
      return;
    }
    setMarker(pointAlong(path, progress));
  }, [progress]);

  const dayLong = waypoints.filter((waypoint) => waypoint.timing.kind === "all-day");
  const timed = waypoints.filter((waypoint) => waypoint.timing.kind === "hours");
  const timedProgress = timed.map((waypoint) => (waypoint.timing.kind === "hours" ? waypoint.timing.progress : 0));
  const timedKey = timedProgress.join(",");
  const [timedPoints, setTimedPoints] = useState<Point[]>([]);

  useEffect(() => {
    const path = routePathRef.current;
    if (!path) {
      return;
    }
    setTimedPoints(timedKey === "" ? [] : timedKey.split(",").map((value) => pointAlong(path, Number(value))));
  }, [timedKey]);

  /** Early in the day the live dot sits almost on top of the fixed MORNING
   * tick — the pill already says "you are here" right there, so the static
   * label just steps aside rather than fighting the dot for the same spot. */
  const markerNearStart = progress !== null && Math.hypot(marker.x - START.x, marker.y - START.y) < 40;
  const markerNearEnd = progress !== null && Math.hypot(marker.x - END.x, marker.y - END.y) < 40;
  const markerNearTimed = timedPoints.some(
    (point) => Math.hypot(marker.x - point.x, marker.y - point.y) < PILL_AVOID_RADIUS
  );
  const pillY = markerNearTimed ? marker.y - 24 : marker.y + 4;

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

          {/* The dashed route, start to end. Also the measuring line the
              live marker below is positioned along. */}
          <path
            ref={routePathRef}
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

          {/* ALL DAY: day-long relation marks, off the route, numbered to
              match the waypoint that tells their story below. */}
          {dayLong.map((waypoint, index) => {
            const y = ALL_DAY_ROW.firstY + index * ALL_DAY_ROW.rowGap;
            const branch = describeBranch(waypoint.transitBranch);
            const hue = `var(--element-${branch.element})`;
            const number = waypoint.waypointNumber === undefined ? "" : `${String(waypoint.waypointNumber).padStart(2, "0")} · `;
            return (
              <g key={`all-day-${index}`} data-waypoint="all-day">
                <WaypointMark x={ALL_DAY_ROW.x} y={y} color={hue} crossing={waypoint.crossing} />
                <g style={{ color: hue }} aria-hidden="true">
                  <AnimalGlyphMark
                    animal={branch.gloss}
                    transform={`translate(${ALL_DAY_ROW.x + 14}, ${y - 10}) scale(0.85)`}
                  />
                </g>
                <MapLabel x={ALL_DAY_ROW.x + 40} y={y + 2.5}>
                  {`${number}${interactionWord(waypoint.interaction).toUpperCase()} · ALL DAY`}
                </MapLabel>
              </g>
            );
          })}

          {/* Timed marks: the rough hour and easy hour, at their clock
              position on the route, once the path has been measured. The
              animal and label hang directly below the mark as one centred
              stack — the route always climbs away to the upper right and
              CLEAR/the evening flag live above it, so straight down is the
              one direction that stays clear. */}
          {timed.map((waypoint, index) => {
            const point = timedPoints[index];
            if (!point || waypoint.timing.kind !== "hours") {
              return null;
            }
            const branch = describeBranch(waypoint.transitBranch);
            const hue = `var(--element-${branch.element})`;
            return (
              <g key={`timed-${index}`} data-waypoint="hours">
                <WaypointMark x={point.x} y={point.y} color={hue} crossing={waypoint.crossing} />
                <g style={{ color: hue }} aria-hidden="true">
                  <AnimalGlyphMark
                    animal={branch.gloss}
                    transform={`translate(${point.x - 8.5}, ${point.y + 12}) scale(0.7)`}
                  />
                </g>
                <MapLabel x={point.x} y={point.y + 38} anchor="middle" color="var(--ink)">
                  {`${waypoint.crossing ? "ROUGH" : "EASY"} · ${waypoint.timing.label.toUpperCase()}`}
                </MapLabel>
              </g>
            );
          })}

          {/* MORNING: the fixed bookend tick at the route's start, with
              today's own animal above it — flavor for the trailhead, not
              tied to the live marker below. Text gets an ink-colored halo
              (paint-order stroke) so the contour lines underneath never cut
              through the letters. */}
          <g style={{ color: "var(--ink)" }} aria-hidden="true">
            <AnimalGlyphMark
              animal={dayBranchGloss}
              transform={`translate(${START.x - 10}, ${START.y - 42}) scale(0.85)`}
            />
          </g>
          {!markerNearStart && (
            <>
              <circle cx={START.x} cy={START.y} r="3" fill="var(--ink-soft)" aria-hidden="true" />
              <text
                x={START.x + 8}
                y={START.y - 6}
                fontSize="7"
                fill="var(--ink-soft)"
                stroke="var(--surface)"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ paintOrder: "stroke" }}
                aria-hidden="true"
              >
                MORNING
              </text>
            </>
          )}

          {/* EVENING: the fixed bookend arrow at the route's end. Same
              step-aside as MORNING once the live dot reaches it. */}
          <path d={`M${END.x} ${END.y} L${END.x} ${END.y - 18}`} stroke="var(--ink)" strokeWidth="1.8" aria-hidden="true" />
          <path
            d={`M${END.x} ${END.y - 18} L${END.x + 15} ${END.y - 13.5} L${END.x} ${END.y - 9} Z`}
            fill={toneColor}
            aria-hidden="true"
          />
          {!markerNearEnd && (
            <text
              x={END.x + 14}
              y={END.y + 14}
              textAnchor="end"
              fontSize="7"
              fill="var(--ink-soft)"
              stroke="var(--surface)"
              strokeWidth="3"
              strokeLinejoin="round"
              style={{ paintOrder: "stroke" }}
              aria-hidden="true"
            >
              EVENING
            </text>
          )}

          {/* YOU ARE HERE: the live position along the route (or the start,
              on days other than today). */}
          <circle cx={marker.x} cy={marker.y} r="4" fill="var(--ink)" aria-hidden="true" />
          {/* The pill stays left-anchored to the dot, same as the original
              start-only layout, but never runs past the card's right edge
              once the marker can sit anywhere along the route — and lifts
              above the dot while the dot is passing a timed mark, so it never
              covers that mark's animal and label. */}
          <rect
            x={Math.min(marker.x, VIEWBOX_WIDTH - PILL_WIDTH - PILL_MARGIN)}
            y={pillY}
            width={PILL_WIDTH}
            height="16"
            rx="8"
            fill="var(--anchor)"
            aria-hidden="true"
          />
          <text
            x={Math.min(marker.x, VIEWBOX_WIDTH - PILL_WIDTH - PILL_MARGIN) + PILL_WIDTH / 2}
            y={pillY + 11}
            textAnchor="middle"
            fontSize="7"
            fontWeight={700}
            fill="var(--paper)"
            aria-hidden="true"
          >
            YOU ARE HERE
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
