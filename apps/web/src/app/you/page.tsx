"use client";

import { AppShell } from "@/components/app-shell";
import { ProfileGate } from "@/components/profile-gate";
import { YouView } from "@/components/you/you-view";

export default function YouPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="You">
          <YouView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
