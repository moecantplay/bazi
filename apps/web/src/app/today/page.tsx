"use client";

import { AppShell } from "@/components/app-shell";
import { PlaceholderScreen } from "@/components/placeholder-screen";
import { ProfileGate } from "@/components/profile-gate";

export default function TodayPage() {
  return (
    <ProfileGate>
      {() => (
        <AppShell title="Today">
          <PlaceholderScreen note="Your daily reading arrives here, once your chart is ready." />
        </AppShell>
      )}
    </ProfileGate>
  );
}
