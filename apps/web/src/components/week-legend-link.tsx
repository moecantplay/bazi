/**
 * The week's shared vocabulary: each day's tone in words (the accessible
 * name every week control uses) and the "What the marks mean" explainer
 * link. Every look's week — elevation strip, calendar strip, tone rings —
 * uses both, so the explainer is never dropped by a look.
 */

"use client";

import { useState } from "react";
import { WEEK_TOPIC, glossaryEntry } from "@daymaster/content";
import type { DayTone } from "@daymaster/presentation";
import { GlossarySheet } from "@/components/glossary-sheet";

export const WEEK_TONE_WORD: Record<DayTone, string> = {
  favoured: "leans favorable",
  friction: "leans toward friction",
  even: "even day"
};

export function WeekLegendLink() {
  const [open, setOpen] = useState(false);
  const entry = glossaryEntry(WEEK_TOPIC);
  if (!entry) {
    return null;
  }
  return (
    <>
      <button
        type="button"
        data-week-legend
        onClick={() => setOpen(true)}
        className="tap-target mx-auto block px-3 py-2 text-[12px] text-ink-soft hover:text-ink active:text-ink"
      >
        What the marks mean &rsaquo;
      </button>
      {open && <GlossarySheet entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
}
