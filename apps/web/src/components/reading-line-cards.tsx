/**
 * A list of reading lines, each its own card with a fact-tag caption above
 * the prose — the shape Cycles' "This year"/"This month" sections use.
 * Shared with the luck timeline's per-decade reveal (the second real use of
 * this exact card list, worth extracting rather than duplicating).
 */

import type { ReadingLine } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { TokenText } from "@/components/token-text";

interface Props {
  lines: ReadingLine[];
}

export function ReadingLineCards({ lines }: Props) {
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {lines.map((line, index) => (
        <li key={index} className="card p-5">
          <FactTag line={line} />
          <p className={`text-[15px] leading-relaxed text-ink ${line.factTagRuns ? "mt-1" : ""}`}>
            <TokenText line={line.runs} />
          </p>
        </li>
      ))}
    </ul>
  );
}
