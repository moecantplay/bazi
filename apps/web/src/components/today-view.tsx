/**
 * The Today screen: one state hook and one screen model, rendered in the
 * user's chosen look (DESIGN.md v5 §Looks). Keyed on the displayed date so
 * the arrival motion replays on a new day or a date change, not on every
 * tab return.
 */

"use client";

import { useEffect, useState } from "react";
import { LookSwitch } from "@/components/look-switch";
import { TodayEditorial } from "@/components/looks/almanac/today-editorial";
import { TodayInstrument } from "@/components/looks/dial/today-instrument";
import { TodayExplorer } from "@/components/looks/trail/today-explorer";
import { LookIntroSheet } from "@/components/today/look-intro-sheet";
import { useTodayScreen } from "@/components/today/use-today-screen";
import { shouldShowLookIntro } from "@/lib/store";
import type { StoredProfile } from "@/lib/store-types";

interface Props {
  profile: StoredProfile;
}

export function TodayView({ profile }: Props) {
  const screen = useTodayScreen(profile);
  // Storage is client-only, so whether to show the one-time look note is read after mount.
  const [lookIntroOpen, setLookIntroOpen] = useState(false);
  useEffect(() => {
    setLookIntroOpen(shouldShowLookIntro());
  }, []);

  return (
    <>
      <div key={screen.dateISO} className="arrive">
        <LookSwitch
          trail={<TodayExplorer screen={screen} />}
          almanac={<TodayEditorial screen={screen} />}
          dial={<TodayInstrument screen={screen} />}
        />
      </div>
      {lookIntroOpen && <LookIntroSheet profile={profile} onDone={() => setLookIntroOpen(false)} />}
    </>
  );
}
