/**
 * The daily reading arranged Co-Star-style by life area (research
 * 2026-07-16): lines group under the palace they touch — Career, Home, Roots,
 * Horizon — with day-level lines under "The day itself". Each area is one
 * tonal card: a section header, then each line's prose with its fact citation
 * BELOW the text, the way Co-Star cites the transit after the sentence.
 * Grouping preserves the content package's line order; the content layer set
 * each line's area, so no chart math happens here.
 */

"use client";

import type { ReadingLine } from "@daymaster/content";
import { ReadingCard } from "@/components/reading-card";

const AREA_TITLE: Record<string, string> = {
  year: "Roots",
  month: "Career",
  day: "Home",
  hour: "Horizon",
  overall: "The day itself"
};

interface Section {
  title: string;
  lines: ReadingLine[];
}

/** Group lines by area into titled sections, ordered by first appearance. */
function sectionsOf(lines: ReadingLine[]): Section[] {
  const byTitle = new Map<string, Section>();
  for (const line of lines) {
    const title = AREA_TITLE[line.area ?? "overall"] ?? "The day itself";
    const existing = byTitle.get(title);
    if (existing) {
      existing.lines.push(line);
    } else {
      byTitle.set(title, { title, lines: [line] });
    }
  }
  return [...byTitle.values()];
}

interface Props {
  lines: ReadingLine[];
}

export function ReadingAreaSections({ lines }: Props) {
  return (
    <div data-reading-body className="flex flex-col gap-2">
      {sectionsOf(lines).map((section) => (
        <section key={section.title} className="card p-5">
          <h3 className="kicker">{section.title}</h3>
          <div className="mt-2 flex flex-col gap-4">
            {section.lines.map((line, index) => (
              <ReadingCard key={index} line={line} flat citation="below" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
