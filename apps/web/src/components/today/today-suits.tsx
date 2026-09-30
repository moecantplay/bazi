/**
 * What the day suits (VOICE.md rule 12, M20-21 R6), the same in every look: a
 * plain heading for the day type, Favors and Watch chips, one reason for the
 * Watch group, all ten activities behind a disclosure, and the date finder.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import type { GuidanceChip } from "@daymaster/presentation";
import { ActivityManifest, useActivityTerrain } from "@/components/activity-terrain";
import { TokenText } from "@/components/token-text";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

function ChipRow({ label, chips, tone }: { label: string; chips: GuidanceChip[]; tone: "favors" | "watch" }) {
  if (chips.length === 0) {
    return null;
  }
  return (
    <div className="suits-row">
      <span className={`suits-lean suits-lean-${tone}`}>{label}</span>
      {chips.map((chip) => (
        <span key={chip.activity} className={`suits-chip suits-chip-${tone}`}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}

export function TodaySuits({ screen }: Props) {
  const [allOpen, setAllOpen] = useState(false);
  const { suits, guidance } = screen.model;
  const cells = useActivityTerrain(guidance.quality.assessments);
  const favors = suits.chips.filter((chip) => chip.leaning === "favors");
  const watch = suits.chips.filter((chip) => chip.leaning === "friction");

  return (
    <section data-guidance className="suits">
      <p className="kicker">What the day suits</p>
      <h3 className="suits-heading">
        <TokenText line={suits.heading} />
      </h3>
      <ChipRow label="Favors" chips={favors} tone="favors" />
      <ChipRow label="Watch" chips={watch} tone="watch" />
      {suits.watchReason && (
        <p data-watch-reason className="text-[14px] leading-relaxed text-ink-soft">
          <TokenText line={suits.watchReason} />
        </p>
      )}
      <button type="button" aria-expanded={allOpen} onClick={() => setAllOpen((open) => !open)} className="look-disclosure">
        {allOpen ? "Hide the ten activities" : "All ten activities"}
        <span aria-hidden className="look-disclosure-chevron">
          &rsaquo;
        </span>
      </button>
      {allOpen && <ActivityManifest cells={cells} />}
      <Link href="/dates/" className="tap-target self-start text-[13px] text-ink-soft hover:text-ink">
        Find a day for something &rarr;
      </Link>
    </section>
  );
}
