/**
 * The "What the marks mean" link: opens the sheet for the marks drawn right
 * above it. Each look's week passes its own topic, as does Explorer's route
 * (M24-15), so a sheet never describes marks the reader can't see.
 */

"use client";

import { useState } from "react";
import { glossaryEntry } from "@daymaster/content";
import { GlossarySheet } from "@/components/glossary-sheet";

interface Props {
  topic: string;
}

export function MarksLegendLink({ topic }: Props) {
  const [open, setOpen] = useState(false);
  const entry = glossaryEntry(topic);
  if (!entry) {
    return null;
  }
  return (
    <>
      <button
        type="button"
        data-marks-legend={topic}
        onClick={() => setOpen(true)}
        className="tap-target mx-auto block px-3 py-2 text-[12px] text-ink-soft hover:text-ink active:text-ink"
      >
        What the marks mean &rsaquo;
      </button>
      {open && <GlossarySheet entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
}
