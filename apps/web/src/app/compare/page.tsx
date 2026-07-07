"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CompareForm } from "@/components/compare-form";
import { CompareView } from "@/components/compare-view";
import { ProfileGate } from "@/components/profile-gate";
import {
  clearCompanion,
  loadCompanion,
  saveCompanion
} from "@/lib/compare-profile";
import type { StoredBirth } from "@/lib/profile";

export default function ComparePage() {
  const [companion, setCompanion] = useState<StoredBirth | null>(() => loadCompanion());

  function handleSave(birth: StoredBirth) {
    saveCompanion(birth);
    setCompanion(birth);
  }

  function handleChangePerson() {
    clearCompanion();
    setCompanion(null);
  }

  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Compare">
          {companion ? (
            <CompareView
              profile={profile}
              companion={companion}
              onChangePerson={handleChangePerson}
            />
          ) : (
            <CompareForm onSave={handleSave} />
          )}
        </AppShell>
      )}
    </ProfileGate>
  );
}
