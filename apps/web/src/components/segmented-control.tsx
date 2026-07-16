/**
 * A two-to-three-way choice as one bordered container (DESIGN.md §Forms): the
 * selected segment is an ink fill with paper text, the rest raised paper.
 * A real radiogroup underneath — arrow keys move the roving tab stop.
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
      className="grid auto-cols-fr grid-flow-col overflow-hidden rounded-full border-[1.5px] border-ink-soft bg-paper-raised"
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
            className={`min-h-[45px] px-4 py-2.5 text-base ${
              selected ? "bg-ink text-paper" : "text-ink hover:bg-paper"
            } ${index > 0 ? "border-l border-hairline" : ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
