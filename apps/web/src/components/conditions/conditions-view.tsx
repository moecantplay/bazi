"use client";

/**
 * Today read with a weather app's rhythm (an experiment beside Today, not a
 * replacement — reached from Settings, never the bottom nav): conditions
 * hero → the hours → ten days → the route → the reading and trail signs
 * behind folds → signpost → journal. Same view-model as Today; only the
 * arrangement differs.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addDays,
  clampOffsetToRange,
  conditionDays,
  currentHourBlockIndex,
  daysBetween,
  hourBlocks,
  mapHeroSummary,
  todayScreenModel
} from "@daymaster/presentation";
import { ConditionsHero } from "@/components/conditions/conditions-hero";
import { HoursStrip } from "@/components/conditions/hours-strip";
import { TenDayList } from "@/components/conditions/ten-day-list";
import { Datebar } from "@/components/datebar";
import { DayJournal } from "@/components/day-journal";
import { MapHero } from "@/components/map-hero";
import { Signpost } from "@/components/signpost";
import { TokenText } from "@/components/token-text";
import { TrailSigns } from "@/components/trail-signs";
import { WaypointRail } from "@/components/waypoint-rail";
import type { StoredProfile } from "@/lib/store-types";
import { useDayProgress } from "@/lib/use-day-progress";
import { useTodayLabel } from "@/lib/use-today-label";

interface Props {
  profile: StoredProfile;
}

export function ConditionsView({ profile }: Props) {
  const today = useTodayLabel();
  const dayProgress = useDayProgress();
  const [offset, setOffset] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [deeperOpen, setDeeperOpen] = useState(false);

  const dateISO = addDays(today, offset);
  const model = useMemo(() => todayScreenModel(profile, dateISO, today), [profile, dateISO, today]);
  const { pillars, stem, branch, reading, guidance, tone, waypoints, headline, branchByArea, dateRange } = model;

  const blocks = useMemo(() => hourBlocks(model.dayPillar.branch), [model.dayPillar.branch]);
  const days = useMemo(() => conditionDays(profile, today), [profile, today]);
  const current = days.find((day) => day.iso === dateISO);
  const officerKey = guidance.quality.officer.key;
  const officerName = guidance.quality.officer.english;
  const gloss = current?.gloss ?? "the day's own grain";
  const hoursLine = reading.lines.find((line) => line.area === "hours");
  const routeLine = mapHeroSummary(waypoints, tone).ariaLabel.replace(/^Today.s route: /, "");

  useEffect(() => {
    document.documentElement.dataset.terrain = stem.element;
  }, [stem.element]);

  const step = (delta: number) => setOffset((value) => clampOffsetToRange(value + delta));

  function jumpTo(value: string) {
    if (value.length === 0) {
      return;
    }
    setOffset(clampOffsetToRange(daysBetween(today, value)));
    setPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
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
      {offset !== 0 && (
        <button
          type="button"
          onClick={() => setOffset(0)}
          className="tap-target -mt-3 self-start text-[12px] text-ink-soft hover:text-ink"
        >
          Back to today
        </button>
      )}

      <ConditionsHero
        officerKey={officerKey}
        officerName={officerName}
        gloss={gloss}
        element={stem.element}
        stemGloss={stem.gloss}
        animal={branch.gloss}
        headline={headline}
        assessments={guidance.quality.assessments}
      />

      <section className="flex flex-col gap-2">
        <p className="kicker">The hours</p>
        <div className="card">
          <HoursStrip blocks={blocks} currentIndex={offset === 0 ? currentHourBlockIndex() : null} />
          {hoursLine && (
            <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-ink">
              <TokenText line={hoursLine.runs} />
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <p className="kicker">Ten days</p>
        <TenDayList days={days} today={today} selectedISO={dateISO} onSelect={jumpTo} />
      </section>

      <section className="flex flex-col gap-2">
        <p className="kicker">The map</p>
        <button
          type="button"
          data-route-toggle
          aria-expanded={mapOpen}
          onClick={() => setMapOpen((open) => !open)}
          className="card tap-target flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] text-ink">
              Route · {waypoints.length} {waypoints.length === 1 ? "mark" : "marks"}
            </span>
            <span className="text-[12px] text-ink-soft">{routeLine}</span>
          </span>
          <span aria-hidden className={`ml-auto text-ink-soft transition-transform ${mapOpen ? "rotate-90" : ""}`}>
            &rsaquo;
          </span>
        </button>
        {mapOpen && (
          <MapHero
            pillars={pillars}
            dayBranchGloss={branch.gloss}
            tone={tone}
            waypoints={waypoints}
            progress={offset === 0 ? dayProgress : null}
          />
        )}
      </section>

      <Fold label="Read the day · the full reading" open={readingOpen} onToggle={() => setReadingOpen((o) => !o)}>
        <WaypointRail lines={reading.lines} branchByArea={branchByArea} waypoints={waypoints} />
      </Fold>

      <Fold label="Go deeper · what the day suits" open={deeperOpen} onToggle={() => setDeeperOpen((o) => !o)}>
        <TrailSigns
          assessments={guidance.quality.assessments}
          chips={guidance.chips}
          proseLines={guidance.lines}
          dos={reading.dos}
          donts={reading.donts}
        />
        <Link href="/dates/" className="tap-target text-[12px] text-ink-soft hover:text-ink">
          Find a day for something &rarr;
        </Link>
      </Fold>

      <Signpost line={reading.agency.runs} />

      {offset <= 0 && <DayJournal dateISO={dateISO} isToday={offset === 0} />}
    </div>
  );
}

interface FoldProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Fold({ label, open, onToggle, children }: FoldProps) {
  return (
    <div className="card flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="tap-target flex w-full items-center justify-between px-4 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-[.17em] text-ink"
      >
        {label}
        <span aria-hidden className="text-[16px]">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="flex flex-col gap-6 px-4 pb-4">{children}</div>}
    </div>
  );
}
