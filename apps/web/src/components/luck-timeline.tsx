/**
 * The luck-cycle (大运) timeline: a vertical rail with one node per luck pillar.
 * The decade containing today is raised as a card with element-accent tags and
 * the ten annual pillars of that decade. Before the first pillar begins, a quiet
 * line names the year it starts and nothing is highlighted.
 */

"use client";

import type { Chart, Element, LuckPillar } from "@daymaster/bazi-engine";
import { LUCK_PILLAR_GLOSS } from "@daymaster/content";
import { describeBranch, describeStem } from "@/lib/display";
import { useHanCharacters } from "@/components/han-characters-provider";
import { ELEMENT_LABEL, ELEMENT_SWATCH_CLASS } from "@/lib/elements";
import { AnnualRow } from "./annual-row";

function metaLine(luck: LuckPillar): string {
  const stem = describeStem(luck.pillar.stem);
  const branch = describeBranch(luck.pillar.branch);
  return `${stem.pinyin} ${stem.element} · ${branch.pinyin} ${branch.element}`;
}

function ElementTag({ element }: { element: Element }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2 py-1 text-[11px] text-ink-soft">
      <span className={`h-2.5 w-2.5 rounded-sm ${ELEMENT_SWATCH_CLASS[element]}`} aria-hidden />
      {ELEMENT_LABEL[element]}
    </span>
  );
}

function Spans({ luck }: { luck: LuckPillar }) {
  return (
    <div className="text-right text-[12px] leading-tight text-ink-soft">
      <div>
        age {luck.startAge}&ndash;{luck.startAge + 9}
      </div>
      <div>
        {luck.startYear}&ndash;{luck.startYear + 9}
      </div>
    </div>
  );
}

/** The pillar's readable name when characters are off: "yang wood · horse". */
function glossPair(luck: LuckPillar): string {
  return `${describeStem(luck.pillar.stem).gloss} · ${describeBranch(luck.pillar.branch).gloss}`;
}

function CurrentCard({ luck, currentYear }: { luck: LuckPillar; currentYear: number }) {
  const { showHanCharacters } = useHanCharacters();
  const stemElement = describeStem(luck.pillar.stem).element;
  const branchElement = describeBranch(luck.pillar.branch).element;

  return (
    <div className="rounded-xl border border-hairline bg-paper-raised dark-borderless p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-wide text-ink-soft">Current decade</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          {showHanCharacters ? (
            <span className="font-han text-4xl leading-none text-ink">
              {luck.pillar.stem}
              {luck.pillar.branch}
            </span>
          ) : (
            <span className="font-display text-xl leading-tight text-ink">{glossPair(luck)}</span>
          )}
          <p className="mt-2 text-[12px] text-ink-soft">{metaLine(luck)}</p>
        </div>
        <Spans luck={luck} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <ElementTag element={stemElement} />
        {branchElement !== stemElement && <ElementTag element={branchElement} />}
      </div>
      <div className="mt-4">
        <AnnualRow startYear={luck.startYear} currentYear={currentYear} />
      </div>
    </div>
  );
}

function PlainNode({ luck }: { luck: LuckPillar }) {
  const { showHanCharacters } = useHanCharacters();
  return (
    <div className="flex items-start justify-between gap-3 pb-1">
      <div>
        {showHanCharacters ? (
          <span className="font-han text-2xl leading-none text-ink">
            {luck.pillar.stem}
            {luck.pillar.branch}
          </span>
        ) : (
          <span className="font-display text-[17px] leading-tight text-ink">
            {glossPair(luck)}
          </span>
        )}
        <p className="mt-1.5 text-[12px] text-ink-soft">{metaLine(luck)}</p>
      </div>
      <Spans luck={luck} />
    </div>
  );
}

interface Props {
  chart: Chart;
  now?: Date;
}

export function LuckTimeline({ chart, now = new Date() }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const currentYear = now.getFullYear();
  const luckPillars = chart.luckPillars;
  const first = luckPillars[0];

  let currentIndex = -1;
  luckPillars.forEach((luck, index) => {
    if (luck.startYear <= currentYear) {
      currentIndex = index;
    }
  });
  const beforeFirst = currentIndex === -1;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[13px] leading-relaxed text-ink-soft">
        Each node is one luck pillar — {LUCK_PILLAR_GLOSS}. Yours begin{" "}
        {chart.luckStart.years} years, {chart.luckStart.months} months, and {chart.luckStart.days}{" "}
        days after birth{showHanCharacters && " (起運)"}, from the classical count of days to the
        nearest seasonal marker.
      </p>
      {beforeFirst && first && (
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Your first luck pillar begins in {first.startYear}. Until then, the natal chart is the
          whole picture.
        </p>
      )}

      <ol className="flex flex-col">
        {luckPillars.map((luck, index) => {
          const isCurrent = !beforeFirst && index === currentIndex;
          const isLast = index === luckPillars.length - 1;
          return (
            <li key={luck.startYear} className="flex gap-4">
              <div className="flex flex-col items-center pt-1.5">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isCurrent ? "bg-ink" : "border border-ink-soft bg-paper"
                  }`}
                  aria-hidden
                />
                {!isLast && <span className="w-px flex-1 bg-hairline" aria-hidden />}
              </div>
              <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                {isCurrent ? (
                  <CurrentCard luck={luck} currentYear={currentYear} />
                ) : (
                  <PlainNode luck={luck} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
