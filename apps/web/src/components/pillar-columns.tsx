/**
 * The four-pillar hero grid, laid out left-to-right for LTR readers as
 * Year - Month - Day - Hour (the traditional right-to-left order flipped, and
 * labeled clearly). The Day column carries an ink underline: it's you. An
 * unknown birth time renders the Hour column as an empty frame, never fake data.
 *
 * When `tenGods` is supplied (the chart screen), each non-day stem gets a small
 * ten-god caption; the onboarding reveal omits it.
 */

import type { ChartTenGods, Pillar, TenGod } from "@daymaster/bazi-engine";
import { TEN_GOD_GLOSSES } from "@daymaster/content";
import type { ChartPillars } from "@/lib/pillars";
import { describeBranch, describeStem } from "@/lib/display";

interface ColumnSpec {
  label: string;
  palace: string;
  pillar: Pillar | null;
  tenGod?: TenGod | null;
  isDay?: boolean;
  isHour?: boolean;
}

function Glyph({ char, pinyin, gloss }: { char: string; pinyin: string; gloss: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-han text-[44px] leading-none text-ink">{char}</span>
      <span className="mt-1 text-[13px] text-ink-soft">{pinyin}</span>
      <span className="text-[13px] text-ink-soft">{gloss}</span>
    </div>
  );
}

function Column({ label, palace, pillar, tenGod, isDay, isHour }: ColumnSpec) {
  const stem = pillar ? describeStem(pillar.stem) : null;
  const branch = pillar ? describeBranch(pillar.branch) : null;

  return (
    <div data-pillar={label.toLowerCase()} className="flex flex-1 flex-col items-center gap-3">
      <div className="flex flex-col items-center">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="text-[11px] uppercase tracking-wide text-ink-soft">{palace}</span>
      </div>

      {pillar && stem && branch ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <Glyph char={pillar.stem} pinyin={stem.pinyin} gloss={stem.gloss} />
            {tenGod && (
              <span className="mt-1.5 flex flex-col text-center text-[10px] leading-tight text-ink-soft">
                <span>
                  {tenGod.english} {tenGod.chinese}
                </span>
                {TEN_GOD_GLOSSES[tenGod.english] && (
                  <span className="italic">{TEN_GOD_GLOSSES[tenGod.english]}</span>
                )}
              </span>
            )}
          </div>
          <Glyph char={pillar.branch} pinyin={branch.pinyin} gloss={branch.gloss} />
        </div>
      ) : (
        <div className="flex min-h-[168px] w-full items-center justify-center rounded-lg border border-dashed border-hairline px-2 text-center text-[13px] text-ink-soft">
          {isHour ? "hour unknown" : ""}
        </div>
      )}

      {isDay && (
        <div className="flex flex-col items-center">
          <span className="h-0.5 w-8 rounded-full bg-ink" aria-hidden />
          <span className="mt-1 text-[11px] text-ink-soft">you</span>
        </div>
      )}
    </div>
  );
}

interface Props {
  pillars: ChartPillars;
  className?: string;
  tenGods?: ChartTenGods;
}

export function PillarColumns({ pillars, className, tenGods }: Props) {
  const columns: ColumnSpec[] = [
    { label: "Year", palace: "roots", pillar: pillars.year, tenGod: tenGods?.year },
    { label: "Month", palace: "career", pillar: pillars.month, tenGod: tenGods?.month },
    { label: "Day", palace: "home", pillar: pillars.day, isDay: true },
    { label: "Hour", palace: "horizon", pillar: pillars.hour, tenGod: tenGods?.hour, isHour: true }
  ];

  return (
    <div className={`flex w-full items-start gap-2 ${className ?? ""}`.trim()}>
      {columns.map((column) => (
        <Column key={column.label} {...column} />
      ))}
    </div>
  );
}
