"use client";

import { chartFor } from "@daymaster/presentation";
import { AppShell } from "@/components/app-shell";
import { HorizonOutlook } from "@/components/horizon-outlook";
import { LuckTimeline } from "@/components/luck-timeline";
import { ProfileGate } from "@/components/profile-gate";

export default function CyclesPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Cycles">
          <div className="flex flex-col gap-10">
            <HorizonOutlook profile={profile} />
            <LuckTimeline chart={chartFor(profile)} />
          </div>
        </AppShell>
      )}
    </ProfileGate>
  );
}
