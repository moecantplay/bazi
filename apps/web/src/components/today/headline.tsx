/** The day's headline hook: Bricolage 800 with the serif-italic emphasis run (DESIGN.md §Type). Each look sets the size. */

import type { HeadlineRun } from "@daymaster/presentation";

interface Props {
  runs: HeadlineRun[];
  className?: string;
}

export function Headline({ runs, className = "" }: Props) {
  return (
    <h2 data-headline className={`font-display leading-[1.07] tracking-[-0.022em] text-ink [text-wrap:balance] ${className}`}>
      {runs.map((run, index) =>
        run.emphasized ? (
          <em key={index} className="headline-emphasis">
            {run.text}
          </em>
        ) : (
          run.text
        )
      )}
    </h2>
  );
}

/** "yang fire · horse day": the day pillar in words, for each look's meta line. */
export function dayMeta(stemGloss: string, branchGloss: string): string {
  return `${stemGloss} · ${branchGloss} day`;
}
