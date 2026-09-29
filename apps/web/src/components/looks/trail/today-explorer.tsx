/** Today in Explorer (stored id `trail`): DESIGN.md v5 §Explorer. */

"use client";

import { useState } from "react";
import { readingSections } from "@daymaster/presentation";
import { ElevationProfile } from "@/components/elevation-profile";
import { PullQuoteBoard } from "@/components/today/pull-quote-board";
import { TokenText } from "@/components/token-text";
import { TodayDateNotes } from "@/components/today/today-date-nav";
import { AboutReadingLink, TodayFooter } from "@/components/today/today-footer";
import { TodaySuits } from "@/components/today/today-suits";
import type { TodayScreen } from "@/components/today/use-today-screen";
import { IdeaCards } from "./idea-cards";
import { RouteHero } from "./route-hero";

interface Props {
  screen: TodayScreen;
}

export function TodayExplorer({ screen }: Props) {
  const [deeperOpen, setDeeperOpen] = useState(false);
  const { model } = screen;
  const sections = readingSections(model.reading.lines, model.grainLine);

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-5">
        <RouteHero screen={screen} />
      </div>
      <TodayDateNotes screen={screen} />
      {model.grainLine && (
        <p className="arrive-rise text-[16px] leading-relaxed text-ink" style={{ ["--d" as string]: 3 }}>
          <TokenText line={model.grainLine.runs} />
        </p>
      )}
      <div className="arrive-rise" style={{ ["--d" as string]: 4 }}>
        <PullQuoteBoard line={model.reading.agency.runs} />
      </div>
      <p className="kicker">Along the way · swipe</p>
      <IdeaCards sections={sections} branchByArea={model.branchByArea} />
      <AboutReadingLink />
      <div className="flex flex-col gap-5">
        <button
          type="button"
          data-go-deeper
          aria-expanded={deeperOpen}
          onClick={() => setDeeperOpen((open) => !open)}
          className="look-disclosure"
        >
          Go deeper · what the day suits
          <span aria-hidden className="chapter-chevron">
            &rsaquo;
          </span>
        </button>
        {deeperOpen && <TodaySuits screen={screen} />}
      </div>
      <TodayFooter screen={screen} />
      <ElevationProfile profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
    </div>
  );
}
