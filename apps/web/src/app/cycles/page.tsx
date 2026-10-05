"use client";

import { AppShell } from "@/components/app-shell";
import { LuckTimeline } from "@/components/luck-timeline";
import { ProfileGate } from "@/components/profile-gate";

export default function CyclesPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Your decades" back>
          <LuckTimeline profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
