/**
 * The Today date strip, restyled as a mono datebar (DESIGN.md §Layout): the
 * displayed date in Space Mono on the left, the compass/orbit mark on the
 * right (the same personal-logo geometry as the map hero's compass rose).
 * The prev/next/jump-to-date interactivity is unchanged from the old date
 * nav row — only its visual language moves.
 */

"use client";

import type { Pillar } from "@daymaster/bazi-engine";
import { formatLong } from "@daymaster/presentation";
import { CompassMark } from "@/components/compass-mark";

interface Props {
  dateISO: string;
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onJump: (value: string) => void;
  onStep: (delta: number) => void;
  min: string;
  max: string;
  atStart: boolean;
  atEnd: boolean;
  pillars: (Pillar | null)[];
}

function monoDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "long"
  })
    .format(new Date(`${iso}T00:00:00Z`))
    .toUpperCase();
}

export function Datebar({
  dateISO,
  pickerOpen,
  onOpenPicker,
  onClosePicker,
  onJump,
  onStep,
  min,
  max,
  atStart,
  atEnd,
  pillars
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <button
          type="button"
          aria-label="Previous day"
          onClick={() => onStep(-1)}
          disabled={atStart}
          className="tap-target px-1 text-xl leading-none text-ink disabled:opacity-30"
        >
          &lsaquo;
        </button>
        {pickerOpen ? (
          <input
            type="date"
            autoFocus
            aria-label="Jump to a date"
            defaultValue={dateISO}
            min={min}
            max={max}
            onChange={(event) => onJump(event.target.value)}
            onBlur={onClosePicker}
            className="field-input min-w-0 flex-1 !py-2 font-mono text-[13px]"
          />
        ) : (
          <button
            type="button"
            onClick={onOpenPicker}
            aria-label={`${formatLong(dateISO)} — jump to a date`}
            className="tap-target truncate font-mono text-[11px] font-bold tracking-[.18em] text-ink"
          >
            {monoDate(dateISO)}
          </button>
        )}
        <button
          type="button"
          aria-label="Next day"
          onClick={() => onStep(1)}
          disabled={atEnd}
          className="tap-target px-1 text-xl leading-none text-ink disabled:opacity-30"
        >
          &rsaquo;
        </button>
      </div>
      <CompassMark pillars={pillars} size={26} className="flex-none text-ink" />
    </div>
  );
}
