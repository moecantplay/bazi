/**
 * The Cycles horizon sections: "This year" and "This month", each
 * carrying its transit pillar glyphs and the outlook lines the content layer
 * phrases from the horizon facts. Sits above the decade timeline as ruled
 * prose (DESIGN.md §Surfaces). Deterministic in the profile and the transit
 * pillars.
 */

"use client";

import { useMemo } from "react";
import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { PillarGlyph } from "@/components/pillar-glyph";
import { todayLabel } from "@/lib/dates";
import { horizonBundleFor } from "@/lib/horizons";
import type { StoredProfile } from "@/lib/profile";

function HorizonLines({ lines }: { lines: ReadingLine[] }) {
  const display = (text: string) => stripHanCharacters(text);

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {lines.map((line, index) => (
        <li key={index} className="card p-5">
          <FactTag line={line} />
          <p className={`text-[15px] leading-relaxed text-ink ${line.factTag ? "mt-1" : ""}`}>
            {display(line.text)}
          </p>
        </li>
      ))}
    </ul>
  );
}

interface Props {
  profile: StoredProfile;
  now?: Date;
}

export function HorizonOutlook({ profile, now }: Props) {
  const dateISO = useMemo(() => todayLabel(now), [now]);
  const bundle = useMemo(() => horizonBundleFor(profile, dateISO), [profile, dateISO]);

  return (
    <section className="flex flex-col gap-8">
      <div data-horizon="year">
        <div className="flex items-center justify-between gap-3">
          <h2 className="kicker">This year</h2>
          <PillarGlyph pillar={bundle.annualPillar} size="sm" />
        </div>
        <HorizonLines lines={bundle.annual} />
      </div>
      <div data-horizon="month">
        <div className="flex items-center justify-between gap-3">
          <h2 className="kicker">This month</h2>
          <PillarGlyph pillar={bundle.monthlyPillar} size="sm" />
        </div>
        <HorizonLines lines={bundle.monthly} />
      </div>
    </section>
  );
}
