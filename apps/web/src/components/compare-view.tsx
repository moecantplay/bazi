/**
 * The Compare reading: both charts' pillars side by side (compact, no ten-god
 * captions), then the comparison lines as cited cards. "Change person" swaps
 * the companion out; the reading itself comes from lib/compare.ts.
 */

"use client";

import { Button } from "@/components/button";
import { PillarColumns } from "@/components/pillar-columns";
import { ReadingCard } from "@/components/reading-card";
import { compareBundleFor } from "@/lib/compare";
import { chartFor } from "@/lib/chart";
import type { StoredBirth, StoredProfile } from "@/lib/profile";

interface Props {
  profile: StoredProfile;
  companion: StoredBirth;
  onChangePerson: () => void;
}

export function CompareView({ profile, companion, onChangePerson }: Props) {
  const yourChart = chartFor(profile);
  const { companionChart, reading } = compareBundleFor(profile, companion);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">You</h2>
        <PillarColumns
          pillars={{
            year: yourChart.year,
            month: yourChart.month,
            day: yourChart.day,
            hour: yourChart.hour
          }}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">Them</h2>
          <span className="text-[12px] text-ink-soft">
            born {companion.date}
            {companion.time ? ` · ${companion.time}` : " · time unknown"} · {companion.city.name}
          </span>
        </div>
        <PillarColumns
          pillars={{
            year: companionChart.year,
            month: companionChart.month,
            day: companionChart.day,
            hour: companionChart.hour
          }}
        />
      </section>

      <section className="flex flex-col gap-3" data-compare-reading>
        <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
          How your charts meet
        </h2>
        {reading.lines.map((line, index) => (
          <ReadingCard key={index} line={line} />
        ))}
      </section>

      <div>
        <Button variant="quiet" onClick={onChangePerson}>
          Change person
        </Button>
      </div>
    </div>
  );
}
