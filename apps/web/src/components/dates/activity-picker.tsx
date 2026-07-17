/**
 * The date-finder's activity chooser: the ten modelled almanac activities as
 * one raised list, rows separated by hairline dividers (DESIGN.md §Forms —
 * hairline stays a divider, never a row border). Each row names the activity
 * in modern words with a literal gloss of its classical category. Selecting
 * one is a real radio underneath, so the group is keyboard- and
 * screen-reader-navigable; a 2px inset ink ring marks the chosen row.
 */

"use client";

import { ACTIVITY_KEYS, type ActivityKey } from "@daymaster/bazi-engine";
import { ACTIVITY_LABELS } from "@daymaster/content";

interface Props {
  value: ActivityKey | null;
  onChange: (activity: ActivityKey) => void;
}

export function ActivityPicker({ value, onChange }: Props) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="kicker">
        What&rsquo;s the day for?
      </legend>
      <div className="stack">
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
                <span className="caption">{label.classical}</span>
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
