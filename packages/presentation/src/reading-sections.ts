/**
 * The daily reading grouped into titled life-area sections (Career, Roots,
 * The day itself, The hours), in order of first appearance: the grouping
 * every look's reading uses, whether it renders as swipe cards or chapters.
 *
 * The line a look already shows as the day's one idea (the grain line, under
 * the headline) is left out, so each thing is said once per screen
 * (DESIGN.md v5 §Concept).
 */

import type { ReadingArea, ReadingLine } from "@daymaster/content";

export interface ReadingSection {
  area: ReadingArea;
  title: string;
  lines: ReadingLine[];
}

/** Areas a daily reading actually groups into; anything else reads as the day itself (as the waypoint rail did). */
const AREA_TITLE: Partial<Record<ReadingArea, string>> = {
  year: "Roots",
  month: "Career",
  day: "Home",
  hour: "Horizon",
  overall: "The day itself",
  hours: "The hours"
};

export function readingSections(lines: readonly ReadingLine[], oneIdea: ReadingLine | undefined): ReadingSection[] {
  const byArea = new Map<ReadingArea, ReadingSection>();
  for (const line of lines) {
    if (line === oneIdea) {
      continue;
    }
    const area: ReadingArea = line.area ?? "overall";
    const existing = byArea.get(area);
    if (existing) {
      existing.lines.push(line);
    } else {
      byArea.set(area, { area, title: AREA_TITLE[area] ?? "The day itself", lines: [line] });
    }
  }
  return [...byArea.values()];
}
