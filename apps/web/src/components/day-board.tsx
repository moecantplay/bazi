/**
 * The day's merged guidance board (VOICE.md rule 12, arranged Co-Star-style):
 * two columns — "Favors" and "Watch" — each opening with the day's almanac
 * chips and following with the fact-cited suggestions, over the prose lines
 * that explain the day's grain. Chips carry no verdict; friction reads as
 * postponement, and a friction chip is always explained by a line below.
 */

"use client";

import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import { ReadingCard } from "@/components/reading-card";
import { useHanCharacters } from "@/components/han-characters-provider";
import type { GuidanceChip } from "@/lib/guidance";

interface ColumnProps {
  title: string;
  chips: GuidanceChip[];
  suggestions: ReadingLine[];
}

function BoardColumn({ title, chips, suggestions }: ColumnProps) {
  const { showHanCharacters } = useHanCharacters();
  const display = (text: string) => (showHanCharacters ? text : stripHanCharacters(text));

  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-4">
      <h3 className="text-[12px] font-medium uppercase tracking-wide text-ink-soft">{title}</h3>
      {chips.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li
              key={chip.activity}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-hairline px-3 py-1"
            >
              <span className="text-[13px] text-ink">{chip.label}</span>
              {showHanCharacters && (
                <span className="font-han text-[12px] text-ink-soft">{chip.chinese}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-2.5 flex flex-col gap-2.5">
        {suggestions.map((line, index) => (
          <li key={index}>
            <p className="text-[14px] leading-relaxed text-ink">{display(line.text)}</p>
            <FactTag line={line} className="mt-0.5 text-[11px] text-ink-soft" />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  chips: GuidanceChip[];
  /** The guidance prose: officer line plus chip explanations, fact-cited. */
  proseLines: ReadingLine[];
  dos: ReadingLine[];
  donts: ReadingLine[];
}

export function DayBoard({ chips, proseLines, dos, donts }: Props) {
  const favors = chips.filter((chip) => chip.leaning === "favors");
  const watch = chips.filter((chip) => chip.leaning === "friction");

  return (
    <section data-guidance className="flex flex-col gap-4">
      <div data-dos-donts className="grid gap-3 sm:grid-cols-2">
        <BoardColumn title="Favors" chips={favors} suggestions={dos} />
        <BoardColumn title="Watch" chips={watch} suggestions={donts} />
      </div>
      {proseLines.length > 0 && (
        <div className="flex flex-col gap-3">
          {proseLines.map((line, index) => (
            <ReadingCard key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  );
}
