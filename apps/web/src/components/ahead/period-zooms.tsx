/**
 * Reshape trial: Ahead's month, year and decade views (R5, R9). Each reads one
 * period plainly, then lets the reader move through its neighbours: months
 * within a year, years within a ten-year stretch, and a look at the next one.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  MONTH_NAMES,
  bestAndBumpiest,
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
import { DayList, NextPreview, PeriodList } from "./ahead-lists";

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
  today: string;
  pick: MonthPick;
  onPick: (pick: MonthPick) => void;
}

export function MonthZoom({ profile, today, pick, onPick }: MonthProps) {
  const period = useMemo(() => monthView(profile, pick.year, pick.month), [profile, pick]);
  const days = useMemo(() => bestAndBumpiest(profile, today, pick.year, pick.month), [profile, today, pick]);
  const next: MonthPick = pick.month === 12 ? { year: pick.year + 1, month: 1 } : { year: pick.year, month: pick.month + 1 };
  const nextPeriod = useMemo(() => monthView(profile, next.year, next.month), [profile, next.year, next.month]);
  const monthsRef = useSelectedInView(`${pick.year}-${pick.month}`);

  return (
    <>
      <ul ref={monthsRef} className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label={`Months of ${pick.year}`}>
        {MONTH_NAMES.map((name, index) => {
          const selected = index + 1 === pick.month;
          return (
            <li key={name} className="flex-none">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onPick({ year: pick.year, month: index + 1 })}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${selected ? "bg-anchor text-paper" : "bg-surface text-ink"}`}
              >
                {name.slice(0, 3)}
              </button>
            </li>
          );
        })}
      </ul>
      <PlainLeadBlock kicker={period.label} lead={period.reading.lead} actionLabel="One thing this month" />
      <PlainCardList cards={period.reading.cards} />
      <DayList label="Best days" days={days.best} />
      <DayList label="Bumpiest days" days={days.bumpiest} />
      <NextPreview
        label="Next month"
        title={`${MONTH_NAMES[next.month - 1]} ${next.year}`}
        headline={nextPeriod.reading.lead.headline}
        onOpen={() => onPick(next)}
      />
    </>
  );
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
  const nextPeriod = useMemo(() => yearView(profile, year + 1), [profile, year]);

  return (
    <>
      <PlainLeadBlock kicker={period.label} lead={period.reading.lead} actionLabel="One thing this year" />
      <PlainCardList cards={period.reading.cards} />
      <PeriodList
        label="Month by month"
        periods={months}
        currentKey={currentMonth.year === year ? currentMonth.month : undefined}
        onSelect={(month) => onOpenMonth({ year, month })}
      />
      <NextPreview label="Next year" title={`${year + 1}`} headline={nextPeriod.reading.lead.headline} onOpen={() => onPickYear(year + 1)} />
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
