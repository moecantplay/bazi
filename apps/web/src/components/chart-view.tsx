/**
 * The Chart screen, shallow to deep: seal, the day-master archetype (the
 * anchor a first-time reader needs), the four-pillar hero with per-stem ten
 * gods (stage/sound/star captions behind a detail toggle), the five-element
 * balance, favorable elements, then the structural interactions and stars as
 * collapsed sections. Prose comes from the content package; the UI adds only
 * headings and the data visualizations.
 */

"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  DAY_MASTER_GLOSS,
  LIFE_STAGE_GLOSS,
  NAYIN_GLOSS,
  stripHanCharacters
} from "@daymaster/content";
import type { ReadingSection, ReadingSectionKey } from "@daymaster/content";
import { describeBranch, describeStem } from "@/lib/display";
import { useHanCharacters } from "@/components/han-characters-provider";
import { PillarColumns } from "@/components/pillar-columns";
import { Seal } from "@/components/seal";
import { ElementBalance } from "@/components/element-balance";
import { ElementChips } from "@/components/element-chips";
import { ReadingCard } from "@/components/reading-card";
import { ShareActions } from "@/components/share-actions";
import { chartFor } from "@/lib/chart";
import { natalReadingFor } from "@/lib/reading";
import type { StoredProfile } from "@/lib/profile";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="kicker">{children}</h2>
  );
}

/** A collapsed-by-default section: the heading is the disclosure control. */
function CollapsibleSection({
  title,
  count,
  children
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="text-[11px] text-ink-soft transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <h2 className="kicker">
          {title} · {count}
        </h2>
      </summary>
      <div className="mt-3 flex flex-col divide-y divide-hairline">{children}</div>
    </details>
  );
}

function Prose({ section }: { section: ReadingSection }) {
  const { showHanCharacters } = useHanCharacters();
  return (
    <div className="flex flex-col gap-3">
      {section.lines.map((line, index) => (
        <p key={index} className="text-[15px] leading-relaxed text-ink">
          {showHanCharacters ? line.text : stripHanCharacters(line.text)}
        </p>
      ))}
    </div>
  );
}

interface Props {
  profile: StoredProfile;
}

export function ChartView({ profile }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));
  const chart = chartFor(profile);
  const reading = natalReadingFor(profile);
  const sectionOf = (key: ReadingSectionKey): ReadingSection | undefined =>
    reading.sections.find((section) => section.key === key);

  const pillars = { year: chart.year, month: chart.month, day: chart.day, hour: chart.hour };

  const dayMaster = sectionOf("day-master");
  const elements = sectionOf("elements");
  const suits = sectionOf("favorable");
  const structure = sectionOf("structure");
  const stars = sectionOf("stars");

  const [archetype, ...dayMasterRest] = dayMaster?.lines ?? [];
  const taiYuanStem = describeStem(chart.taiYuan.stem);
  const taiYuanBranch = describeBranch(chart.taiYuan.branch);
  const [pillarDetailOpen, setPillarDetailOpen] = useState(false);
  const sealContainerRef = useRef<HTMLDivElement>(null);

  const presentPillars = [chart.year, chart.month, chart.day, chart.hour].filter(
    (pillar) => pillar !== null
  );
  const pillarLine = presentPillars
    .map((pillar) =>
      showHanCharacters
        ? `${pillar.stem}${pillar.branch}`
        : `${describeStem(pillar.stem).gloss} ${describeBranch(pillar.branch).gloss}`
    )
    .join(" · ");

  return (
    <div className="flex flex-col gap-10">
      <div ref={sealContainerRef} className="flex justify-center">
        <Seal pillars={[chart.year, chart.month, chart.day, chart.hour]} />
      </div>

      {dayMaster && archetype && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <Heading>Your day-master</Heading>
            <p className="text-[12px] text-ink-soft">{DAY_MASTER_GLOSS}</p>
          </div>
          <p className="font-display text-2xl leading-snug text-ink">{display(archetype.text)}</p>
          {dayMasterRest.map((line, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-ink">
              {display(line.text)}
            </p>
          ))}
        </section>
      )}

      <div className="flex flex-col gap-3">
        <PillarColumns
          pillars={pillars}
          tenGods={chart.tenGods}
          lifeStages={pillarDetailOpen ? chart.lifeStages : undefined}
          naYin={pillarDetailOpen ? chart.naYin : undefined}
          stars={pillarDetailOpen ? chart.shensha : undefined}
        />
        {pillarDetailOpen && (
          <p className="text-center text-[11px] leading-relaxed text-ink-soft">
            stage = {LIFE_STAGE_GLOSS}; sound = {NAYIN_GLOSS}. Named lines below each pillar are
            its stars — motifs your chart keeps returning to.
          </p>
        )}
        <button
          type="button"
          aria-expanded={pillarDetailOpen}
          onClick={() => setPillarDetailOpen((open) => !open)}
          className="self-center text-[12px] text-ink-soft hover:text-ink"
        >
          {pillarDetailOpen ? "Hide pillar detail" : "More pillar detail →"}
        </button>
      </div>

      <section className="flex flex-col gap-4">
        <Heading>{elements?.title ?? "Your elements"}</Heading>
        <ElementBalance counts={chart.fiveElementCounts} />
        {elements && <Prose section={elements} />}
      </section>

      {chart.favorableElements.length > 0 && (
        <section className="flex flex-col gap-4">
          <Heading>{suits?.title ?? "What tends to suit you"}</Heading>
          <ElementChips elements={chart.favorableElements} />
          {suits && <Prose section={suits} />}
        </section>
      )}

      {structure && structure.lines.length > 0 && (
        <section>
          <CollapsibleSection title={structure.title} count={structure.lines.length}>
            {structure.lines.map((line, index) => (
              <ReadingCard key={index} line={line} />
            ))}
          </CollapsibleSection>
        </section>
      )}

      {stars && stars.lines.length > 0 && (
        <section>
          <CollapsibleSection title={stars.title} count={stars.lines.length}>
            {stars.lines.map((line, index) => (
              <ReadingCard key={index} line={line} />
            ))}
          </CollapsibleSection>
        </section>
      )}

      {archetype && (
        <ShareActions
          sealContainerRef={sealContainerRef}
          pillarLine={pillarLine}
          archetype={display(archetype.text)}
          birth={profile.birth}
        />
      )}

      <p className="text-[12px] leading-relaxed text-ink-soft">
        Conception pillar{showHanCharacters && " (胎元)"} — the classical estimate of the month
        you were conceived:{" "}
        {showHanCharacters && (
          <>
            <span className="font-han text-ink">
              {chart.taiYuan.stem}
              {chart.taiYuan.branch}
            </span>{" "}
          </>
        )}
        {taiYuanStem.pinyin} {taiYuanStem.element} · {taiYuanBranch.pinyin}{" "}
        {taiYuanBranch.element}.
      </p>
    </div>
  );
}
