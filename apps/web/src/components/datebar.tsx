/**
 * The Today date strip, restyled as a mono datebar (DESIGN.md §Layout): the
 * displayed date in Space Mono on the left, the compass/orbit mark on the
 * right (the same personal-logo geometry as the map hero's compass rose).
 * The prev/next/jump-to-date controls are the shared DateStepper.
 */

"use client";

import type { Pillar } from "@daymaster/bazi-engine";
import { CompassMark } from "@/components/compass-mark";
import { DateStepper } from "@/components/date-stepper";

interface Props {
  dateISO: string;
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onJump: (value: string) => void;
  onStep: (delta: number) => void;
  min: string;
  max: string;
  atStart: boolean;
  atEnd: boolean;
  pillars: (Pillar | null)[];
}

export function Datebar({ pillars, ...stepper }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <DateStepper {...stepper} />
      </div>
      <CompassMark pillars={pillars} size={26} className="flex-none text-ink" />
    </div>
  );
}
