/**
 * The ranked date-finder results: one card per day, best first. Each card shows
 * the date, the day's transit pillar, its officer (name plus everyday gloss),
 * and a tinted pillar cell for every chart — leaf-green where the day favours
 * that chart, flame-orange where it meets friction, plain paper where it's
 * even. The cinnabar red belongs to the seal, so friction reads as Fire, not
 * cinnabar. The top day carries its verdict line underneath.
 */

"use client";

import type { ActivityAssessment, DateCandidate } from "@daymaster/bazi-engine";
import { dateVerdictLine, OFFICER_GLOSSES } from "@daymaster/content";
import { LEANING_TINT, LEANING_WORD, formatLong } from "@daymaster/presentation";
import { PillarGlyph } from "@/components/pillar-glyph";
import { ReadingCard } from "@/components/reading-card";

function OfficerName({ officer }: { officer: DateCandidate["officer"] }) {
  return <span className="text-[13px] text-ink">{officer.english}</span>;
}

function LeaningCell({
  assessment,
  label
}: {
  assessment: ActivityAssessment;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5"
      style={{ background: LEANING_TINT[assessment.leaning] }}
      aria-label={`${label}: ${LEANING_WORD[assessment.leaning]}`}
    >
      <span className="text-[12px] leading-none text-ink">
        {LEANING_WORD[assessment.leaning]}
      </span>
      {/* Full ink, not ink-soft: muted text on the tinted leaning fill fails
          AA (measured 3.14-3.65:1 across terrains) — same fix as the
          segmented-control/legend-tags tinted-background bugs. */}
      <span className="text-[10px] text-ink">{label}</span>
    </div>
  );
}

interface Props {
  candidates: DateCandidate[];
  /** Chart display names in the candidates' per-chart order (you first). */
  chartLabels: string[];
  /** Base seed for the top day's verdict line; the date is appended. */
  verdictSeedBase: string;
}

export function DateResults({ candidates, chartLabels, verdictSeedBase }: Props) {
  if (candidates.length === 0) {
    return (
      <p className="text-[14px] text-ink-soft">
        No days came back for that window. Try a wider range.
      </p>
    );
  }

  return (
    <ol data-date-results className="flex flex-col gap-3">
      {candidates.map((candidate, index) => (
        <li key={candidate.date} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[15px] text-ink">{formatLong(candidate.date)}</span>
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <OfficerName officer={candidate.officer} />
                {OFFICER_GLOSSES[candidate.officer.key] && (
                  <span className="text-[11px] text-ink-soft">
                    {OFFICER_GLOSSES[candidate.officer.key]}
                  </span>
                )}
              </span>
            </div>
            <PillarGlyph pillar={candidate.pillar} size="sm" />
          </div>

          <div data-leaning-swatches className="mt-3 flex flex-wrap gap-2">
            {candidate.perChart.map((assessment, chartIndex) => (
              <LeaningCell
                key={chartIndex}
                assessment={assessment}
                label={chartLabels[chartIndex] ?? `Chart ${chartIndex + 1}`}
              />
            ))}
          </div>

          {index === 0 && (
            <div className="mt-3 border-t border-hairline pt-3">
              <ReadingCard
                flat
                line={dateVerdictLine(candidate, `${verdictSeedBase}|${candidate.date}`)}
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
