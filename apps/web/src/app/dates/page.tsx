"use client";

import { AppShell } from "@/components/app-shell";
import { DateFinder } from "@/components/dates/date-finder";
import { ProfileGate } from "@/components/profile-gate";

export default function DatesPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Find a day">
          <DateFinder profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
