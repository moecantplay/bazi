/**
 * The Today screen: a ±30-day date strip around the device's real today (tap
 * the date to jump within the window), the displayed day's pillar and which
 * natal palaces its branch touches, the daily reading as stacked cards, and
 * the agency line last, set apart in display type. A quiet streak line and a
 * come-back-tomorrow note are screen chrome, not reading copy.
 *
 * All reading text comes from the content package and is deterministic in the
 * daily seedKey, so revisiting a date always shows the same words.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReadingFact } from "@daymaster/bazi-engine";
import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { ReadingCard } from "@/components/reading-card";
import { useHanCharacters } from "@/components/han-characters-provider";
import { addDays, daysBetween, formatLong, todayLabel } from "@/lib/dates";
import { describeBranch, describeStem, palaceWord } from "@/lib/display";
import { dailyBundleFor } from "@/lib/reading";
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

/** One column of the day's suggestions; the caption cites the fact behind each. */
function SuggestionList({ title, lines }: { title: string; lines: ReadingLine[] }) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-4">
      <h3 className="text-[12px] font-medium uppercase tracking-wide text-ink-soft">{title}</h3>
      <ul className="mt-2 flex flex-col gap-2.5">
        {lines.map((line, index) => (
          <li key={index}>
            <p className="text-[14px] leading-relaxed text-ink">{display(line.text)}</p>
            {line.factTag && (
              <p data-fact-tag className="mt-0.5 text-[11px] text-ink-soft">
                {display(line.factTag)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
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

  useEffect(() => {
    setStreak(recordTodayOpen(today));
  }, [today]);

  const dateISO = addDays(today, offset);
  const bundle = useMemo(() => dailyBundleFor(profile, dateISO), [profile, dateISO]);

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
                className="rounded-lg border border-ink-soft bg-paper-raised px-3 py-1.5 text-base text-ink"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label={`${formatLong(dateISO)} — jump to a date`}
                className="font-display text-xl text-ink"
              >
                {formatLong(dateISO)}
              </button>
            )}
            {offset !== 0 && !pickerOpen && (
              <button
                type="button"
                onClick={() => setOffset(0)}
                className="mt-1 text-[12px] text-ink-soft hover:text-ink"
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

      <div className="flex flex-col items-center gap-2">
        {showHanCharacters ? (
          <span className="font-han text-4xl leading-none text-ink">
            {bundle.dayPillar.stem}
            {bundle.dayPillar.branch}
          </span>
        ) : (
          <span className="font-display text-2xl leading-none text-ink">
            {stem.gloss} · {branch.gloss}
          </span>
        )}
        <span className="text-[13px] text-ink-soft">
          {stem.pinyin} {stem.element} · {branch.pinyin} {branch.element}
        </span>
        {touches.length > 0 && (
          <p className="mt-1 text-center text-[14px] text-ink">
            This day touches your {joinWords(touches)} palace{touches.length > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      <div data-reading-body className="flex flex-col gap-3">
        {bundle.reading.lines.map((line, index) => (
          <ReadingCard key={index} line={line} />
        ))}
      </div>

      <div data-dos-donts className="grid gap-3 sm:grid-cols-2">
        <SuggestionList title="Worth doing" lines={bundle.reading.dos} />
        <SuggestionList title="Worth postponing" lines={bundle.reading.donts} />
      </div>

      <div className="rounded-xl border-t-2 border-ink bg-paper-raised p-5">
        <p className="font-display text-xl leading-snug text-ink">{bundle.reading.agency.text}</p>
      </div>

      {offset === 0 && (
        <p className="-mt-4 text-center text-[12px] text-ink-soft">
          Tomorrow reads differently. It&rsquo;ll be here in the morning.
        </p>
      )}
    </div>
  );
}
