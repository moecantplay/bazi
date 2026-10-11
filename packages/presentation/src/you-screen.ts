/**
 * The You screen's view-models (M24-08): the natal facts and the element split
 * handed to content's plain wording. The split is the engine's favourable set,
 * in its order, and the rest as what wears you down: the same strength rule
 * read the other way.
 */

import { natalFacts, type Element } from "@daymaster/bazi-engine";
import { youColours, youElements, youReading, type PlainReading, type YouColours, type YouElements } from "@daymaster/content";
import { chartFor } from "./chart.js";
import { ELEMENT_ORDER } from "./elements.js";
import { natalSeedKey } from "./seed-key.js";
import type { StoredProfile } from "./types.js";

export interface ElementSplit {
  helps: Element[];
  wears: Element[];
}

/** The favourable elements in the engine's order, and the rest. */
export function elementSplit(profile: StoredProfile): ElementSplit {
  const helps = chartFor(profile).favorableElements;
  return { helps, wears: ELEMENT_ORDER.filter((element) => !helps.includes(element)) };
}

/** The portrait lead and the What shapes you cards. */
export function youScreenFor(profile: StoredProfile): PlainReading | null {
  return youReading(natalFacts(chartFor(profile)), natalSeedKey(profile));
}

/** What helps you and what wears you down. */
export function youElementsFor(profile: StoredProfile): YouElements | null {
  const { helps, wears } = elementSplit(profile);
  return youElements(helps, wears);
}

/** Colours that suit you and colours to go easy on. */
export function youColoursFor(profile: StoredProfile): YouColours | null {
  const { helps, wears } = elementSplit(profile);
  return youColours(helps, wears);
}
