/**
 * English-only rendering of reading text (the "Show Chinese characters" toggle).
 *
 * Every line the content layer emits already carries its English alongside the
 * Han characters, so removing the characters never removes meaning. This module
 * rewrites a finished line for readers who have the characters turned off:
 * parentheticals lose their Han, bare branch runs in fact tags become animal
 * names ("子午 clash" -> "rat–horse clash"), stem+branch pillar pairs become
 * their plain names ("戊辰" -> "yang-earth dragon"), and any remaining
 * characters are dropped with the spacing and "·" separators tidied up.
 */

import type { Branch } from "@daymaster/bazi-engine";

/** The zodiac animal each branch names — its immediate, familiar translation. */
export const BRANCH_ANIMALS: Record<Branch, string> = {
  子: "rat",
  丑: "ox",
  寅: "tiger",
  卯: "rabbit",
  辰: "dragon",
  巳: "snake",
  午: "horse",
  未: "goat",
  申: "monkey",
  酉: "rooster",
  戌: "dog",
  亥: "pig",
};

/** Each stem's element and polarity in plain words — its everyday translation. */
const STEM_GLOSSES: Record<string, string> = {
  甲: "yang-wood",
  乙: "yin-wood",
  丙: "yang-fire",
  丁: "yin-fire",
  戊: "yang-earth",
  己: "yin-earth",
  庚: "yang-metal",
  辛: "yin-metal",
  壬: "yang-water",
  癸: "yin-water",
};

/** A standalone stem+branch pillar pair, e.g. "戊辰". Ranges match HAN below. */
const PILLAR_RUN =
  /(?<![㐀-鿿豈-﫿])([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])(?![㐀-鿿豈-﫿])/g;

const HAN = /[㐀-鿿豈-﫿]/;
const HAN_ALL = /[㐀-鿿豈-﫿]/g;

/** A standalone run of two or three branch characters, e.g. "子午" or "寅午戌". */
const BRANCH_RUN = /(?<![㐀-鿿])([子丑寅卯辰巳午未申酉戌亥]{2,3})(?![㐀-鿿])/g;

/** A Han run carrying its English gloss in parens, e.g. "子 (rat)". */
const GLOSSED_HAN = /[㐀-鿿豈-﫿]+\s*\(([^()]*)\)/g;

/** "(得令 — in season)" -> "(in season)"; "(文昌)" -> gone, with its space. */
function stripParenthetical(whole: string, inside: string): string {
  if (!HAN.test(inside)) {
    return whole;
  }
  const kept = inside
    .replace(HAN_ALL, "")
    .replace(/^[\s—–-]+/, "")
    .replace(/[\s—–-]+$/, "")
    .trim();
  return kept ? ` (${kept})` : "";
}

/** Drop empty "·" segments left behind ("Direct Officer · " -> "Direct Officer"). */
function tidySeparators(text: string): string {
  if (!text.includes("·")) {
    return text;
  }
  return text
    .split("·")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join(" · ");
}

/**
 * The same line with every Han character removed and the English left standing.
 * Text without Han characters passes through unchanged.
 */
export function stripHanCharacters(text: string): string {
  if (!HAN.test(text)) {
    return text;
  }
  // "子 (rat)" keeps only its gloss; parens whose inside has Han are left for
  // stripParenthetical below ("note (偏印)" and friends).
  const withGlosses = text.replace(GLOSSED_HAN, (whole, inside: string) =>
    HAN.test(inside) ? whole : inside,
  );
  const withoutParens = withGlosses.replace(/\s*\(([^)]*)\)/g, stripParenthetical);
  const withPillars = withoutParens.replace(
    PILLAR_RUN,
    (_run, stem: string, branch: string) =>
      `${STEM_GLOSSES[stem]} ${BRANCH_ANIMALS[branch as Branch]}`,
  );
  const withAnimals = withPillars.replace(BRANCH_RUN, (run) =>
    [...run].map((char) => BRANCH_ANIMALS[char as Branch]).join("–"),
  );
  const withoutHan = withAnimals.replace(HAN_ALL, "");
  return tidySeparators(withoutHan.replace(/\s{2,}/g, " ").replace(/\s+([.,;])/g, "$1")).trim();
}
