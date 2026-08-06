/**
 * The app's buttons (DESIGN.md v4 §Components). Primary is the anchor pair
 * (anchor fill, paper text) — Trail's one black anchor per screen; the
 * signpost is Today's only anchor and Today has no primary button, so the
 * two never compete (CLAUDE.md 2026-08-05). Secondary is a card fill with an
 * ink-tint border; ghost is transparent with a dashed border — the rail
 * motif's one appearance off the map. Cinnabar is never used here — it
 * belongs to the seal alone.
 */

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "quiet";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 font-mono text-[13px] font-bold uppercase tracking-wide transition-transform duration-100 active:translate-y-px disabled:cursor-not-allowed disabled:active:translate-y-0";

/* Disabled recedes via its surface, never by fading the label alone (a faded
   label measured 2.84:1 and read as broken rather than unpressable). The
   border stays solid — dashed is the ghost button's affordance, and a
   disabled button borrowing it became indistinguishable from ghost. */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-anchor text-paper border-[1.5px] border-anchor hover:opacity-90 btn-primary-disabled",
  secondary: "bg-surface text-ink border-ink-tint hover:opacity-90 disabled:opacity-50",
  ghost: "bg-transparent text-ink border-[1.5px] border-dashed border-hairline hover:opacity-80 disabled:opacity-40",
  destructive: "border-[1.5px] border-ink bg-transparent text-ink hover:opacity-80 disabled:opacity-40",
  /* Borderless — the lowest-emphasis action (Back, Change person). Unlike
     ghost it carries no dashed rail motif, so it stays out of the way of a
     screen that already has one. */
  quiet: "bg-transparent px-3 text-ink-soft hover:text-ink disabled:opacity-40"
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  const composed = `${BASE} ${VARIANTS[variant]} ${className ?? ""}`.trim();
  return <button className={composed} {...rest} />;
}
