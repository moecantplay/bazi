/**
 * Onboarding orchestrator: one step per screen, gathering the birth details and
 * ending in the seal-stamp chart reveal. Progress dots track the five gathering
 * steps; Back is available on every step after the first. The bottom tab nav is
 * intentionally absent here — onboarding owns the viewport until a chart exists.
 */

"use client";

import { useState } from "react";
import { CityStep } from "@/components/onboarding/city-step";
import { DateStep } from "@/components/onboarding/date-step";
import { DisclaimerStep } from "@/components/onboarding/disclaimer-step";
import { EMPTY_DRAFT, type OnboardingDraft } from "@/components/onboarding/draft";
import { ProgressDots } from "@/components/onboarding/progress-dots";
import { RevealStep } from "@/components/onboarding/reveal-step";
import { SexStep } from "@/components/onboarding/sex-step";
import { TimeStep } from "@/components/onboarding/time-step";
import type { StoredBirth, StoredCity } from "@/lib/profile";

const GATHERING_STEPS = 5;
const REVEAL_STEP = GATHERING_STEPS; // index 5

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);

  function update(partial: Partial<OnboardingDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  const goNext = () => setStep((current) => Math.min(current + 1, REVEAL_STEP));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  function assembleBirth(city: StoredCity, sex: StoredBirth["sex"]): StoredBirth {
    return {
      date: draft.date,
      time: draft.timeUnknown ? null : draft.time,
      city,
      sex
    };
  }

  const onReveal = step === REVEAL_STEP && draft.city !== null && draft.sex !== null;

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col px-5 py-6">
        <header className="flex h-10 items-center justify-between">
          <div className="w-16">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-ink-soft hover:text-ink"
              >
                Back
              </button>
            )}
          </div>
          {step < REVEAL_STEP && <ProgressDots total={GATHERING_STEPS} current={step} />}
          <div className="w-16" />
        </header>

        <main className="flex flex-1 flex-col pt-4">
          {step === 0 && (
            <DateStep
              value={draft.date}
              onChange={(date) => update({ date })}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <TimeStep
              time={draft.time}
              unknown={draft.timeUnknown}
              onTimeChange={(time) => update({ time })}
              onUnknownChange={(timeUnknown) => update({ timeUnknown })}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <CityStep
              city={draft.city}
              onSelect={(city) => update({ city })}
              onNext={goNext}
            />
          )}
          {step === 3 && (
            <SexStep value={draft.sex} onChange={(sex) => update({ sex })} onNext={goNext} />
          )}
          {step === 4 && <DisclaimerStep onNext={goNext} />}
          {onReveal && draft.city && draft.sex && (
            <RevealStep birth={assembleBirth(draft.city, draft.sex)} />
          )}
        </main>
      </div>
    </div>
  );
}
