/** Today in Instrument (stored id `dial`): DESIGN.md v5 §Instrument, composed per M20-21. */

"use client";

import { MARKS_TOPIC } from "@daymaster/content";
import { SettingsGear } from "@/components/settings-gear";
import { DayTonePhrase, Headline } from "@/components/today/headline";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { ReadingBody } from "@/components/today/reading-body";
import { TodayDateNav, TodayDateNotes } from "@/components/today/today-date-nav";
import { FirstDayBanner } from "@/components/today/first-day-banner";
import { FirstWeekNote } from "@/components/today/first-week-note";
import { TodayColour } from "@/components/today/today-colour";
import { TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
import { TopicCards } from "@/components/today/topic-cards";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { MarksLegendLink } from "@/components/marks-legend-link";
import { DayDial, DialKey } from "./day-dial";
import { WeekRings } from "./week-rings";

interface Props {
  screen: TodayScreen;
}

export function TodayInstrument({ screen }: Props) {
  const { model } = screen;

  return (
    <div className="flex flex-col gap-5 pt-3">
      <div className="arrive-rise -ml-3 flex items-center justify-between">
        <TodayDateNav screen={screen} />
        <div className="flex min-w-0 items-center gap-2">
          <DayTonePhrase tone={model.tone} className="caption truncate pl-2" />
          <SettingsGear className="-mr-2 flex-none" />
        </div>
      </div>
      <div className="arrive-rise flex flex-col gap-4" style={{ ["--d" as string]: 1 }}>
        <WeekRings profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
        <MarksLegendLink topic={MARKS_TOPIC.dial} />
      </div>
      <div className="flex flex-col gap-2">
        <DayDial screen={screen} />
        <div className="arrive-rise" style={{ ["--d" as string]: 4 }}>
          <DialKey screen={screen} />
        </div>
      </div>
      <TodayDateNotes screen={screen} />
      <Headline runs={model.headline} className="arrive-rise text-[31px]" />
      <ReadingBody reading={model.reading} dateISO={screen.dateISO} delay={6} />
      <div className="arrive-rise" style={{ ["--d" as string]: 7 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <FirstDayBanner screen={screen} />
      <FirstWeekNote screen={screen} />
      <TopicCards cards={model.reading.cards} dateISO={screen.dateISO} look="dial" />
      <TodaySuits screen={screen} />
      <TodayColour screen={screen} />
      <TodayFooter screen={screen} />
    </div>
  );
}
