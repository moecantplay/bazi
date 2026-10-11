/**
 * Your colours (M24-08): colours that suit you and colours to go easy on, each
 * a small swatch with its name, then where they apply and one honest fix
 * (DESIGN.md §Colour swatches, VOICE.md rule 12).
 */

import type { Colour, YouColours } from "@daymaster/content";
import { COLOUR_SWATCH } from "@daymaster/presentation";

/** A mid-grey inset ring so white shows on light ground and black on dark. */
const SWATCH_RING = "inset 0 0 0 1px rgba(128, 128, 128, 0.5)";

interface GroupProps {
  title: string;
  colours: Colour[];
}

function ColourGroup({ title, colours }: GroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="caption">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {colours.map((colour) => (
          <li key={colour} className="chip py-1.5 text-[13px] capitalize text-ink">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: COLOUR_SWATCH[colour], boxShadow: SWATCH_RING }}
              aria-hidden
            />
            {colour}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  colours: YouColours;
}

export function YouColoursCard({ colours }: Props) {
  return (
    <section className="flex flex-col gap-3" aria-label="Your colours">
      <p className="kicker">Your colours</p>
      <div className="card flex flex-col gap-5 p-5">
        <ColourGroup title="Colours that suit you" colours={colours.suit} />
        {colours.easyOn.length > 0 && <ColourGroup title="Go easy on" colours={colours.easyOn} />}
        <div className="flex flex-col gap-1">
          <p className="text-[14px] leading-snug text-ink-soft">{colours.where}</p>
          {colours.fix && <p className="headline-emphasis text-[17px] leading-snug text-ink">{colours.fix}</p>}
        </div>
      </div>
    </section>
  );
}
