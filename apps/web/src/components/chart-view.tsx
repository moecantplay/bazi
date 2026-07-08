/**
 * The Chart screen: seal, the four-pillar hero (with per-stem ten gods), the
 * day-master archetype, the five-element balance, favorable elements, and the
 * chart's structural interactions. Prose comes from the content package; the UI
 * adds only headings and the data visualizations.
 */

"use client";

import { DAY_MASTER_GLOSS, LIFE_STAGE_GLOSS, NAYIN_GLOSS } from "@daymaster/content";
import type { ReadingSection, ReadingSectionKey } from "@daymaster/content";
import { describeBranch, describeStem } from "@/lib/display";
import { PillarColumns } from "@/components/pillar-columns";
import { Seal } from "@/components/seal";
import { ElementBalance } from "@/components/element-balance";
import { ElementChips } from "@/components/element-chips";
import { ReadingCard } from "@/components/reading-card";
import { chartFor } from "@/lib/chart";
import { natalReadingFor } from "@/lib/reading";
import type { StoredProfile } from "@/lib/profile";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">{children}</h2>
  );
}

function Prose({ section }: { section: ReadingSection }) {
  return (
    <div className="flex flex-col gap-3">
      {section.lines.map((line, index) => (
        <p key={index} className="text-[15px] leading-relaxed text-ink">
          {line.text}
        </p>
      ))}
    </div>
  );
}

interface Props {
  profile: StoredProfile;
}

export function ChartView({ profile }: Props) {
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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <Seal pillars={[chart.year, chart.month, chart.day, chart.hour]} />
      </div>

      <div className="flex flex-col gap-3">
        <PillarColumns
          pillars={pillars}
          tenGods={chart.tenGods}
          lifeStages={chart.lifeStages}
          naYin={chart.naYin}
          stars={chart.shensha}
        />
        <p className="text-center text-[11px] leading-relaxed text-ink-soft">
          stage = {LIFE_STAGE_GLOSS}; sound = {NAYIN_GLOSS}. Named lines below each pillar are its
          stars — motifs your chart keeps returning to.
        </p>
      </div>

      {dayMaster && archetype && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <Heading>Your day-master</Heading>
            <p className="text-[12px] text-ink-soft">{DAY_MASTER_GLOSS}</p>
          </div>
          <p className="font-display text-2xl leading-snug text-ink">{archetype.text}</p>
          {dayMasterRest.map((line, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-ink">
              {line.text}
            </p>
          ))}
        </section>
      )}

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
        <section className="flex flex-col gap-3">
          <Heading>{structure.title}</Heading>
          {structure.lines.map((line, index) => (
            <ReadingCard key={index} line={line} />
          ))}
        </section>
      )}

      {stars && stars.lines.length > 0 && (
        <section className="flex flex-col gap-3">
          <Heading>{stars.title}</Heading>
          {stars.lines.map((line, index) => (
            <ReadingCard key={index} line={line} />
          ))}
        </section>
      )}

      <p className="text-[12px] leading-relaxed text-ink-soft">
        Conception pillar (胎元) — the classical estimate of the month you were conceived:{" "}
        <span className="font-han text-ink">
          {chart.taiYuan.stem}
          {chart.taiYuan.branch}
        </span>{" "}
        {taiYuanStem.pinyin} {taiYuanStem.element} · {taiYuanBranch.pinyin}{" "}
        {taiYuanBranch.element}.
      </p>
    </div>
  );
}
