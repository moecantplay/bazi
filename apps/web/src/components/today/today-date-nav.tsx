/** The date stepper wired to Today's state, plus the notes that follow it. */

"use client";

import { DateStepper } from "@/components/date-stepper";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function TodayDateNav({ screen }: Props) {
  const { dateRange } = screen.model;
  return (
    <DateStepper
      dateISO={screen.dateISO}
      pickerOpen={screen.pickerOpen}
      onOpenPicker={screen.openPicker}
      onClosePicker={screen.closePicker}
      onJump={screen.jumpTo}
      onStep={screen.step}
      min={dateRange.min}
      max={dateRange.max}
      atStart={dateRange.atStart}
      atEnd={dateRange.atEnd}
      month="short"
    />
  );
}

/** "Back to today" and the 30-day limit note; renders nothing on today itself. */
export function TodayDateNotes({ screen }: Props) {
  if (screen.offset === 0 && !screen.model.dateRange.atBoundary) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4">
      {screen.offset !== 0 && (
        <button type="button" onClick={screen.backToToday} className="tap-target text-[12px] text-ink-soft hover:text-ink">
          Back to today
        </button>
      )}
      {screen.model.dateRange.atBoundary && (
        <p className="text-[12px] text-ink-soft">Readings reach 30 days out from today.</p>
      )}
    </div>
  );
}
