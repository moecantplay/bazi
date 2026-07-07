"use client";

import { AppShell } from "@/components/app-shell";
import { PlaceholderScreen } from "@/components/placeholder-screen";
import { ProfileGate } from "@/components/profile-gate";

export default function CyclesPage() {
  return (
    <ProfileGate>
      {() => (
        <AppShell title="Cycles">
          <PlaceholderScreen note="Your luck cycles arrive here, once your chart is ready." />
        </AppShell>
      )}
    </ProfileGate>
  );
}
