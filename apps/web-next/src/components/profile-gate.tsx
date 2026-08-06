/**
 * Guards the main screens: renders its children only once a stored profile is
 * confirmed, and redirects to onboarding when there isn't one. Prevents the
 * placeholder and settings screens from ever showing without a chart behind them.
 *
 * Also the single choke point every gated screen passes through, so it's
 * where the day's terrain (DESIGN.md v4 §Tokens) gets stamped on <html> —
 * every screen shares one day's ground, not just Today.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { dayTerrain, type StoredProfile } from "@daymaster/presentation";
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
    setProfile(stored);
    setStatus("present");
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
