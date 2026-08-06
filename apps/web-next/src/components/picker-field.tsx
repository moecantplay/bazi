/**
 * Native date/time input with an iOS-only empty-state hint. iOS Safari
 * renders an empty date/time field as a completely blank box — every other
 * browser shows a dd/mm/yyyy-style template — which reads as a dead input.
 * The hint span is display:none outside iOS (globals.css .picker-field-hint).
 */

import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: "date" | "time";
  value: string;
  hint: string;
}

export function PickerField({ hint, className, ...inputProps }: Props) {
  const showHint = inputProps.value.length === 0 && !inputProps.disabled;

  return (
    <span className="relative block">
      <input {...inputProps} className={className ?? "field-input"} />
      {showHint && (
        <span aria-hidden className="picker-field-hint">
          {hint}
        </span>
      )}
    </span>
  );
}
