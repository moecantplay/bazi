/**
 * The reading as chapters: a flat segment stack of collapsed sections, each
 * opening in place (Editorial and Instrument). The last chapter is "What the
 * day suits". Collapsed panels stay in the DOM (hidden), so the whole reading
 * is still one `data-reading-body`.
 */

"use client";

import { useId, useState, type ReactNode } from "react";
import type { ReadingSection } from "@daymaster/presentation";
import { ReadingCard } from "@/components/reading-card";
import { plainText } from "@/lib/content-runs";

interface ChapterProps {
  kicker: string;
  title: string;
  children: ReactNode;
  /** Data hook for the one chapter E2E opens by name. */
  dataHook?: "go-deeper";
  /**
   * Render the body only once opened. Reading chapters stay in the DOM while
   * collapsed (the whole reading is one data-reading-body); "What the day
   * suits" is a fold like Explorer's, built on demand.
   */
  lazy?: boolean;
}

function Chapter({ kicker, title, children, dataHook, lazy = false }: ChapterProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="chapter">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-go-deeper={dataHook === "go-deeper" ? "" : undefined}
        onClick={() => setOpen((current) => !current)}
        className="chapter-toggle"
      >
        <span className="caption">{kicker}</span>
        <span className="chapter-title">{title}</span>
        <span aria-hidden className="chapter-chevron">
          &rsaquo;
        </span>
      </button>
      <div id={panelId} hidden={!open} className="chapter-panel">
        {(open || !lazy) && children}
      </div>
    </div>
  );
}

/** A chapter's title: its first citation in words ("Rat–horse clash"), else the area name. */
function chapterTitle(section: ReadingSection): string {
  const tag = section.lines.find((line) => line.factTagRuns)?.factTagRuns;
  if (!tag) {
    return section.title;
  }
  const lead = plainText(tag).split(" · ")[0] ?? section.title;
  return lead.charAt(0).toUpperCase() + lead.slice(1);
}

interface Props {
  sections: ReadingSection[];
  suits: ReactNode;
}

export function ReadingChapters({ sections, suits }: Props) {
  return (
    <div data-reading-body className="flex flex-col gap-0.5">
      {sections.map((section) => (
        <Chapter key={section.area} kicker={section.title} title={chapterTitle(section)}>
          {section.lines.map((line, index) => (
            <ReadingCard key={index} line={line} flat citation="below" />
          ))}
        </Chapter>
      ))}
      <Chapter kicker="Go deeper" title="What the day suits" dataHook="go-deeper" lazy>
        {suits}
      </Chapter>
    </div>
  );
}
