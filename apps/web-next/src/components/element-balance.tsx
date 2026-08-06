/**
 * Five-element balance as horizontal bars. The element hue is the bar fill; the
 * label and count are ink text beside it (DESIGN.md: element colors are fills,
 * never normal-size text). Counts come straight from the chart.
 */

import type { Element } from "@daymaster/bazi-engine";
import { ELEMENT_LABEL, ELEMENT_ORDER, ELEMENT_SWATCH_CLASS } from "@daymaster/presentation";

interface Props {
  counts: Record<Element, number>;
}

export function ElementBalance({ counts }: Props) {
  const max = Math.max(1, ...ELEMENT_ORDER.map((element) => counts[element]));

  return (
    <ul className="flex flex-col gap-2.5">
      {ELEMENT_ORDER.map((element) => {
        const count = counts[element];
        const width = `${(count / max) * 100}%`;
        return (
          <li key={element} className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-[13px] text-ink">{ELEMENT_LABEL[element]}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-hairline">
              <span
                className={`block h-full rounded-full ${ELEMENT_SWATCH_CLASS[element]}`}
                style={{ width }}
                aria-hidden
              />
            </span>
            <span className="w-4 shrink-0 text-right text-[13px] tabular-nums text-ink-soft">
              {count}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
