/**
 * The reader's best hour on Explorer's route (DESIGN.md §Explorer, M24-13):
 * a disc in the fill of the hour's own element, ringed in its hue, with the
 * hour animal and a four-point star, labelled "SUITS YOU · 11 AM–1 PM".
 * When NOW is inside the hour, the disc steps aside for NOW; the label stays.
 */

import { describeBranch, type BestHourMark } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import { BestHourStar, elementFill, elementHue } from "../best-hour-star";
import { labelPlacement, routeX, routeY } from "./route-geometry";

interface Props {
  mark: BestHourMark;
  /** NOW is inside this hour and draws in its place. */
  hidden: boolean;
}

export function BestHourRouteMark({ mark, hidden }: Props) {
  const x = routeX(mark.progress);
  const y = routeY(x);
  const label = `SUITS YOU · ${mark.label.toUpperCase()}`;
  const placed = labelPlacement(x, y, label);
  return (
    <g data-waypoint="best-hour" className="arrive-pop" style={{ ["--d" as string]: 8 }}>
      {!hidden && (
        <g>
          <circle cx={x} cy={y} r={17} fill={elementFill(mark.element)} stroke={elementHue(mark.element)} strokeWidth={2} />
          <g style={{ color: "var(--ink)" }}>
            <AnimalGlyphMark
              animal={describeBranch(mark.branch).gloss}
              transform={`translate(${x - 9.5} ${y - 9.5}) scale(${19 / 24})`}
              renderSize={19}
            />
          </g>
          <BestHourStar x={x + 13} y={y - 15} element={mark.element} />
        </g>
      )}
      <text className="svg-label" x={placed.x} y={placed.y} fontSize={9.5} fill="var(--ink)" textAnchor={placed.anchor}>
        {label}
      </text>
    </g>
  );
}
