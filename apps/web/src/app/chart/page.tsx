"use client";

import { AppShell } from "@/components/app-shell";
import { ChartView } from "@/components/chart-view";
import { ProfileGate } from "@/components/profile-gate";

export default function ChartPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Your chart in full" back>
          <ChartView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
