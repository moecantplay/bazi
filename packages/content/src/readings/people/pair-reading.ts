/**
 * People (M24-09): how the two of you meet, from the pair's compare facts. The
 * lead is keyed by how the day-masters relate; each sign link between the two
 * charts becomes a card by life area, then what each of you brings out in the
 * other. Selection is fixed per fact, so the same pair always reads the same,
 * and each line is the first the screen hasn't shown yet (M24-11), so two links
 * of one kind in different parts of life read differently.
 */

import type { CompareFact } from "@daymaster/bazi-engine";
import { PAIR_AREA_SUFFIX, PAIR_BRINGS, PAIR_INTERACTION_CARDS, PAIR_LEADS } from "../../banks/people/pair.js";
import { firstUnused } from "../../rotation.js";
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
  const shown = new Set<string>();
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
    const [title, line] = firstUnused(PAIR_INTERACTION_CARDS[fact.interaction], ([, candidate]) => shown.has(candidate));
    shown.add(line);
    cards.push({ topic, title: `${title} ${PAIR_AREA_SUFFIX[area]}`, line });
  }
  const brings = [
    { english: dayMasters.aSeesB.english, title: "What they bring out in you" },
    { english: dayMasters.bSeesA.english, title: "What you bring them" },
  ];
  for (const { english, title } of brings) {
    const pool = PAIR_BRINGS[english];
    if (!pool) {
      continue;
    }
    const line = firstUnused(pool, (candidate) => shown.has(candidate));
    shown.add(line);
    cards.push({ topic: `ten-god:${english}`, title, line });
  }
  return { lead: { ...leadText, topic: `relation:${dayMasters.relation}` }, cards };
}
