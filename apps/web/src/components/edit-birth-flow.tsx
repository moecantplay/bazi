/**
 * Edit birth details from Settings: the same four gathering steps as
 * onboarding, prefilled from the saved profile, ending in a confirm step that
 * shows the recomputed pillars before anything is written. Saving replaces
 * only the birth block — engine settings, appearance, characters, and the
 * comparison companion all stay put.
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { CityStep } from "@/components/onboarding/city-step";
import { DateStep } from "@/components/onboarding/date-step";
import { SexStep } from "@/components/onboarding/sex-step";
import { TimeStep } from "@/components/onboarding/time-step";
import { ProgressDots } from "@/components/onboarding/progress-dots";
import { PillarColumns } from "@/components/pillar-columns";
import { computePillars, isYearInRange, type ChartPillars } from "@/lib/pillars";
import { saveProfile, type StoredBirth, type StoredProfile } from "@/lib/profile";

const GATHERING_STEPS = 4;
const CONFIRM_STEP = GATHERING_STEPS; // index 4

interface Props {
  profile: StoredProfile;
}

interface ConfirmProps {
  profile: StoredProfile;
  birth: StoredBirth;
}

function ConfirmStep({ profile, birth }: ConfirmProps) {
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  const pillars = useMemo<ChartPillars | null>(() => {
    try {
      return computePillars(birth, profile.config);
    } catch {
      return null;
    }
  }, [birth, profile.config]);

  if (pillars === null) {
    const outOfRange = !isYearInRange(birth.date);
    return (
      <div className="flex flex-1 flex-col justify-center gap-3 text-center">
        <p className="text-base text-ink">
          {outOfRange
            ? "That date is outside the supported range (1900–2100). Check the year."
            : "We couldn’t build a chart from those details."}
        </p>
        <p className="text-sm text-ink-soft">
          Go back and check the birth date and city, and we&rsquo;ll try again.
        </p>
      </div>
    );
  }

  function handleSave() {
    if (!saveProfile({ ...profile, birth })) {
      setSaveFailed(true);
      return;
    }
    router.replace("/chart");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1 className="font-display text-3xl text-ink">Here&rsquo;s the updated chart.</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Save it and every reading follows the new details. Your settings stay as they are.
        </p>
        <div className="mt-8">
          <PillarColumns pillars={pillars} />
        </div>
      </div>
      <div className="pt-8">
        <Button className="w-full" onClick={handleSave}>
          Save changes
        </Button>
        {saveFailed && (
          <p role="alert" className="mt-3 text-center text-sm text-ink-soft">
            This browser wouldn&rsquo;t let us store the change — that happens in private
            browsing. Try a regular window.
          </p>
        )}
      </div>
    </div>
  );
}

export function EditBirthFlow({ profile }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [birth, setBirth] = useState<StoredBirth>(profile.birth);
  const [time, setTime] = useState(profile.birth.time ?? "");
  const [timeUnknown, setTimeUnknown] = useState(profile.birth.time === null);

  const goNext = () => setStep((current) => Math.min(current + 1, CONFIRM_STEP));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const assembled: StoredBirth = { ...birth, time: timeUnknown ? null : time };

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
          {step < CONFIRM_STEP && <ProgressDots total={GATHERING_STEPS} current={step} />}
          <div className="w-16 text-right">
            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col pt-4">
          {step === 0 && (
            <DateStep
              value={birth.date}
              onChange={(date) => setBirth((current) => ({ ...current, date }))}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <TimeStep
              time={time}
              unknown={timeUnknown}
              onTimeChange={setTime}
              onUnknownChange={setTimeUnknown}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <CityStep
              city={birth.city}
              onSelect={(city) => setBirth((current) => ({ ...current, city }))}
              onNext={goNext}
            />
          )}
          {step === 3 && (
            <SexStep
              value={birth.sex}
              onChange={(sex) => setBirth((current) => ({ ...current, sex }))}
              onNext={goNext}
            />
          )}
          {step === CONFIRM_STEP && <ConfirmStep profile={profile} birth={assembled} />}
        </main>
      </div>
    </div>
  );
}
