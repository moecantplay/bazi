/** What the day suits: the trail signs and the date-finder link, the same in every look. */

"use client";

import Link from "next/link";
import { TrailSigns } from "@/components/trail-signs";
import type { TodayScreen } from "@/components/today/use-today-screen";

interface Props {
  screen: TodayScreen;
}

export function TodaySuits({ screen }: Props) {
  const { guidance, reading } = screen.model;
  return (
    <div className="flex flex-col gap-5">
      <TrailSigns
        assessments={guidance.quality.assessments}
        chips={guidance.chips}
        proseLines={guidance.lines}
        dos={reading.dos}
        donts={reading.donts}
      />
      <Link href="/dates/" className="tap-target self-start text-[13px] text-ink hover:text-ink-soft">
        Find a day for something &rarr;
      </Link>
    </div>
  );
}
