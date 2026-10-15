/**
 * The reader's first week on Today (M24-10). Day one has the first-day
 * banner; on each of the next six days the reader opens Today, one note
 * introduces one part of the page. Parts go in a fixed order, each once, and
 * only on a day it's on screen. Pure: the web layer stores what this returns.
 */

import type { FirstWeekPart, TopicCard } from "@daymaster/content";
import { todayColourFor } from "./today-colour.js";
import type { StoredProfile } from "./types.js";

/** A part of Today a first-week note can introduce; content holds each part's note. */
export type IntroPart = FirstWeekPart;

/** Every part, in the order they're introduced. */
export const INTRO_ORDER: readonly IntroPart[] = [
  "hours",
  "character",
  "pace",
  "element",
  "also-today",
  "small-signs",
  "suits",
  "colour",
  "journal"
];

/** Opened days the first week lasts, the banner's day included. */
export const FIRST_WEEK_DAYS = 7;

/** What the store keeps: the days Today was opened, and the day each part had its note. */
export interface FirstWeekState {
  /** ISO dates, in the order they were first opened; at most FIRST_WEEK_DAYS. */
  opened: string[];
  noted: Partial<Record<IntroPart, string>>;
}

export interface FirstWeekStep {
  /** The part to introduce today, or null for no note. */
  part: IntroPart | null;
  /** Which opened day of the week today is (1–7), or 0 once the week is over. */
  day: number;
  /** The state to store: the same object when nothing changed, null once the week is over. */
  next: FirstWeekState | null;
}

/** A first week that hasn't had a day yet: what onboarding stores with a new profile. */
export function startFirstWeek(): FirstWeekState {
  return { opened: [], noted: {} };
}

function cardPart(topic: string): IntroPart | null {
  if (topic === "hours") {
    return "hours";
  }
  if (topic === "stars") {
    return "small-signs";
  }
  const prefixes: [string, IntroPart][] = [
    ["ten-god:", "character"],
    ["stage:", "pace"],
    ["element:", "element"],
    ["interaction:", "also-today"]
  ];
  return prefixes.find(([prefix]) => topic.startsWith(prefix))?.[1] ?? null;
}

/**
 * The parts on today's Today, in INTRO_ORDER: one per kind of plain card
 * present, plus What the day suits and the journal (always shown for today)
 * and Today's colour when the day has one.
 */
export function partsOnScreen(profile: StoredProfile, dateISO: string, cards: readonly TopicCard[]): IntroPart[] {
  const present = new Set<IntroPart>(["suits", "journal"]);
  for (const card of cards) {
    const part = cardPart(card.topic);
    if (part) {
      present.add(part);
    }
  }
  if (todayColourFor(profile, dateISO)) {
    present.add("colour");
  }
  return INTRO_ORDER.filter((part) => present.has(part));
}

/** Today's note, and the state to store after showing it. */
export function firstWeekNote(state: FirstWeekState, todayISO: string, onScreen: readonly IntroPart[]): FirstWeekStep {
  const isNewDay = !state.opened.includes(todayISO);
  if (isNewDay && state.opened.length >= FIRST_WEEK_DAYS) {
    return { part: null, day: 0, next: null };
  }
  const opened = isNewDay ? [...state.opened, todayISO] : state.opened;
  const day = opened.indexOf(todayISO) + 1;

  // A part already noted today shows again on a reload, unless its card has
  // since left the screen (an edit to the birth details can change the cards).
  const notedToday = INTRO_ORDER.find((part) => state.noted[part] === todayISO);
  if (notedToday) {
    return { part: onScreen.includes(notedToday) ? notedToday : null, day, next: state };
  }

  const part = day === 1 ? undefined : INTRO_ORDER.find((candidate) => onScreen.includes(candidate) && state.noted[candidate] === undefined);
  if (!part) {
    return { part: null, day, next: isNewDay ? { ...state, opened } : state };
  }
  return { part, day, next: { opened, noted: { ...state.noted, [part]: todayISO } } };
}
