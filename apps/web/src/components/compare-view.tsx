/**
 * The Compare reading: both charts' pillars side by side (compact, no ten-god
 * captions), then the comparison lines as cited cards. "Change person" returns
 * to the saved-people picker; the reading itself comes from lib/compare.ts.
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { PillarColumns } from "@/components/pillar-columns";
import { ReadingCard } from "@/components/reading-card";
import { compareBundleFor } from "@/lib/compare";
import { chartFor } from "@/lib/chart";
import { formatLong } from "@/lib/dates";
import type { StoredPerson } from "@/lib/people";
import type { StoredProfile } from "@/lib/profile";

interface Props {
  profile: StoredProfile;
  person: StoredPerson;
  onChangePerson: () => void;
}

export function CompareView({ profile, person, onChangePerson }: Props) {
  const companion = person.birth;
  const yourChart = chartFor(profile);
  const { companionChart, reading } = compareBundleFor(profile, companion);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="kicker">You</h2>
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
          <h2 className="kicker">
            {person.name}
          </h2>
          <span className="text-[12px] text-ink-soft">
            born {formatLong(companion.date)}
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
        <h2 className="kicker">How your charts meet</h2>
        <div className="flex flex-col gap-2">
          {reading.lines.map((line, index) => (
            <ReadingCard key={index} line={line} />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="quiet" onClick={onChangePerson}>
          Change person
        </Button>
        <Link
          href="/dates/"
          className="tap-target text-[12px] text-ink-soft hover:text-ink"
        >
          Find a day that suits you both &rarr;
        </Link>
      </div>
    </div>
  );
}
