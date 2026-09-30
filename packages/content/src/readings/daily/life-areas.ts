/**
 * The four parts of life Today speaks about, in everyday words (VOICE.md
 * palace vocabulary): the chart's palaces never appear by name on Today.
 */

import type { InteractionType, Palace } from "@daymaster/bazi-engine";

export type LifeArea = "family" | "work" | "home" | "plans";

export const LIFE_AREAS: readonly LifeArea[] = ["family", "work", "home", "plans"];

const AREA_OF_PALACE: Record<Palace, LifeArea | null> = {
  year: "family",
  month: "work",
  day: "home",
  hour: "plans",
  annual: null,
  monthly: null,
  daily: null,
  luck: null,
};

/** The life area a natal palace speaks for; transit palaces have none. */
export function lifeAreaOf(palace: Palace | undefined): LifeArea {
  return (palace && AREA_OF_PALACE[palace]) ?? "home";
}

/** How the topic pages name each area's sign in the birth chart. */
export const AREA_SIGN_PHRASE: Record<LifeArea, string> = {
  family: "your birth chart's sign for family",
  work: "your birth chart's sign for work",
  home: "your birth chart's sign for home and partner",
  plans: "your birth chart's sign for what you're building toward",
};

/** Interactions that grind (the body eases them) versus ones that help. */
export const FRICTION_INTERACTIONS: readonly InteractionType[] = ["six-clash", "punishment", "harm"];

export function isFriction(interaction: InteractionType): boolean {
  return FRICTION_INTERACTIONS.includes(interaction);
}
