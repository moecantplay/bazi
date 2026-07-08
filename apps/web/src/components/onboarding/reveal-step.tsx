/**
 * The onboarding finale: compute the pillars and reveal them under the seal.
 *
 * On first paint the seal stamps in and the pillar columns fade up in a stagger
 * (CSS-gated behind prefers-reduced-motion). "Save chart" persists the profile
 * with default engine settings and moves to Today. If the engine rejects the
 * inputs, we surface the range error rather than a stack trace.
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_CONFIG } from "@daymaster/bazi-engine";
import { Button } from "@/components/button";
import { PillarColumns } from "@/components/pillar-columns";
import { Seal } from "@/components/seal";
import { computePillars, isYearInRange, type ChartPillars } from "@/lib/pillars";
import { saveProfile, type StoredBirth, type StoredProfile } from "@/lib/profile";

interface Props {
  birth: StoredBirth;
}

interface ChartResult {
  pillars: ChartPillars | null;
  error: boolean;
}

export function RevealStep({ birth }: Props) {
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  const result = useMemo<ChartResult>(() => {
    try {
      return {
        pillars: computePillars(birth, {
          lateZiHour: DEFAULT_CONFIG.lateZiHour,
          trueSolarTime: DEFAULT_CONFIG.trueSolarTime
        }),
        error: false
      };
    } catch {
      return { pillars: null, error: true };
    }
  }, [birth]);

  function handleSave() {
    const profile: StoredProfile = {
      birth,
      config: {
        lateZiHour: DEFAULT_CONFIG.lateZiHour,
        trueSolarTime: DEFAULT_CONFIG.trueSolarTime
      },
      createdAt: new Date().toISOString()
    };
    if (!saveProfile(profile)) {
      setSaveFailed(true);
      return;
    }
    router.replace("/today");
  }

  if (result.error || !result.pillars) {
    const outOfRange = !isYearInRange(birth.date);
    return (
      <div className="flex flex-1 flex-col justify-center gap-3 text-center">
        <p className="text-base text-ink">
          {outOfRange
            ? "That date is outside the supported range (1900–2100). Check the year."
            : "We couldn’t build your chart from those details."}
        </p>
        <p className="text-sm text-ink-soft">
          Go back and check your birth date and city, and we&rsquo;ll try again.
        </p>
      </div>
    );
  }

  const pillars = result.pillars;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <div className="flex flex-col items-center gap-6 pt-2">
          <div className="seal-stamp">
            <Seal pillars={[pillars.year, pillars.month, pillars.day, pillars.hour]} />
          </div>
          <p className="text-center font-display text-2xl text-ink">Here is your chart.</p>
        </div>
        <div className="mt-8">
          <PillarColumns pillars={pillars} className="reveal-columns" />
        </div>
      </div>
      <div className="pt-8">
        <Button className="w-full" onClick={handleSave}>
          Save chart
        </Button>
        {saveFailed && (
          <p role="alert" className="mt-3 text-center text-sm text-ink-soft">
            This browser wouldn&rsquo;t let us store your chart — that happens in private
            browsing. Try a regular window, and your chart stays on this device.
          </p>
        )}
      </div>
    </div>
  );
}
