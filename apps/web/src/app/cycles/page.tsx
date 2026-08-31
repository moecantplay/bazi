"use client";

import { AppShell } from "@/components/app-shell";
import { LuckTimeline } from "@/components/luck-timeline";
import { ProfileGate } from "@/components/profile-gate";

export default function CyclesPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Cycles">
          <LuckTimeline profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
