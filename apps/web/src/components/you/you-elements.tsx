/**
 * Your elements (M24-08): the ones that help you and the ones that wear you
 * down, each a swatch chip with a plain line beside it, closed by one way to
 * ease it. Element names appear only as chip labels (VOICE.md rule 11).
 */

import type { ElementLine, YouElements } from "@daymaster/content";
import { ELEMENT_LABEL, ELEMENT_SWATCH_CLASS } from "@daymaster/presentation";

interface GroupProps {
  title: string;
  entries: ElementLine[];
}

function ElementGroup({ title, entries }: GroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="caption">{title}</p>
      <ul className="flex flex-col gap-2">
        {entries.map(({ element, line }) => (
          <li key={element} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
            <span className="chip justify-self-start py-1.5 text-[13px] text-ink">
              <span className={`h-3 w-3 rounded-sm ${ELEMENT_SWATCH_CLASS[element]}`} aria-hidden />
              {ELEMENT_LABEL[element]}
            </span>
            <span className="text-[14px] leading-snug text-ink-soft">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  elements: YouElements;
}

export function YouElementsSection({ elements }: Props) {
  return (
    <section className="flex flex-col gap-3" aria-label="Your elements">
      <p className="kicker">Your elements</p>
      <div className="card flex flex-col gap-5 p-5">
        <ElementGroup title="What helps you" entries={elements.helps} />
        {elements.wears.length > 0 && <ElementGroup title="What wears you down" entries={elements.wears} />}
        <div className="flex flex-col gap-1">
          <p className="caption">Ease it</p>
          <p className="headline-emphasis text-[17px] leading-snug text-ink">{elements.ease}</p>
        </div>
      </div>
    </section>
  );
}
