/**
 * Onboarding's first screen (M24-05): what Daymaster is, and a sample
 * of today built from chart-free facts only, before anything is asked.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { todayLabel, welcomeSample, type WelcomeSample } from "@daymaster/presentation";
import { Button } from "@/components/button";
import { Seal } from "@/components/seal";

interface Props {
  onNext: () => void;
}

function deviceZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

export function WelcomeStep({ onNext }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Computed after mount: the static export prerenders this page at build
  // time, so a date read during render would mismatch on hydration.
  const [today, setToday] = useState<{ iso: string; sample: WelcomeSample } | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    const iso = todayLabel();
    setToday({ iso, sample: welcomeSample(iso, deviceZone()) });
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Seal pillars={[]} size={64} />
      <div className="flex flex-col gap-3">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-[34px] leading-[1.08] text-ink outline-none">
          How today is likely to go, and one thing to do about it.
        </h1>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Daymaster reads your day from an old Chinese calendar system, in plain words.
        </p>
      </div>

      {today && (
        <section className="card flex flex-col gap-3 p-5" aria-label="Today, for anyone">
          <p className="caption">{`Today, for anyone · ${shortDate(today.iso)}`}</p>
          <p className="font-display text-[24px] leading-tight text-ink">{today.sample.headline}</p>
          {today.sample.easiest && today.sample.roughest && (
            <p className="text-[15px] leading-relaxed text-ink">
              {`The easiest stretch is ${today.sample.easiest}; the bumpiest is ${today.sample.roughest}.`}
            </p>
          )}
          {today.sample.favors.length > 0 && (
            <div className="suits-row">
              <span className="suits-lean suits-lean-favors">Favors</span>
              {today.sample.favors.map((label) => (
                <span key={label} className="suits-chip suits-chip-favors">
                  {label}
                </span>
              ))}
            </div>
          )}
          <p className="text-[13px] leading-relaxed text-ink-soft">Your own reading adds what today means for you.</p>
        </section>
      )}

      <div className="mt-auto">
        <Button className="w-full" onClick={onNext}>
          Get my reading
        </Button>
      </div>
    </div>
  );
}
