/**
 * Onboarding step 5: the disclaimer, shown verbatim. The reader must move
 * through it (scroll to the end) and actively acknowledge before continuing;
 * the acknowledgment can't be dismissed, only granted.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { DISCLAIMER } from "@daymaster/content";
import { StepFrame } from "./step-frame";

interface Props {
  onNext: () => void;
}

export function DisclaimerStep({ onNext }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // If the text fits without scrolling, treat it as already read.
  useEffect(() => {
    const element = scrollRef.current;
    if (element && element.scrollHeight <= element.clientHeight + 1) {
      setReachedEnd(true);
    }
  }, []);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 4) {
      setReachedEnd(true);
    }
  }

  return (
    <StepFrame
      title="Before your chart"
      subtitle="One thing to read first."
      primaryLabel="Show my chart"
      onPrimary={onNext}
      primaryDisabled={!acknowledged}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="card max-h-56 overflow-y-auto p-5 text-[15px] leading-relaxed text-ink"
      >
        {DISCLAIMER}
      </div>

      <label
        className={`mt-5 flex items-start gap-3 text-sm ${
          reachedEnd ? "text-ink" : "text-ink-soft"
        }`}
      >
        <input
          type="checkbox"
          checked={acknowledged}
          disabled={!reachedEnd}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-ink disabled:opacity-40"
        />
        I understand this is for reflection, not advice.
      </label>
    </StepFrame>
  );
}
