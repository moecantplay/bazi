/**
 * The frame every main screen renders inside: a centered, mobile-first column
 * (max 28rem) with the bottom tab nav below it. Onboarding does not use this
 * shell; it owns the whole viewport until a chart is saved.
 */

import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

interface Props {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col px-5 pb-28 pt-8">
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <div className="mt-6 flex-1">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
