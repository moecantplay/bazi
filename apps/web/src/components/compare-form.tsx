/**
 * The second-person birth form for Compare: date, time (or unknown), city,
 * sex. One compact card rather than the onboarding steps — the reader has
 * done this before. Saving hands the validated birth back to the screen.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { CitySearch } from "@/components/city-search";
import { isYearInRange } from "@/lib/pillars";
import type { Sex, StoredBirth, StoredCity } from "@/lib/profile";

interface Props {
  onSave: (birth: StoredBirth) => void;
}

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" }
];

export function CompareForm({ onSave }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState<StoredCity | null>(null);
  const [sex, setSex] = useState<Sex | null>(null);

  const dateOk = date.length > 0 && isYearInRange(date);
  const timeOk = unknownTime || time.length > 0;
  const canSave = dateOk && timeOk && city !== null && sex !== null;

  function handleSave() {
    if (!canSave || city === null || sex === null) {
      return;
    }
    onSave({
      date,
      time: unknownTime ? null : time,
      city,
      sex
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        Enter a second person&rsquo;s birth details to read how your two charts meet. Their
        details stay on this device, like yours.
      </p>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-ink">Their birth date</span>
        <input
          type="date"
          min="1900-01-01"
          max="2100-12-31"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-lg border border-ink-soft bg-paper-raised px-4 py-3 text-base text-ink"
        />
      </label>
      {date.length > 0 && !dateOk && (
        <p className="-mt-3 text-sm text-ink" role="alert">
          That date is outside the supported range (1900&ndash;2100). Check the year.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-ink">Their birth time</span>
          <input
            type="time"
            value={time}
            disabled={unknownTime}
            onChange={(event) => setTime(event.target.value)}
            className="w-full rounded-lg border border-ink-soft bg-paper-raised px-4 py-3 text-base text-ink disabled:opacity-40"
          />
        </label>
        <label className="mt-1 flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={unknownTime}
            onChange={(event) => setUnknownTime(event.target.checked)}
            className="h-4 w-4"
          />
          Time unknown — read three pillars
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-ink">Their birth city</span>
        <CitySearch selected={city} onSelect={setCity} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-ink">Their sex at birth</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Their sex at birth">
          {SEX_OPTIONS.map((option) => {
            const selected = sex === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSex(option.value)}
                className={`flex-1 rounded-lg border px-4 py-3 text-base ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-ink-soft bg-paper-raised text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <Button onClick={handleSave} disabled={!canSave}>
        Read the pair
      </Button>
    </div>
  );
}
