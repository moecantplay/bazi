/**
 * Onboarding's last step (reshape trial): sex at birth, used only to set the
 * direction the ten-year stretches run, plus the verbatim disclaimer. Its
 * acknowledgment gates the step's action, which saves the chart and opens
 * Today.
 */

"use client";

import { useState } from "react";
import { DISCLAIMER } from "@daymaster/content";
import { SegmentedControl } from "@/components/segmented-control";
import type { Sex } from "@/lib/store-types";
import { StepFrame } from "./step-frame";

interface Props {
  value: Sex | null;
  onChange: (sex: Sex) => void;
  onFinish: () => void;
  /** Shown under the action when saving or building the chart failed. */
  error: string | null;
}

const OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" }
];

export function LastStep({ value, onChange, onFinish, error }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <StepFrame
      title="Last one: your sex at birth."
      subtitle="It sets which way your ten-year stretches run. Nothing else in the reading uses it."
      primaryLabel="Show my day"
      onPrimary={onFinish}
      primaryDisabled={value === null || !acknowledged}
    >
      <SegmentedControl options={OPTIONS} value={value} onChange={onChange} ariaLabel="Sex at birth" />

      <section className="card mt-6 flex flex-col gap-3 p-5" aria-label="Before your reading">
        <p className="kicker">Before your reading</p>
        <p className="text-[14px] leading-relaxed text-ink">{DISCLAIMER}</p>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ink"
          />
          I understand this is for reflection, not advice.
        </label>
      </section>

      {error && (
        <p role="alert" className="mt-4 text-sm text-ink">
          {error}
        </p>
      )}
    </StepFrame>
  );
}
