/**
 * The ten days ahead as a list — the weather app's daily forecast rows:
 * weekday, condition icon, officer name, the day's lead activity, stem
 * element, and a three-bar lean (high for favoured, low for friction).
 * Tapping a row shows that day.
 */

import { formatLong, type ConditionDay, type DayTone } from "@daymaster/presentation";
import { ConditionIcon } from "@/components/conditions/condition-icon";

interface Props {
  days: readonly ConditionDay[];
  today: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}

const TONE_WORD: Record<DayTone, string> = {
  favoured: "leans favorable",
  friction: "leans toward friction",
  even: "even day"
};

const BAR_HEIGHT: Record<DayTone, string> = {
  favoured: "h-2.5 bg-element-wood",
  even: "h-1.5 bg-ink-soft opacity-50",
  friction: "h-1 bg-element-fire"
};

function weekdayShort(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", weekday: "short" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

export function TenDayList({ days, today, selectedISO, onSelect }: Props) {
  return (
    <ul data-ten-days className="list-none rounded-card bg-surface px-2 py-1.5 shadow-card" aria-label="The ten days ahead">
      {days.map((day) => {
        const isToday = day.iso === today;
        const isSelected = day.iso === selectedISO;
        const leadWord = day.lead ? `${day.lead.label}${day.lead.leaning === "friction" ? " · slow" : ""}` : "Even footing";
        return (
          <li key={day.iso}>
            <button
              type="button"
              onClick={() => onSelect(day.iso)}
              aria-pressed={isSelected}
              aria-label={`${formatLong(day.iso)}${isToday ? ", today" : ""} — ${day.officerName} day, ${TONE_WORD[day.tone]}`}
              className={`grid min-h-12 w-full grid-cols-[44px_30px_1fr_auto] items-center gap-3 rounded-[14px] px-2.5 py-2 text-left ${
                isSelected ? "bg-ink-tint" : ""
              }`}
            >
              <span
                className={`font-mono text-[11px] font-bold uppercase tracking-[.12em] ${
                  isSelected ? "text-ink" : "text-ink-soft"
                }`}
              >
                {isToday ? "Today" : weekdayShort(day.iso)}
              </span>
              <span className="grid place-items-center">
                <ConditionIcon officerKey={day.officerKey} officerName={day.officerName} element={day.element} size={26} />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="font-display text-[16px] tracking-[-0.01em] text-ink">{day.officerName}</span>
                <span className="truncate text-[12px] text-ink-soft">{leadWord}</span>
              </span>
              <span className="flex flex-col items-end gap-1">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-ink-soft">
                  {day.element}
                </span>
                <span aria-hidden className="flex h-2.5 items-end gap-0.5" title={TONE_WORD[day.tone]}>
                  {[0, 1, 2].map((bar) => (
                    <i key={bar} className={`block w-[5px] rounded-[1px] ${BAR_HEIGHT[day.tone]}`} />
                  ))}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
