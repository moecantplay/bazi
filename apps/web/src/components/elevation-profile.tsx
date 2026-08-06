/**
 * The seven-day elevation profile (DESIGN.md §Surfaces), replacing the old
 * week-strip bars: today plus the next six days, each day's summed dayTone
 * plotted as elevation on a dashed line — favoured days sit higher, friction
 * days sit lower — with that day's own animal glyph riding its point. Today
 * renders solid in the anchor pair; the rest fade with distance from today.
 * Tapping a day jumps the reading below to it, same interaction as before.
 *
 * The fade applies to the animal glyph only, not the weekday/day-number
 * label below it: fading the whole button (as DESIGN.md's "animal
 * opacity/emphasis fading" could be read to imply) took the 8px label's
 * ink-soft-on-surface contrast from a passing ~5:1 down to well under 2:1 at
 * the lower fade steps — checked live against the built app across all 5
 * terrains × both themes, not just the design-system prototype's fixed
 * opacity examples. The label needs to stay legible at every distance; only
 * the glyph is decorative enough to recede.
 */

"use client";

import { useMemo, useState } from "react";
import { dailyPillar } from "@daymaster/bazi-engine";
import { WEEK_TOPIC, glossaryEntry } from "@daymaster/content";
import { GlossarySheet } from "@/components/glossary-sheet";
import { AnimalGlyphMark, AnimalIcon } from "@/components/glyph-icon";
import { addDays, formatLong } from "@/lib/dates";
import { describeBranch } from "@/lib/display";
import { dayTone, type DayTone } from "@/lib/day-tone";
import type { StoredProfile } from "@/lib/profile";

const WEEK_LENGTH = 7;

const TONE_WORD: Record<DayTone, string> = {
  favoured: "leans favorable",
  friction: "leans toward friction",
  even: "even day"
};

/** Elevation (percent from the top) for each tone — favoured is higher. */
const TONE_Y: Record<DayTone, number> = {
  favoured: 22,
  even: 50,
  friction: 78
};

function weekdayInitial(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", weekday: "narrow" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

interface Cell {
  iso: string;
  tone: DayTone;
  animal: string;
  element: ReturnType<typeof describeBranch>["element"];
  x: number;
  y: number;
}

interface Props {
  profile: StoredProfile;
  today: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}

export function ElevationProfile({ profile, today, selectedISO, onSelect }: Props) {
  const [legendOpen, setLegendOpen] = useState(false);
  const legendEntry = glossaryEntry(WEEK_TOPIC);
  const zone = profile.birth.city.tz;

  const cells = useMemo<Cell[]>(
    () =>
      Array.from({ length: WEEK_LENGTH }, (_, index) => {
        const iso = addDays(today, index);
        const tone = dayTone(profile, iso);
        const branch = describeBranch(dailyPillar(iso, zone).branch);
        return {
          iso,
          tone,
          animal: branch.gloss,
          element: branch.element,
          x: ((index + 0.5) / WEEK_LENGTH) * 100,
          y: TONE_Y[tone]
        };
      }),
    [profile, today, zone]
  );

  const pathD = cells.map((cell, index) => `${index === 0 ? "M" : "L"}${cell.x} ${cell.y}`).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <p className="kicker">Next 7 days · elevation</p>
      <div className="relative h-24 rounded-card bg-surface p-2 shadow-card">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0"
        >
          <path
            d={pathD}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.6"
            strokeDasharray="3 3.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ul className="relative h-full list-none" aria-label="The week ahead">
          {cells.map((cell, index) => {
            const isToday = cell.iso === today;
            const isSelected = cell.iso === selectedISO;
            const opacity = Math.max(0.4, 1 - index * 0.12);
            const dayNumber = Number(cell.iso.slice(8, 10));
            const suffix = isToday ? ", today" : "";
            return (
              <li
                key={cell.iso}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
                style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(cell.iso)}
                  aria-pressed={isSelected}
                  title={TONE_WORD[cell.tone]}
                  aria-label={`${formatLong(cell.iso)}${suffix} — ${TONE_WORD[cell.tone]}`}
                  className={`flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-full ${
                    isSelected && !isToday ? "shadow-[inset_0_0_0_2px_var(--ink)]" : ""
                  }`}
                >
                  <span style={{ opacity: isToday ? 1 : opacity }}>
                    {isToday ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-anchor text-paper">
                        <svg width={15} height={15} viewBox="0 0 24 24" role="img" aria-label={cell.animal}>
                          <AnimalGlyphMark animal={cell.animal} />
                        </svg>
                      </span>
                    ) : (
                      <AnimalIcon animal={cell.animal} element={cell.element} size={18} />
                    )}
                  </span>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-wide text-ink-soft">
                    {weekdayInitial(cell.iso)}{dayNumber}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {legendEntry && (
        <>
          <button
            type="button"
            data-week-legend
            onClick={() => setLegendOpen(true)}
            className="tap-target mx-auto block px-3 py-2 text-[12px] text-ink-soft hover:text-ink active:text-ink"
          >
            What the marks mean &rsaquo;
          </button>
          {legendOpen && <GlossarySheet entry={legendEntry} onClose={() => setLegendOpen(false)} />}
        </>
      )}
    </div>
  );
}
