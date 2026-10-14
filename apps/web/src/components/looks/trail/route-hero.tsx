/**
 * Explorer's signature object (DESIGN.md v5 §Explorer): date, headline and
 * the day's route on one terrain. The walked stretch is solid up to NOW,
 * whose time sits in a fixed pill in the corner opposite MORNING (M24-14);
 * only the timed marks ride the route (the day's rough and easy hours and
 * the reader's best hour, M24-13), labelled up and to the left, where the
 * climbing line never is.
 */

"use client";

import { useId } from "react";
import { describeBranch, mapHeroSummary, type RouteWaypoint } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import { SettingsGear } from "@/components/settings-gear";
import { DayTonePhrase, Headline } from "@/components/today/headline";
import { TodayDateNav } from "@/components/today/today-date-nav";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { BestHourStar, elementHue } from "../best-hour-star";
import { BestHourRouteMark } from "./best-hour-route-mark";
import { CONTOURS, NOW_PILL, ROUTE_END, ROUTE_HEIGHT, ROUTE_WIDTH, inBlock, labelPlacement, routePath, routeX, routeY } from "./route-geometry";

interface Props {
  screen: TodayScreen;
  /** Off in the look previews, which sit inside a button on Settings itself. */
  showSettings?: boolean;
}

type TimedWaypoint = RouteWaypoint & { timing: Extract<RouteWaypoint["timing"], { kind: "hours" }> };

function isTimed(waypoint: RouteWaypoint): waypoint is TimedWaypoint {
  return waypoint.timing.kind === "hours";
}

function clockLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

export function RouteHero({ screen, showSettings = true }: Props) {
  const { model, progress, now } = screen;
  /** Unique per instance: a look preview can put a second route on the page. */
  const maskId = useId();
  const { bestHour } = model;
  const { ariaLabel } = mapHeroSummary(model.waypoints, model.tone, bestHour);
  const timed = model.waypoints.filter(isTimed);
  const nowX = progress === null ? null : routeX(progress);
  const hour = now ? now.getHours() + now.getMinutes() / 60 : null;
  /** The timed mark you are inside right now: NOW takes its ring and the mark's own disc steps aside. */
  const current = hour === null ? undefined : timed.find((waypoint) => inBlock(hour, waypoint.timing.startHour, waypoint.timing.endHour));
  const ownBestHour = bestHour && !bestHour.isEasyHour ? bestHour : null;
  const inBestHour = hour !== null && ownBestHour !== null && inBlock(hour, ownBestHour.startHour, ownBestHour.endHour);
  const nowRing = current ? (current.crossing ? "var(--signal-amber)" : "var(--element-wood)") : inBestHour && ownBestHour ? elementHue(ownBestHour.element) : "none";

  return (
    <div className="route-hero arrive-fade">
      <svg className="route-hero-topo" viewBox="0 0 390 518" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {CONTOURS.map((contour, index) => (
          <path key={index} d={contour.d} fill="none" stroke="var(--hairline)" strokeOpacity={0.55} strokeWidth={contour.heavy ? 1.6 : 1} />
        ))}
      </svg>
      <div className="arrive-rise relative flex items-center justify-between pl-2 pr-5 pt-4">
        <TodayDateNav screen={screen} />
        <div className="flex min-w-0 items-center gap-2">
          <DayTonePhrase tone={model.tone} className="caption truncate pl-2" />
          {showSettings && <SettingsGear className="-mr-3 flex-none" />}
        </div>
      </div>
      <Headline runs={model.headline} className="arrive-rise relative px-5 pt-3 text-[38px]" />
      <svg className="route-hero-route" viewBox={`0 0 ${ROUTE_WIDTH} ${ROUTE_HEIGHT}`} role="img" aria-label={ariaLabel}>
        <defs>
          <mask id={maskId}>
            <path className="arrive-draw" d={routePath()} fill="none" stroke="#fff" strokeWidth={10} pathLength={1} strokeDasharray={1} />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
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
          const x = routeX(waypoint.timing.progress);
          const y = routeY(x);
          const rough = waypoint.crossing;
          const animal = describeBranch(waypoint.transitBranch).gloss;
          const suitsYou = !rough && bestHour?.isEasyHour === true;
          const label = `${rough ? "ROUGH" : suitsYou ? "EASY · SUITS YOU" : "EASY"} · ${waypoint.timing.label.toUpperCase()}`;
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
                  {suitsYou && bestHour && <BestHourStar x={x + 13} y={y - 15} element={bestHour.element} />}
                </g>
              )}
              <text className="svg-label" x={placed.x} y={placed.y} fontSize={9.5} fill="var(--ink)" textAnchor={placed.anchor}>
                {label}
              </text>
            </g>
          );
        })}
        {ownBestHour && <BestHourRouteMark mark={ownBestHour} hidden={inBestHour} />}
        {nowX !== null && (
          <g className="arrive-pop" style={{ ["--d" as string]: 5 }}>
            <circle
              cx={nowX}
              cy={routeY(nowX)}
              r={21}
              fill="var(--anchor)"
              stroke={nowRing}
              strokeWidth={4}
            />
            <g style={{ color: "var(--paper)" }}>
              <AnimalGlyphMark
                animal={model.branch.gloss}
                transform={`translate(${nowX - 12} ${routeY(nowX) - 12})`}
                renderSize={24}
              />
            </g>
          </g>
        )}
        {nowX !== null && (
          <g data-now-pill className="arrive-pop" style={{ ["--d" as string]: 5 }}>
            <rect x={NOW_PILL.x} y={NOW_PILL.y} width={NOW_PILL.width} height={NOW_PILL.height} rx={NOW_PILL.height / 2} fill="var(--anchor)" />
            <text
              className="svg-label"
              x={NOW_PILL.x + NOW_PILL.width / 2}
              y={NOW_PILL.y + 13.5}
              fontSize={8.5}
              fill="var(--paper)"
              textAnchor="middle"
            >
              {`NOW ${now ? clockLabel(now).toUpperCase() : ""}`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
