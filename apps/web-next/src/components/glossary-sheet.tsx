/**
 * A bottom sheet that explains one entry — a glossary category explainer
 * behind a reading caption, the "how this reading works" overview, or a
 * read-more deep dive (which adds a "Working with it" advice section). Closes
 * on the backdrop, the close button, or Escape. Renders title/body/advice
 * through TokenText (the entry's `*Runs` fields) rather than
 * stripHanCharacters — see M19 decision F.
 */

"use client";

import { useEffect } from "react";
import type { TokenLine } from "@daymaster/content";
import { TokenText } from "@/components/token-text";
import { plainText, runsOrText } from "@/lib/content-runs";

/** Structurally fits both GlossaryEntry and ReadMoreEntry. */
interface SheetEntry {
  title: string;
  body: readonly string[];
  advice?: readonly string[];
  titleRuns?: TokenLine;
  bodyRuns?: readonly TokenLine[];
  adviceRuns?: readonly TokenLine[];
}

interface Props {
  entry: SheetEntry;
  onClose: () => void;
}

export function GlossarySheet({ entry, onClose }: Props) {
  const titleRuns = runsOrText(entry.titleRuns, entry.title);
  const bodyRuns = entry.body.map((paragraph, index) => runsOrText(entry.bodyRuns?.[index], paragraph));
  const adviceRuns = entry.advice?.map((paragraph, index) => runsOrText(entry.adviceRuns?.[index], paragraph));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      data-glossary-sheet
      role="dialog"
      aria-modal="true"
      aria-label={plainText(titleRuns)}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="sheet-in relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-sheet bg-surface p-6 pb-8 shadow-hero sm:rounded-sheet sm:pb-6">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-ink-tint" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg leading-snug text-ink">
            <TokenText line={titleRuns} />
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 px-2 py-1 text-2xl leading-none text-ink-soft hover:text-ink"
          >
            &times;
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {bodyRuns.map((paragraph, index) => (
            <p key={index} className="text-[14px] leading-relaxed text-ink">
              <TokenText line={paragraph} />
            </p>
          ))}
        </div>
        {adviceRuns && (
          <div data-glossary-advice className="mt-4 border-t-[1.5px] border-dashed border-hairline pt-3">
            <h3 className="kicker text-element-wood">Working with it</h3>
            <div className="mt-2 flex flex-col gap-3">
              {adviceRuns.map((paragraph, index) => (
                <p key={index} className="text-[14px] leading-relaxed text-ink">
                  <TokenText line={paragraph} />
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
