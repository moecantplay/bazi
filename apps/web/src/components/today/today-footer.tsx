/** After the reading, in every look: how this reading works, the journal, the streak and the tomorrow line. */

"use client";

import { useState } from "react";
import { READING_TOPIC, glossaryEntry } from "@daymaster/content";
import { streakLine } from "@daymaster/presentation";
import { DayJournal } from "@/components/day-journal";
import { GlossarySheet } from "@/components/glossary-sheet";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function AboutReadingLink() {
  const [open, setOpen] = useState(false);
  const entry = glossaryEntry(READING_TOPIC);
  if (!entry) {
    return null;
  }
  return (
    <>
      <button
        type="button"
        data-about-reading
        onClick={() => setOpen(true)}
        className="tap-target self-start text-[13px] text-ink-soft hover:text-ink"
      >
        How this reading works &rarr;
      </button>
      {open && <GlossarySheet entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
}

export function TodayFooter({ screen }: Props) {
  const { offset, streak, today, dateISO } = screen;
  return (
    <>
      {offset <= 0 && <DayJournal dateISO={dateISO} isToday={offset === 0} />}
      {offset === 0 && streak >= 2 && (
        <p data-streak className="text-center text-[12px] text-ink-soft">
          {streakLine(streak, today)}
        </p>
      )}
      {offset === 0 && (
        <p className="text-center text-[12px] text-ink-soft">Tomorrow reads differently. It&rsquo;ll be here in the morning.</p>
      )}
    </>
  );
}
