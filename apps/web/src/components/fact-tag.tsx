/**
 * A reading line's citation caption. When the line carries a glossary topic,
 * the caption becomes a link that opens the explainer sheet — every system
 * term is one tap from its plain-language description. Lines without a topic
 * render the caption as before. Renders factTagRuns through TokenText rather
 * than stripHanCharacters(factTag) — see M19 decision F.
 */

"use client";

import { useState } from "react";
import type { ReadingLine } from "@daymaster/content";
import { glossaryEntry } from "@daymaster/content";
import { GlossarySheet } from "@/components/glossary-sheet";
import { TokenText } from "@/components/token-text";
import { plainText } from "@/lib/content-runs";

interface Props {
  line: ReadingLine;
  className?: string;
}

export function FactTag({ line, className = "caption" }: Props) {
  const [open, setOpen] = useState(false);

  if (!line.factTagRuns) {
    return null;
  }
  const runs = line.factTagRuns;
  const entry = line.topic ? glossaryEntry(line.topic) : undefined;

  if (!entry) {
    return (
      <p data-fact-tag className={className}>
        <TokenText line={runs} />
      </p>
    );
  }

  return (
    <>
      <p data-fact-tag className={className}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${plainText(runs)} — what is this?`}
          className="tap-target inline-flex items-baseline gap-1 text-left hover:text-ink"
        >
          <TokenText line={runs} />
          <span aria-hidden="true" className="text-[13px] leading-none">
            &rsaquo;
          </span>
        </button>
      </p>
      {open && <GlossarySheet entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
}
