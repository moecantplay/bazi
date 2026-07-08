/**
 * One reading line as a card: the fact it came from as a small citation caption
 * (when the line cites one), then the line itself. Used for the chart's
 * structure callouts and the daily reading's body. With Chinese characters
 * turned off, both texts render through stripHanCharacters — the English the
 * line already carries stands alone.
 */

"use client";

import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { useHanCharacters } from "@/components/han-characters-provider";

interface Props {
  line: ReadingLine;
}

export function ReadingCard({ line }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-4">
      {line.factTag && (
        <p data-fact-tag className="text-[12px] text-ink-soft">
          {display(line.factTag)}
        </p>
      )}
      <p className={`text-[15px] leading-relaxed text-ink ${line.factTag ? "mt-1.5" : ""}`}>
        {display(line.text)}
      </p>
    </div>
  );
}
