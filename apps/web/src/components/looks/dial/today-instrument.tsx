/** Today in Instrument (stored id `dial`): DESIGN.md v5 §Instrument. */

"use client";

import { readingSections } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";
import { Headline, dayMeta } from "@/components/today/headline";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { ReadingChapters } from "@/components/today/reading-chapters";
import { TodayDateNav, TodayDateNotes } from "@/components/today/today-date-nav";
import { AboutReadingLink, TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { WeekLegendLink } from "@/components/week-legend-link";
import { DayDial, DialKey } from "./day-dial";
import { WeekRings } from "./week-rings";

interface Props {
  screen: TodayScreen;
}

export function TodayInstrument({ screen }: Props) {
  const { model } = screen;
  const sections = readingSections(model.reading.lines, model.grainLine);

  return (
    <div className="flex flex-col gap-5 pt-3">
      <div className="arrive-rise -ml-3 flex items-center justify-between">
        <TodayDateNav screen={screen} />
        <span className="caption truncate pl-2">{dayMeta(model.stem.gloss, model.branch.gloss)}</span>
      </div>
      <div className="arrive-rise flex flex-col gap-4" style={{ ["--d" as string]: 1 }}>
        <WeekRings profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
        <WeekLegendLink />
      </div>
      <DayDial screen={screen} />
      <div className="arrive-rise" style={{ ["--d" as string]: 4 }}>
        <DialKey screen={screen} />
      </div>
      <TodayDateNotes screen={screen} />
      <Headline runs={model.headline} className="arrive-rise text-[31px]" />
      {model.grainLine && (
        <p className="arrive-rise text-[16px] leading-relaxed text-ink" style={{ ["--d" as string]: 6 }}>
          <TokenText line={model.grainLine.runs} />
        </p>
      )}
      <div className="arrive-rise" style={{ ["--d" as string]: 7 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <ReadingChapters sections={sections} suits={<TodaySuits screen={screen} />} />
      <AboutReadingLink />
      <TodayFooter screen={screen} />
    </div>
  );
}
