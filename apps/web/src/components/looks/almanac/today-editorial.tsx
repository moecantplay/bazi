/** Today in Editorial (stored id `almanac`): DESIGN.md v5 §Editorial. */

"use client";

import { readingSections } from "@daymaster/presentation";
import { TokenText } from "@/components/token-text";
import { Headline } from "@/components/today/headline";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { ReadingChapters } from "@/components/today/reading-chapters";
import { TodayDateNotes } from "@/components/today/today-date-nav";
import { AboutReadingLink, TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
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
  const sections = readingSections(model.reading.lines, model.grainLine);

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-5">
        <PosterField screen={screen} />
      </div>
      <TodayDateNotes screen={screen} />
      <Headline runs={model.headline} className="arrive-rise text-[42px] !leading-[1.02]" />
      {model.grainLine && (
        <p className="arrive-rise text-[16px] leading-relaxed text-ink" style={{ ["--d" as string]: 4 }}>
          <TokenText line={model.grainLine.runs} />
        </p>
      )}
      <div className="arrive-rise" style={{ ["--d" as string]: 5 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <DashedRule label="The rest of the day" />
      <ReadingChapters sections={sections} suits={<TodaySuits screen={screen} />} />
      <AboutReadingLink />
      <TodayFooter screen={screen} />
      <DashedRule label="The week" />
      <WeekCalendar profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
    </div>
  );
}
