/** Renders the composition for the active look (DESIGN.md v5 §Looks). */

"use client";

import type { ReactNode } from "react";
import { useLook } from "@/lib/use-look";

interface Props {
  trail: ReactNode;
  almanac: ReactNode;
  dial: ReactNode;
}

export function LookSwitch({ trail, almanac, dial }: Props) {
  const look = useLook();
  if (look === "almanac") {
    return almanac;
  }
  if (look === "dial") {
    return dial;
  }
  return trail;
}
