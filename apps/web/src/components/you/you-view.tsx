/**
 * Reshape trial: You — who you are in plain words. The day-master portrait
 * leads, plain cards follow, and the pillar grid with its old names waits
 * behind "Your chart in full" (the existing Chart screen).
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { chartFor, youElementsFor, youScreenFor, type StoredProfile } from "@daymaster/presentation";
import { PlainCardList, PlainLeadBlock } from "@/components/plain/plain-reading";
import { Seal } from "@/components/seal";
import { AboutReadingLink } from "@/components/today/today-footer";
import { YouElementsSection } from "@/components/you/you-elements";

interface Props {
  profile: StoredProfile;
}

export function YouView({ profile }: Props) {
  const chart = useMemo(() => chartFor(profile), [profile]);
  const reading = useMemo(() => youScreenFor(profile), [profile]);
  const elements = useMemo(() => youElementsFor(profile), [profile]);
  if (!reading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Seal pillars={[chart.year, chart.month, chart.day, chart.hour]} size={72} />
      <PlainLeadBlock kicker="Who you are" lead={reading.lead} actionLabel="Worth remembering" />
      {elements && <YouElementsSection elements={elements} />}

      <section className="flex flex-col gap-3" aria-label="What shapes you">
        <p className="kicker">What shapes you</p>
        <PlainCardList cards={reading.cards} />
      </section>

      <Link href="/chart/" className="card flex flex-col gap-1 p-5 text-ink">
        <span className="caption">Your chart in full</span>
        <span className="font-display text-[18px] leading-tight">The four pillars and their old names</span>
        <span className="text-[14px] leading-relaxed text-ink-soft">
          The patterns and small signs you were born with, explained, and ways to share your chart.
        </span>
      </Link>

      <AboutReadingLink />
    </div>
  );
}
