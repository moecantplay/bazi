/**
 * Explorer's signature object (DESIGN.md v5 §Explorer): date, headline and
 * the day's route on one terrain. The walked stretch is solid up to NOW;
 * only the two timed marks ride the route, labelled up and to the left,
 * where the climbing line never is.
 */

"use client";

import { describeBranch, mapHeroSummary, type RouteWaypoint } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import { Headline, dayMeta } from "@/components/today/headline";
import { TodayDateNav } from "@/components/today/today-date-nav";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { CONTOURS, ROUTE_END, ROUTE_HEIGHT, ROUTE_WIDTH, routePath, routeX, routeY, spreadMarks } from "./route-geometry";

interface Props {
  screen: TodayScreen;
}

type TimedWaypoint = RouteWaypoint & { timing: Extract<RouteWaypoint["timing"], { kind: "hours" }> };

function isTimed(waypoint: RouteWaypoint): waypoint is TimedWaypoint {
  return waypoint.timing.kind === "hours";
}

/** Space Mono at 9.5px with the label letter-spacing: about 7px a character. */
const LABEL_CHAR_WIDTH = 7.1;

/**
 * Up and to the left of the mark, where the climbing route never is; a label
 * that would run off the left edge goes down and to the right instead, the
 * other side the route never occupies.
 */
function labelPlacement(x: number, y: number, text: string): { x: number; y: number; anchor: "start" | "end" } {
  if (x - 24 - text.length * LABEL_CHAR_WIDTH >= 4) {
    return { x: x - 24, y: y - 12, anchor: "end" };
  }
  return { x: x + 24, y: y + 26, anchor: "start" };
}

/** Whether a clock hour falls inside a two-hour block (blocks may wrap past midnight). */
function inBlock(hour: number, start: number, end: number): boolean {
  return end > start ? hour >= start && hour < end : hour >= start || hour < end;
}

function clockLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

export function RouteHero({ screen }: Props) {
  const { model, progress, now } = screen;
  const { ariaLabel } = mapHeroSummary(model.waypoints, model.tone);
  const timed = model.waypoints.filter(isTimed);
  const markXs = spreadMarks(timed.map((waypoint) => routeX(waypoint.timing.progress)));
  const nowX = progress === null ? null : routeX(progress);
  const hour = now ? now.getHours() + now.getMinutes() / 60 : null;
  /** The timed mark you are inside right now: NOW takes its ring and the mark's own disc steps aside. */
  const current = hour === null ? undefined : timed.find((waypoint) => inBlock(hour, waypoint.timing.startHour, waypoint.timing.endHour));

  return (
    <div className="route-hero arrive-fade">
      <svg className="route-hero-topo" viewBox="0 0 390 518" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {CONTOURS.map((contour, index) => (
          <path key={index} d={contour.d} fill="none" stroke="var(--hairline)" strokeOpacity={0.55} strokeWidth={contour.heavy ? 1.6 : 1} />
        ))}
      </svg>
      <div className="arrive-rise relative flex items-center justify-between pl-2 pr-5 pt-4">
        <TodayDateNav screen={screen} />
        <span className="caption truncate pl-2">{dayMeta(model.stem.gloss, model.branch.gloss)}</span>
      </div>
      <Headline runs={model.headline} className="arrive-rise relative px-5 pt-3 text-[38px]" />
      <svg className="route-hero-route" viewBox={`0 0 ${ROUTE_WIDTH} ${ROUTE_HEIGHT}`} role="img" aria-label={ariaLabel}>
        <defs>
          <mask id="route-reveal">
            <path className="arrive-draw" d={routePath()} fill="none" stroke="#fff" strokeWidth={10} pathLength={1} strokeDasharray={1} />
          </mask>
        </defs>
        <g mask="url(#route-reveal)">
          <path d={routePath()} fill="none" stroke="var(--ink)" strokeWidth={2.2} strokeDasharray="6 6" />
          {nowX !== null && nowX > 24 && (
            <path d={routePath(24, nowX)} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
          )}
        </g>
        <text className="svg-label" x={20} y={236} fontSize={9} fill="var(--ink-soft)">
          MORNING
        </text>
        <path
          className="arrive-pop"
          d={`M${ROUTE_END.x} ${ROUTE_END.y}V${ROUTE_END.y - 30}l16 7-16 7`}
          fill="var(--ink)"
          stroke="var(--ink)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <text className="svg-label" x={356} y={ROUTE_END.y - 22} fontSize={9} fill="var(--ink-soft)" textAnchor="end">
          EVENING
        </text>
        {timed.map((waypoint, index) => {
          const x = markXs[index] ?? routeX(waypoint.timing.progress);
          const y = routeY(x);
          const rough = waypoint.crossing;
          const animal = describeBranch(waypoint.transitBranch).gloss;
          const label = `${rough ? "ROUGH" : "EASY"} · ${waypoint.timing.label.toUpperCase()}`;
          const placed = labelPlacement(x, y, label);
          return (
            <g key={index} data-waypoint="hours" className="arrive-pop" style={{ ["--d" as string]: 6 + index }}>
              {waypoint !== current && (
                <g>
                  <circle
                    cx={x}
                    cy={y}
                    r={17}
                    fill={rough ? "var(--signal-amber-fill)" : "var(--element-wood-fill)"}
                    stroke={rough ? "var(--signal-amber)" : "var(--element-wood)"}
                    strokeWidth={2}
                  />
                  <g style={{ color: "var(--ink)" }}>
                    <AnimalGlyphMark animal={animal} transform={`translate(${x - 9.5} ${y - 9.5}) scale(${19 / 24})`} renderSize={19} />
                  </g>
                  {rough && (
                    <path d={`M${x + 9} ${y - 21}l8 8m0-8l-8 8`} stroke="var(--signal-amber)" strokeWidth={2.4} strokeLinecap="round" />
                  )}
                </g>
              )}
              <text className="svg-label" x={placed.x} y={placed.y} fontSize={9.5} fill="var(--ink)" textAnchor={placed.anchor}>
                {label}
              </text>
            </g>
          );
        })}
        {nowX !== null && (
          <g className="arrive-pop" style={{ ["--d" as string]: 5 }}>
            <circle
              cx={nowX}
              cy={routeY(nowX)}
              r={21}
              fill="var(--anchor)"
              stroke={current ? (current.crossing ? "var(--signal-amber)" : "var(--element-wood)") : "none"}
              strokeWidth={4}
            />
            <g style={{ color: "var(--paper)" }}>
              <AnimalGlyphMark
                animal={model.branch.gloss}
                transform={`translate(${nowX - 12} ${routeY(nowX) - 12})`}
                renderSize={24}
              />
            </g>
            <rect x={nowX - 44} y={routeY(nowX) + 28} width={88} height={20} rx={10} fill="var(--anchor)" />
            <text className="svg-label" x={nowX} y={routeY(nowX) + 41.5} fontSize={8.5} fill="var(--paper)" textAnchor="middle">
              {`NOW ${now ? clockLabel(now).toUpperCase() : ""}`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
