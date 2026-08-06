/**
 * The day's merged guidance board, restyled as trail signs (DESIGN.md
 * §Surfaces): two tiles — "Clear trail" and "Take it slow" — replacing
 * "Favors"/"Watch" (still rule-12 compliant: postponement, never
 * prohibition). Each tile is a word list of the day's almanac activities
 * followed by the fact-cited suggestions; the grouped guidance prose below
 * is unchanged from the old DayBoard, only the tile chrome and headings move.
 *
 * The favors/watch split and the fact-tag grouping are presentation's
 * `guidanceBoardFor`/`groupGuidanceByFactTag` (Phase 5) — this component only
 * renders them. Prose renders through TokenText(line.runs) directly —
 * ReadingLine.runs is required as of M19 Phase 11's content cleanup.
 */

"use client";

import type { ReadingLine } from "@daymaster/content";
import { groupGuidanceByFactTag, guidanceBoardFor, type GuidanceChip } from "@daymaster/presentation";
import { FactTag } from "@/components/fact-tag";
import { TokenText } from "@/components/token-text";

interface SignProps {
  title: string;
  emphasis: "wood" | "amber";
  chips: GuidanceChip[];
  suggestions: ReadingLine[];
}

function BlazeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[17px] w-[17px] flex-none">
      <rect x="8.5" y="3.5" width="7" height="7.5" rx="1.5" />
      <rect x="8.5" y="13" width="7" height="7.5" rx="1.5" />
    </svg>
  );
}

function CairnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[17px] w-[17px] flex-none">
      <ellipse cx="12" cy="18.5" rx="7" ry="3" />
      <ellipse cx="12" cy="13.2" rx="5" ry="2.7" />
      <ellipse cx="12" cy="8.8" rx="3.3" ry="2.3" />
    </svg>
  );
}

function TrailSign({ title, emphasis, chips, suggestions }: SignProps) {
  const ringColor = emphasis === "wood" ? "var(--element-wood)" : "var(--signal-amber)";
  const textClass = emphasis === "wood" ? "text-element-wood" : "text-signal-amber";

  return (
    <div
      className="rounded-tile bg-surface p-3.5"
      style={{ boxShadow: `inset 0 0 0 1.5px ${ringColor}` }}
    >
      <h3 className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wide ${textClass}`}>
        {emphasis === "wood" ? <BlazeIcon /> : <CairnIcon />}
        {title}
      </h3>
      {chips.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {chips.map((chip) => (
            <li key={chip.activity} className="text-[12.5px] font-semibold leading-snug text-ink">
              {chip.label}
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-3 flex flex-col gap-2.5 border-t border-hairline pt-3">
        {suggestions.map((line, index) => (
          <li key={index}>
            <p className="text-[13px] leading-relaxed text-ink">
              <TokenText line={line.runs} />
            </p>
            <FactTag line={line} className="caption mt-0.5" />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  chips: GuidanceChip[];
  /** The guidance prose: officer line plus chip explanations, fact-cited. */
  proseLines: ReadingLine[];
  dos: ReadingLine[];
  donts: ReadingLine[];
}

function GuidanceGroup({ lines }: { lines: ReadingLine[] }) {
  const first = lines[0];
  if (!first) {
    return null;
  }

  return (
    <div className="card p-5">
      <FactTag line={first} />
      <div className="mt-1.5 flex flex-col gap-2">
        {lines.map((line, index) => (
          <p key={index} className="text-[15px] leading-relaxed text-ink">
            <TokenText line={line.runs} />
          </p>
        ))}
      </div>
    </div>
  );
}

export function TrailSigns({ chips, proseLines, dos, donts }: Props) {
  const board = guidanceBoardFor(chips);

  return (
    <section data-guidance className="flex flex-col gap-4">
      <p className="kicker">Trail signs</p>
      <div data-dos-donts className="grid grid-cols-2 gap-2">
        <TrailSign title="Clear trail" emphasis="wood" chips={board.favors} suggestions={dos} />
        <TrailSign title="Take it slow" emphasis="amber" chips={board.watch} suggestions={donts} />
      </div>
      {proseLines.length > 0 && (
        <div className="flex flex-col gap-2">
          {groupGuidanceByFactTag(proseLines).map((group, index) => (
            <GuidanceGroup key={index} lines={group} />
          ))}
        </div>
      )}
    </section>
  );
}
