/** Today in Explorer (stored id `trail`): DESIGN.md v5 §Explorer, composed per M20-21. */

"use client";

import { MARKS_TOPIC } from "@daymaster/content";
import { ElevationProfile } from "@/components/elevation-profile";
import { MarksLegendLink } from "@/components/marks-legend-link";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { ReadingBody } from "@/components/today/reading-body";
import { TodayDateNotes } from "@/components/today/today-date-nav";
import { FirstDayBanner } from "@/components/today/first-day-banner";
import { FirstWeekNote } from "@/components/today/first-week-note";
import { TodayColour } from "@/components/today/today-colour";
import { TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
import { TopicCards } from "@/components/today/topic-cards";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { RouteHero } from "./route-hero";

interface Props {
  screen: TodayScreen;
}

export function TodayExplorer({ screen }: Props) {
  const { model } = screen;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="-mx-5">
          <RouteHero screen={screen} />
        </div>
        <MarksLegendLink topic={MARKS_TOPIC.trailRoute} />
      </div>
      <TodayDateNotes screen={screen} />
      <ReadingBody reading={model.reading} dateISO={screen.dateISO} delay={3} />
      <div className="arrive-rise" style={{ ["--d" as string]: 4 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <FirstDayBanner screen={screen} />
      <FirstWeekNote screen={screen} />
      <TopicCards cards={model.reading.cards} dateISO={screen.dateISO} look="trail" />
      <TodaySuits screen={screen} />
      <TodayColour screen={screen} />
      <TodayFooter screen={screen} />
      <ElevationProfile profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
    </div>
  );
}
