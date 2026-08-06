/**
 * The second-person birth form for Compare: a name to file them under, then
 * date, time (or unknown), city, sex. One compact card rather than the
 * onboarding steps — the reader has done this before. Saving hands the name
 * and validated birth back to the screen, which stores them as a person.
 */

"use client";

import { useState } from "react";
import { isYearInRange } from "@daymaster/presentation";
import { Button } from "@/components/button";
import { CitySearch } from "@/components/city-search";
import { PickerField } from "@/components/picker-field";
import { SegmentedControl } from "@/components/segmented-control";
import type { Sex, StoredBirth, StoredCity } from "@/lib/store-types";

interface Props {
  onSave: (name: string, birth: StoredBirth) => void;
  /** Softens the intro copy when a saved-people list sits above the form. */
  hasSavedPeople?: boolean;
  /** Prefills the form — a chart that arrived via share link. */
  initialBirth?: StoredBirth;
}

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" }
];

export function CompareForm({ onSave, hasSavedPeople = false, initialBirth }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(initialBirth?.date ?? "");
  const [time, setTime] = useState(initialBirth?.time ?? "");
  const [unknownTime, setUnknownTime] = useState(initialBirth ? initialBirth.time === null : false);
  const [city, setCity] = useState<StoredCity | null>(initialBirth?.city ?? null);
  const [sex, setSex] = useState<Sex | null>(initialBirth?.sex ?? null);

  const dateOk = date.length > 0 && isYearInRange(date);
  const timeOk = unknownTime || time.length > 0;
  const canSave = dateOk && timeOk && city !== null && sex !== null;

  function handleSave() {
    if (!canSave || city === null || sex === null) {
      return;
    }
    onSave(name.trim() || "Them", {
      date,
      time: unknownTime ? null : time,
      city,
      sex
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        {hasSavedPeople
          ? "Or add someone new. Their details stay on this device, like yours."
          : "Enter a second person’s birth details to read how your two charts meet. Their details stay on this device, like yours."}
      </p>

      <label className="flex flex-col gap-2">
        <span className="field-label">Their name</span>
        <input
          type="text"
          value={name}
          placeholder="So you can find them again"
          onChange={(event) => setName(event.target.value)}
          className="field-input placeholder:text-ink-soft"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="field-label">Their birth date</span>
        <PickerField
          type="date"
          hint="Tap to pick a date"
          min="1900-01-01"
          max="2100-12-31"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
      {date.length > 0 && !dateOk && (
        <p className="-mt-3 text-sm text-ink" role="alert">
          That date is outside the supported range (1900&ndash;2100). Check the year.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className="field-label">Their birth time</span>
          <PickerField
            type="time"
            hint="Tap to pick a time"
            value={time}
            disabled={unknownTime}
            onChange={(event) => setTime(event.target.value)}
            className="field-input disabled:opacity-40"
          />
        </label>
        <label className="mt-1 flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={unknownTime}
            onChange={(event) => setUnknownTime(event.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          Time unknown — read three pillars
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="field-label">Their birth city</span>
        <CitySearch selected={city} onSelect={setCity} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="field-label">Their sex at birth</span>
        <SegmentedControl
          options={SEX_OPTIONS}
          value={sex}
          onChange={setSex}
          ariaLabel="Their sex at birth"
        />
      </div>

      <Button onClick={handleSave} disabled={!canSave}>
        Read the pair
      </Button>
    </div>
  );
}
