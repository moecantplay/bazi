/**
 * The four-pillar hero grid, laid out left-to-right for LTR readers as
 * Year - Month - Day - Hour (the traditional right-to-left order flipped, and
 * labeled clearly). The Day column carries an ink underline: it's you. An
 * unknown birth time renders the Hour column as an empty frame, never fake data.
 *
 * When `tenGods` is supplied (the chart screen), each non-day stem gets a small
 * ten-god caption; the onboarding reveal omits it. `lifeStages`, `naYin`, and
 * `stars` likewise add chart-screen detail captions when provided — every
 * system term carries its plain-meaning gloss inline (VOICE.md §11).
 *
 * With Chinese characters turned off (Settings), the English gloss takes the
 * character's place as the readable word and captions drop their Han.
 */

"use client";

import type {
  ChartLifeStages,
  ChartNaYin,
  ChartTenGods,
  Pillar,
  PillarLifeStages,
  NaYin,
  ShenshaHit,
  TenGod,
} from "@daymaster/bazi-engine";
import { LIFE_STAGE_GLOSSES, STAR_GLOSSES, TEN_GOD_GLOSSES } from "@daymaster/content";
import type { ChartPillars } from "@/lib/pillars";
import { describeBranch, describeStem } from "@/lib/display";
import { useHanCharacters } from "@/components/han-characters-provider";

interface ColumnSpec {
  label: string;
  palace: string;
  pillar: Pillar | null;
  tenGod?: TenGod | null;
  lifeStages?: PillarLifeStages | null;
  naYin?: NaYin | null;
  stars?: ShenshaHit[];
  isDay?: boolean;
  isHour?: boolean;
}

function Glyph({ char, pinyin, gloss }: { char: string; pinyin: string; gloss: string }) {
  const { showHanCharacters } = useHanCharacters();

  if (!showHanCharacters) {
    return (
      <div className="flex flex-col items-center py-2">
        <span className="text-center text-[16px] font-medium leading-tight text-ink">{gloss}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <span className="font-han text-[44px] leading-none text-ink">{char}</span>
      <span className="mt-1 text-[13px] text-ink-soft">{pinyin}</span>
      <span className="text-[13px] text-ink-soft">{gloss}</span>
    </div>
  );
}

/** A small named caption ("stage 墓 Storage") with a plain-meaning tooltip. */
function DetailCaption({ label, title }: { label: string; title?: string }) {
  return (
    <span className="text-center text-[10px] leading-tight text-ink-soft" title={title}>
      {label}
    </span>
  );
}

/**
 * Each column is a subgrid spanning the parent's six shared rows (header /
 * stem / ten-god / branch / details / you-marker), so a column missing a
 * ten-god caption (the Day pillar) or wrapping a longer gloss never pushes
 * its branch out of line with its neighbours.
 */
function Column({
  label,
  palace,
  pillar,
  tenGod,
  lifeStages,
  naYin,
  stars,
  isDay,
  isHour,
}: ColumnSpec) {
  const { showHanCharacters } = useHanCharacters();
  const stem = pillar ? describeStem(pillar.stem) : null;
  const branch = pillar ? describeBranch(pillar.branch) : null;

  return (
    <div
      data-pillar={label.toLowerCase()}
      className="grid grid-rows-subgrid row-span-6 justify-items-center gap-y-0"
    >
      <div className="flex flex-col items-center pb-3">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="text-[11px] font-medium text-ink-soft">{palace}</span>
      </div>

      {pillar && stem && branch ? (
        <>
          <Glyph char={pillar.stem} pinyin={stem.pinyin} gloss={stem.gloss} />
          <div className="pb-4 pt-1.5">
            {tenGod && (
              <span className="flex flex-col text-center text-[10px] leading-tight text-ink-soft">
                <span>
                  {showHanCharacters ? `${tenGod.english} ${tenGod.chinese}` : tenGod.english}
                </span>
                {TEN_GOD_GLOSSES[tenGod.english] && (
                  <span className="italic">{TEN_GOD_GLOSSES[tenGod.english]}</span>
                )}
              </span>
            )}
          </div>
          <Glyph char={pillar.branch} pinyin={branch.pinyin} gloss={branch.gloss} />
          <div className="pt-4">
            {(lifeStages || naYin || (stars && stars.length > 0)) && (
              <div className="flex flex-col items-center gap-1">
                {lifeStages && (
                  <DetailCaption
                    label={
                      showHanCharacters
                        ? `stage ${lifeStages.dayMaster.chinese} ${lifeStages.dayMaster.english}`
                        : `stage ${lifeStages.dayMaster.english}`
                    }
                    title={LIFE_STAGE_GLOSSES[lifeStages.dayMaster.english]}
                  />
                )}
                {naYin && (
                  <DetailCaption
                    label={
                      showHanCharacters
                        ? `sound ${naYin.chinese} ${naYin.english}`
                        : `sound ${naYin.english}`
                    }
                  />
                )}
                {stars?.map((star) => (
                  <DetailCaption
                    key={star.key}
                    label={showHanCharacters ? `${star.chinese} ${star.english}` : star.english}
                    title={STAR_GLOSSES[star.key]}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="row-span-4 flex min-h-[168px] w-full items-center justify-center self-stretch rounded-lg border border-dashed border-hairline px-2 text-center text-[13px] text-ink-soft">
          {isHour ? "hour unknown" : ""}
        </div>
      )}

      <div className="pt-3">
        {isDay && (
          <div className="flex flex-col items-center">
            <span className="h-0.5 w-8 rounded-full bg-ink" aria-hidden />
            <span className="mt-1 text-[11px] text-ink-soft">you</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  pillars: ChartPillars;
  className?: string;
  tenGods?: ChartTenGods;
  lifeStages?: ChartLifeStages;
  naYin?: ChartNaYin;
  /** Natal star hits; each is rendered under the pillar it lands on. */
  stars?: ShenshaHit[];
}

export function PillarColumns({ pillars, className, tenGods, lifeStages, naYin, stars }: Props) {
  const starsFor = (palace: string) => stars?.filter((hit) => hit.palace === palace);
  const columns: ColumnSpec[] = [
    {
      label: "Year",
      palace: "roots",
      pillar: pillars.year,
      tenGod: tenGods?.year,
      lifeStages: lifeStages?.year,
      naYin: naYin?.year,
      stars: starsFor("year"),
    },
    {
      label: "Month",
      palace: "career",
      pillar: pillars.month,
      tenGod: tenGods?.month,
      lifeStages: lifeStages?.month,
      naYin: naYin?.month,
      stars: starsFor("month"),
    },
    {
      label: "Day",
      palace: "home",
      pillar: pillars.day,
      isDay: true,
      lifeStages: lifeStages?.day,
      naYin: naYin?.day,
      stars: starsFor("day"),
    },
    {
      label: "Hour",
      palace: "horizon",
      pillar: pillars.hour,
      tenGod: tenGods?.hour,
      isHour: true,
      lifeStages: lifeStages?.hour,
      naYin: naYin?.hour,
      stars: starsFor("hour"),
    },
  ];

  return (
    <div
      className={`grid w-full grid-cols-4 grid-rows-[repeat(6,auto)] gap-x-2 ${className ?? ""}`.trim()}
    >
      {columns.map((column) => (
        <Column key={column.label} {...column} />
      ))}
    </div>
  );
}
