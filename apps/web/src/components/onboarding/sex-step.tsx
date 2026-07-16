/**
 * Onboarding step 4: sex. Used only to set which direction the luck cycles run;
 * the one-line note says exactly that and nothing more.
 */

import { SegmentedControl } from "@/components/segmented-control";
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
      <SegmentedControl
        options={OPTIONS}
        value={value}
        onChange={onChange}
        ariaLabel="Sex at birth"
      />
    </StepFrame>
  );
}
