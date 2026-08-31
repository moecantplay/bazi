/**
 * The ten years of one luck decade, as a vertical snap-scroll rail beside
 * that year's reading — Cycles' decade → year → month drill-down's second
 * level. Replaces the old horizontal AnnualRow strip, whose overflow-x-auto
 * clipped years at the card edge with no scroll affordance; ScrollCarousel's
 * spacer/mask/snap mechanics fix that structurally rather than patching the
 * symptom. Years outside the engine's 1900-2100 range are omitted rather
 * than allowed to throw, same as AnnualRow before it.
 */

"use client";

import { annualPillar, type Pillar } from "@daymaster/bazi-engine";
import { describeBranch, describeStem, MAX_BIRTH_YEAR, MIN_BIRTH_YEAR } from "@daymaster/presentation";
import { AnimalIcon } from "@/components/glyph-icon";
import { ScrollCarousel } from "@/components/scroll-carousel";

interface AnnualYear {
  year: number;
  pillar: Pillar;
}

function annualYears(startYear: number): AnnualYear[] {
  const years: AnnualYear[] = [];
  for (let year = startYear; year < startYear + 10; year += 1) {
    if (year < MIN_BIRTH_YEAR || year > MAX_BIRTH_YEAR) {
      continue;
    }
    try {
      years.push({ year, pillar: annualPillar(year) });
    } catch {
      // Out of the engine's supported span: skip this year silently.
    }
  }
  return years;
}

const ITEM_HEIGHT = 56;

interface Props {
  startYear: number;
  currentYear: number;
  activeYear: number;
  onSelect: (year: number) => void;
}

export function YearPicker({ startYear, currentYear, activeYear, onSelect }: Props) {
  const years = annualYears(startYear);
  if (years.length === 0) {
    return null;
  }
  const activeIndex = Math.max(
    0,
    years.findIndex((y) => y.year === activeYear)
  );

  return (
    <div className="h-[258px] w-[84px] flex-none" data-year-picker>
      <ScrollCarousel
        items={years}
        itemKey={(y) => y.year}
        axis="y"
        itemSize={ITEM_HEIGHT}
        activeIndex={activeIndex}
        onActiveChange={(index) => {
          const picked = years[index];
          if (picked) {
            onSelect(picked.year);
          }
        }}
        aria-label="Pick a year"
        renderItem={({ year, pillar }) => {
          const stem = describeStem(pillar.stem);
          const branch = describeBranch(pillar.branch);
          return (
            <span
              className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl bg-surface shadow-card"
              title={`${stem.pinyin} ${branch.pinyin} · ${stem.gloss} ${branch.gloss}`}
            >
              <span className="font-display text-[15px] leading-none text-ink">{year}</span>
              <span className="flex items-center gap-1">
                <AnimalIcon animal={branch.gloss} element={branch.element} size={12} />
                <span className="text-[9px] font-mono uppercase tracking-wide text-ink-soft">{branch.gloss}</span>
              </span>
            </span>
          );
        }}
        renderNowMarker={({ year }) =>
          year === currentYear ? (
            <span className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal-amber" aria-hidden />
          ) : null
        }
      />
    </div>
  );
}
