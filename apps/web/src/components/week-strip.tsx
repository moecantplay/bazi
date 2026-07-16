/**
 * A seven-day at-a-glance strip (today plus the next six). Each cell shows the
 * weekday initial, the day number, and a small tone marker summed from the
 * day's activity leanings — a filled ink dot when the day leans favorable, an
 * open ring when it leans toward friction, a hairline when it's even. No
 * traffic-light colour: the marker stays in the ink/paper vocabulary so it
 * reads in both themes. Tapping a cell jumps the reading below to that day.
 * The tone word rides each cell's title for hover, and a "what the marks
 * mean" link under the strip opens the glossary explainer for touch.
 */

"use client";

import { useMemo, useState } from "react";
import { WEEK_TOPIC, glossaryEntry } from "@daymaster/content";
import { GlossarySheet } from "@/components/glossary-sheet";
import { addDays, formatLong } from "@/lib/dates";
import { dayTone, type DayTone } from "@/lib/day-tone";
import type { StoredProfile } from "@/lib/profile";

const WEEK_LENGTH = 7;

const TONE_WORD: Record<DayTone, string> = {
  favoured: "leans favorable",
  friction: "leans toward friction",
  even: "even day"
};

function weekdayInitial(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", weekday: "narrow" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

function ToneMarker({ tone }: { tone: DayTone }) {
  if (tone === "favoured") {
    return <span className="h-2 w-2 rounded-full bg-ink" aria-hidden />;
  }
  if (tone === "friction") {
    return <span className="h-2 w-2 rounded-full border border-ink-soft bg-transparent" aria-hidden />;
  }
  return <span className="h-px w-2.5 rounded-full bg-hairline" aria-hidden />;
}

interface Cell {
  iso: string;
  tone: DayTone;
}

interface Props {
  profile: StoredProfile;
  today: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}

export function WeekStrip({ profile, today, selectedISO, onSelect }: Props) {
  const [legendOpen, setLegendOpen] = useState(false);
  const legendEntry = glossaryEntry(WEEK_TOPIC);

  const cells = useMemo<Cell[]>(
    () =>
      Array.from({ length: WEEK_LENGTH }, (_, index) => {
        const iso = addDays(today, index);
        return { iso, tone: dayTone(profile, iso) };
      }),
    [profile, today]
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="kicker">The week ahead</h2>
      <div className="-mx-1 overflow-x-auto">
        <ul className="flex min-w-max gap-1 px-1" aria-label="The week ahead">
          {cells.map(({ iso, tone }) => {
            const isToday = iso === today;
            const isSelected = iso === selectedISO;
            const dayNumber = Number(iso.slice(8, 10));
            const suffix = isToday ? ", today" : "";
            return (
              <li key={iso} className="flex-1">
                <button
                  type="button"
                  onClick={() => onSelect(iso)}
                  aria-pressed={isSelected}
                  title={TONE_WORD[tone]}
                  aria-label={`${formatLong(iso)}${suffix} — ${TONE_WORD[tone]}`}
                  className={`flex w-full min-w-[44px] flex-col items-center gap-1.5 rounded-lg px-2 py-2 ${
                    isSelected ? "bg-paper-raised" : "hover:bg-paper-raised"
                  }`}
                >
                  <span className="text-[11px] text-ink-soft">{weekdayInitial(iso)}</span>
                  <span className={`text-[15px] ${isToday ? "font-medium text-ink" : "text-ink"}`}>
                    {dayNumber}
                  </span>
                  <span className="flex h-2 items-center justify-center">
                    <ToneMarker tone={tone} />
                  </span>
                  <span
                    className={`h-0.5 w-5 rounded-full ${isToday ? "bg-ink" : "bg-transparent"}`}
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {legendEntry && (
        <>
          <button
            type="button"
            data-week-legend
            onClick={() => setLegendOpen(true)}
            className="mx-auto block text-[12px] text-ink-soft hover:text-ink"
          >
            What the marks mean &rsaquo;
          </button>
          {legendOpen && <GlossarySheet entry={legendEntry} onClose={() => setLegendOpen(false)} />}
        </>
      )}
    </div>
  );
}
