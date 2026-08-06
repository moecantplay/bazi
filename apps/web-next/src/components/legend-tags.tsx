/**
 * The map-legend chips under the headline (DESIGN.md §Layout "legend tags"):
 * element·polarity and zodiac·day-type. The reference mockup
 * (docs/design-system/src/cards/trail.mjs) also shows a third dashed
 * "notice" tag naming the day officer (e.g. "RECEIVE — GATHERING-IN"), but
 * OFFICER_GLOSSES (packages/content/src/vocab.ts) only holds full
 * descriptive sentences, not a short chip-length pair — inventing a punchy
 * officer tag would mean writing new copy, which is out of scope for a
 * presentation-only reskin. Dropped rather than guessed.
 *
 * Deliberately NOT the shared `.chip` class: `.chip`'s ink-tint background
 * (bg-ink-tint) plus `ink-soft` text measured under 4.5:1 at this 9.5px size
 * once terrain shifted the underlying tones (checked live against the built
 * app across all 5 terrains × both themes). The reference mockup's own tag
 * sits on a plain `--card` fill, not a tint — `bg-surface` here matches that
 * and clears AA the same way `.card`'s ink-soft captions already do
 * elsewhere.
 */

import type { Element } from "@daymaster/bazi-engine";
import { AnimalIcon, ElementIcon } from "@/components/glyph-icon";

interface Props {
  stemElement: Element;
  stemPolarity: "yang" | "yin";
  branchGloss: string;
  branchElement: Element;
}

export function LegendTags({ stemElement, stemPolarity, branchGloss, branchElement }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wide text-ink-soft">
        <ElementIcon element={stemElement} polarity={stemPolarity} size={14} />
        {stemElement} &middot; {stemPolarity}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wide text-ink-soft">
        <AnimalIcon animal={branchGloss} element={branchElement} size={14} tone="ink" />
        {branchGloss} day
      </span>
    </div>
  );
}
