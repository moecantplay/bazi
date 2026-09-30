/** Today in Editorial (stored id `almanac`): DESIGN.md v5 §Editorial, composed per M20-21. */

"use client";

import { Headline } from "@/components/today/headline";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { ReadingBody } from "@/components/today/reading-body";
import { TodayDateNotes } from "@/components/today/today-date-nav";
import { AboutReadingLink, TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
import { TopicCards } from "@/components/today/topic-cards";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { PosterField } from "./poster-field";
import { WeekCalendar } from "./week-calendar";

interface Props {
  screen: TodayScreen;
}

function DashedRule({ label }: { label: string }) {
  return (
    <p className="caption flex items-center gap-2">
      <span>{label}</span>
      <span aria-hidden className="flex-1 border-t-2 border-dashed border-hairline" />
    </p>
  );
}

export function TodayEditorial({ screen }: Props) {
  const { model } = screen;

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-5">
        <PosterField screen={screen} />
      </div>
      <TodayDateNotes screen={screen} />
      <Headline runs={model.headline} className="arrive-rise text-[42px] !leading-[1.02]" />
      <ReadingBody reading={model.reading} dateISO={screen.dateISO} delay={4} />
      <div className="arrive-rise" style={{ ["--d" as string]: 5 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <TopicCards cards={model.reading.cards} dateISO={screen.dateISO} look="almanac" />
      <TodaySuits screen={screen} />
      <AboutReadingLink />
      <TodayFooter screen={screen} />
      <DashedRule label="The week" />
      <WeekCalendar profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
    </div>
  );
}
