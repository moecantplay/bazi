/**
 * Today's first-week note (M24-10): reads the stored week, asks presentation
 * which part to introduce today, and stores the result. Only today counts as
 * an opened day; browsing another date neither records nor shows a note.
 */

"use client";

import { useEffect, useState } from "react";
import { firstWeekNote, partsOnScreen, type IntroPart } from "@daymaster/presentation";
import { loadFirstWeek, setFirstWeek } from "@/lib/store";
import type { TodayScreen } from "./use-today-screen";

export interface FirstWeekNoteView {
  part: IntroPart;
  /** Which opened day of the first week today is (2–7). */
  day: number;
}

export function useFirstWeekNote(screen: TodayScreen): FirstWeekNoteView | null {
  const { profile, today, offset, model } = screen;
  const [note, setNote] = useState<FirstWeekNoteView | null>(null);
  const showingToday = offset === 0;
  const cards = showingToday ? model.reading.cards : null;

  useEffect(() => {
    if (cards === null) {
      return;
    }
    const state = loadFirstWeek();
    if (state === null) {
      setNote(null);
      return;
    }
    const step = firstWeekNote(state, today, partsOnScreen(profile, today, cards));
    if (step.next !== state) {
      setFirstWeek(step.next);
    }
    setNote(step.part === null ? null : { part: step.part, day: step.day });
  }, [profile, today, cards]);

  return showingToday ? note : null;
}
