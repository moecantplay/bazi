/**
 * The three looks as a radio group of live previews: large cards in a snap
 * carousel (onboarding) or three small tiles (Settings, the one-time note).
 * Arrow keys move the choice, as in any radio group.
 */

"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { LookPreview } from "@/components/look-preview";
import type { TodayScreen } from "@/components/today/use-today-screen";
import type { LookPreference } from "@/lib/store-types";

export const LOOK_OPTIONS: { look: LookPreference; name: string; description: string }[] = [
  { look: "trail", name: "Explorer", description: "Your day as a route, with the easy and rough hours on the way." },
  { look: "almanac", name: "Editorial", description: "Your day as a printed page: big, quiet, one idea." },
  { look: "dial", name: "Instrument", description: "Your day as a 24-hour dial you can read at a glance." }
];

/** The name a reader sees for a look ("Editorial"). */
export function lookName(look: LookPreference): string {
  return LOOK_OPTIONS.find((option) => option.look === look)?.name ?? "Explorer";
}

interface Props {
  value: LookPreference;
  onChange: (look: LookPreference) => void;
  screen: TodayScreen;
  size: "large" | "small";
}

export function LookPicker({ value, onChange, screen, size }: Props) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // A restored or pre-set pick may sit off-screen in the carousel: bring it into view once, on mount.
  useEffect(() => {
    if (size !== "large") {
      return;
    }
    const index = LOOK_OPTIONS.findIndex((option) => option.look === value);
    buttons.current[index]?.scrollIntoView({ block: "nearest", inline: "center" });
    // Only on mount: later changes come from taps or arrow keys, which already keep the pick in view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const current = LOOK_OPTIONS.findIndex((option) => option.look === value);
    const next = (current + step + LOOK_OPTIONS.length) % LOOK_OPTIONS.length;
    const option = LOOK_OPTIONS[next];
    if (option) {
      onChange(option.look);
      buttons.current[next]?.focus();
      buttons.current[next]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }

  return (
    <div role="radiogroup" aria-label="Look" onKeyDown={onKeyDown} className={size === "large" ? "look-carousel" : "look-tiles"}>
      {LOOK_OPTIONS.map((option, index) => {
        const checked = option.look === value;
        return (
          <button
            key={option.look}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-look-option={option.look}
            onClick={() => onChange(option.look)}
            className={`look-option look-option-${size}`}
          >
            <span className="look-option-thumb">
              <LookPreview look={option.look} screen={screen} />
              <span aria-hidden className="look-option-check">
                &#10003;
              </span>
            </span>
            <span className="look-option-name">{option.name}</span>
            {size === "large" && <span className="look-option-description">{option.description}</span>}
          </button>
        );
      })}
    </div>
  );
}
