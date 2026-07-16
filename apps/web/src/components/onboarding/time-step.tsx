/**
 * Onboarding step 2: birth time, or an explicit "I don't know my birth time".
 * An unknown time yields a three-pillar chart with no hour claims anywhere.
 */

import { StepFrame } from "./step-frame";

interface Props {
  time: string;
  unknown: boolean;
  onTimeChange: (time: string) => void;
  onUnknownChange: (unknown: boolean) => void;
  onNext: () => void;
}

export function TimeStep({ time, unknown, onTimeChange, onUnknownChange, onNext }: Props) {
  const canAdvance = unknown || time.length > 0;

  return (
    <StepFrame
      title="What time?"
      subtitle="The hour sets the fourth pillar. If you're not sure, that's fine — the chart works with three."
      primaryLabel="Next"
      onPrimary={onNext}
      primaryDisabled={!canAdvance}
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm text-ink">Birth time</span>
        <input
          type="time"
          value={time}
          disabled={unknown}
          onChange={(event) => onTimeChange(event.target.value)}
          className="field-input disabled:opacity-40"
        />
      </label>

      <label className="mt-5 flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(event) => onUnknownChange(event.target.checked)}
          className="h-4 w-4 accent-ink"
        />
        I don&rsquo;t know my birth time
      </label>
    </StepFrame>
  );
}
