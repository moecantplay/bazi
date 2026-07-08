/**
 * Settings body: the two engine toggles (each persisted the moment it changes),
 * the appearance choice (system / light / dark), the disclaimer in full, and a
 * two-step "Delete my data" that clears the profile and returns to onboarding.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Toggle } from "@/components/toggle";
import { BACKUP_FILENAME, serializeBackup } from "@/lib/backup";
import { DISCLAIMER } from "@/lib/copy";
import { clearCompanion } from "@/lib/compare-profile";
import { formatLong } from "@/lib/dates";
import { clearHanCharactersPreference } from "@/lib/han-characters";
import { clearStreak } from "@/lib/streak";
import { useHanCharacters } from "@/components/han-characters-provider";
import {
  clearProfile,
  saveConfig,
  type StoredConfig,
  type StoredProfile
} from "@/lib/profile";
import {
  clearThemePreference,
  loadThemePreference,
  saveThemePreference,
  type ThemePreference
} from "@/lib/theme";

const APPEARANCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

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
  const { showHanCharacters, setShowHanCharacters } = useHanCharacters();
  const [config, setConfig] = useState<StoredConfig>(profile.config);
  const [theme, setTheme] = useState<ThemePreference>(() => loadThemePreference());
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function chooseTheme(next: ThemePreference) {
    setTheme(next);
    saveThemePreference(next);
  }

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
    },
    {
      label: "Show Chinese characters",
      explanation:
        "The traditional stem and branch characters, always with English beside them. Turn off to read everything in English only.",
      checked: showHanCharacters,
      onChange: setShowHanCharacters
    }
  ];

  function handleDelete() {
    clearProfile();
    clearCompanion();
    clearThemePreference();
    clearHanCharactersPreference();
    clearStreak();
    router.replace("/onboarding");
  }

  function handleDownload() {
    const json = serializeBackup();
    if (json === null) {
      return;
    }
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = BACKUP_FILENAME;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const { birth } = profile;
  const birthSummary = `${formatLong(birth.date)} · ${
    birth.time ?? "hour unknown"
  } · ${birth.city.name}`;

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
          Appearance
        </h2>
        <div role="radiogroup" aria-label="Appearance" className="mt-3 flex gap-2">
          {APPEARANCE_OPTIONS.map((option) => {
            const active = option.value === theme;
            return (
              <button
                key={option.value}
                role="radio"
                aria-checked={active}
                onClick={() => chooseTheme(option.value)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-[15px] font-medium transition-opacity duration-100 ${
                  active
                    ? "bg-ink text-paper"
                    : "border border-ink-soft bg-transparent text-ink hover:opacity-80"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          System follows your device. Light and dark stay put.
        </p>
      </section>

      <section>
        <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
          Your data
        </h2>
        <p className="mt-3 text-[15px] text-ink">{birthSummary}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Your chart lives only on this device. Download a backup to keep it safe or move it
          somewhere new.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="quiet" onClick={() => router.push("/settings/edit")}>
            Edit birth details
          </Button>
          <Button variant="quiet" onClick={handleDownload}>
            Download my data
          </Button>
        </div>
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
              This erases your chart, your comparison companion, and every preference from
              this device. It can&rsquo;t be undone.
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
