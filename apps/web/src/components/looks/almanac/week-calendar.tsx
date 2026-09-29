/**
 * Editorial's week: a typographic calendar strip of the next seven days,
 * each with its tone dot (wood = leans your way, amber = take it slow,
 * hairline = even). Today's cell is the anchor pair; tapping a day opens it.
 */

"use client";

import { useMemo } from "react";
import { elevationWeek, formatLong, type DayTone } from "@daymaster/presentation";
import { WEEK_TONE_WORD, WeekLegendLink } from "@/components/week-legend-link";
import type { StoredProfile } from "@/lib/store-types";

interface Props {
  profile: StoredProfile;
  today: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}

const TONE_DOT: Record<DayTone, string> = {
  favoured: "var(--element-wood)",
  friction: "var(--signal-amber)",
  even: "var(--hairline)"
};

function parts(iso: string): { weekday: string; day: string } {
  const date = new Date(`${iso}T00:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(undefined, { timeZone: "UTC", ...options }).format(date);
  return { weekday: format({ weekday: "short" }), day: format({ day: "numeric" }) };
}

export function WeekCalendar({ profile, today, selectedISO, onSelect }: Props) {
  const cells = useMemo(() => elevationWeek(profile, today), [profile, today]);
  return (
    <div className="flex flex-col gap-4">
      <div className="week-calendar" role="group" aria-label="The next seven days">
        {cells.map((cell) => {
          const label = parts(cell.iso);
          const selected = cell.iso === selectedISO;
          return (
            <button
              key={cell.iso}
              type="button"
              aria-pressed={selected}
              aria-label={`${formatLong(cell.iso)} — ${WEEK_TONE_WORD[cell.tone]}`}
              onClick={() => onSelect(cell.iso)}
              className="week-calendar-day"
            >
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-[.08em]">{label.weekday}</span>
              <span className="font-display text-[18px] leading-none">{label.day}</span>
              <span aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: selected ? "var(--paper)" : TONE_DOT[cell.tone] }} />
            </button>
          );
        })}
      </div>
      <WeekLegendLink />
    </div>
  );
}
