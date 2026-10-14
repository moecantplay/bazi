/**
 * Which fact Today is about (VOICE.md rule 13): the strongest sign link to the
 * chart, or the day's character when nothing pulls on the chart. The element
 * joins the first screen only when it changes the advice.
 */

import type { DayFact, Element, InteractionType, ReadingFact } from "@daymaster/bazi-engine";
import { pick } from "../../hash.js";
import type { DailySeed } from "../../types.js";
import { isFriction, lifeAreaOf, type LifeArea } from "./life-areas.js";

export type TransitFact = Extract<DayFact, { kind: "transit-interaction" }>;
type TransitOf<F extends ReadingFact> = Extract<F, { kind: "transit-interaction" }>;
type ElementFact = Extract<DayFact, { kind: "element-day" }>;

/** How loudly each interaction speaks, strongest first. */
const SEVERITY: Record<InteractionType, number> = {
  "six-clash": 0,
  punishment: 1,
  harm: 2,
  "six-combine": 3,
  trine: 4,
};

export type Lead =
  | { kind: "interaction"; fact: TransitFact; area: LifeArea; topic: string }
  | { kind: "quiet"; god: string; topic: string };

export interface Modifier {
  element: Element;
  tone: "suits" | "against";
  topic: string;
}

/** A transit's topic key: its interaction and the first natal palace it touches. */
export function interactionTopic(fact: TransitOf<ReadingFact>): string {
  return `interaction:${fact.interaction}:${fact.natalPalaces[0] ?? "overall"}`;
}

/**
 * Every transit a reading can speak about, a day's or a period's, strongest
 * first; equal severities keep a stable topic order. An interaction kind this
 * layer doesn't know (a future engine enum) is left out rather than guessed at.
 */
export function rankTransits<F extends ReadingFact>(facts: readonly F[]): TransitOf<F>[] {
  return facts
    .filter((fact): fact is TransitOf<F> => fact.kind === "transit-interaction")
    .filter((fact) => fact.interaction in SEVERITY)
    .sort((a, b) => SEVERITY[a.interaction] - SEVERITY[b.interaction] || interactionTopic(a).localeCompare(interactionTopic(b)));
}

/** The lead: the strongest transit (the seed breaks ties), else the day's character. */
export function chooseLead(facts: readonly DayFact[], seed: Pick<DailySeed, "chart">): Lead {
  const ranked = rankTransits(facts);
  const strongest = ranked[0];
  if (strongest) {
    const tier = ranked.filter((fact) => SEVERITY[fact.interaction] === SEVERITY[strongest.interaction]);
    // Tied transits share the day's branch; breaking the tie on the branch
    // (not the date) keeps a branch's lead the same every time it comes round.
    const fact = tier.length === 1 ? strongest : pick(tier, `${seed.chart}|${strongest.transitBranch}`, "lead");
    return { kind: "interaction", fact, area: lifeAreaOf(fact.natalPalaces[0]), topic: interactionTopic(fact) };
  }
  const tenGod = facts.find((fact): fact is Extract<DayFact, { kind: "ten-god-day" }> => fact.kind === "ten-god-day");
  const god = tenGod?.english ?? "Friend";
  return { kind: "quiet", god, topic: `ten-god:${god}` };
}

/**
 * The element joins the body when it pulls against the lead: a grinding lead
 * on a day that suits you, a helping lead on a day against your grain. On a
 * quiet day it always joins, as the day's second fact.
 */
export function chooseModifier(facts: readonly DayFact[], lead: Lead): Modifier | null {
  const element = facts.find((fact): fact is ElementFact => fact.kind === "element-day");
  if (!element) {
    return null;
  }
  const tone = element.favorable ? "suits" : "against";
  const topic = `element:${element.element}`;
  if (lead.kind === "quiet") {
    return { element: element.element, tone, topic };
  }
  const friction = isFriction(lead.fact.interaction);
  if ((friction && element.favorable) || (!friction && !element.favorable)) {
    return { element: element.element, tone, topic };
  }
  return null;
}
