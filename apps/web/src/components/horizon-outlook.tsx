/**
 * The Cycles horizon sections: "This year" (流年) and "This month" (流月), each
 * carrying its transit pillar glyphs and the outlook lines the content layer
 * phrases from the horizon facts. Sits above the decade timeline; styled like
 * the timeline's cards. Deterministic in the profile and the transit pillars.
 */

"use client";

import { useMemo } from "react";
import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { PillarGlyph } from "@/components/pillar-glyph";
import { useHanCharacters } from "@/components/han-characters-provider";
import { todayLabel } from "@/lib/dates";
import { horizonBundleFor } from "@/lib/horizons";
import type { StoredProfile } from "@/lib/profile";

function HorizonLines({ lines }: { lines: ReadingLine[] }) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  return (
    <ul className="mt-3 flex flex-col gap-2.5">
      {lines.map((line, index) => (
        <li key={index}>
          {line.factTag && (
            <p data-fact-tag className="text-[12px] text-ink-soft">
              {display(line.factTag)}
            </p>
          )}
          <p className={`text-[14px] leading-relaxed text-ink ${line.factTag ? "mt-0.5" : ""}`}>
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
    <section className="flex flex-col gap-4">
      <div data-horizon="year" className="rounded-xl border border-hairline bg-paper-raised p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">This year</h2>
          <PillarGlyph pillar={bundle.annualPillar} size="sm" />
        </div>
        <HorizonLines lines={bundle.annual} />
      </div>
      <div data-horizon="month" className="rounded-xl border border-hairline bg-paper-raised p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
            This month
          </h2>
          <PillarGlyph pillar={bundle.monthlyPillar} size="sm" />
        </div>
        <HorizonLines lines={bundle.monthly} />
      </div>
    </section>
  );
}
