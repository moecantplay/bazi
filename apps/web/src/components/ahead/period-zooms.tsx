/**
 * Ahead's seasons (M24-07): month, year and decade. Each reads one period
 * plainly, then lets the reader move through its neighbours: months within a
 * year, years within a ten-year stretch, and a look at the next one. Only
 * periods the engine can read are offered (its tables run 1900–2100).
 */

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  MONTH_NAMES,
  decadeAges,
  decadeView,
  monthView,
  monthsOfYear,
  yearView,
  yearsOfDecade,
  type StoredProfile
} from "@daymaster/presentation";
import type { LuckPillar } from "@daymaster/bazi-engine";
import { PlainCardList, PlainLeadBlock } from "@/components/plain/plain-reading";
import { NextPreview, PeriodList } from "./ahead-lists";

/** Keeps the selected chip of a horizontal picker in view when the selection changes. */
function useSelectedInView(selectedKey: string | number) {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    listRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [selectedKey]);
  return listRef;
}

export interface MonthPick {
  year: number;
  month: number;
}

interface MonthProps {
  profile: StoredProfile;
  pick: MonthPick;
  onPick: (pick: MonthPick) => void;
}

export function MonthZoom({ profile, pick, onPick }: MonthProps) {
  const period = useMemo(() => monthView(profile, pick.year, pick.month), [profile, pick]);
  const months = useMemo(() => monthsOfYear(profile, pick.year), [profile, pick.year]);
  const next: MonthPick = pick.month === 12 ? { year: pick.year + 1, month: 1 } : { year: pick.year, month: pick.month + 1 };
  const nextPeriod = useMemo(
    () => (next.year <= 2100 ? monthView(profile, next.year, next.month) : null),
    [profile, next.year, next.month]
  );
  const monthsRef = useSelectedInView(`${pick.year}-${pick.month}`);

  return (
    <>
      <ul ref={monthsRef} className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label={`Months of ${pick.year}`}>
        {months.map((month) => {
          const selected = month.key === pick.month;
          return (
            <li key={month.key} className="flex-none">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPick({ year: pick.year, month: month.key })}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${selected ? "bg-anchor text-paper" : "bg-surface text-ink"}`}
              >
                {month.short}
              </button>
            </li>
          );
        })}
      </ul>
      {period && (
        <>
          <PlainLeadBlock kicker={period.label} lead={period.reading.lead} actionLabel="One thing this month" />
          <PlainCardList cards={period.reading.cards} />
        </>
      )}
      {nextPeriod && (
        <NextPreview
          label="Next month"
          title={`${MONTH_NAMES[next.month - 1]} ${next.year}`}
          headline={nextPeriod.reading.lead.headline}
          onOpen={() => onPick(next)}
        />
      )}
    </>
  );
}

/** Years a reader can pick: their lifetime (birth year to 90 years on), inside the engine's 1900–2100 range. */
function lifetimeYears(profile: StoredProfile): number[] {
  const born = Number(profile.birth.date.slice(0, 4));
  const first = Math.max(1900, born);
  const last = Math.min(2100, born + 90);
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

interface YearProps {
  profile: StoredProfile;
  year: number;
  currentMonth: MonthPick;
  onPickYear: (year: number) => void;
  onOpenMonth: (pick: MonthPick) => void;
}

export function YearZoom({ profile, year, currentMonth, onPickYear, onOpenMonth }: YearProps) {
  const period = useMemo(() => yearView(profile, year), [profile, year]);
  const months = useMemo(() => monthsOfYear(profile, year), [profile, year]);
  const nextPeriod = useMemo(() => (year < 2100 ? yearView(profile, year + 1) : null), [profile, year]);
  const years = useMemo(() => lifetimeYears(profile), [profile]);
  const yearsRef = useSelectedInView(year);

  return (
    <>
      <ul ref={yearsRef} className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label="Pick a year">
        {years.map((candidate) => {
          const selected = candidate === year;
          return (
            <li key={candidate} className="flex-none">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPickYear(candidate)}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${selected ? "bg-anchor text-paper" : "bg-surface text-ink"}`}
              >
                {candidate === currentMonth.year ? `${candidate} · now` : candidate}
              </button>
            </li>
          );
        })}
      </ul>
      <PlainLeadBlock kicker={period.label} lead={period.reading.lead} actionLabel="One thing this year" />
      <PlainCardList cards={period.reading.cards} />
      <PeriodList
        label="Month by month"
        periods={months}
        currentKey={currentMonth.year === year ? currentMonth.month : undefined}
        onSelect={(month) => onOpenMonth({ year, month })}
      />
      {nextPeriod && (
        <NextPreview label="Next year" title={`${year + 1}`} headline={nextPeriod.reading.lead.headline} onOpen={() => onPickYear(year + 1)} />
      )}
    </>
  );
}

interface DecadeProps {
  profile: StoredProfile;
  decades: LuckPillar[];
  index: number;
  currentIndex: number | null;
  thisYear: number;
  onPickDecade: (index: number) => void;
  onOpenYear: (year: number) => void;
}

export function DecadeZoom({ profile, decades, index, currentIndex, thisYear, onPickDecade, onOpenYear }: DecadeProps) {
  const luck = decades[index]!;
  const period = useMemo(() => decadeView(profile, luck), [profile, luck]);
  const years = useMemo(() => yearsOfDecade(profile, luck), [profile, luck]);
  const nextLuck = decades[index + 1];
  const nextPeriod = useMemo(() => (nextLuck ? decadeView(profile, nextLuck) : null), [profile, nextLuck]);
  const decadesRef = useSelectedInView(index);

  return (
    <>
      <ul ref={decadesRef} className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label="Your ten-year stretches">
        {decades.map((decade, position) => {
          const selected = position === index;
          return (
            <li key={decade.startYear} className="flex-none">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPickDecade(position)}
                className={`flex flex-col items-center rounded-tile px-3.5 py-2 ${selected ? "bg-anchor text-paper" : "bg-surface text-ink"}`}
              >
                <span className="caption !text-current opacity-80">{position === currentIndex ? "Now" : "Ages"}</span>
                <span className="font-display text-[16px]">{decadeAges(decade)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <PlainLeadBlock kicker={period.label} lead={period.reading.lead} actionLabel="One thing this decade" />
      <PlainCardList cards={period.reading.cards} />
      <PeriodList
        label="Year by year"
        periods={years}
        currentKey={index === currentIndex ? thisYear : undefined}
        onSelect={onOpenYear}
      />
      {nextLuck && nextPeriod && (
        <NextPreview
          label="Your next ten-year stretch"
          title={`Begins ${nextLuck.startYear}, at ${nextLuck.startAge}`}
          headline={nextPeriod.reading.lead.headline}
          onOpen={() => onPickDecade(index + 1)}
        />
      )}
      <Link href="/cycles/" className="tap-target self-start text-[13px] text-ink-soft hover:text-ink">
        Your decades, the old way &rarr;
      </Link>
    </>
  );
}
