/**
 * Today's trail signs: one card that reads the day's activities top to bottom.
 * The skyline plot across all 10 almanac activities sits on top; beneath it
 * two sign rows — "Clear trail" (favors) and "Take it slow" (friction, rule-12
 * postponement never prohibition) — name the strongest leanings in words; a
 * disclosure opens the full 10-activity manifest last. The grouped guidance
 * prose follows the card. Used by Conditions; Today has its own suits.
 *
 * Before 2026-09-10 the chips lived in two separate tiles under a separate
 * terrain card, so the same ten activities were drawn twice on one screen.
 * The rows are the chips; the dots are the rows — one section, one grammar.
 *
 * The favors/watch split and the fact-tag grouping are presentation's
 * `guidanceBoardFor`/`groupGuidanceByFactTag` — this component only renders.
 */

"use client";

import { useState } from "react";
import type { ActivityAssessment } from "@daymaster/bazi-engine";
import type { ReadingLine } from "@daymaster/content";
import { groupGuidanceByFactTag, guidanceBoardFor, type GuidanceChip } from "@daymaster/presentation";
import { ActivityManifest, ActivityTerrainPlot, useActivityTerrain } from "@/components/activity-terrain";
import { FactTag } from "@/components/fact-tag";
import { TokenText } from "@/components/token-text";

interface SignRowProps {
  title: string;
  emphasis: "wood" | "amber";
  chips: GuidanceChip[];
}

function SignRow({ title, emphasis, chips }: SignRowProps) {
  const dotClass = emphasis === "wood" ? "bg-ink" : "bg-signal-amber";
  const titleClass = emphasis === "wood" ? "text-element-wood" : "text-signal-amber";
  const names = chips.map((chip) => chip.label).join(" · ");

  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-baseline gap-2.5">
        <span aria-hidden className={`mt-px h-[9px] w-[9px] flex-none self-center rounded-full ${dotClass}`} />
        <span className={`font-mono text-[10px] font-bold uppercase tracking-wide ${titleClass}`}>{title}</span>
        <span className="text-[13px] font-semibold leading-snug text-ink">
          {names.length > 0 ? names : "Nothing leans hard today"}
        </span>
      </h3>
    </div>
  );
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-2.5 w-2.5 flex-none transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
    >
      <path d="M4 1.5L9 6L4 10.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  assessments: ActivityAssessment[];
  chips: GuidanceChip[];
  /** The guidance prose: officer line plus chip explanations, fact-cited. */
  proseLines: ReadingLine[];
}

export function TrailSigns({ assessments, chips, proseLines }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const cells = useActivityTerrain(assessments);
  const board = guidanceBoardFor(chips);
  const calledOut = new Set(chips.map((chip) => chip.activity));

  return (
    <section data-guidance className="flex flex-col gap-4">
      <p className="kicker">Trail signs</p>
      <div data-activity-terrain className="rounded-card bg-surface p-4 shadow-card">
        <ActivityTerrainPlot cells={cells} calledOut={calledOut} />

        <div data-dos-donts className="mt-4 flex flex-col gap-4 border-t border-hairline pt-4">
          <SignRow title="Clear trail" emphasis="wood" chips={board.favors} />
          <SignRow title="Take it slow" emphasis="amber" chips={board.watch} />
        </div>

        <button
          type="button"
          aria-expanded={detailOpen}
          onClick={() => setDetailOpen((open) => !open)}
          className="tap-target mt-3 flex w-full items-center justify-between border-t border-hairline pt-3 text-[12px] font-bold uppercase tracking-wide text-ink"
        >
          {detailOpen ? "Hide details" : "Show all 10 in detail"}
          <ChevronIcon open={detailOpen} />
        </button>

        {detailOpen && <ActivityManifest cells={cells} />}
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
