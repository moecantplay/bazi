/**
 * "Your day, by area": every modelled activity as one row — the modern label
 * with its classical category as a gloss, a four-cell meter filled to the
 * score's strength (leaf-green favours, flame-orange friction, matching the
 * date finder's tint convention; cinnabar stays the seal's), and the leaning
 * word. Tapping a row unfolds the line that explains why the day leans that
 * way — drawn from the same frames as the chip explanations, so a chip and
 * its row never tell two stories.
 */

"use client";

import { useState } from "react";
import type { ActivityAssessment, DayQuality } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS, activityAreaLine, stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { useHanCharacters } from "@/components/han-characters-provider";
import { LEANING_WORD } from "@/lib/date-finder";

const METER_CELLS = 4;

function Meter({ assessment }: { assessment: ActivityAssessment }) {
  const filled =
    assessment.leaning === "neutral"
      ? 0
      : Math.min(METER_CELLS, Math.abs(assessment.score));
  const hue =
    assessment.leaning === "favors" ? "var(--element-wood)" : "var(--element-fire)";

  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: METER_CELLS }, (_, index) => (
        <span
          key={index}
          className="h-2 w-2 rounded-sm border border-hairline"
          style={index < filled ? { background: hue, borderColor: "transparent" } : undefined}
        />
      ))}
    </span>
  );
}

interface Props {
  quality: DayQuality;
  /** The daily seedKey, so row details stay in step with the day's reading. */
  seedKey: string;
}

export function AreaGauges({ quality, seedKey }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const [openActivity, setOpenActivity] = useState<string | null>(null);
  const [showNeutral, setShowNeutral] = useState(false);
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  const leaning = quality.assessments.filter((entry) => entry.leaning !== "neutral");
  const neutral = quality.assessments.filter((entry) => entry.leaning === "neutral");
  // A day with no leanings at all keeps every row visible — a lone disclosure
  // button under a kicker would be an empty section.
  const collapsible = leaning.length > 0 && neutral.length > 0;
  const visible = collapsible && !showNeutral ? leaning : [...leaning, ...neutral];

  return (
    <section data-areas className="flex flex-col gap-2">
      <h2 className="kicker">Your day, by area</h2>
      <ul className="flex flex-col divide-y divide-hairline rounded-xl border border-hairline bg-paper-raised dark-borderless">
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
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[14px] text-ink">{label.label}</span>
                  {showHanCharacters && (
                    <span className="font-han text-[12px] text-ink-soft">{label.chinese}</span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <Meter assessment={assessment} />
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
