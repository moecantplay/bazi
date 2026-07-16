/**
 * The date-finder's activity chooser: the ten modelled almanac activities as
 * one raised list, rows separated by hairline dividers (DESIGN.md §Forms —
 * hairline stays a divider, never a row border). Each row names the activity
 * in modern words, its classical category character (when Chinese is on) and
 * a literal English gloss. Selecting one is a real radio underneath, so the
 * group is keyboard- and screen-reader-navigable; a 2px inset ink ring marks
 * the chosen row.
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
      <legend className="kicker">
        What&rsquo;s the day for?
      </legend>
      <div className="flex flex-col divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-paper-raised dark-borderless">
        {ACTIVITY_KEYS.map((key) => {
          const label = ACTIVITY_LABELS[key];
          const selected = value === key;
          return (
            <label
              key={key}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-3 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ink ${
                selected ? "ring-2 ring-inset ring-ink" : ""
              }`}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] leading-snug text-ink">
                  {label.label}
                  <input
                    type="radio"
                    name="activity"
                    value={key}
                    checked={selected}
                    onChange={() => onChange(key)}
                    className="sr-only"
                  />
                </span>
                <span className="caption flex items-baseline gap-1.5">
                  {showHanCharacters && (
                    <span className="whitespace-nowrap font-han">{label.chinese}</span>
                  )}
                  {label.classical}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${selected ? "bg-ink" : "bg-transparent"}`}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
