/**
 * Settings body: the two engine toggles (each persisted the moment it changes),
 * the disclaimer in full, and a two-step "Delete my data" that clears the
 * profile and returns to onboarding.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Toggle } from "@/components/toggle";
import { DISCLAIMER } from "@/lib/copy";
import {
  clearProfile,
  saveConfig,
  type StoredConfig,
  type StoredProfile
} from "@/lib/profile";

interface Props {
  profile: StoredProfile;
}

interface Row {
  label: string;
  explanation: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingsContent({ profile }: Props) {
  const router = useRouter();
  const [config, setConfig] = useState<StoredConfig>(profile.config);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function persist(next: StoredConfig) {
    setConfig(next);
    saveConfig(next);
  }

  const rows: Row[] = [
    {
      label: "Shift late-night births to the next day",
      explanation:
        "Births between 23:00 and midnight: keep the same day's pillar, or shift to the next day (schools differ).",
      checked: config.lateZiHour === "shift-day",
      onChange: (checked) =>
        persist({ ...config, lateZiHour: checked ? "shift-day" : "midnight" })
    },
    {
      label: "Use true solar time",
      explanation:
        "Adjust the clock time to the sun's actual position at your birthplace before computing hour and day.",
      checked: config.trueSolarTime,
      onChange: (checked) => persist({ ...config, trueSolarTime: checked })
    }
  ];

  function handleDelete() {
    clearProfile();
    router.replace("/onboarding");
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col divide-y divide-hairline">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-4">
            <div className="flex-1">
              <p className="text-[15px] text-ink">{row.label}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{row.explanation}</p>
            </div>
            <Toggle checked={row.checked} onChange={row.onChange} label={row.label} />
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
          About your readings
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">{DISCLAIMER}</p>
      </section>

      <section>
        {confirmingDelete ? (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] text-ink">
              This erases your chart and settings from this device. It can&rsquo;t be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDelete}>
                Delete my data
              </Button>
              <Button variant="quiet" onClick={() => setConfirmingDelete(false)}>
                Keep it
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
            Delete my data
          </Button>
        )}
      </section>
    </div>
  );
}
