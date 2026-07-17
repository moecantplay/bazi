/**
 * "At a glance" (Co-Star's trouble↔power chart, research 2026-07-16): every
 * modelled activity as one row — the modern label with its classical category
 * as a gloss, a bar growing from the center tick of a watch↔favors axis whose
 * length is the score's strength (leaf-green favours, flame-orange friction,
 * matching the date finder's tints; cinnabar stays the seal's), and the
 * leaning word.
 * Sits directly under the day hero so the scan comes before the prose.
 * Tapping a row unfolds the line that explains why the day leans that way —
 * drawn from the same frames as the suggestion explanations, so the board and
 * a row never tell two stories.
 */

"use client";

import { useState } from "react";
import type { ActivityAssessment, DayQuality } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS, activityAreaLine, stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { LEANING_WORD } from "@/lib/date-finder";

/** Score offsets clamp to ±4 steps; the axis is 4 steps wide per side. */
const MAX_STEPS = 4;

/**
 * A bar growing out of the center tick of a watch↔favors axis: friction fills
 * leftward, favors fills rightward, length = |score|. Neutral leaves the axis
 * bare. A directional fill with no round thumb reads as a measurement, where
 * the earlier dot-on-axis read as a draggable slider.
 */
function AxisBar({ assessment }: { assessment: ActivityAssessment }) {
  const steps = Math.min(MAX_STEPS, Math.abs(assessment.score));
  const favors = assessment.leaning === "favors";
  const friction = assessment.leaning === "friction";
  const width = (steps / MAX_STEPS) * 50;

  return (
    <span className="relative h-2 w-24 shrink-0" aria-hidden="true">
      <span className="bg-ink-tint absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full" />
      <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-ink-soft opacity-40" />
      {(favors || friction) && (
        <span
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{
            width: `${width}%`,
            background: favors ? "var(--element-wood)" : "var(--element-fire)",
            ...(favors ? { left: "50%" } : { right: "50%" })
          }}
        />
      )}
    </span>
  );
}

interface Props {
  quality: DayQuality;
  /** The daily seedKey, so row details stay in step with the day's reading. */
  seedKey: string;
}

export function AreaGauges({ quality, seedKey }: Props) {
  const [openActivity, setOpenActivity] = useState<string | null>(null);
  const [showNeutral, setShowNeutral] = useState(false);
  const display = (text: string) => stripHanCharacters(text);

  const leaning = quality.assessments.filter((entry) => entry.leaning !== "neutral");
  const neutral = quality.assessments.filter((entry) => entry.leaning === "neutral");
  // A day with no leanings at all keeps every row visible — a lone disclosure
  // button under a kicker would be an empty section.
  const collapsible = leaning.length > 0 && neutral.length > 0;
  const visible = collapsible && !showNeutral ? leaning : [...leaning, ...neutral];

  return (
    <section data-areas className="flex flex-col gap-2">
      <h2 className="kicker">At a glance</h2>
      <ul className="stack">
        {visible.map((assessment) => {
          const isOpen = openActivity === assessment.activity;
          const label = ACTIVITY_LABELS[assessment.activity];
          const detail = isOpen
            ? activityAreaLine(quality, assessment.activity, seedKey)
            : null;
          return (
            <li key={assessment.activity}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={`${label.label}: ${LEANING_WORD[assessment.leaning]}`}
                onClick={() => setOpenActivity(isOpen ? null : assessment.activity)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
              >
                <span className="min-w-0 text-[14px] text-ink">{label.label}</span>
                <span className="flex items-center gap-2">
                  <AxisBar assessment={assessment} />
                  <span className="w-14 text-right text-[11px] text-ink-soft">
                    {LEANING_WORD[assessment.leaning]}
                  </span>
                </span>
              </button>
              {detail && (
                <div className="px-4 pb-3">
                  <p className="text-[15px] leading-relaxed text-ink">{display(detail.text)}</p>
                  <FactTag line={detail} className="caption mt-0.5" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {collapsible && (
        <button
          type="button"
          data-areas-toggle
          aria-expanded={showNeutral}
          onClick={() => setShowNeutral((current) => !current)}
          className="tap-target self-start text-[12px] text-ink-soft hover:text-ink"
        >
          {showNeutral
            ? "Show fewer areas"
            : `Show all ${quality.assessments.length} areas →`}
        </button>
      )}
    </section>
  );
}
