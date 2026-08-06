/**
 * The Today screen, rebuilt to DESIGN.md's Trail direction: the day as a
 * route on a topographic map. Top to bottom — datebar, seven-day elevation
 * profile, headline hook with one line of grain prose, legend tags, the map
 * hero, the waypoint-rail reading, trail signs, the signpost (agency line),
 * and the streak line. All data plumbing (bundle/guidance/seedKey, the date
 * strip's prev/next/jump logic, the streak counter, the glossary "how this
 * reading works" entry) is unchanged from M17 — only what renders moves.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { READING_TOPIC, glossaryEntry, stripHanCharacters } from "@daymaster/content";
import { Datebar } from "@/components/datebar";
import { ElevationProfile } from "@/components/elevation-profile";
import { GlossarySheet } from "@/components/glossary-sheet";
import { LegendTags } from "@/components/legend-tags";
import { MapHero } from "@/components/map-hero";
import { TrailSigns } from "@/components/trail-signs";
import { WaypointRail } from "@/components/waypoint-rail";
import { chartFor } from "@/lib/chart";
import { addDays, daysBetween } from "@/lib/dates";
import { dayTone } from "@/lib/day-tone";
import { describeBranch, describeStem } from "@/lib/display";
import { dayGuidanceFor } from "@/lib/guidance";
import { dailyBundleFor } from "@/lib/reading";
import { routeWaypointsFor } from "@/lib/route-waypoints";
import type { StoredProfile } from "@/lib/profile";
import { recordTodayOpen, streakLine } from "@/lib/streak";
import { useTodayLabel } from "@/lib/use-today-label";

const RANGE = 30;

interface HeadlineRun {
  text: string;
  emphasized: boolean;
}

/**
 * Splits a headline into a plain-weight frame and one serif-italic emphasis
 * run (DESIGN.md §Type: "one phrase per headline — the direction's one
 * flourish"). The middle of the sentence carries the emphasis; the opening
 * words and the final word stay plain. Headlines too short to split render
 * unemphasized.
 */
function headlineRuns(text: string): HeadlineRun[] {
  const words = text.split(" ");
  if (words.length < 5) {
    return [{ text, emphasized: false }];
  }
  const start = Math.max(1, Math.floor(words.length * 0.4));
  const end = words.length - 1;
  return [
    { text: `${words.slice(0, start).join(" ")} `, emphasized: false },
    { text: words.slice(start, end).join(" "), emphasized: true },
    { text: ` ${words.slice(end).join(" ")}`, emphasized: false }
  ];
}

interface Props {
  profile: StoredProfile;
}

export function TodayView({ profile }: Props) {
  const today = useTodayLabel();
  const [offset, setOffset] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutEntry = glossaryEntry(READING_TOPIC);

  useEffect(() => {
    setStreak(recordTodayOpen(today));
  }, [today]);

  const dateISO = addDays(today, offset);
  const bundle = useMemo(() => dailyBundleFor(profile, dateISO), [profile, dateISO]);
  const guidance = useMemo(() => dayGuidanceFor(profile, dateISO), [profile, dateISO]);
  const chart = useMemo(() => chartFor(profile), [profile]);
  const tone = useMemo(() => dayTone(profile, dateISO), [profile, dateISO]);
  const waypoints = useMemo(
    () => routeWaypointsFor(bundle.reading.lines, bundle.facts),
    [bundle]
  );

  const stem = describeStem(bundle.dayPillar.stem);
  const branch = describeBranch(bundle.dayPillar.branch);
  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  const grainLine = bundle.reading.lines.find((line) => line.area === "overall") ?? bundle.reading.lines[0];

  const branchByArea = {
    year: chart.year.branch,
    month: chart.month.branch,
    day: chart.day.branch,
    ...(chart.hour ? { hour: chart.hour.branch } : {}),
    overall: bundle.dayPillar.branch
  };

  const step = (delta: number) =>
    setOffset((current) => Math.min(RANGE, Math.max(-RANGE, current + delta)));

  const atBoundary = Math.abs(offset) >= RANGE;

  function jumpTo(value: string) {
    if (value.length === 0) {
      return;
    }
    const target = Math.min(RANGE, Math.max(-RANGE, daysBetween(today, value)));
    setOffset(target);
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
        min={addDays(today, -RANGE)}
        max={addDays(today, RANGE)}
        atStart={offset <= -RANGE}
        atEnd={offset >= RANGE}
        pillars={pillars}
      />
      {atBoundary && (
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
          {headlineRuns(bundle.reading.headline.text).map((run, index) =>
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
        <p className="text-[14px] leading-relaxed text-ink">{stripHanCharacters(grainLine?.text ?? "")}</p>
      </div>

      <LegendTags
        stemElement={stem.element}
        stemPolarity={stem.polarity}
        branchGloss={branch.gloss}
        branchElement={branch.element}
      />

      <MapHero pillars={pillars} dayBranchGloss={branch.gloss} tone={tone} waypoints={waypoints} />

      <div className="flex flex-col gap-2">
        <WaypointRail lines={bundle.reading.lines} branchByArea={branchByArea} />
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

      <TrailSigns
        chips={guidance.chips}
        proseLines={guidance.lines}
        dos={bundle.reading.dos}
        donts={bundle.reading.donts}
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
            {stripHanCharacters(bundle.reading.agency.text)}
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
