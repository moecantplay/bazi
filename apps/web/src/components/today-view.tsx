/**
 * The Today screen, arranged Co-Star-style: a ±30-day date strip around the
 * device's real today (tap the date to jump within the window), the day's
 * headline hook in display type, the day pillar and which natal palaces it
 * touches, the reading as stacked cards, the merged Favors/Watch board (chips
 * plus fact-cited suggestions over the explaining prose), every activity as a
 * gauge row, then the week strip — and the agency line last, set apart in
 * display type. A quiet streak line and a come-back-tomorrow note are screen
 * chrome, not reading copy.
 *
 * All reading text comes from the content package and is deterministic in the
 * daily seedKey, so revisiting a date always shows the same words.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { READING_TOPIC, glossaryEntry } from "@daymaster/content";
import { AreaGauges } from "@/components/area-gauges";
import { DayBoard } from "@/components/day-board";
import { GlossarySheet } from "@/components/glossary-sheet";
import { ReadingCard } from "@/components/reading-card";
import { WeekStrip } from "@/components/week-strip";
import { useHanCharacters } from "@/components/han-characters-provider";
import { addDays, daysBetween, formatLong, todayLabel } from "@/lib/dates";
import { describeBranch, describeStem, palaceWord } from "@/lib/display";
import { dayGuidanceFor } from "@/lib/guidance";
import { dailyBundleFor, dailySeedKey } from "@/lib/reading";
import type { StoredProfile } from "@/lib/profile";
import { recordTodayOpen } from "@/lib/streak";

const RANGE = 30;

function joinWords(words: string[]): string {
  if (words.length <= 1) {
    return words[0] ?? "";
  }
  if (words.length === 2) {
    return `${words[0]} and ${words[1]}`;
  }
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

/** Natal palace words the displayed day's own branch touches, deduped. */
function dailyPalaceTouches(facts: ReadingFact[]): string[] {
  const words = new Set<string>();
  for (const fact of facts) {
    if (fact.kind === "transit-interaction" && fact.transitPalace === "daily") {
      for (const palace of fact.natalPalaces) {
        const word = palaceWord(palace);
        if (word) {
          words.add(word);
        }
      }
    }
  }
  return [...words];
}

interface Props {
  profile: StoredProfile;
}

/**
 * The device's current date, re-checked whenever the app regains focus or
 * visibility — a PWA reopened after midnight must show the new day, not the
 * day it was backgrounded on.
 */
function useTodayLabel(): string {
  const [today, setToday] = useState(() => todayLabel());

  useEffect(() => {
    function refresh() {
      if (document.visibilityState === "hidden") {
        return;
      }
      const fresh = todayLabel();
      setToday((current) => (current === fresh ? current : fresh));
    }
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
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

  const { showHanCharacters } = useHanCharacters();
  const stem = describeStem(bundle.dayPillar.stem);
  const branch = describeBranch(bundle.dayPillar.branch);
  const touches = dailyPalaceTouches(bundle.facts);

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <div className="flex w-full items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => step(-1)}
            disabled={offset <= -RANGE}
            className="px-3 py-2 text-2xl leading-none text-ink disabled:opacity-30"
          >
            &lsaquo;
          </button>
          <div className="flex flex-col items-center" aria-live="polite">
            {pickerOpen ? (
              <input
                type="date"
                autoFocus
                aria-label="Jump to a date"
                defaultValue={dateISO}
                min={addDays(today, -RANGE)}
                max={addDays(today, RANGE)}
                onChange={(event) => jumpTo(event.target.value)}
                onBlur={() => setPickerOpen(false)}
                className="field-input w-auto"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label={`${formatLong(dateISO)} — jump to a date`}
                className="font-display text-lg font-semibold text-ink"
              >
                {formatLong(dateISO)}
              </button>
            )}
            {offset !== 0 && !pickerOpen && (
              <button
                type="button"
                onClick={() => setOffset(0)}
                className="mt-1 px-3 py-1.5 text-[12px] text-ink-soft hover:text-ink"
              >
                Back to today
              </button>
            )}
            {offset === 0 && !pickerOpen && streak >= 2 && (
              <p className="mt-1 text-[12px] text-ink-soft">{streak} days running</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Next day"
            onClick={() => step(1)}
            disabled={offset >= RANGE}
            className="px-3 py-2 text-2xl leading-none text-ink disabled:opacity-30"
          >
            &rsaquo;
          </button>
        </div>
        {atBoundary && (
          <p className="text-[12px] text-ink-soft">Readings reach 30 days out from today.</p>
        )}
      </div>

      <h2 data-headline className="text-center font-display text-[28px] leading-snug text-ink">
        {bundle.reading.headline.text}
      </h2>

      <div className="flex flex-col items-center gap-2">
        {showHanCharacters ? (
          <span className="font-han text-[56px] leading-none text-ink">
            {bundle.dayPillar.stem}
            {bundle.dayPillar.branch}
          </span>
        ) : (
          <span className="font-display text-3xl leading-none text-ink">
            {stem.gloss} · {branch.gloss}
          </span>
        )}
        <span className="caption inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ background: `var(--element-${stem.element})` }}
          />
          {stem.pinyin} {stem.element}
          <span aria-hidden="true">·</span>
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ background: `var(--element-${branch.element})` }}
          />
          {branch.pinyin} {branch.element}
        </span>
        {touches.length > 0 && (
          <p className="mt-1 text-center text-[14px] text-ink">
            This day touches your {joinWords(touches)} palace{touches.length > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      <div data-reading-body className="flex flex-col gap-2">
        {bundle.reading.lines.map((line, index) => (
          <ReadingCard key={index} line={line} />
        ))}
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

      <DayBoard
        chips={guidance.chips}
        proseLines={guidance.lines}
        dos={bundle.reading.dos}
        donts={bundle.reading.donts}
      />

      <AreaGauges quality={guidance.quality} seedKey={dailySeedKey(profile, dateISO)} />

      <WeekStrip profile={profile} today={today} selectedISO={dateISO} onSelect={jumpTo} />

      <Link href="/dates/" className="tap-target -mt-2 text-[12px] text-ink-soft hover:text-ink">
        Find a day for something &rarr;
      </Link>

      <div className="card border-t-2 border-ink p-5">
        <p className="font-display text-[21px] font-semibold leading-snug text-ink">{bundle.reading.agency.text}</p>
      </div>

      {offset === 0 && (
        <p className="-mt-4 text-center text-[12px] text-ink-soft">
          Tomorrow reads differently. It&rsquo;ll be here in the morning.
        </p>
      )}
    </div>
  );
}
