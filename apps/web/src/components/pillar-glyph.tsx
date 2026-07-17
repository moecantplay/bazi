/**
 * One transit pillar as glyphs: the stem and branch characters when Chinese is
 * on, the "yang fire · horse" gloss pair when it's off. A shared building block
 * for the Cycles horizon sections and the date-finder results, both of which
 * show a pillar without the full four-column hero grid.
 */

"use client";

import type { Pillar } from "@daymaster/bazi-engine";
import { describeBranch, describeStem } from "@/lib/display";
import { AnimalIcon, ElementIcon } from "@/components/glyph-icon";
import { useHanCharacters } from "@/components/han-characters-provider";

interface Props {
  pillar: Pillar;
  size?: "sm" | "lg";
  showMeta?: boolean;
}

export function PillarGlyph({ pillar, size = "lg", showMeta = false }: Props) {
  const { showHanCharacters } = useHanCharacters();
  const stem = describeStem(pillar.stem);
  const branch = describeBranch(pillar.branch);
  const hanSize = size === "lg" ? "text-4xl" : "text-lg";
  const glossSize = size === "lg" ? "text-xl" : "text-[14px]";

  return (
    <span className="inline-flex flex-col items-center leading-none">
      {showHanCharacters ? (
        <span className={`font-han ${hanSize} leading-none text-ink`}>
          {pillar.stem}
          {pillar.branch}
        </span>
      ) : (
        <span className={`inline-flex items-center gap-1.5 font-display ${glossSize} leading-tight text-ink`}>
          <ElementIcon
            element={stem.element}
            polarity={stem.polarity}
            size={size === "lg" ? 22 : 17}
          />
          <AnimalIcon
            animal={branch.gloss}
            element={branch.element}
            size={size === "lg" ? 22 : 17}
          />
          {stem.gloss} · {branch.gloss}
        </span>
      )}
      {showMeta && (
        <span className="mt-1.5 text-[12px] text-ink-soft">
          {stem.pinyin} {stem.element} · {branch.pinyin} {branch.element}
        </span>
      )}
    </span>
  );
}
