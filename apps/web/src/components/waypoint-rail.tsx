/**
 * The daily reading as a waypoint rail (DESIGN.md §Surfaces): the same
 * Co-Star-style life-area grouping as before (research 2026-07-16 — lines
 * group under the palace they touch, day-level lines under "The day
 * itself"), now hung off a dashed rail with a numbered, icon-bearing node
 * per section instead of a flat tonal card. Prose still sits above its fact
 * citation (the M17 rule, unchanged) — only the surrounding chrome moves.
 */

"use client";

import type { Branch, Palace } from "@daymaster/bazi-engine";
import type { ReadingLine } from "@daymaster/content";
import { AnimalIcon } from "@/components/glyph-icon";
import { ReadingCard } from "@/components/reading-card";
import { describeBranch } from "@/lib/display";

const AREA_TITLE: Record<string, string> = {
  year: "Roots",
  month: "Career",
  day: "Home",
  hour: "Horizon",
  overall: "The day itself"
};

interface Section {
  area: string;
  title: string;
  lines: ReadingLine[];
}

/** Group lines by area into titled sections, ordered by first appearance. */
function sectionsOf(lines: ReadingLine[]): Section[] {
  const byArea = new Map<string, Section>();
  for (const line of lines) {
    const area = line.area ?? "overall";
    const existing = byArea.get(area);
    if (existing) {
      existing.lines.push(line);
    } else {
      byArea.set(area, { area, title: AREA_TITLE[area] ?? "The day itself", lines: [line] });
    }
  }
  return [...byArea.values()];
}

interface Props {
  lines: ReadingLine[];
  /**
   * The branch each section's waypoint node illustrates: the natal palace's
   * own branch for year/month/day/hour, today's transit branch for
   * "overall" ("The day itself"). Sections with no matching branch (e.g. an
   * unknown birth hour) fall back to a plain node.
   */
  branchByArea: Partial<Record<Palace | "overall", Branch>>;
}

export function WaypointRail({ lines, branchByArea }: Props) {
  const sections = sectionsOf(lines);

  return (
    <div
      data-reading-body
      className="ml-3 border-dashed border-hairline pl-7"
      style={{ borderLeftWidth: "var(--rail-width)" }}
    >
      <p className="kicker -ml-7 mb-1">Waypoints · the full route</p>
      {sections.map((section, index) => {
        const branch = branchByArea[section.area as Palace | "overall"];
        const icon = branch ? describeBranch(branch) : null;
        return (
          <section key={section.area} className="relative py-3.5">
            <span
              className="absolute -left-[47px] top-3 flex items-center justify-center rounded-full bg-surface shadow-node"
              style={{ height: "var(--node-size)", width: "var(--node-size)" }}
            >
              {icon ? (
                <AnimalIcon animal={icon.gloss} element={icon.element} size={20} />
              ) : (
                <span className="h-2 w-2 rounded-full bg-ink-tint" aria-hidden />
              )}
            </span>
            <p className="caption">Waypoint {String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-display text-[19px] text-ink">{section.title}</h3>
            <div className="mt-2 flex flex-col gap-4">
              {section.lines.map((line, lineIndex) => (
                <ReadingCard key={lineIndex} line={line} flat citation="below" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
