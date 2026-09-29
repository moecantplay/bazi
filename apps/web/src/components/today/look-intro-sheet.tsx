/**
 * The one-time note for readers who had a chart before looks existed
 * (M19.9-04 R5): the three looks as previews of their own today, over Today.
 * Any answer — keep, choose, Escape, tapping outside — is final; it never
 * shows again. New readers choose in onboarding and never see it.
 */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { LookPicker, lookName } from "@/components/look-picker";
import { usePreviewScreen } from "@/components/today/use-preview-screen";
import { answerLookIntro } from "@/lib/store";
import type { LookPreference, StoredProfile } from "@/lib/store-types";
import { useLook } from "@/lib/use-look";

interface Props {
  profile: StoredProfile;
  onDone: () => void;
}

export function LookIntroSheet({ profile, onDone }: Props) {
  const current = useLook();
  const [pick, setPick] = useState<LookPreference>(current);
  const screen = usePreviewScreen(profile);

  function answer(look: LookPreference) {
    answerLookIntro(look);
    onDone();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        answerLookIntro(current);
        onDone();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [current, onDone]);

  const keeping = pick === current;
  return (
    <div data-look-intro role="dialog" aria-modal="true" aria-labelledby="look-intro-title" className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={`Close, keep ${lookName(current)}`} onClick={() => answer(current)} className="absolute inset-0 bg-black/40" />
      <div className="sheet-in relative flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-sheet bg-surface p-5 pb-8 shadow-hero sm:rounded-sheet">
        <div className="mx-auto h-1 w-9 rounded-full bg-ink-tint" aria-hidden />
        <p className="kicker">New</p>
        <h2 id="look-intro-title" className="font-display text-[26px] leading-tight text-ink">
          Your day, three ways
        </h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Daymaster now comes in three looks. Your reading stays the same; pick the one you&rsquo;d like to open every morning.
        </p>
        <LookPicker value={pick} onChange={setPick} screen={screen} size="small" />
        <Button className="w-full" onClick={() => answer(pick)}>
          {keeping ? `Keep ${lookName(current)}` : `Use ${lookName(pick)}`}
        </Button>
        {!keeping && (
          <Button variant="ghost" className="w-full" onClick={() => answer(current)}>
            {`Not now, keep ${lookName(current)}`}
          </Button>
        )}
      </div>
    </div>
  );
}

