/**
 * Onboarding orchestrator: one step per screen, gathering the birth details and
 * ending in the seal-stamp chart reveal. Progress dots track the five gathering
 * steps; Back is available on every step after the first. The bottom tab nav is
 * intentionally absent here — onboarding owns the viewport until a chart exists.
 *
 * Answers persist to sessionStorage as they're entered, so a refresh resumes
 * where the flow left off. The first step also offers "restore from a backup
 * file" for someone returning on a new device.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CityStep } from "@/components/onboarding/city-step";
import { DateStep } from "@/components/onboarding/date-step";
import { DisclaimerStep } from "@/components/onboarding/disclaimer-step";
import {
  clearDraft,
  loadDraftEnvelope,
  saveDraftEnvelope,
  type OnboardingDraft
} from "@/components/onboarding/draft";
import { ProgressDots } from "@/components/onboarding/progress-dots";
import { RevealStep } from "@/components/onboarding/reveal-step";
import { SexStep } from "@/components/onboarding/sex-step";
import { TimeStep } from "@/components/onboarding/time-step";
import { importBackup, type ImportResult } from "@/lib/backup";
import { loadProfile, type StoredBirth, type StoredCity } from "@/lib/profile";
import { decodeShareParam, SHARE_PARAM, stashIncomingShare } from "@/lib/share-link";

const GATHERING_STEPS = 5;
const REVEAL_STEP = GATHERING_STEPS; // index 5

const RESTORE_ERRORS: Record<Exclude<ImportResult, "ok">, string> = {
  invalid: "That file doesn’t look like a Daymaster backup.",
  storage:
    "This browser wouldn’t let us store the restored chart — that happens in private browsing."
};

export default function OnboardingPage() {
  const router = useRouter();
  const [{ step, draft }, setFlow] = useState(() => loadDraftEnvelope());
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [sharedChartWaiting, setSharedChartWaiting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveDraftEnvelope({ step, draft });
  }, [step, draft]);

  // A ?share= link carries someone's chart for comparison. With a profile it
  // goes straight to Compare; on a fresh device it waits until onboarding is
  // done, and a notice on the first step says so.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (value === null) {
      return;
    }
    const birth = decodeShareParam(value);
    if (birth === null) {
      return;
    }
    stashIncomingShare(birth);
    if (loadProfile() !== null) {
      router.replace("/compare");
      return;
    }
    window.history.replaceState(null, "", "/onboarding/");
    setSharedChartWaiting(true);
  }, [router]);

  function update(partial: Partial<OnboardingDraft>) {
    setFlow((current) => ({ ...current, draft: { ...current.draft, ...partial } }));
  }

  const goNext = () =>
    setFlow((current) => ({ ...current, step: Math.min(current.step + 1, REVEAL_STEP) }));
  const goBack = () =>
    setFlow((current) => ({ ...current, step: Math.max(current.step - 1, 0) }));

  function assembleBirth(city: StoredCity, sex: StoredBirth["sex"]): StoredBirth {
    return {
      date: draft.date,
      time: draft.timeUnknown ? null : draft.time,
      city,
      sex
    };
  }

  async function handleRestoreFile(file: File) {
    const result = importBackup(await file.text());
    if (result !== "ok") {
      setRestoreError(RESTORE_ERRORS[result]);
      return;
    }
    clearDraft();
    router.replace("/today");
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

        {step === 0 && (
          <footer className="pb-2 pt-5 text-center">
            {sharedChartWaiting && (
              <p className="mb-3 text-[13px] leading-relaxed text-ink-soft">
                A chart came with your link. Set up your own first — you&rsquo;ll find theirs
                waiting in Compare.
              </p>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-target text-[12px] text-ink-soft hover:text-ink"
            >
              Have a backup file? Restore it →
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Restore from a backup file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleRestoreFile(file);
                }
                event.target.value = "";
              }}
            />
            {restoreError && (
              <p role="alert" className="mt-2 text-[13px] text-ink-soft">
                {restoreError}
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
