/**
 * Reshape trial: on the day a reader's chart was made, one line above the
 * reading says who they are in the system and what this page is for. Every
 * other day it renders nothing.
 */

"use client";

import { portraitLine } from "@daymaster/content";
import { chartFor, todayLabel } from "@daymaster/presentation";
import { Seal } from "@/components/seal";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function FirstDayBanner({ screen }: Props) {
  const { profile, dateISO } = screen;
  if (todayLabel(new Date(profile.createdAt)) !== dateISO) {
    return null;
  }
  const chart = chartFor(profile);
  return (
    <section data-first-day className="card flex items-center gap-4 p-4" aria-label="Your first day">
      <Seal pillars={[chart.year, chart.month, chart.day, chart.hour]} size={44} />
      <p className="flex-1 text-[14px] leading-relaxed text-ink">
        <span className="font-semibold">{portraitLine(chart.day.stem)}</span> Each morning, this page says how your day
        could go and one thing to do.
      </p>
    </section>
  );
}
