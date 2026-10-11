/**
 * The plain reading shape every screen past Today shares (M24): one lead
 * (headline → body → one thing to try) and a plain card for each other fact,
 * as Today does since M20-21. Everyday words only (VOICE.md rule 11).
 */

import type { ReadingFact } from "@daymaster/bazi-engine";

export interface PlainLead {
  headline: string;
  body: string;
  action: string;
  topic: string;
}

export interface PlainCard {
  topic: string;
  title: string;
  line: string;
}

export interface PlainReading {
  lead: PlainLead;
  cards: PlainCard[];
}

/** A card's wording: [title, line]. */
export type CardText = readonly [string, string];

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

export function factOf<K extends ReadingFact["kind"]>(facts: readonly ReadingFact[], kind: K): FactOf<K> | undefined {
  return facts.find((fact): fact is FactOf<K> => fact.kind === kind);
}

export function card(topic: string, [title, line]: CardText): PlainCard {
  return { topic, title, line };
}

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
