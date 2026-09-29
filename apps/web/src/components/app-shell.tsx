/**
 * The frame every main screen renders inside: a centered, mobile-first column
 * (max 28rem) with the bottom tab nav below it. Onboarding does not use this
 * shell; it owns the whole viewport until a chart is saved.
 */

import type { ReactNode } from "react";
import { BackLink } from "@/components/back-link";
import { BottomNav } from "@/components/bottom-nav";

interface Props {
  title: string;
  children: ReactNode;
  /** Show a "back" link above the title, for screens outside the bottom nav. */
  back?: boolean;
  /**
   * The screen draws its own full-bleed hero from the very top (a look's
   * Today): the title stays as a visually hidden heading and the content
   * starts flush, free to run edge to edge with negative margins.
   */
  bleed?: boolean;
}

export function AppShell({ title, children, back = false, bleed = false }: Props) {
  return (
    <div className="min-h-screen bg-paper">
      <div className={`mx-auto flex min-h-screen w-full max-w-app flex-col px-5 pb-28 ${bleed ? "overflow-x-clip" : "pt-8"}`}>
        {back && <BackLink />}
        <h1 className={bleed ? "sr-only" : "font-display text-3xl text-ink"}>{title}</h1>
        <main className={`flex-1 ${bleed ? "" : "mt-6"}`}>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
