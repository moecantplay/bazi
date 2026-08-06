/**
 * A two-to-three-way choice as one pill track (DESIGN.md v4 §Components): a
 * 12%-ink-soft-tint track (not ink — an ink-tinted track pulled the
 * unselected label below AA, see globals.css .bg-mut-tint), Space Mono
 * uppercase labels, the selected segment lifting to a card fill + shadow. A
 * real radiogroup underneath — arrow keys move the roving tab stop.
 *
 * Unselected labels render full `--ink`, not `--ink-soft`: even after the
 * track itself moved off an ink tint, ink-soft-on-tinted-track measured
 * ~4.0:1 at 11px against a required 4.5:1 (both terrain-shifted background
 * and foreground share the same ink-soft hue, compressing the gap further
 * than either alone would suggest) — measured live against the built app
 * across all 5 terrains × both themes, not just the design-system prototype.
 * The selected/unselected distinction still reads via the card lift + shadow.
 */

"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel
}: Props<T>) {
  const selectedIndex = options.findIndex((option) => option.value === value);

  function onKeyDown(event: React.KeyboardEvent) {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (delta === 0) {
      return;
    }
    event.preventDefault();
    const from = selectedIndex < 0 ? 0 : selectedIndex;
    const next = options[(from + delta + options.length) % options.length];
    if (next) {
      onChange(next.value);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className="bg-mut-tint grid auto-cols-fr grid-flow-col gap-[3px] rounded-full p-[3px]"
    >
      {options.map((option, index) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (selectedIndex < 0 && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`min-h-10 rounded-full px-4 font-mono text-[11px] font-bold uppercase tracking-wide ${
              selected ? "bg-surface text-ink shadow-card" : "text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
