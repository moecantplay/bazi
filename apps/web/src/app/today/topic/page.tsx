"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ProfileGate } from "@/components/profile-gate";
import { TopicPageView } from "@/components/topic/topic-page-view";

/** A topic page behind one of Today's cards (M20-21 R11); date and topic ride in the query. */
export default function TopicPage() {
  return (
    <ProfileGate>
      {(profile) => (
        <AppShell title="Today" bleed>
          <Suspense fallback={null}>
            <TopicPageView profile={profile} />
          </Suspense>
        </AppShell>
      )}
    </ProfileGate>
  );
}
