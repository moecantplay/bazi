/**
 * The last step before the reveal (M19.9-04): the reader's own day previewed
 * in each look, and a pick. The button says what it will do; the pick is
 * applied on continue, so the reveal and everything after open in it.
 */

"use client";

import { useMemo } from "react";
import { LookPicker, lookName } from "@/components/look-picker";
import { usePreviewScreen } from "@/components/today/use-preview-screen";
import { applyLookPreference } from "@/lib/store";
import type { LookPreference, StoredBirth, StoredProfile } from "@/lib/store-types";
import { ONBOARDING_CONFIG } from "./draft";
import { StepFrame } from "./step-frame";

interface Props {
  birth: StoredBirth;
  value: LookPreference;
  onChange: (look: LookPreference) => void;
  onNext: () => void;
}

export function LookStep({ birth, value, onChange, onNext }: Props) {
  const { date, time, city, sex } = birth;
  // Keyed on the fields, not the object: the page assembles a fresh `birth` every render.
  const profile = useMemo<StoredProfile>(
    () => ({ birth: { date, time, city, sex }, config: ONBOARDING_CONFIG, createdAt: "" }),
    [date, time, city, sex]
  );
  const screen = usePreviewScreen(profile);

  function next() {
    applyLookPreference(value);
    onNext();
  }

  return (
    <StepFrame
      title="Choose your look"
      subtitle="Same reading, three ways to see your day. These previews are your today. You can change it any time in Settings."
      primaryLabel={`Continue with ${lookName(value)}`}
      onPrimary={next}
    >
      <LookPicker value={value} onChange={onChange} screen={screen} size="large" />
    </StepFrame>
  );
}
