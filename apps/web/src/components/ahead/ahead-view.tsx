/**
 * Reshape trial: Ahead — what's coming, at four zooms shown one at a time
 * (R5), each with room to move through it (R9): ten days and the standout
 * days of the month; any month with its best and bumpiest days; a year month
 * by month; a ten-year stretch year by year.
 */

"use client";

import { useMemo, useState } from "react";
import { decadesOf, type StoredProfile } from "@daymaster/presentation";
import { SegmentedControl } from "@/components/segmented-control";
import { useTodayLabel } from "@/lib/use-today-label";
import { DecadeZoom, MonthZoom, YearZoom, type MonthPick } from "./period-zooms";
import { TenDays } from "./ten-days";

type Zoom = "days" | "month" | "year" | "decade";

const ZOOMS: { value: Zoom; label: string }[] = [
  { value: "days", label: "10 days" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "decade", label: "Decade" }
];

interface Props {
  profile: StoredProfile;
}

export function AheadView({ profile }: Props) {
  const today = useTodayLabel();
  const thisYear = Number(today.slice(0, 4));
  const thisMonth: MonthPick = { year: thisYear, month: Number(today.slice(5, 7)) };
  const { decades, currentIndex } = useMemo(() => decadesOf(profile, thisYear), [profile, thisYear]);

  const [zoom, setZoom] = useState<Zoom>("days");
  const [monthPick, setMonthPick] = useState<MonthPick>(thisMonth);
  const [year, setYear] = useState(thisYear);
  const [decadeIndex, setDecadeIndex] = useState(currentIndex ?? 0);

  function openMonth(pick: MonthPick) {
    setMonthPick(pick);
    setZoom("month");
    window.scrollTo({ top: 0 });
  }

  function openYear(next: number) {
    setYear(next);
    setZoom("year");
    window.scrollTo({ top: 0 });
  }

  function pickDecade(index: number) {
    setDecadeIndex(index);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl options={ZOOMS} value={zoom} onChange={setZoom} ariaLabel="How far ahead" />
      {zoom === "days" && <TenDays profile={profile} today={today} />}
      {zoom === "month" && <MonthZoom profile={profile} today={today} pick={monthPick} onPick={openMonth} />}
      {zoom === "year" && (
        <YearZoom profile={profile} year={year} currentMonth={thisMonth} onPickYear={openYear} onOpenMonth={openMonth} />
      )}
      {zoom === "decade" && decades.length > 0 && (
        <DecadeZoom
          profile={profile}
          decades={decades}
          index={decadeIndex}
          currentIndex={currentIndex}
          thisYear={thisYear}
          onPickDecade={pickDecade}
          onOpenYear={openYear}
        />
      )}
    </div>
  );
}
