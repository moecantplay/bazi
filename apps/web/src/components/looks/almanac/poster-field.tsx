/**
 * Editorial's signature object (DESIGN.md v5 §Editorial): the day as a
 * printed page. Day-of-year number, the day's animal at poster scale in ink,
 * on a grained field in the day element's fill hue (never cinnabar).
 */

"use client";

import { dayOfYear } from "@daymaster/presentation";
import { AnimalGlyphMark } from "@/components/glyph-icon";
import { dayMeta } from "@/components/today/headline";
import { TodayDateNav } from "@/components/today/today-date-nav";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function PosterField({ screen }: Props) {
  const { model, dateISO } = screen;
  const day = dayOfYear(dateISO);
  return (
    <div className="poster-field arrive-fade" style={{ background: `var(--element-${model.stem.element}-fill)` }}>
      <div className="arrive-rise relative z-[1] flex items-start justify-between">
        <span className="font-display text-[64px] leading-[.9] tracking-[-0.04em] text-ink" aria-hidden>
          {day}
        </span>
        <TodayDateNav screen={screen} />
      </div>
      <svg className="poster-animal arrive-drift" viewBox="0 0 24 24" aria-hidden style={{ color: "var(--ink)" }}>
        <AnimalGlyphMark animal={model.branch.gloss} renderSize={340} />
      </svg>
      <div className="arrive-rise relative z-[1] flex flex-col gap-1" style={{ ["--d" as string]: 2 }}>
        <span className="caption !text-ink">{`Day ${day} of the year`}</span>
        <span className="caption !text-ink">{dayMeta(model.stem.gloss, model.branch.gloss)}</span>
      </div>
    </div>
  );
}
