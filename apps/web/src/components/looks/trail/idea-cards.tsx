/**
 * Explorer's reading: one swipe card per idea (DESIGN.md v5 §Explorer,
 * "Further along"), so a section with three lines becomes three cards of
 * similar height rather than one tall one.
 */

"use client";

import type { Branch } from "@daymaster/bazi-engine";
import type { ReadingArea } from "@daymaster/content";
import { describeBranch, type ReadingSection } from "@daymaster/presentation";
import { AnimalIcon } from "@/components/glyph-icon";
import { ReadingCard } from "@/components/reading-card";

interface Props {
  sections: ReadingSection[];
  branchByArea: Partial<Record<ReadingArea, Branch>>;
}

export function IdeaCards({ sections, branchByArea }: Props) {
  return (
    <div data-reading-body className="idea-cards -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 pt-1">
      {sections.flatMap((section) => {
        const branch = branchByArea[section.area];
        const animal = branch ? describeBranch(branch) : null;
        return section.lines.map((line, index) => (
          <article key={`${section.area}-${index}`} className="idea-card">
            <p className="caption flex items-center gap-2">
              {animal && <AnimalIcon animal={animal.gloss} element={animal.element} size={18} tone="ink" />}
              {section.title}
            </p>
            <ReadingCard line={line} flat citation="below" />
          </article>
        ));
      })}
    </div>
  );
}
