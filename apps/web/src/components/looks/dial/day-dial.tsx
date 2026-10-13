/**
 * Instrument's signature object (DESIGN.md v5 §Instrument): the day's easy
 * and rough hours as arcs on a 24-hour ring, the reader's best hour as a thin
 * arc just outside it (M24-13), the twelve two-hour animals on the rim (up to
 * four lit: rough, easy, your best hour and the hour you are in), and a hand
 * in the anchor pair pointing at now. On any other day there is no hand.
 */

"use client";

import { describeBranch, mapHeroSummary, type RouteWaypoint } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import type { TodayScreen } from "@/components/today/use-today-screen";
import type { Element } from "@daymaster/bazi-engine";
import { BestHourStar, elementFill, elementHue } from "../best-hour-star";
import { DIAL_CENTRE as C, HOUR_ANIMALS, RIM_RADIUS, TRACK_RADIUS, angleOf, arcPath, blockOfHour, polar } from "./dial-geometry";

interface Props {
  screen: TodayScreen;
}

type Timed = RouteWaypoint & { timing: Extract<RouteWaypoint["timing"], { kind: "hours" }> };

const CARDINALS: [number, string][] = [
  [12, "NOON"],
  [18, "6 PM"],
  [0, "MIDNIGHT"],
  [6, "6 AM"]
];

interface Lit {
  fill: string;
  ring: string;
  /** The reader's best hour: its element's star, and an outer ring when it shares the easy hour's halo. */
  bestHour?: { element: Element; sharesHalo: boolean };
}

/** Radius of the best-hour arc, between the track (118 ± 8) and the rim animals (154 − 15). */
const BEST_HOUR_RADIUS = 133;

function clockLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date).toUpperCase();
}

/** The weekday of another day, in place of a sign name (M20-24). */
function weekdayLabel(dateISO: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", timeZone: "UTC" }).format(new Date(`${dateISO}T00:00:00Z`)).toUpperCase();
}

export function DayDial({ screen }: Props) {
  const { model, now } = screen;
  const { bestHour } = model;
  const timed = model.waypoints.filter((waypoint): waypoint is Timed => waypoint.timing.kind === "hours");
  const hour = now ? now.getHours() + now.getMinutes() / 60 : null;

  const lit = new Map<string, Lit>();
  for (const waypoint of timed) {
    lit.set(describeBranch(waypoint.transitBranch).gloss, waypoint.crossing
      ? { fill: "var(--signal-amber-fill)", ring: "var(--signal-amber)" }
      : { fill: "var(--element-wood-fill)", ring: "var(--element-wood)" });
  }
  if (bestHour) {
    const animal = describeBranch(bestHour.branch).gloss;
    const shared = lit.get(animal);
    lit.set(animal, shared
      ? { ...shared, bestHour: { element: bestHour.element, sharesHalo: true } }
      : { fill: elementFill(bestHour.element), ring: elementHue(bestHour.element), bestHour: { element: bestHour.element, sharesHalo: false } });
  }
  const currentAnimal = hour === null ? null : HOUR_ANIMALS[blockOfHour(hour)];
  if (currentAnimal && !lit.has(currentAnimal)) {
    lit.set(currentAnimal, { fill: "var(--surface)", ring: "var(--ink)" });
  }
  const { ariaLabel } = mapHeroSummary(model.waypoints, model.tone, bestHour);

  return (
    <svg className="day-dial" viewBox="-12 -12 364 364" role="img" aria-label={ariaLabel.replace("Today's route", "Today's hours")}>
      <circle className="arrive-fade" cx={C} cy={C} r={TRACK_RADIUS} fill="none" stroke="var(--hairline)" strokeOpacity={0.5} strokeWidth={16} />
      <path className="arrive-fade" d={arcPath(6, 18, TRACK_RADIUS)} fill="none" stroke="var(--hairline)" strokeWidth={16} />
      {Array.from({ length: 24 }, (_, tick) => {
        const major = tick % 6 === 0;
        const [x1, y1] = polar(tick, 100);
        const [x2, y2] = polar(tick, major ? 90 : 95);
        return (
          <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? "var(--ink)" : "var(--hairline)"} strokeWidth={major ? 2 : 1.4} strokeLinecap="round" />
        );
      })}
      {CARDINALS.map(([at, label]) => {
        const [x, y] = polar(at, 76);
        return (
          <text key={label} className="svg-label" x={x} y={y + 3} fontSize={8.5} fill="var(--ink-soft)" textAnchor="middle">
            {label}
          </text>
        );
      })}
      {timed.map((waypoint, index) => (
        <path
          key={index}
          data-waypoint="hours"
          className="arrive-draw"
          d={arcPath(waypoint.timing.startHour, waypoint.timing.endHour, TRACK_RADIUS)}
          fill="none"
          stroke={waypoint.crossing ? "var(--signal-amber)" : "var(--element-wood)"}
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
        />
      ))}
      {bestHour && (
        <path
          data-waypoint="best-hour"
          className="arrive-draw"
          d={arcPath(bestHour.startHour, bestHour.endHour, BEST_HOUR_RADIUS)}
          fill="none"
          stroke={elementHue(bestHour.element)}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
        />
      )}
      {HOUR_ANIMALS.map((animal, index) => {
        const [x, y] = polar(index * 2, RIM_RADIUS);
        const mark = lit.get(animal);
        const size = mark ? 18 : 16;
        return (
          <g key={animal} className="arrive-pop" style={{ ["--d" as string]: 2 + index * 0.35 }}>
            {mark?.bestHour?.sharesHalo && <circle cx={x} cy={y} r={19} fill="none" stroke={elementHue(mark.bestHour.element)} strokeWidth={2} />}
            {mark && <circle cx={x} cy={y} r={15} fill={mark.fill} stroke={mark.ring} strokeWidth={1.8} />}
            <g style={{ color: "var(--ink)" }} opacity={mark ? 1 : 0.42}>
              <AnimalGlyphMark animal={animal} transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`} renderSize={size} />
            </g>
            {mark?.bestHour && <BestHourStar x={x + 12} y={y - 12} element={mark.bestHour.element} />}
          </g>
        );
      })}
      {hour !== null && (
        <g className="arrive-sweep" style={{ transformOrigin: `${C}px ${C}px` }}>
          <g transform={`rotate(${(angleOf(hour) * 180) / Math.PI} ${C} ${C})`}>
            <line x1={C + 64} y1={C} x2={C + 128} y2={C} stroke="var(--anchor)" strokeWidth={3} strokeLinecap="round" />
            <circle cx={C + TRACK_RADIUS} cy={C} r={9} fill="var(--anchor)" stroke="var(--paper)" strokeWidth={3} />
          </g>
        </g>
      )}
      <circle cx={C} cy={C} r={58} fill="var(--surface)" />
      <g className="arrive-pop" style={{ color: "var(--ink)", ["--d" as string]: 3 }}>
        <AnimalGlyphMark animal={model.branch.gloss} transform={`translate(${C - 25} ${C - 33}) scale(${50 / 24})`} renderSize={50} />
      </g>
      <text className="svg-label" x={C} y={C + 32} fontSize={8.5} fill="var(--ink-soft)" textAnchor="middle">
        {now ? `NOW ${clockLabel(now)}` : weekdayLabel(screen.dateISO)}
      </text>
    </svg>
  );
}

/** The dial's key: the easy and rough hours in words, under the ring, then the reader's best hour. */
export function DialKey({ screen }: Props) {
  const { bestHour } = screen.model;
  const timed = screen.model.waypoints.filter((waypoint): waypoint is Timed => waypoint.timing.kind === "hours");
  return (
    <p className="caption flex flex-wrap gap-x-4 gap-y-1">
      {timed.map((waypoint, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-[7px] w-[18px] rounded-full"
            style={{ background: waypoint.crossing ? "var(--signal-amber)" : "var(--element-wood)" }}
          />
          {`${waypoint.crossing ? "Rough" : "Easy"} ${waypoint.timing.label}`}
        </span>
      ))}
      {bestHour && (
        <span data-best-hour-key className="inline-flex items-center gap-2">
          <span aria-hidden className="h-[7px] w-[18px] rounded-full" style={{ background: elementHue(bestHour.element) }} />
          {bestHour.isEasyHour ? "Easy hour suits you" : `Suits you ${bestHour.label}`}
        </span>
      )}
    </p>
  );
}
