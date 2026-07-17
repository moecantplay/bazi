/**
 * The ten annual pillars of one luck decade, as a compact scrollable row of
 * small blocks. The current year is marked with the ink underline the app
 * uses for "this is now". Years outside the engine's 1900-2100 range are
 * omitted rather than allowed to throw. Each block shows only the year's
 * animal — the block is too narrow for more, and the tooltip keeps the
 * full name.
 */

import { annualPillar, type Pillar } from "@daymaster/bazi-engine";
import { describeBranch, describeStem } from "@/lib/display";
import { AnimalIcon } from "@/components/glyph-icon";
import { MAX_BIRTH_YEAR, MIN_BIRTH_YEAR } from "@/lib/pillars";

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

interface Props {
  startYear: number;
  currentYear: number;
}

export function AnnualRow({ startYear, currentYear }: Props) {
  const years = annualYears(startYear);
  if (years.length === 0) {
    return null;
  }

  return (
    <div className="-mx-1 overflow-x-auto">
      <ul className="flex min-w-max gap-1 px-1">
        {years.map(({ year, pillar }) => {
          const isCurrent = year === currentYear;
          return (
            <li key={year} className="flex flex-col items-center gap-1">
              <span className={`text-[11px] ${isCurrent ? "text-ink" : "text-ink-soft"}`}>
                {year}
              </span>
              <span
                className="text-[12px] leading-none text-ink"
                aria-label={`${describeStem(pillar.stem).pinyin} ${describeBranch(pillar.branch).pinyin}`}
                title={`${describeStem(pillar.stem).pinyin} ${describeBranch(pillar.branch).pinyin} · ${describeStem(pillar.stem).gloss} ${describeBranch(pillar.branch).gloss}`}
              >
                <span className="flex flex-col items-center gap-0.5">
                  <AnimalIcon
                    animal={describeBranch(pillar.branch).gloss}
                    element={describeBranch(pillar.branch).element}
                    size={16}
                  />
                  {describeBranch(pillar.branch).gloss}
                </span>
              </span>
              <span
                className={`h-0.5 w-6 rounded-full ${isCurrent ? "bg-ink" : "bg-transparent"}`}
                aria-hidden
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
