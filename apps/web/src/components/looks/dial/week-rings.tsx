/**
 * Instrument's week: seven tone rings (solid wood = leans your way, dashed
 * amber = take it slow, hairline = even). The displayed day is filled in the
 * anchor pair; tapping a day opens it.
 */

"use client";

import { useMemo } from "react";
import { elevationWeek, formatLong } from "@daymaster/presentation";
import { WEEK_TONE_WORD } from "@/components/week-legend-link";
import type { StoredProfile } from "@/lib/store-types";

interface Props {
  profile: StoredProfile;
  today: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}

function format(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", ...options }).format(new Date(`${iso}T00:00:00Z`));
}

export function WeekRings({ profile, today, selectedISO, onSelect }: Props) {
  const cells = useMemo(() => elevationWeek(profile, today), [profile, today]);
  return (
    <div className="flex justify-between" role="group" aria-label="The next seven days">
      {cells.map((cell) => {
        const selected = cell.iso === selectedISO;
        return (
          <button
            key={cell.iso}
            type="button"
            aria-pressed={selected}
            aria-label={`${formatLong(cell.iso)} — ${WEEK_TONE_WORD[cell.tone]}`}
            onClick={() => onSelect(cell.iso)}
            className="flex w-11 flex-col items-center gap-1.5"
          >
            <span className="week-ring" data-tone={cell.tone} data-selected={selected || undefined}>
              {format(cell.iso, { day: "numeric" })}
            </span>
            <span className="font-mono text-[8.5px] font-bold uppercase tracking-[.1em] text-ink-soft">
              {format(cell.iso, { weekday: "short" })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
