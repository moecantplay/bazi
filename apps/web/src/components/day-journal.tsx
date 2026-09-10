/**
 * "Did this day land?" — the reader's own verdict on a reading, kept per day.
 * Two quiet choices (rang true / didn't fit) and, once one is picked, a short
 * optional note. Shown for today and past days only: a day that hasn't
 * happened can't have landed. Saved the moment it changes; tapping the chosen
 * mark again clears it. The mark is the reader's judgement of the reading,
 * never the reading's judgement of the reader (VOICE.md rule 4).
 *
 * Lives in the single store (journal field) so a backup carries it and a
 * future sync can too — unlike the streak, which stays device-local.
 */

"use client";

import { useEffect, useState } from "react";
import { JOURNAL_NOTE_MAX, loadJournalEntry, removeJournalEntry, saveJournalEntry, type JournalMark } from "@/lib/store";

interface Props {
  dateISO: string;
  /** True when the shown day is the real today; changes the prompt's tense. */
  isToday: boolean;
}

const MARKS: { value: JournalMark; label: string }[] = [
  { value: "rang-true", label: "Rang true" },
  { value: "did-not-fit", label: "Didn't fit" }
];

export function DayJournal({ dateISO, isToday }: Props) {
  const [mark, setMark] = useState<JournalMark | null>(null);
  const [note, setNote] = useState("");

  // Re-read whenever the shown day changes; localStorage is only reachable after mount.
  useEffect(() => {
    const entry = loadJournalEntry(dateISO);
    setMark(entry?.mark ?? null);
    setNote(entry?.note ?? "");
  }, [dateISO]);

  function choose(next: JournalMark) {
    if (next === mark) {
      setMark(null);
      setNote("");
      removeJournalEntry(dateISO);
      return;
    }
    setMark(next);
    saveJournalEntry(dateISO, next, note);
  }

  function changeNote(value: string) {
    const trimmed = value.slice(0, JOURNAL_NOTE_MAX);
    setNote(trimmed);
    if (mark !== null) {
      saveJournalEntry(dateISO, mark, trimmed);
    }
  }

  return (
    <section data-day-journal className="flex flex-col gap-3">
      <p className="kicker">{isToday ? "How is it landing?" : "How did it land?"}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Mark this day's reading">
        {MARKS.map((option) => {
          const selected = option.value === mark;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(option.value)}
              className={`min-h-[44px] rounded-full px-5 font-mono text-[12px] font-bold uppercase tracking-wide transition-transform duration-100 active:translate-y-px ${
                selected ? "bg-anchor text-paper" : "bg-surface text-ink border-ink-tint"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {mark !== null && (
        <label className="flex flex-col gap-1.5">
          <span className="field-label">A note for later, if you like</span>
          <input
            type="text"
            value={note}
            onChange={(event) => changeNote(event.target.value)}
            maxLength={JOURNAL_NOTE_MAX}
            placeholder="What actually happened"
            className="field-input"
          />
        </label>
      )}
    </section>
  );
}
