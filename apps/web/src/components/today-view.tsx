/**
 * The Today screen: one state hook and one screen model, rendered in the
 * user's chosen look (DESIGN.md v5 §Looks). Keyed on the displayed date so
 * the arrival motion replays on a new day or a date change, not on every
 * tab return.
 */

"use client";

import { LookSwitch } from "@/components/look-switch";
import { TodayEditorial } from "@/components/looks/almanac/today-editorial";
import { TodayInstrument } from "@/components/looks/dial/today-instrument";
import { TodayExplorer } from "@/components/looks/trail/today-explorer";
import { useTodayScreen } from "@/components/today/use-today-screen";
import type { StoredProfile } from "@/lib/store-types";

interface Props {
  profile: StoredProfile;
}

export function TodayView({ profile }: Props) {
  const screen = useTodayScreen(profile);
  return (
    <div key={screen.dateISO} className="arrive">
      <LookSwitch
        trail={<TodayExplorer screen={screen} />}
        almanac={<TodayEditorial screen={screen} />}
        dial={<TodayInstrument screen={screen} />}
      />
    </div>
  );
}
