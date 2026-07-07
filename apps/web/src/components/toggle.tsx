/**
 * An accessible on/off switch. Ink track when on, hairline when off; the whole
 * control is one button, so keyboard and screen-reader support come for free.
 * No cinnabar — that stays with the seal.
 */

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 ${
        checked ? "bg-ink" : "bg-hairline"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-paper-raised shadow transition-transform duration-150 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
