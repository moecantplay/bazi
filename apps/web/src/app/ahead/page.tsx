"use client";

import { AheadView } from "@/components/ahead/ahead-view";
import { AppShell } from "@/components/app-shell";
import { ProfileGate } from "@/components/profile-gate";

export default function AheadPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Ahead">
          <AheadView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
