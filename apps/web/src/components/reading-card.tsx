/**
 * One reading line as a card: the fact it came from as a small citation caption
 * (when the line cites one), then the line itself. The caption links to its
 * glossary category explainer when the line carries a topic; when that topic
 * also has a read-more deep dive, the card closes with a "Read more" link that
 * opens it. Used for the chart's structure callouts and the daily reading's
 * body. With Chinese characters turned off, both texts render through
 * stripHanCharacters — the English the line already carries stands alone.
 */

"use client";

import { useState } from "react";
import type { ReadingLine } from "@daymaster/content";
import { readMoreEntry, stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { GlossarySheet } from "@/components/glossary-sheet";
import { useHanCharacters } from "@/components/han-characters-provider";

interface Props {
  line: ReadingLine;
}

export function ReadingCard({ line }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  const dive = line.topic ? readMoreEntry(line.topic) : undefined;

  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-4">
      <FactTag line={line} />
      <p className={`text-[15px] leading-relaxed text-ink ${line.factTag ? "mt-1.5" : ""}`}>
        {display(line.text)}
      </p>
      {dive && (
        <button
          type="button"
          data-read-more
          onClick={() => setReadMoreOpen(true)}
          className="mt-2 text-[13px] text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Read more &rarr;
        </button>
      )}
      {readMoreOpen && dive && (
        <GlossarySheet entry={dive} onClose={() => setReadMoreOpen(false)} />
      )}
    </div>
  );
}
