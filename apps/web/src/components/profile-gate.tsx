/**
 * Guards the main screens: renders its children only once a stored profile is
 * confirmed, and redirects to onboarding when there isn't one. Prevents the
 * placeholder and settings screens from ever showing without a chart behind them.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { loadProfile, type StoredProfile } from "@/lib/profile";

type Status = "loading" | "present" | "absent";

interface Props {
  children: (profile: StoredProfile) => ReactNode;
}

export function ProfileGate({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    const stored = loadProfile();
    if (stored === null) {
      setStatus("absent");
      router.replace("/onboarding");
      return;
    }
    setProfile(stored);
    setStatus("present");
  }, [router]);

  if (status !== "present" || profile === null) {
    return <div className="min-h-screen bg-paper" aria-hidden />;
  }

  return <>{children(profile)}</>;
}
