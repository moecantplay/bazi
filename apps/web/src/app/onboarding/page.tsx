/**
 * Onboarding orchestrator (reshape trial): a Welcome screen with a chart-free
 * sample of today, then four gathering steps — date, time, city, and sex with
 * the disclaimer — ending straight on Today. No look step (the look is a
 * Settings choice) and no chart reveal. Progress dots track the four
 * gathering steps; Back is available on every step after Welcome. The bottom
 * tab nav is intentionally absent here — onboarding owns the viewport until a
 * chart exists.
 *
 * Answers persist to sessionStorage as they're entered, so a refresh resumes
 * where the flow left off. The first step also offers "restore from a backup
 * file" for someone returning on a new device — this is the only restore entry
 * point in this phase (Settings is still a placeholder screen).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CityStep } from "@/components/onboarding/city-step";
import { DateStep } from "@/components/onboarding/date-step";
import {
  EMPTY_DRAFT,
  ONBOARDING_CONFIG,
  clearDraft,
  loadDraftEnvelope,
  saveDraftEnvelope,
  type OnboardingDraft
} from "@/components/onboarding/draft";
import { ProgressDots } from "@/components/onboarding/progress-dots";
import { LastStep } from "@/components/onboarding/last-step";
import { TimeStep } from "@/components/onboarding/time-step";
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import { chartPreviewFor, isYearInRange } from "@daymaster/presentation";
import { track, type OnboardingStepName } from "@/lib/analytics";
import { importBackup, type ImportResult } from "@/lib/backup";
import { decodeShareParam, readSharePayload, stashIncomingShare } from "@/lib/share-link";
import { DEFAULT_LOOK, loadStore, saveOnboardingResult } from "@/lib/store";
import type { StoredBirth, StoredCity, StoredProfile } from "@/lib/store-types";

/** Welcome is step 0; the gathering steps are 1–4. */
const GATHERING_STEPS = 4;
const LAST_STEP = GATHERING_STEPS;
/** Step names for usage counts, by index (M19.8-06); Welcome isn't counted. */
const STEP_NAMES: (OnboardingStepName | null)[] = [null, "date", "time", "city", "sex"];

const RESTORE_ERRORS: Record<Exclude<ImportResult, "ok">, string> = {
  invalid: "That file doesn’t look like a Daymaster backup.",
  storage:
    "This browser wouldn’t let us store the restored chart — that happens in private browsing."
};

export default function OnboardingPage() {
  const router = useRouter();
  // Always start from the fresh envelope so the first client render matches
  // the server's HTML; the saved draft (session storage) is restored after
  // mount. Reading storage in the initializer hydrated a mid-flow refresh
  // onto step-0 markup and threw a hydration error.
  const [{ step, draft }, setFlow] = useState(() => ({ step: 0, draft: EMPTY_DRAFT }));
  const [draftRestored, setDraftRestored] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [sharedChartWaiting, setSharedChartWaiting] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFlow(loadDraftEnvelope());
    setDraftRestored(true);
  }, []);

  useEffect(() => {
    if (!draftRestored) {
      return;
    }
    saveDraftEnvelope({ step, draft });
  }, [draftRestored, step, draft]);

  // Where onboarding loses people: one count per step reached.
  useEffect(() => {
    const name = STEP_NAMES[step];
    if (!draftRestored || name === undefined || name === null) {
      return;
    }
    track({ name: "onboarding-step", data: { step: name } });
  }, [draftRestored, step]);

  // A share link carries someone's chart for comparison. With a profile it
  // goes straight to Compare; on a fresh device it waits until onboarding is
  // done, and a notice on the first step says so. Either way the payload
  // leaves the address bar.
  useEffect(() => {
    const value = readSharePayload(window.location);
    if (value === null) {
      return;
    }
    const birth = decodeShareParam(value);
    if (birth === null) {
      return;
    }
    stashIncomingShare(birth);
    if (loadStore().profile !== null) {
      router.replace("/people");
      return;
    }
    window.history.replaceState(null, "", "/onboarding/");
    setSharedChartWaiting(true);
  }, [router]);

  function update(partial: Partial<OnboardingDraft>) {
    setFlow((current) => ({ ...current, draft: { ...current.draft, ...partial } }));
  }

  const goNext = () =>
    setFlow((current) => ({ ...current, step: Math.min(current.step + 1, LAST_STEP) }));
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

  function handleFinish() {
    if (draft.city === null || draft.sex === null) {
      return;
    }
    const birth = assembleBirth(draft.city, draft.sex);
    const preview = chartPreviewFor(birth, ONBOARDING_CONFIG);
    if (preview.error || !preview.pillars) {
      setFinishError(
        isYearInRange(birth.date)
          ? "We couldn’t build your chart from those details. Go back and check your birth date and city."
          : "That date is outside the supported range (1900–2100). Go back and check the year."
      );
      return;
    }
    const profile: StoredProfile = { birth, config: ONBOARDING_CONFIG, createdAt: new Date().toISOString() };
    if (!saveOnboardingResult(profile, DEFAULT_LOOK)) {
      setFinishError(
        "This browser wouldn’t let us store your chart — that happens in private browsing. Try a regular window."
      );
      return;
    }
    track({ name: "onboarding-finished", data: { look: DEFAULT_LOOK } });
    clearDraft();
    router.replace("/today");
  }

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
          {step > 0 && <ProgressDots total={GATHERING_STEPS} current={step - 1} />}
          <div className="w-16" />
        </header>

        <main className="flex flex-1 flex-col pt-4">
          {step === 0 && <WelcomeStep onNext={goNext} />}
          {step === 1 && (
            <DateStep
              value={draft.date}
              onChange={(date) => update({ date })}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <TimeStep
              time={draft.time}
              unknown={draft.timeUnknown}
              onTimeChange={(time) => update({ time })}
              onUnknownChange={(timeUnknown) => update({ timeUnknown })}
              onNext={goNext}
            />
          )}
          {step === 3 && (
            <CityStep
              city={draft.city}
              onSelect={(city) => update({ city })}
              onNext={goNext}
            />
          )}
          {step === 4 && (
            <LastStep
              value={draft.sex}
              onChange={(sex) => update({ sex })}
              onFinish={handleFinish}
              error={finishError}
            />
          )}
        </main>

        {step === 0 && (
          <footer className="pb-2 pt-5 text-center">
            {sharedChartWaiting && (
              <p className="mb-3 text-[13px] leading-relaxed text-ink-soft">
                A chart came with your link. Set up your own first — you&rsquo;ll find theirs
                waiting in People.
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
