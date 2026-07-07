/**
 * The Today screen: a ±30-day date strip around the device's real today, the
 * displayed day's pillar and which natal palaces its branch touches, the daily
 * reading as stacked cards, and the agency line last, set apart in display type.
 *
 * All reading text comes from the content package and is deterministic in the
 * daily seedKey, so revisiting a date always shows the same words.
 */

"use client";

import { useMemo, useState } from "react";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { ReadingCard } from "@/components/reading-card";
import { addDays, formatLong, todayLabel } from "@/lib/dates";
import { describeBranch, describeStem, palaceWord } from "@/lib/display";
import { dailyBundleFor } from "@/lib/reading";
import type { StoredProfile } from "@/lib/profile";

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

export function TodayView({ profile }: Props) {
  const [today] = useState(() => todayLabel());
  const [offset, setOffset] = useState(0);

  const dateISO = addDays(today, offset);
  const bundle = useMemo(() => dailyBundleFor(profile, dateISO), [profile, dateISO]);

  const stem = describeStem(bundle.dayPillar.stem);
  const branch = describeBranch(bundle.dayPillar.branch);
  const touches = dailyPalaceTouches(bundle.facts);

  const step = (delta: number) =>
    setOffset((current) => Math.min(RANGE, Math.max(-RANGE, current + delta)));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous day"
          onClick={() => step(-1)}
          disabled={offset <= -RANGE}
          className="px-3 py-2 text-2xl leading-none text-ink disabled:opacity-30"
        >
          &lsaquo;
        </button>
        <div className="flex flex-col items-center">
          <p className="font-display text-xl text-ink">{formatLong(dateISO)}</p>
          {offset !== 0 && (
            <button
              type="button"
              onClick={() => setOffset(0)}
              className="mt-1 text-[12px] text-ink-soft hover:text-ink"
            >
              Back to today
            </button>
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

      <div className="flex flex-col items-center gap-2">
        <span className="font-han text-4xl leading-none text-ink">
          {bundle.dayPillar.stem}
          {bundle.dayPillar.branch}
        </span>
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

      <div className="rounded-xl border-t-2 border-ink bg-paper-raised p-5">
        <p className="font-display text-xl leading-snug text-ink">{bundle.reading.agency.text}</p>
      </div>
    </div>
  );
}
