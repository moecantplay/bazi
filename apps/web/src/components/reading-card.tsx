/**
 * One reading line as a card: the fact it came from as a small citation caption
 * (when the line cites one), then the line itself. Used for the chart's
 * structure callouts and the daily reading's body.
 */

import type { ReadingLine } from "@daymaster/content";

interface Props {
  line: ReadingLine;
}

export function ReadingCard({ line }: Props) {
  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-4">
      {line.factTag && (
        <p data-fact-tag className="text-[12px] text-ink-soft">
          {line.factTag}
        </p>
      )}
      <p className={`text-[15px] leading-relaxed text-ink ${line.factTag ? "mt-1.5" : ""}`}>
        {line.text}
      </p>
    </div>
  );
}
