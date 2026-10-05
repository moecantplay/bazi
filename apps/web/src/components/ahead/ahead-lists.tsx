/**
 * Reshape trial (R9): the lists Ahead is built from — days with their Today
 * headline, periods with their lead headline, and the look ahead to the next
 * period. Every line is an existing plain headline.
 */

import Link from "next/link";
import type { DayHeadline, Lean, PeriodSummary } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";

const LEAN_DOT: Record<Lean, string> = {
  good: "bg-[var(--element-wood)]",
  rough: "bg-[var(--signal-amber)]",
  even: "bg-hairline"
};

const LEAN_WORD: Record<Lean, string> = { good: "Leans your way", rough: "Take it slowly", even: "Even" };

function LeanDot({ lean }: { lean: Lean }) {
  return <span aria-hidden className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${LEAN_DOT[lean]}`} />;
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

interface DayListProps {
  label: string;
  days: DayHeadline[];
}

export function DayList({ label, days }: DayListProps) {
  if (days.length === 0) {
    return null;
  }
  return (
    <section className="flex flex-col gap-3" aria-label={label}>
      <p className="kicker">{label}</p>
      <ul className="stack">
        {days.map((day) => {
          const inner = (
            <>
              <LeanDot lean={day.lean} />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="caption">{`${shortDate(day.iso)} · ${LEAN_WORD[day.lean]}`}</span>
                <span className="text-[15px] leading-snug text-ink">
                  <TokenText line={day.headline.runs} />
                </span>
              </span>
            </>
          );
          return (
            <li key={day.iso}>
              {day.openable ? (
                <Link href={`/today/?date=${day.iso}`} className="flex items-start gap-3 px-4 py-3 text-ink">
                  {inner}
                  <span aria-hidden className="self-center text-ink-soft">
                    &rsaquo;
                  </span>
                </Link>
              ) : (
                <div className="flex items-start gap-3 px-4 py-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface PeriodListProps {
  label: string;
  periods: PeriodSummary[];
  /** Highlighted row (the period being read now), if any. */
  currentKey?: number;
  onSelect: (key: number) => void;
}

export function PeriodList({ label, periods, currentKey, onSelect }: PeriodListProps) {
  return (
    <section className="flex flex-col gap-3" aria-label={label}>
      <p className="kicker">{label}</p>
      <ul className="stack">
        {periods.map((period) => (
          <li key={period.key}>
            <button
              type="button"
              onClick={() => onSelect(period.key)}
              aria-current={period.key === currentKey ? "true" : undefined}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-ink"
            >
              <LeanDot lean={period.lean} />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className={`caption ${period.key === currentKey ? "!text-ink" : ""}`}>
                  {period.key === currentKey ? `${period.short} · now` : period.short}
                </span>
                <span className="text-[15px] leading-snug">{period.headline}</span>
              </span>
              <span aria-hidden className="self-center text-ink-soft">
                &rsaquo;
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface NextPreviewProps {
  label: string;
  title: string;
  headline: string;
  onOpen: () => void;
}

export function NextPreview({ label, title, headline, onOpen }: NextPreviewProps) {
  return (
    <button type="button" onClick={onOpen} className="card flex flex-col gap-1 p-5 text-left text-ink">
      <span className="caption">{label}</span>
      <span className="font-display text-[18px] leading-tight">{title}</span>
      <span className="text-[14px] leading-relaxed text-ink-soft">{headline}</span>
    </button>
  );
}
