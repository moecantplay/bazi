/**
 * The Today guidance block (VOICE.md rule 12): a scannable chip row — "Favors"
 * chips, then "Watch" chips — each naming an activity with its classical
 * category as a small gloss, over the prose lines that explain the day's grain.
 * Chips carry no verdict; the prose stays weather. With Chinese off, chips drop
 * the character and keep the modern label, and the prose renders stripped.
 */

"use client";

import { useMemo } from "react";
import { ReadingCard } from "@/components/reading-card";
import { useHanCharacters } from "@/components/han-characters-provider";
import { dayGuidanceFor, type GuidanceChip } from "@/lib/guidance";
import type { StoredProfile } from "@/lib/profile";

function ChipGroup({ title, chips }: { title: string; chips: GuidanceChip[] }) {
  const { showHanCharacters } = useHanCharacters();
  if (chips.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">{title}</span>
      <ul className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <li
            key={chip.activity}
            className="inline-flex items-baseline gap-1.5 rounded-full border border-hairline bg-paper-raised px-3 py-1"
          >
            <span className="text-[13px] text-ink">{chip.label}</span>
            {showHanCharacters && (
              <span className="font-han text-[12px] text-ink-soft">{chip.chinese}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  profile: StoredProfile;
  dateISO: string;
}

export function GuidanceBlock({ profile, dateISO }: Props) {
  const { chips, lines } = useMemo(() => dayGuidanceFor(profile, dateISO), [profile, dateISO]);
  const favors = chips.filter((chip) => chip.leaning === "favors");
  const watch = chips.filter((chip) => chip.leaning === "friction");

  if (chips.length === 0 && lines.length === 0) {
    return null;
  }

  return (
    <section data-guidance className="flex flex-col gap-4">
      {(favors.length > 0 || watch.length > 0) && (
        <div data-guidance-chips className="flex flex-col gap-3">
          <ChipGroup title="Favors" chips={favors} />
          <ChipGroup title="Watch" chips={watch} />
        </div>
      )}
      {lines.length > 0 && (
        <div className="flex flex-col gap-3">
          {lines.map((line, index) => (
            <ReadingCard key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  );
}
