/**
 * Guards the main screens: renders its children only once a stored profile is
 * confirmed, and redirects to onboarding when there isn't one. Prevents the
 * placeholder and settings screens from ever showing without a chart behind them.
 *
 * Also the single choke point every gated screen passes through, so it's
 * where the day's terrain (DESIGN.md v4 §Tokens) gets stamped on <html> —
 * every screen defaults to real today's ground. TodayView re-stamps it to
 * the currently viewed day whenever its date nav moves off today (DESIGN.md:
 * ground is keyed to "the active profile's day-stem element ... [and] date"),
 * then this effect's own re-run (profile/today don't change mid-session)
 * never fights it back.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ensureTrueSolarReady } from "@daymaster/bazi-engine";
import { dayTerrain, type StoredProfile } from "@daymaster/presentation";
import { deviceZone } from "@/lib/device-zone";
import { requestPersistentStorage } from "@/lib/persist-storage";
import { loadStore } from "@/lib/store";
import { useTodayLabel } from "@/lib/use-today-label";

type Status = "loading" | "present" | "absent";

interface Props {
  children: (profile: StoredProfile) => ReactNode;
}

export function ProfileGate({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const today = useTodayLabel();

  useEffect(() => {
    const { profile: stored } = loadStore();
    if (stored === null) {
      setStatus("absent");
      router.replace("/onboarding");
      return;
    }
    function show(present: StoredProfile) {
      // Days are read where the reader is now; the chart stays fixed to the
      // birth zone. Attached here, at the one place a profile enters the UI,
      // and stripped again by saveStore so it never persists.
      setProfile({ ...present, readingZone: deviceZone(present.birth.city.tz) });
      setStatus("present");
      // A chart now exists worth protecting from eviction (M19.8-02). Fire and forget.
      void requestPersistentStorage();
    }
    // True solar time loads on demand (M19.8-08). If loading fails, the screen
    // still opens and the engine's error reaches the recovery screen.
    if (stored.config.trueSolarTime) {
      void ensureTrueSolarReady().finally(() => show(stored));
      return;
    }
    show(stored);
  }, [router]);

  useEffect(() => {
    if (profile === null) {
      return;
    }
    document.documentElement.dataset.terrain = dayTerrain(profile, today);
  }, [profile, today]);

  if (status !== "present" || profile === null) {
    return <div className="min-h-screen bg-paper" aria-hidden />;
  }

  return <>{children(profile)}</>;
}
