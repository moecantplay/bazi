"use client";

import { AppShell } from "@/components/app-shell";
import { PlaceholderScreen } from "@/components/placeholder-screen";
import { ProfileGate } from "@/components/profile-gate";

export default function ChartPage() {
  return (
    <ProfileGate>
      {() => (
        <AppShell title="Chart">
          <PlaceholderScreen note="Your pillars and their reading arrive here, together with your chart." />
        </AppShell>
      )}
    </ProfileGate>
  );
}
