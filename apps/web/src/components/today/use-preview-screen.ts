/**
 * A read-only Today screen for look previews (onboarding, Settings, the
 * one-time note): today's model for a profile, on the live clock, with inert
 * controls. Unlike useTodayScreen it records no streak and stamps no terrain.
 */

"use client";

import { useMemo } from "react";
import { dayProgress, todayScreenModel } from "@daymaster/presentation";
import type { TodayScreen } from "@/components/today/use-today-screen";
import type { StoredProfile } from "@/lib/store-types";
import { useNow } from "@/lib/use-now";
import { useTodayLabel } from "@/lib/use-today-label";

function ignore(): void {}

export function usePreviewScreen(profile: StoredProfile): TodayScreen {
  const today = useTodayLabel();
  const now = useNow();
  const model = useMemo(() => todayScreenModel(profile, today, today), [profile, today]);
  return {
    profile,
    today,
    dateISO: today,
    offset: 0,
    model,
    progress: dayProgress(now),
    now,
    streak: 0,
    pickerOpen: false,
    openPicker: ignore,
    closePicker: ignore,
    step: ignore,
    jumpTo: ignore,
    backToToday: ignore
  };
}
