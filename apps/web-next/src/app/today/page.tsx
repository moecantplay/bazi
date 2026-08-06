"use client";

import { AppShell } from "@/components/app-shell";
import { ProfileGate } from "@/components/profile-gate";
import { TodayView } from "@/components/today-view";

export default function TodayPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Today">
          <TodayView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
