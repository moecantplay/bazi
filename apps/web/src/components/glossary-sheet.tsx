/**
 * A bottom sheet that explains one entry — a glossary category explainer
 * behind a reading caption, the "how this reading works" overview, or a
 * read-more deep dive (which adds a "Working with it" advice section). Closes
 * on the backdrop, the close button, or Escape. Renders through the Han
 * toggle like all reading text.
 */

"use client";

import { useEffect } from "react";
import { stripHanCharacters } from "@daymaster/content";
import { useHanCharacters } from "@/components/han-characters-provider";

/** Structurally fits both GlossaryEntry and ReadMoreEntry. */
interface SheetEntry {
  title: string;
  body: readonly string[];
  advice?: readonly string[];
}

interface Props {
  entry: SheetEntry;
  onClose: () => void;
}

export function GlossarySheet({ entry, onClose }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

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
      aria-label={display(entry.title)}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-hairline bg-paper-raised dark-borderless p-6 pb-8 sm:rounded-2xl sm:pb-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg leading-snug text-ink">{display(entry.title)}</h2>
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
          {entry.body.map((paragraph, index) => (
            <p key={index} className="text-[14px] leading-relaxed text-ink">
              {display(paragraph)}
            </p>
          ))}
        </div>
        {entry.advice && (
          <div data-glossary-advice className="mt-4 border-t border-hairline pt-3">
            <h3 className="kicker">
              Working with it
            </h3>
            <div className="mt-2 flex flex-col gap-3">
              {entry.advice.map((paragraph, index) => (
                <p key={index} className="text-[14px] leading-relaxed text-ink">
                  {display(paragraph)}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
