/**
 * Presentation-only lookups for stems and branches: pinyin and a short English
 * gloss shown beneath each character, plus the element each maps to.
 *
 * Pinyin and glosses are display concerns and live in the web layer (the engine
 * deals only in characters). VOICE.md requires every Chinese character to carry
 * its English immediately, so these maps are always rendered alongside the Han.
 */

import type { Branch, Element, Palace, Stem } from "@daymaster/bazi-engine";
import {
  BRANCH_ELEMENTS,
  BRANCHES,
  STEM_ELEMENTS,
  STEM_POLARITIES,
  STEMS
} from "@daymaster/bazi-engine";
import { BRANCH_ANIMALS } from "@daymaster/content";

interface Glyph {
  pinyin: string;
  gloss: string;
  element: Element;
}

const STEM_PINYIN: Record<Stem, string> = {
  甲: "jiǎ",
  乙: "yǐ",
  丙: "bǐng",
  丁: "dīng",
  戊: "wù",
  己: "jǐ",
  庚: "gēng",
  辛: "xīn",
  壬: "rén",
  癸: "guǐ"
};

const BRANCH_PINYIN: Record<Branch, string> = {
  子: "zǐ",
  丑: "chǒu",
  寅: "yín",
  卯: "mǎo",
  辰: "chén",
  巳: "sì",
  午: "wǔ",
  未: "wèi",
  申: "shēn",
  酉: "yǒu",
  戌: "xū",
  亥: "hài"
};

// Both stems and branches are drawn from the engine's canonical arrays, so a
// character always resolves to a valid index; the fallbacks satisfy the
// compiler's index-access checks without ever running.
const STEM_ELEMENT: Record<Stem, Element> = Object.fromEntries(
  STEMS.map((stem, index) => [stem, STEM_ELEMENTS[index] ?? "wood"])
) as Record<Stem, Element>;

const STEM_POLARITY = Object.fromEntries(
  STEMS.map((stem, index) => [stem, STEM_POLARITIES[index] ?? "yang"])
) as Record<Stem, "yang" | "yin">;

const BRANCH_ELEMENT: Record<Branch, Element> = Object.fromEntries(
  BRANCHES.map((branch, index) => [branch, BRANCH_ELEMENTS[index] ?? "water"])
) as Record<Branch, Element>;

/** Display fields for a heavenly stem: pinyin, "yang wood"-style gloss, element. */
export function describeStem(stem: Stem): Glyph {
  const element = STEM_ELEMENT[stem];
  return {
    pinyin: STEM_PINYIN[stem],
    gloss: `${STEM_POLARITY[stem]} ${element}`,
    element
  };
}

/** Display fields for an earthly branch: pinyin, zodiac-animal gloss, element. */
export function describeBranch(branch: Branch): Glyph {
  return {
    pinyin: BRANCH_PINYIN[branch],
    gloss: BRANCH_ANIMALS[branch],
    element: BRANCH_ELEMENT[branch]
  };
}

/**
 * The VOICE.md palace vocabulary for each natal pillar. Year = roots, month =
 * career, day = home, hour = horizon. Transit-only palaces have no natal word.
 */
const PALACE_WORD: Partial<Record<Palace, string>> = {
  year: "roots",
  month: "career",
  day: "home",
  hour: "horizon"
};

/** The palace word for a natal pillar, or null for transit-only palaces. */
export function palaceWord(palace: Palace): string | null {
  return PALACE_WORD[palace] ?? null;
}
