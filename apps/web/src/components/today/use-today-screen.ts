/**
 * Everything Today needs that isn't layout: the displayed date and how to
 * move it, the screen model for that date, the streak, the live clock, and
 * the terrain stamp. Every look's composition renders from this one object,
 * so the three looks always show the same reading (DESIGN.md v5).
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, clampOffsetToRange, dayProgress, daysBetween, todayScreenModel, type TodayScreenModel } from "@daymaster/presentation";
import { trackReadingOpened } from "@/lib/analytics";
import { dateFromQuery } from "@/lib/topic-href";
import { hasOpenedToday, recordTodayOpen } from "@/lib/streak";
import type { StoredProfile } from "@/lib/store-types";
import { useNow } from "@/lib/use-now";
import { useTodayLabel } from "@/lib/use-today-label";

export interface TodayScreen {
  profile: StoredProfile;
  today: string;
  dateISO: string;
  /** Days from today to the displayed date. */
  offset: number;
  model: TodayScreenModel;
  /** 0–1 through the day, only while today is displayed. */
  progress: number | null;
  /** The device clock, only while today is displayed. */
  now: Date | null;
  streak: number;
  pickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  step: (delta: number) => void;
  jumpTo: (value: string) => void;
  backToToday: () => void;
}

/**
 * The day offset a link asked for (`?date=`, e.g. Back from a topic page),
 * clamped to Today's range. Today only renders client-side, behind
 * ProfileGate, so reading the URL here never mismatches server HTML.
 */
function offsetFromUrl(today: string): number {
  const date = dateFromQuery(window.location.search);
  return date === null ? 0 : clampOffsetToRange(daysBetween(today, date));
}

export function useTodayScreen(profile: StoredProfile): TodayScreen {
  const today = useTodayLabel();
  const now = useNow();
  const [offset, setOffset] = useState(() => offsetFromUrl(today));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const firstOpenToday = !hasOpenedToday(today);
    const count = recordTodayOpen(today);
    setStreak(count);
    if (firstOpenToday) {
      trackReadingOpened(profile, count, today);
    }
  }, [profile, today]);

  const dateISO = addDays(today, offset);
  const model = useMemo(() => todayScreenModel(profile, dateISO, today), [profile, dateISO, today]);

  useEffect(() => {
    document.documentElement.dataset.terrain = model.stem.element;
  }, [model.stem.element]);

  // Keep the displayed date in the URL (without adding history entries), so a
  // topic page's Back returns to this day rather than to today.
  useEffect(() => {
    const query = offset === 0 ? "" : `?date=${dateISO}`;
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query}`);
  }, [offset, dateISO]);

  function jumpTo(value: string) {
    if (value.length === 0) {
      return;
    }
    setOffset(clampOffsetToRange(daysBetween(today, value)));
    setPickerOpen(false);
  }

  return {
    profile,
    today,
    dateISO,
    offset,
    model,
    progress: offset === 0 ? dayProgress(now) : null,
    now: offset === 0 ? now : null,
    streak,
    pickerOpen,
    openPicker: () => setPickerOpen(true),
    closePicker: () => setPickerOpen(false),
    step: (delta) => setOffset((current) => clampOffsetToRange(current + delta)),
    jumpTo,
    backToToday: () => setOffset(0)
  };
}
