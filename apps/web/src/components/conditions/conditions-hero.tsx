/**
 * The "current conditions" block: the day officer as the condition (icon +
 * name), the day's stem and animal, the headline as the one-line summary,
 * the officer's everyday gloss as the "feels like" line, and up to three
 * index tiles for the activities that lean. No numbers anywhere — the
 * conditions are texture words, never a score.
 */

import type { ActivityAssessment, Element } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";
import type { HeadlineRun } from "@daymaster/presentation";
import { ConditionIcon } from "@/components/conditions/condition-icon";

const INDEX_TILE_COUNT = 3;

interface Props {
  officerKey: string;
  officerName: string;
  gloss: string;
  element: Element;
  stemGloss: string;
  animal: string;
  headline: HeadlineRun[];
  assessments: readonly ActivityAssessment[];
}

export function ConditionsHero({
  officerKey,
  officerName,
  gloss,
  element,
  stemGloss,
  animal,
  headline,
  assessments
}: Props) {
  const leaning = assessments
    .filter((assessment) => assessment.leaning !== "neutral")
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, INDEX_TILE_COUNT);

  return (
    <section data-conditions-hero className="flex flex-col gap-4 rounded-hero bg-surface p-5 shadow-hero">
      <div className="flex items-center gap-4">
        <ConditionIcon officerKey={officerKey} officerName={officerName} element={element} size={84} />
        <div className="min-w-0">
          <h2 data-condition className="font-display text-[44px] leading-none tracking-[-0.025em] text-ink">
            {officerName}
          </h2>
          <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-ink-soft">
            <span style={{ color: `var(--element-${element})` }}>{stemGloss}</span> · {animal} day
          </p>
        </div>
      </div>

      <p className="font-display text-[21px] leading-[1.2] tracking-[-0.015em] text-ink [text-wrap:balance]">
        {headline.map((run, index) =>
          run.emphasized ? (
            <em
              key={index}
              className="font-medium italic"
              style={{ fontFamily: 'ui-serif, "New York", Georgia, serif' }}
            >
              {run.text}
            </em>
          ) : (
            run.text
          )
        )}
      </p>

      <p className="text-[14px] leading-relaxed text-ink">
        A {officerName} day: {gloss}.
      </p>

      {leaning.length > 0 && (
        <ul className="grid list-none grid-cols-3 gap-2" aria-label="What leans today">
          {leaning.map((assessment) => {
            const slow = assessment.leaning === "friction";
            return (
              <li
                key={assessment.activity}
                className={`flex min-h-16 flex-col gap-1 rounded-tile px-3 py-2.5 ${
                  slow ? "bg-signal-amber-fill" : "bg-ink-tint"
                }`}
              >
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-[.15em] ${
                    slow ? "text-signal-amber" : "text-ink-soft"
                  }`}
                >
                  {slow ? "Take it slow" : "Clear trail"}
                </span>
                <span className="text-[13px] font-semibold leading-tight text-ink">
                  {ACTIVITY_LABELS[assessment.activity].label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
