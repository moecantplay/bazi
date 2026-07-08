/**
 * The date-finder's activity chooser: the ten modelled almanac activities as
 * radio-style cards. Each card names the activity in modern words, its
 * classical category character (when Chinese is on) and a literal English
 * gloss. Selecting one is a real radio underneath, so the group is keyboard-
 * and screen-reader-navigable; the card border marks the choice.
 */

"use client";

import { ACTIVITY_KEYS, type ActivityKey } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";
import { useHanCharacters } from "@/components/han-characters-provider";

interface Props {
  value: ActivityKey | null;
  onChange: (activity: ActivityKey) => void;
}

export function ActivityPicker({ value, onChange }: Props) {
  const { showHanCharacters } = useHanCharacters();

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">
        What&rsquo;s the day for?
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {ACTIVITY_KEYS.map((key) => {
          const label = ACTIVITY_LABELS[key];
          const selected = value === key;
          return (
            <label
              key={key}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border bg-paper-raised px-3 py-2.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${
                selected ? "border-ink" : "border-hairline"
              }`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[14px] text-ink">{label.label}</span>
                {showHanCharacters && (
                  <span className="font-han text-[13px] text-ink-soft">{label.chinese}</span>
                )}
                <input
                  type="radio"
                  name="activity"
                  value={key}
                  checked={selected}
                  onChange={() => onChange(key)}
                  className="sr-only"
                />
              </span>
              <span className="text-[11px] text-ink-soft">{label.classical}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
