"use client";

import { AppShell } from "@/components/app-shell";
import { ProfileGate } from "@/components/profile-gate";
import { SettingsContent } from "@/components/settings-content";

export default function SettingsPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Settings">
          <SettingsContent profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
