/**
 * The twelve calendar months of a selected year, as a horizontal snap-scroll
 * carousel one level below YearPicker in Cycles' decade → year → month
 * drill-down. Rebuilt on ScrollCarousel — same active/reading-always-visible
 * model as the decade carousel above it, replacing the old naive
 * overflow-x-auto strip that clipped months at the card edge. Each
 * sexagenary month pillar is read at local noon on the 15th
 * (packages/bazi-engine's `monthlyPillarFactsForCalendarMonth`), so cells
 * here show only the plain Gregorian month name — the jié-based pillar
 * itself only surfaces once a month is actually selected and its reading
 * renders; showing an animal per cell up front would mean resolving all
 * twelve pillars just to label a picker, which this deliberately avoids.
 */

"use client";

import { ScrollCarousel } from "@/components/scroll-carousel";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthCell {
  month: number;
  label: string;
}

const MONTHS: MonthCell[] = MONTH_LABELS.map((label, index) => ({ month: index + 1, label }));

const ITEM_WIDTH = 58;

interface Props {
  activeMonth: number;
  /** The real current month (1-12), only when the selected year is the real current year. */
  currentMonth: number | null;
  onSelect: (month: number) => void;
}

export function MonthPicker({ activeMonth, currentMonth, onSelect }: Props) {
  return (
    <div className="h-[60px]" data-month-picker>
      <ScrollCarousel
        items={MONTHS}
        itemKey={(cell) => cell.month}
        axis="x"
        itemSize={ITEM_WIDTH}
        activeIndex={activeMonth - 1}
        onActiveChange={(index) => onSelect(MONTHS[index]!.month)}
        aria-label="Pick a month"
        renderItem={({ label }) => (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl bg-surface shadow-card">
            <span className="font-display text-[13px] leading-none text-ink">{label}</span>
          </span>
        )}
        renderNowMarker={({ month }) =>
          month === currentMonth ? (
            <span className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal-amber" aria-hidden />
          ) : null
        }
      />
    </div>
  );
}
