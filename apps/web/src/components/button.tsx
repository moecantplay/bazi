/**
 * The app's buttons. Primary actions are a filled ink block with paper text
 * (15.77:1 contrast); "quiet" is a low-emphasis text button for Back and the
 * like; "destructive" is an ink outline reserved for data deletion. Cinnabar is
 * never used here — it belongs to the seal alone.
 */

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "destructive";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const BASE =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-opacity duration-100 disabled:cursor-not-allowed";

/* Disabled primary reads unpressable, not broken (DESIGN.md §Forms): the
   tonal surface with soft text instead of a washed-out ink slab. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:opacity-90 disabled:bg-surface disabled:text-ink-soft disabled:hover:opacity-100",
  quiet: "bg-transparent text-ink-soft hover:text-ink disabled:opacity-40",
  destructive: "border border-ink bg-transparent text-ink hover:opacity-80 disabled:opacity-40"
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  const composed = `${BASE} ${VARIANTS[variant]} ${className ?? ""}`.trim();
  return <button className={composed} {...rest} />;
}
