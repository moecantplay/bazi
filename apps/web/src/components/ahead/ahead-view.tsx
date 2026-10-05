/**
 * Reshape trial: Ahead — what's coming, at four zooms shown one at a time.
 * Ten days is the day strip plus Find a day; month, year and decade are each
 * one plain reading (a lead, then plain cards).
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OFFICER_DAY_WORDS } from "@daymaster/content";
import { aheadPeriodsFor, conditionDays, type ConditionDay, type StoredProfile } from "@daymaster/presentation";
import { PlainCardList, PlainLeadBlock } from "@/components/plain/plain-reading";
import { SegmentedControl } from "@/components/segmented-control";
import { useTodayLabel } from "@/lib/use-today-label";

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

function weekday(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(new Date(`${iso}T00:00:00Z`));
}

function DayTile({ day, isToday }: { day: ConditionDay; isToday: boolean }) {
  const tone = isToday
    ? "bg-anchor text-paper"
    : day.tone === "favoured"
      ? "bg-[var(--element-wood-fill)] text-ink"
      : day.tone === "friction"
        ? "bg-[var(--signal-amber-fill)] text-ink"
        : "bg-surface text-ink";
  const activity = day.lead ? (day.lead.leaning === "favors" ? day.lead.label : "Take it slow") : "Even";
  return (
    <li className={`flex w-[100px] flex-none flex-col gap-1 rounded-tile p-3 shadow-card ${tone}`}>
      <span className="caption !text-current opacity-80">{isToday ? "Today" : weekday(day.iso)}</span>
      <span className="font-display text-[22px] leading-none">{Number(day.iso.slice(8))}</span>
      <span className="text-[13px] font-semibold">{OFFICER_DAY_WORDS[day.officerKey] ?? "Even"}</span>
      <span className="text-[12px] opacity-85">{activity}</span>
    </li>
  );
}

export function AheadView({ profile }: Props) {
  const today = useTodayLabel();
  const [zoom, setZoom] = useState<Zoom>("days");
  const days = useMemo(() => conditionDays(profile, today), [profile, today]);
  const periods = useMemo(() => aheadPeriodsFor(profile, today), [profile, today]);

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl options={ZOOMS} value={zoom} onChange={setZoom} ariaLabel="How far ahead" />

      {zoom === "days" && (
        <>
          <section className="flex flex-col gap-3" aria-label="The next ten days">
            <p className="kicker">The next ten days</p>
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
              {days.map((day, index) => (
                <DayTile key={day.iso} day={day} isToday={index === 0} />
              ))}
            </ul>
            <p className="text-[13px] leading-relaxed text-ink-soft">
              Green days lean your way; amber days are better taken slowly.
            </p>
          </section>
          <Link href="/dates/" className="card flex flex-col gap-1 p-5 text-ink">
            <span className="caption">Find a day</span>
            <span className="font-display text-[18px] leading-tight">What are you planning?</span>
            <span className="text-[14px] leading-relaxed text-ink-soft">
              Moving, signing, launching, a get-together: the best days in the next year.
            </span>
          </Link>
        </>
      )}

      {zoom === "month" && (
        <>
          <PlainLeadBlock kicker={periods.month.label} lead={periods.month.reading.lead} actionLabel="One thing this month" />
          <PlainCardList cards={periods.month.reading.cards} />
        </>
      )}

      {zoom === "year" && (
        <>
          <PlainLeadBlock kicker={periods.year.label} lead={periods.year.reading.lead} actionLabel="One thing this year" />
          <PlainCardList cards={periods.year.reading.cards} />
        </>
      )}

      {zoom === "decade" && (
        <>
          <ul className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" aria-label="Your ten-year stretches">
            {periods.decades.map((decade) => (
              <li
                key={decade.ages}
                aria-current={decade.current ? "true" : undefined}
                className={`flex flex-none flex-col items-center rounded-tile px-3.5 py-2 ${
                  decade.current ? "bg-anchor text-paper" : "bg-surface text-ink"
                }`}
              >
                <span className="caption !text-current opacity-80">Ages</span>
                <span className="font-display text-[16px]">{decade.ages}</span>
              </li>
            ))}
          </ul>
          {periods.decade ? (
            <>
              <PlainLeadBlock kicker={periods.decade.label} lead={periods.decade.reading.lead} actionLabel="One thing this decade" />
              <PlainCardList cards={periods.decade.reading.cards} />
            </>
          ) : (
            <p className="text-[15px] leading-relaxed text-ink">Your first ten-year stretch hasn&rsquo;t begun yet.</p>
          )}
          <Link href="/cycles/" className="tap-target self-start text-[13px] text-ink-soft hover:text-ink">
            Your decades, the old way &rarr;
          </Link>
        </>
      )}
    </div>
  );
}
