/** Onboarding step 1: birth date, validated to the engine's 1900-2100 range. */

import { isYearInRange } from "@/lib/pillars";
import { StepFrame } from "./step-frame";

interface Props {
  value: string;
  onChange: (date: string) => void;
  onNext: () => void;
}

export function DateStep({ value, onChange, onNext }: Props) {
  const hasValue = value.length > 0;
  const inRange = hasValue && isYearInRange(value);
  const showRangeError = hasValue && !inRange;

  return (
    <StepFrame
      title="When were you born?"
      subtitle="Your birth date anchors the whole chart."
      primaryLabel="Next"
      onPrimary={onNext}
      primaryDisabled={!inRange}
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm text-ink">Birth date</span>
        <input
          type="date"
          min="1900-01-01"
          max="2100-12-31"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="field-input"
        />
      </label>
      {showRangeError && (
        <p className="mt-3 text-sm text-ink" role="alert">
          That date is outside the supported range (1900&ndash;2100). Check the year.
        </p>
      )}
    </StepFrame>
  );
}
