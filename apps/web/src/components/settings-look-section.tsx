/** Settings → Look: the three looks as live previews of today; a tap switches at once (M19.9-04). */

"use client";

import { useState } from "react";
import { LookPicker } from "@/components/look-picker";
import { usePreviewScreen } from "@/components/today/use-preview-screen";
import { loadLookPreference, saveLookPreference } from "@/lib/store";
import type { LookPreference, StoredProfile } from "@/lib/store-types";

interface Props {
  profile: StoredProfile;
}

export function SettingsLookSection({ profile }: Props) {
  const [look, setLook] = useState<LookPreference>(() => loadLookPreference());
  const screen = usePreviewScreen(profile);

  function choose(next: LookPreference) {
    setLook(next);
    saveLookPreference(next);
  }

  return (
    <section>
      <h2 className="kicker">Look</h2>
      <div className="mt-3">
        <LookPicker value={look} onChange={choose} screen={screen} size="small" />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">Changes how Today looks. The reading stays the same.</p>
    </section>
  );
}
