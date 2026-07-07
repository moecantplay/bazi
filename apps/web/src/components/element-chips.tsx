/**
 * A row of element chips: a hue swatch with an ink label. Used for the chart's
 * favorable elements. Renders nothing when the list is empty.
 */

import type { Element } from "@daymaster/bazi-engine";
import { ELEMENT_LABEL, ELEMENT_SWATCH_CLASS } from "@/lib/elements";

interface Props {
  elements: Element[];
}

export function ElementChips({ elements }: Props) {
  if (elements.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {elements.map((element) => (
        <li
          key={element}
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-paper-raised px-3 py-1.5 text-[13px] text-ink"
        >
          <span className={`h-3 w-3 rounded-sm ${ELEMENT_SWATCH_CLASS[element]}`} aria-hidden />
          {ELEMENT_LABEL[element]}
        </li>
      ))}
    </ul>
  );
}
