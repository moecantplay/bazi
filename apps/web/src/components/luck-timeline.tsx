/**
 * Cycles' single interactive section: decade → year → month, each level a
 * snap-scroll carousel (ScrollCarousel) whose centered card is always the
 * one being read below it — there is no expand/collapse state left. Decade
 * and month are horizontal strips; year is a vertical rail beside its own
 * reading (2026-08-31 product decision, replacing every level's earlier
 * horizontal `overflow-x-auto` strips, which clipped items at the card edge
 * with no scroll affordance on a real phone).
 *
 * Picking a decade cascades a fresh default year (the real current year if
 * it falls inside that decade, else the decade's own start year); picking a
 * year cascades a fresh default month the same way — matching the old
 * accordion's snap-to-now-when-reachable behavior, just landing on a
 * concrete value instead of `null` (a carousel always has one active card).
 *
 * The real-current decade/year/month gets a small `signal-amber` corner dot.
 * That token means "friction/caution" everywhere else in this app
 * (trail-signs, activity-terrain, map-hero), so here it's kept strictly to a
 * small dot — never a fill or the active-card outline color — and the
 * decade level additionally keeps the literal "Current decade" text label
 * this section has always shown, so the signal never rests on color alone.
 */

"use client";

import { useMemo, useState } from "react";
import type { Element, LuckPillar } from "@daymaster/bazi-engine";
import { LUCK_PILLAR_GLOSS } from "@daymaster/content";
import {
  annualReadingFor,
  chartFor,
  describeBranch,
  describeStem,
  ELEMENT_LABEL,
  ELEMENT_SWATCH_CLASS,
  luckPillarReadingsFor,
  monthlyReadingFor
} from "@daymaster/presentation";
import { AnimalIcon, ElementIcon } from "@/components/glyph-icon";
import { MonthPicker } from "@/components/month-picker";
import { PillarGlyph } from "@/components/pillar-glyph";
import { ReadingLineCards } from "@/components/reading-line-cards";
import { ScrollCarousel } from "@/components/scroll-carousel";
import { YearPicker } from "@/components/year-picker";
import type { StoredProfile } from "@/lib/store-types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const DECADE_ITEM_WIDTH = 150;

function ElementTag({ element }: { element: Element }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2 py-1 text-[11px] text-ink-soft">
      <span className={`h-2.5 w-2.5 rounded-sm ${ELEMENT_SWATCH_CLASS[element]}`} aria-hidden />
      {ELEMENT_LABEL[element]}
    </span>
  );
}

/** A short dashed route segment between two levels — Trail's rail motif,
 * scaled down to a section transition (matches waypoint-rail.tsx's tokens:
 * hairline dash, --rail-width, a bg-surface shadow-node circle). */
function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-start pl-[9px]">
      <span className="border-dashed border-hairline" style={{ borderLeftWidth: "var(--rail-width)", height: "18px" }} aria-hidden />
      <span
        className="-ml-[7px] mb-1 rounded-full border-hairline bg-surface shadow-node"
        style={{ height: "14px", width: "14px", borderWidth: "var(--rail-width)" }}
        aria-hidden
      />
      <h3 className="kicker">{label}</h3>
    </div>
  );
}

function DecadeCard({ luck }: { luck: LuckPillar }) {
  const stem = describeStem(luck.pillar.stem);
  const branch = describeBranch(luck.pillar.branch);
  return (
    <span className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl bg-surface px-3 py-2 text-center shadow-card">
      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">
        ages {luck.startAge}&ndash;{luck.startAge + 9}
      </span>
      <span className="flex items-center gap-1.5 font-display text-[16px] leading-tight text-ink">
        <ElementIcon element={stem.element} polarity={stem.polarity} size={17} />
        <AnimalIcon animal={branch.gloss} element={branch.element} size={17} />
        {luck.startYear}&ndash;{luck.startYear + 9}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">
        {stem.pinyin} &middot; {branch.pinyin}
      </span>
    </span>
  );
}

/** The "this is really now" marker — rendered by ScrollCarousel outside the
 * distance-dimmed wrapper so it never composites below AA on an off-center
 * card (measured 2.99:1 in light theme when it was nested inside the dim). */
function DecadeNowMarker() {
  return (
    <>
      <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-wide text-ink-soft">
        Current decade
      </span>
      <span className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-signal-amber" aria-hidden />
    </>
  );
}

function defaultYearFor(luck: LuckPillar, currentYear: number): number {
  const withinDecade = luck.startYear <= currentYear && currentYear < luck.startYear + 10;
  return withinDecade ? currentYear : luck.startYear;
}

function defaultMonthFor(year: number, currentYear: number, currentMonth: number): number {
  return year === currentYear ? currentMonth : 1;
}

interface Props {
  profile: StoredProfile;
  now?: Date;
}

export function LuckTimeline({ profile, now = new Date() }: Props) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const chart = useMemo(() => chartFor(profile), [profile]);
  const readings = useMemo(() => luckPillarReadingsFor(profile), [profile]);
  const luckPillars = chart.luckPillars;
  const first = luckPillars[0];

  let currentIndex = -1;
  luckPillars.forEach((luck, index) => {
    if (luck.startYear <= currentYear) {
      currentIndex = index;
    }
  });
  const beforeFirst = currentIndex === -1;
  const currentDecade = beforeFirst ? undefined : luckPillars[currentIndex];

  const [decadeIndex, setDecadeIndex] = useState(beforeFirst ? 0 : currentIndex);
  const [year, setYear] = useState(() => defaultYearFor(luckPillars[decadeIndex]!, currentYear));
  const [month, setMonth] = useState(() => defaultMonthFor(year, currentYear, currentMonth));

  function onDecadeChange(index: number) {
    setDecadeIndex(index);
    const luck = luckPillars[index]!;
    const newYear = defaultYearFor(luck, currentYear);
    setYear(newYear);
    setMonth(defaultMonthFor(newYear, currentYear, currentMonth));
  }
  function onYearChange(newYear: number) {
    setYear(newYear);
    setMonth(defaultMonthFor(newYear, currentYear, currentMonth));
  }

  const activeLuck = luckPillars[decadeIndex]!;
  const activeStemElement = describeStem(activeLuck.pillar.stem).element;
  const activeBranchElement = describeBranch(activeLuck.pillar.branch).element;
  const decadeLines = readings[decadeIndex]?.lines ?? [];
  const annual = useMemo(() => annualReadingFor(profile, year), [profile, year]);
  const monthly = useMemo(() => monthlyReadingFor(profile, year, month), [profile, year, month]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-relaxed text-ink-soft">
        Each node is one luck pillar &mdash; {LUCK_PILLAR_GLOSS}. Yours begin {chart.luckStart.years} years,{" "}
        {chart.luckStart.months} months, and {chart.luckStart.days} days after birth, from the classical count
        of days to the nearest seasonal marker. Swipe or tap to move through your decades, then a year and a
        month within one.
      </p>
      {beforeFirst && first && (
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Your first luck pillar begins in {first.startYear}. Until then, the natal chart is the whole picture
          &mdash; here&rsquo;s a preview of what it opens into.
        </p>
      )}

      <div className="h-[100px]" data-luck-decade-picker>
        <ScrollCarousel
          items={luckPillars}
          itemKey={(luck) => luck.startYear}
          axis="x"
          itemSize={DECADE_ITEM_WIDTH}
          activeIndex={decadeIndex}
          onActiveChange={onDecadeChange}
          aria-label="Pick a decade"
          itemProps={(luck) => ({
            "data-luck-decade-card": "",
            "data-luck-current": !beforeFirst && luck.startYear === currentDecade?.startYear ? "" : undefined
          })}
          renderItem={(luck) => <DecadeCard luck={luck} />}
          renderNowMarker={(luck) =>
            !beforeFirst && luck.startYear === currentDecade?.startYear ? <DecadeNowMarker /> : null
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <ElementTag element={activeStemElement} />
        {activeBranchElement !== activeStemElement && <ElementTag element={activeBranchElement} />}
      </div>

      <div data-luck-reading>
        <h3 className="kicker">This decade</h3>
        <ReadingLineCards lines={decadeLines} />
      </div>

      <Connector label="Year" />
      <div className="flex gap-3">
        <YearPicker startYear={activeLuck.startYear} currentYear={currentYear} activeYear={year} onSelect={onYearChange} />
        <div className="min-w-0 flex-1" data-horizon="year">
          <div className="flex items-center justify-between gap-3">
            <h3 className="kicker">{annual.year}</h3>
            <PillarGlyph pillar={annual.pillar} size="sm" />
          </div>
          <ReadingLineCards lines={annual.lines} />
        </div>
      </div>

      <Connector label="Month" />
      <MonthPicker activeMonth={month} currentMonth={year === currentYear ? currentMonth : null} onSelect={setMonth} />
      <div data-horizon="month">
        <div className="flex items-center justify-between gap-3">
          <h3 className="kicker">
            {MONTH_NAMES[monthly.month - 1]} {monthly.year}
          </h3>
          <PillarGlyph pillar={monthly.pillar} size="sm" />
        </div>
        <ReadingLineCards lines={monthly.lines} />
      </div>
    </div>
  );
}
