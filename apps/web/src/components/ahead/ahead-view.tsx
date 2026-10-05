/**
 * Reshape trial: Ahead (R10, R12) — what Today can't show. "Your seasons"
 * leads: the slower weather behind the days, one zoom at a time (any month, a
 * year month by month, a ten-year stretch year by year). "Plan something"
 * closes the screen and answers "when should I…?". Single days belong to
 * Today, which already moves through them.
 */

"use client";

import { useMemo, useRef, useState } from "react";
import { decadesOf, type StoredProfile } from "@daymaster/presentation";
import { SegmentedControl } from "@/components/segmented-control";
import { useTodayLabel } from "@/lib/use-today-label";
import { DecadeZoom, MonthZoom, YearZoom, type MonthPick } from "./period-zooms";
import { PlanSomething } from "./plan-something";

type Zoom = "month" | "year" | "decade";

const ZOOMS: { value: Zoom; label: string }[] = [
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

  const [zoom, setZoom] = useState<Zoom>("month");
  const [monthPick, setMonthPick] = useState<MonthPick>(thisMonth);
  const [year, setYear] = useState(thisYear);
  const [decadeIndex, setDecadeIndex] = useState(currentIndex ?? 0);

  const seasonsRef = useRef<HTMLElement>(null);

  /** Moving to another period brings the seasons section back into view. */
  function toSeasons() {
    seasonsRef.current?.scrollIntoView({ block: "start" });
  }

  function openMonth(pick: MonthPick) {
    setMonthPick(pick);
    setZoom("month");
    toSeasons();
  }

  function openYear(next: number) {
    setYear(next);
    setZoom("year");
    toSeasons();
  }

  function pickDecade(index: number) {
    setDecadeIndex(index);
    toSeasons();
  }

  return (
    <div className="flex flex-col gap-6">
      <section ref={seasonsRef} className="flex scroll-mt-6 flex-col gap-6" aria-label="Your seasons">
        <p className="kicker">Your seasons</p>
        <SegmentedControl options={ZOOMS} value={zoom} onChange={setZoom} ariaLabel="Which season" />
        {zoom === "month" && <MonthZoom profile={profile} pick={monthPick} onPick={openMonth} />}
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
      </section>
      <PlanSomething />
    </div>
  );
}
