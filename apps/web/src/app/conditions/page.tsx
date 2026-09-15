"use client";

import { AppShell } from "@/components/app-shell";
import { ConditionsView } from "@/components/conditions/conditions-view";
import { ProfileGate } from "@/components/profile-gate";

export default function ConditionsPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Conditions" back>
          <ConditionsView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
