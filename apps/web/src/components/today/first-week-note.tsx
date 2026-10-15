/**
 * The first-week note (M24-10): on a new reader's opened days 2–7, one line
 * saying what one part of Today is for. It takes the first-day banner's slot
 * in every look, sunk into the page with a tail pointing at the cards below,
 * and a dot for each day of the week so far.
 */

"use client";

import { FIRST_WEEK_NOTES, firstWeekKicker } from "@daymaster/content";
import { FIRST_WEEK_DAYS } from "@daymaster/presentation";
import type { TodayScreen } from "./use-today-screen";
import { useFirstWeekNote } from "./use-first-week-note";

interface Props {
  screen: TodayScreen;
}

function WeekDots({ day }: { day: number }) {
  return (
    <span aria-hidden className="first-week-dots">
      {Array.from({ length: FIRST_WEEK_DAYS }, (_, index) => (
        <span key={index} className={index < day ? "is-reached" : undefined} />
      ))}
    </span>
  );
}

export function FirstWeekNote({ screen }: Props) {
  const note = useFirstWeekNote(screen);
  if (note === null) {
    return null;
  }
  return (
    <section data-first-week={note.part} className="first-week-note" aria-label="Your first week">
      <div className="flex items-center gap-3">
        <p className="kicker">{firstWeekKicker(note.day)}</p>
        <WeekDots day={note.day} />
      </div>
      <p className="text-[14px] leading-relaxed text-ink">{FIRST_WEEK_NOTES[note.part]}</p>
    </section>
  );
}
