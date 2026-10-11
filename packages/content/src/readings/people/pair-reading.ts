/**
 * People (M24-09): how the two of you meet, from the pair's compare facts. The
 * lead is keyed by how the day-masters relate; each sign link between the two
 * charts becomes a card by life area, then what each of you brings out in the
 * other. Selection is fixed per fact, so the same pair always reads the same.
 */

import type { CompareFact } from "@daymaster/bazi-engine";
import { PERIOD_TEN_GOD_CARDS } from "../../banks/ahead/period.js";
import { PAIR_AREA_SUFFIX, PAIR_INTERACTION_CARDS, PAIR_LEADS } from "../../banks/people/pair.js";
import { lifeAreaOf } from "../daily/life-areas.js";
import type { PlainCard, PlainReading } from "../plain/plain-reading.js";

export function pairReading(facts: readonly CompareFact[]): PlainReading | null {
  const dayMasters = facts.find((fact): fact is Extract<CompareFact, { kind: "compare-day-masters" }> => fact.kind === "compare-day-masters");
  if (!dayMasters) {
    return null;
  }
  const leadText = PAIR_LEADS[dayMasters.relation];
  const cards: PlainCard[] = [];
  const seen = new Set<string>();
  for (const fact of facts) {
    if (fact.kind !== "compare-interaction") {
      continue;
    }
    const area = lifeAreaOf(fact.aPalace);
    const topic = `pair:${fact.interaction}:${area}`;
    if (seen.has(topic)) {
      continue;
    }
    seen.add(topic);
    const [title, line] = PAIR_INTERACTION_CARDS[fact.interaction];
    cards.push({ topic, title: `${title} ${PAIR_AREA_SUFFIX[area]}`, line });
  }
  const theyBring = PERIOD_TEN_GOD_CARDS[dayMasters.aSeesB.english];
  if (theyBring) {
    cards.push({ topic: `ten-god:${dayMasters.aSeesB.english}`, title: "What they bring out in you", line: `${theyBring[0]}.` });
  }
  const youBring = PERIOD_TEN_GOD_CARDS[dayMasters.bSeesA.english];
  if (youBring) {
    cards.push({ topic: `ten-god:${dayMasters.bSeesA.english}`, title: "What you bring them", line: `${youBring[0]}.` });
  }
  return { lead: { ...leadText, topic: `relation:${dayMasters.relation}` }, cards };
}
