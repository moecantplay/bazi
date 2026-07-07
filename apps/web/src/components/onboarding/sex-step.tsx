/**
 * Onboarding step 4: sex. Used only to set which direction the luck cycles run;
 * the one-line note says exactly that and nothing more.
 */

import type { Sex } from "@/lib/profile";
import { StepFrame } from "./step-frame";

interface Props {
  value: Sex | null;
  onChange: (sex: Sex) => void;
  onNext: () => void;
}

const OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" }
];

export function SexStep({ value, onChange, onNext }: Props) {
  return (
    <StepFrame
      title="Sex at birth"
      subtitle="Used only to set the direction your luck cycles run — nothing else in the reading."
      primaryLabel="Next"
      onPrimary={onNext}
      primaryDisabled={value === null}
    >
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Sex at birth">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-base ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-ink-soft bg-paper-raised text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}
