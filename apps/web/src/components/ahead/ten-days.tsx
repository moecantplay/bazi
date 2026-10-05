/**
 * Reshape trial: Ahead's ten-day view — the day strip (each day opens Today on
 * its date), the standout days of the next 30, and Find a day (R5, R9).
 */

import Link from "next/link";
import { useMemo } from "react";
import { OFFICER_DAY_WORDS } from "@daymaster/content";
import { comingUp, conditionDays, dayLeans, type ConditionDay, type Lean, type StoredProfile } from "@daymaster/presentation";
import { DayList } from "./ahead-lists";

interface Props {
  profile: StoredProfile;
  today: string;
}

function weekday(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(new Date(`${iso}T00:00:00Z`));
}

/** The tile's colour follows what Today says about the day (its lead), like the rest of Ahead. */
function DayTile({ day, lean, isToday }: { day: ConditionDay; lean: Lean; isToday: boolean }) {
  const tone = isToday
    ? "bg-anchor text-paper"
    : lean === "good"
      ? "bg-[var(--element-wood-fill)] text-ink"
      : lean === "rough"
        ? "bg-[var(--signal-amber-fill)] text-ink"
        : "bg-surface text-ink";
  const activity = day.lead ? (day.lead.leaning === "favors" ? day.lead.label : "Take it slow") : "Even";
  return (
    <li className="flex-none">
      <Link
        href={isToday ? "/today/" : `/today/?date=${day.iso}`}
        className={`flex w-[100px] flex-col gap-1 rounded-tile p-3 shadow-card ${tone}`}
      >
        <span className="caption !text-current opacity-80">{isToday ? "Today" : weekday(day.iso)}</span>
        <span className="font-display text-[22px] leading-none">{Number(day.iso.slice(8))}</span>
        <span className="text-[13px] font-semibold">{OFFICER_DAY_WORDS[day.officerKey] ?? "Even"}</span>
        <span className="text-[12px] opacity-85">{activity}</span>
      </Link>
    </li>
  );
}

export function TenDays({ profile, today }: Props) {
  const days = useMemo(() => conditionDays(profile, today), [profile, today]);
  const leans = useMemo(() => dayLeans(profile, today), [profile, today]);
  const upcoming = useMemo(() => comingUp(profile, today), [profile, today]);

  return (
    <>
      <section className="flex flex-col gap-3" aria-label="The next ten days">
        <p className="kicker">The next ten days</p>
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
          {days.map((day, index) => (
            <DayTile key={day.iso} day={day} lean={leans[day.iso] ?? "even"} isToday={index === 0} />
          ))}
        </ul>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Green days lean your way; amber days are better taken slowly. Tap a day to read it.
        </p>
      </section>
      <DayList label="Coming up this month" days={upcoming} />
      <Link href="/dates/" className="card flex flex-col gap-1 p-5 text-ink">
        <span className="caption">Find a day</span>
        <span className="font-display text-[18px] leading-tight">What are you planning?</span>
        <span className="text-[14px] leading-relaxed text-ink-soft">
          Moving, signing, launching, a get-together: the best days in the next year.
        </span>
      </Link>
    </>
  );
}
