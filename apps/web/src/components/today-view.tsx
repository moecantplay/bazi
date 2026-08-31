/**
 * The Today screen, built to DESIGN.md's Trail direction: the day as a
 * route on a topographic map. Top to bottom — datebar, seven-day elevation
 * profile, headline hook with one line of grain prose, legend tags, the map
 * hero, the waypoint-rail reading, trail signs, the signpost (agency line),
 * and the streak line.
 *
 * Every piece of derived data (chart, pillars, reading, guidance, tone,
 * waypoints, headline runs, grain line, branchByArea, the date range) comes
 * from presentation's `todayScreenModel` — this component only holds the
 * date-strip's offset/picker state and renders what the model computes.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { READING_TOPIC, glossaryEntry } from "@daymaster/content";
import { addDays, clampOffsetToRange, daysBetween, streakLine, todayScreenModel } from "@daymaster/presentation";
import { ActivityTerrain } from "@/components/activity-terrain";
import { Datebar } from "@/components/datebar";
import { ElevationProfile } from "@/components/elevation-profile";
import { GlossarySheet } from "@/components/glossary-sheet";
import { LegendTags } from "@/components/legend-tags";
import { MapHero } from "@/components/map-hero";
import { TokenText } from "@/components/token-text";
import { TrailSigns } from "@/components/trail-signs";
import { WaypointRail } from "@/components/waypoint-rail";
import { recordTodayOpen } from "@/lib/streak";
import type { StoredProfile } from "@/lib/store-types";
import { useDayProgress } from "@/lib/use-day-progress";
import { useTodayLabel } from "@/lib/use-today-label";

interface Props {
  profile: StoredProfile;
}

export function TodayView({ profile }: Props) {
  const today = useTodayLabel();
  const dayProgress = useDayProgress();
  const [offset, setOffset] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutEntry = glossaryEntry(READING_TOPIC);

  useEffect(() => {
    setStreak(recordTodayOpen(today));
  }, [today]);

  const dateISO = addDays(today, offset);
  const model = useMemo(() => todayScreenModel(profile, dateISO, today), [profile, dateISO, today]);
  const { pillars, stem, branch, reading, guidance, tone, waypoints, headline, grainLine, branchByArea, dateRange } =
    model;

  useEffect(() => {
    document.documentElement.dataset.terrain = stem.element;
  }, [stem.element]);

  const step = (delta: number) => setOffset((current) => clampOffsetToRange(current + delta));

  function jumpTo(value: string) {
    if (value.length === 0) {
      return;
    }
    setOffset(clampOffsetToRange(daysBetween(today, value)));
    setPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-7">
      <Datebar
        dateISO={dateISO}
        pickerOpen={pickerOpen}
        onOpenPicker={() => setPickerOpen(true)}
        onClosePicker={() => setPickerOpen(false)}
        onJump={jumpTo}
        onStep={step}
        min={dateRange.min}
        max={dateRange.max}
        atStart={dateRange.atStart}
        atEnd={dateRange.atEnd}
        pillars={pillars}
      />
      {dateRange.atBoundary && (
        <p className="-mt-4 text-[12px] text-ink-soft">Readings reach 30 days out from today.</p>
      )}
      {offset !== 0 && (
        <button
          type="button"
          onClick={() => setOffset(0)}
          className="tap-target -mt-4 self-start text-[12px] text-ink-soft hover:text-ink"
        >
          Back to today
        </button>
      )}

      <ElevationProfile profile={profile} today={today} selectedISO={dateISO} onSelect={jumpTo} />

      <div className="flex flex-col gap-2">
        <p className="kicker">Today&rsquo;s terrain</p>
        <h2 data-headline className="font-display text-[35px] leading-[1.07] tracking-[-0.022em] text-ink [text-wrap:balance]">
          {headline.map((run, index) =>
            run.emphasized ? (
              <em
                key={index}
                className="font-medium italic"
                style={{ fontFamily: 'ui-serif, "New York", Georgia, serif' }}
              >
                {run.text}
              </em>
            ) : (
              run.text
            )
          )}
        </h2>
        <p className="text-[14px] leading-relaxed text-ink">
          {grainLine && <TokenText line={grainLine.runs} />}
        </p>
      </div>

      <LegendTags
        stemElement={stem.element}
        stemPolarity={stem.polarity}
        branchGloss={branch.gloss}
        branchElement={branch.element}
      />

      <MapHero
        pillars={pillars}
        dayBranchGloss={branch.gloss}
        tone={tone}
        waypoints={waypoints}
        progress={offset === 0 ? dayProgress : null}
      />

      <div className="flex flex-col gap-2">
        <WaypointRail lines={reading.lines} branchByArea={branchByArea} />
        {aboutEntry && (
          <button
            type="button"
            data-about-reading
            onClick={() => setAboutOpen(true)}
            className="tap-target self-start pt-3 text-[12px] text-ink-soft hover:text-ink"
          >
            How this reading works &rarr;
          </button>
        )}
        {aboutOpen && aboutEntry && (
          <GlossarySheet entry={aboutEntry} onClose={() => setAboutOpen(false)} />
        )}
      </div>

      <ActivityTerrain assessments={guidance.quality.assessments} />

      <TrailSigns
        chips={guidance.chips}
        proseLines={guidance.lines}
        dos={reading.dos}
        donts={reading.donts}
      />

      <Link href="/dates/" className="tap-target -mt-2 text-[12px] text-ink-soft hover:text-ink">
        Find a day for something &rarr;
      </Link>

      <div className="flex">
        <div className="relative mr-5 rounded-l-[18px] bg-anchor py-4 pl-5 pr-4 text-paper">
          <p
            className="font-mono text-[9px] font-bold uppercase tracking-[.2em]"
            style={{ color: "color-mix(in srgb, var(--paper) 55%, var(--ink-soft))" }}
          >
            One small thing before camp
          </p>
          <p className="mt-1.5 text-[16.5px] font-medium leading-snug">
            <TokenText line={reading.agency.runs} />
          </p>
          <span
            aria-hidden
            className="absolute left-full top-0 h-full w-5 bg-anchor"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
        </div>
      </div>
      <span aria-hidden className="-mt-6 ml-10 h-6 w-0.5 bg-hairline" />

      {offset === 0 && streak >= 2 && (
        <p data-streak className="-mt-4 text-center text-[12px] text-ink-soft">
          {streakLine(streak, today)}
        </p>
      )}
      {offset === 0 && (
        <p className="-mt-4 text-center text-[12px] text-ink-soft">
          Tomorrow reads differently. It&rsquo;ll be here in the morning.
        </p>
      )}
    </div>
  );
}
