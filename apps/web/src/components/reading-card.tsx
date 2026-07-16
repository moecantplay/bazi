/**
 * One reading line as a tonal content card (DESIGN.md §Surfaces): the fact it
 * came from as a citation caption (when the line cites one), then the line
 * itself — a borderless `--surface` fill, radius 24; parents stack these with
 * 8px gaps. The caption opens its glossary explainer when the line carries a
 * topic; when that topic also has a read-more deep dive, the card closes with
 * a "Read more" arrow link that opens it. With Chinese characters turned off,
 * both texts render through stripHanCharacters.
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
  /** Render without the tonal container — for lines already inside a card. */
  flat?: boolean;
}

export function ReadingCard({ line, flat = false }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  const dive = line.topic ? readMoreEntry(line.topic) : undefined;

  return (
    <div className={flat ? "" : "card p-5"}>
      <FactTag line={line} />
      <p className={`text-[15px] leading-relaxed text-ink ${line.factTag ? "mt-1.5" : ""}`}>
        {display(line.text)}
      </p>
      {dive && (
        <button
          type="button"
          data-read-more
          onClick={() => setReadMoreOpen(true)}
          className="tap-target mt-2 text-[12px] text-ink-soft hover:text-ink"
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
