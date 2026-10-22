/**
 * Today's reading, composed around one lead fact (VOICE.md rule 13, M20-21):
 * a headline, a two-to-three sentence body and one thing to do, all in
 * everyday words, then a plain card for every other fact.
 *
 * Each slot steps through its pool by visit (rotation.ts), so the same
 * situation doesn't repeat its wording on nearby days. Deterministic in
 * (facts, seed). No chart math: facts carry everything.
 */

import type { DayFact } from "@daymaster/bazi-engine";
import { pickerFor, type Picker, type RotationSlot } from "../../rotation.js";
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

function modifierSentence(modifier: Modifier | null, pick: Picker): string | null {
  if (!modifier) {
    return null;
  }
  return pick(MODIFIERS[modifier.element][modifier.tone], `modifier:${modifier.element}:${modifier.tone}`);
}

function compose(facts: readonly DayFact[], seed: DailySeed, pick: Picker): DailyReading {
  const lead = chooseLead(facts, seed);
  const modifier = chooseModifier(facts, lead);
  const pools = poolsFor(lead);

  const base = pick(pools.bodies, `body:${pools.cell}`);
  const effect = modifierSentence(modifier, pick);

  return {
    headline: finalizeLine({ text: pick(pools.headlines, `headline:${pools.cell}`) }),
    body: finalizeLine({ text: effect ? `${base} ${effect}` : base }),
    agency: finalizeLine({ text: pick(pools.agencies, `agency:${pools.cell}`) }),
    leadTopic: lead.topic,
    modifierTopic: modifier?.topic ?? null,
    cards: topicCards(facts, lead, modifier, pick),
  };
}

/** Build Today's reading. */
export function dailyReading(facts: readonly DayFact[], seed: DailySeed): DailyReading {
  return compose(facts, seed, pickerFor(seed));
}

/**
 * Every rotating slot a day's reading picks under, with its pool size. The
 * slots depend only on the facts, never on the steps, so presentation counts
 * visits by them.
 */
export function dailySlots(facts: readonly DayFact[], chartSeed: string): RotationSlot[] {
  const slots: RotationSlot[] = [];
  const seed: DailySeed = { chart: chartSeed, date: "1970-01-01" };
  compose(facts, seed, pickerFor(seed, slots));
  return slots;
}
