/**
 * One transit pillar as its "yang fire · horse" gloss pair anchored by the
 * element and animal icons. A shared building block for the Cycles horizon
 * sections and the date-finder results, both of which show a pillar without
 * the full four-column hero grid.
 */

import type { Pillar } from "@daymaster/bazi-engine";
import { describeBranch, describeStem } from "@daymaster/presentation";
import { AnimalIcon, ElementIcon } from "@/components/glyph-icon";

interface Props {
  pillar: Pillar;
  size?: "sm" | "lg";
  showMeta?: boolean;
}

export function PillarGlyph({ pillar, size = "lg", showMeta = false }: Props) {
  const stem = describeStem(pillar.stem);
  const branch = describeBranch(pillar.branch);
  const glossSize = size === "lg" ? "text-xl" : "text-[14px]";

  return (
    <span className="inline-flex flex-col items-center leading-none">
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
        {stem.gloss} &middot; {branch.gloss}
      </span>
      {showMeta && (
        <span className="mt-1.5 text-[12px] text-ink-soft">
          {stem.pinyin} {stem.element} &middot; {branch.pinyin} {branch.element}
        </span>
      )}
    </span>
  );
}
