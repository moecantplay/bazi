/**
 * The day's merged guidance board (VOICE.md rule 12; stark-list arrangement
 * from the Co-Star research, 2026-07-16): two columns — "Favors" and "Watch"
 * — each a plain word list of the day's almanac activities (Co-Star's do/don't
 * idiom, our non-prohibitive labels) followed by the fact-cited suggestions,
 * over the prose that explains the day's grain. A friction listing is always
 * explained by a line below.
 */

"use client";

import type { ReadingLine } from "@daymaster/content";
import { stripHanCharacters } from "@daymaster/content";
import { FactTag } from "@/components/fact-tag";
import type { GuidanceChip } from "@/lib/guidance";

interface ColumnProps {
  title: string;
  chips: GuidanceChip[];
  suggestions: ReadingLine[];
}

function BoardColumn({ title, chips, suggestions }: ColumnProps) {
  const display = (text: string) => stripHanCharacters(text);

  return (
    <div className="card p-5">
      <h3 className="kicker">{title}</h3>
      {chips.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {chips.map((chip) => (
            <li key={chip.activity}>
              <span className="text-[15px] leading-relaxed text-ink">{chip.label}</span>
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-3 flex flex-col gap-2.5 border-t border-hairline pt-3">
        {suggestions.map((line, index) => (
          <li key={index}>
            <p className="text-[14px] leading-relaxed text-ink">{display(line.text)}</p>
            <FactTag line={line} className="caption mt-0.5" />
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

/**
 * Consecutive prose lines that cite the same fact render as one block —
 * caption once, sentences as paragraphs (DESIGN.md §Surfaces: guidance
 * grouping). Without this, an officer day stacks three sibling cards all
 * captioned e.g. "Success day".
 */
function groupByFactTag(lines: ReadingLine[]): ReadingLine[][] {
  const groups: ReadingLine[][] = [];
  let current: ReadingLine[] | null = null;
  let currentTag: ReadingLine["factTag"] = null;
  for (const line of lines) {
    if (current && currentTag === line.factTag) {
      current.push(line);
    } else {
      current = [line];
      currentTag = line.factTag;
      groups.push(current);
    }
  }
  return groups;
}

function GuidanceGroup({ lines }: { lines: ReadingLine[] }) {
  const display = (text: string) => stripHanCharacters(text);

  const first = lines[0];
  if (!first) {
    return null;
  }

  return (
    <div className="card p-5">
      <FactTag line={first} />
      <div className="mt-1.5 flex flex-col gap-2">
        {lines.map((line, index) => (
          <p key={index} className="text-[15px] leading-relaxed text-ink">
            {display(line.text)}
          </p>
        ))}
      </div>
    </div>
  );
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
        <div className="flex flex-col gap-2">
          {groupByFactTag(proseLines).map((group, index) => (
            <GuidanceGroup key={index} lines={group} />
          ))}
        </div>
      )}
    </section>
  );
}
