/**
 * Today's reading, composed around one lead fact (VOICE.md rule 13, M20-21):
 * a headline, a two-to-three sentence body and one thing to do, all in
 * everyday words, then a plain card for every other fact.
 *
 * Each slot steps through its pool day by day (cyclePick), so the same
 * situation doesn't repeat its wording on nearby days. Deterministic in
 * (facts, seed). No chart math — facts carry everything.
 */

import type { ReadingFact } from "@daymaster/bazi-engine";
import { cyclePick, dayNumber } from "../../hash.js";
import { finalizeLine, type DailyReading, type DailySeed } from "../../types.js";
import { topicCards } from "./cards.js";
import { chooseLead, chooseModifier, type Lead, type Modifier } from "./lead.js";
import {
  AGENCY,
  BODY_BASES,
  HEADLINES,
  MODIFIERS,
  QUIET_AGENCY,
  QUIET_BODIES,
  QUIET_HEADLINES,
} from "./pools.js";

interface FirstScreenPools {
  cell: string;
  headlines: readonly string[];
  bodies: readonly string[];
  agencies: readonly string[];
}

/**
 * The situation a day's first screen is written for: interaction × life area,
 * or the day's character on a quiet day. Presentation counts a situation's
 * visits by this key.
 */
export function leadCellOf(facts: readonly ReadingFact[], chartSeed: string): string {
  return poolsFor(chooseLead(facts, { chart: chartSeed })).cell;
}

function poolsFor(lead: Lead): FirstScreenPools {
  if (lead.kind === "interaction") {
    const { interaction } = lead.fact;
    return {
      cell: `${interaction}:${lead.area}`,
      headlines: HEADLINES[interaction][lead.area],
      bodies: BODY_BASES[interaction][lead.area],
      agencies: AGENCY[interaction][lead.area],
    };
  }
  const god = QUIET_BODIES[lead.god] ? lead.god : "Friend";
  return {
    cell: `quiet:${god}`,
    headlines: QUIET_HEADLINES[god] ?? [],
    bodies: QUIET_BODIES[god] ?? [],
    agencies: QUIET_AGENCY[god] ?? [],
  };
}

function modifierSentence(modifier: Modifier | null, seed: DailySeed): string | null {
  if (!modifier) {
    return null;
  }
  const pool = MODIFIERS[modifier.element][modifier.tone];
  return cyclePick(pool, seed.chart, `modifier:${modifier.element}:${modifier.tone}`, dayNumber(seed.date));
}

/** Build Today's reading. */
export function dailyReading(facts: ReadingFact[], seed: DailySeed): DailyReading {
  const lead = chooseLead(facts, seed);
  const modifier = chooseModifier(facts, lead);
  const pools = poolsFor(lead);
  const step = seed.visit ?? dayNumber(seed.date);
  const pickFrom = (pool: readonly string[], slot: string): string => cyclePick(pool, seed.chart, `${slot}:${pools.cell}`, step);

  const base = pickFrom(pools.bodies, "body");
  const effect = modifierSentence(modifier, seed);

  return {
    headline: finalizeLine({ text: pickFrom(pools.headlines, "headline") }),
    body: finalizeLine({ text: effect ? `${base} ${effect}` : base }),
    agency: finalizeLine({ text: pickFrom(pools.agencies, "agency") }),
    leadTopic: lead.topic,
    modifierTopic: modifier?.topic ?? null,
    cards: topicCards(facts, lead, modifier, seed),
  };
}
