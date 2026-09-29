/**
 * One look's hero, rendered live from the reader's own day and scaled into a
 * card (DESIGN.md v5 §Shared surfaces, look picker). Heroes only — the part
 * of Today where the looks differ — so three previews stay cheap. Inert and
 * hidden from assistive tech; the picker's radio carries the name.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { PosterField } from "@/components/looks/almanac/poster-field";
import { DayDial } from "@/components/looks/dial/day-dial";
import { WeekRings } from "@/components/looks/dial/week-rings";
import { RouteHero } from "@/components/looks/trail/route-hero";
import { Headline } from "@/components/today/headline";
import type { TodayScreen } from "@/components/today/use-today-screen";
import type { LookPreference } from "@/lib/store-types";

/** The width every look is designed at; previews scale down from it. */
const DESIGN_WIDTH = 390;

interface Props {
  look: LookPreference;
  screen: TodayScreen;
}

function useScaleToWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setScale(entry.contentRect.width / DESIGN_WIDTH);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, scale };
}

function Hero({ look, screen }: Props) {
  const { model } = screen;
  if (look === "almanac") {
    return (
      <>
        <PosterField screen={screen} />
        <Headline runs={model.headline} className="px-5 pt-6 text-[42px] !leading-[1.02]" />
      </>
    );
  }
  if (look === "dial") {
    return (
      <div className="flex flex-col gap-4 px-5 pt-4">
        <WeekRings profile={screen.profile} today={screen.today} selectedISO={screen.dateISO} onSelect={screen.jumpTo} />
        <DayDial screen={screen} />
        <Headline runs={model.headline} className="text-[31px]" />
      </div>
    );
  }
  return <RouteHero screen={screen} />;
}

export function LookPreview({ look, screen }: Props) {
  const { ref, scale } = useScaleToWidth();
  return (
    <div ref={ref} className="look-preview" aria-hidden inert>
      <div className="look-preview-canvas" style={{ transform: `scale(${scale})` }}>
        <Hero look={look} screen={screen} />
      </div>
    </div>
  );
}
