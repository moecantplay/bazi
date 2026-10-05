"use client";

import { AppShell } from "@/components/app-shell";
import { PeopleView } from "@/components/people/people-view";
import { ProfileGate } from "@/components/profile-gate";

export default function PeoplePage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="People">
          <PeopleView profile={profile} />
        </AppShell>
      )}
    </ProfileGate>
  );
}
