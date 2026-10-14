/**
 * ‹ date › with a tap-to-pick date field: the day navigation every Today
 * look shares. The date shows in Space Mono; tapping it swaps
 * in a native date input clamped to the reading range.
 */

"use client";

import { formatLong } from "@daymaster/presentation";

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
}

/** TUE, 29 SEP: short enough to share a row in every look. */
function monoDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" })
    .format(new Date(`${iso}T00:00:00Z`))
    .toUpperCase();
}

export function DateStepper({
  dateISO,
  pickerOpen,
  onOpenPicker,
  onClosePicker,
  onJump,
  onStep,
  min,
  max,
  atStart,
  atEnd
}: Props) {
  return (
    <div className="flex min-w-0 items-center gap-1">
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
  );
}
