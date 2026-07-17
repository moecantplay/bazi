/**
 * The Today screen, restructured to Co-Star's content architecture (research
 * 2026-07-16): a ±30-day date strip around the device's real today (tap the
 * date to jump within the window), then the week strip, then the hero —
 * headline hook in display type over the day pillar — then "At a glance"
 * (the activity axis-dot rows, orientation before prose), the reading grouped
 * into life-area sections with citations under the prose, the Favors/Watch
 * board as stark word lists with its grouped guidance prose, and the agency
 * line last, set apart in display type. A quiet streak line and a
 * come-back-tomorrow note are screen chrome, not reading copy.
 *
 * All reading text comes from the content package and is deterministic in the
 * daily seedKey, so revisiting a date always shows the same words.
 */

"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { READING_TOPIC, glossaryEntry } from "@daymaster/content";
import { AreaGauges } from "@/components/area-gauges";
import { DayBoard } from "@/components/day-board";
import { DayOrbit } from "@/components/day-orbit";
import { GlossarySheet } from "@/components/glossary-sheet";
import { ReadingAreaSections } from "@/components/reading-area-sections";
import { WeekStrip } from "@/components/week-strip";
import { useHanCharacters } from "@/components/han-characters-provider";
import { addDays, daysBetween, formatLong, todayLabel } from "@/lib/dates";
import { describeBranch, describeStem } from "@/lib/display";
import { dayGuidanceFor } from "@/lib/guidance";
import { dailyBundleFor, dailySeedKey } from "@/lib/reading";
import type { StoredProfile } from "@/lib/profile";
import { recordTodayOpen, streakLine } from "@/lib/streak";

const RANGE = 30;

interface HeadlineRun {
  text: string;
  emphasized: boolean;
}

/**
 * Splits a headline into regular/extrabold runs for the hero's mixed-weight
 * setting: the middle of the sentence carries the weight, the opening words
 * and the final word stay regular. Purely presentational and deterministic
 * in the text; headlines too short to split render unemphasized.
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
              <p data-streak className="mt-1 text-[12px] text-ink-soft">{streakLine(streak, today)}</p>
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

      <WeekStrip profile={profile} today={today} selectedISO={dateISO} onSelect={jumpTo} />

      {/* The hero is the screen's one color mass: the day's two elements
          wash the card (stem pools top-left, branch warms bottom-right) and
          the orbit line art replaces the bare pillar glyphs. Everything
          inside is full ink — ink-soft can't hold contrast on the wash, and
          the headline is the only text in its strongest zone because only
          large text clears AA there (see globals.css). */}
      <section
        className="hero-card relative overflow-hidden rounded-3xl px-6 pb-8 pt-9"
        style={
          {
            "--hero-stem": `var(--element-${stem.element})`,
            "--hero-branch": `var(--element-${branch.element})`
          } as CSSProperties
        }
      >
        <h2
          data-headline
          className="text-[38px] font-normal leading-[1.12] tracking-[-0.02em] text-ink"
        >
          {headlineRuns(bundle.reading.headline.text).map((run, index) =>
            run.emphasized ? (
              <b key={index} className="font-extrabold">
                {run.text}
              </b>
            ) : (
              run.text
            )
          )}
        </h2>

        <div className="mt-7 flex flex-col items-center gap-2">
          <DayOrbit
            stemCharacter={bundle.dayPillar.stem}
            branchCharacter={bundle.dayPillar.branch}
            stemGloss={stem.gloss}
            branchGloss={branch.gloss}
            stemElement={stem.element}
            branchElement={branch.element}
            showHanCharacters={showHanCharacters}
          />
          <span className="caption text-ink">
            {stem.pinyin} {stem.element} · {branch.pinyin} {branch.element}
          </span>
        </div>
      </section>

      <AreaGauges quality={guidance.quality} seedKey={dailySeedKey(profile, dateISO)} />

      <div className="flex flex-col gap-2">
        <ReadingAreaSections lines={bundle.reading.lines} />
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
