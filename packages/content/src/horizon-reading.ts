/**
 * Assemble the year (流年) and month (流月) outlook from the engine's horizon
 * facts. Each period reads in up to three lines — a ten-god theme, the element
 * weather, and one transit note when a period pillar touches a natal palace.
 *
 * Deterministic in (horizons, seedKey). Zero chart math: the facts carry the
 * pillar, its element, its ten-god relation, and any interactions already.
 */

import type { HorizonFacts, ReadingFact } from "@daymaster/bazi-engine";
import type { ReadingLine } from "./types.js";
import { pick } from "./hash.js";
import { elementWord, interactionTag, palaceWord } from "./vocab.js";
import {
  ELEMENT_PERIOD_FAVORABLE,
  ELEMENT_PERIOD_UNFAVORABLE,
  TEN_GOD_PERIOD_THEMES,
  THEME_FRAMES,
  THEME_GENERIC,
  TRANSIT_PERIOD_FRAMES,
  TRANSIT_PERIOD_GENERIC,
} from "./banks/horizons.js";

type Period = "annual" | "monthly";
type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

/** The year and month outlooks, each an ordered set of lines. */
export interface HorizonReading {
  annual: ReadingLine[];
  monthly: ReadingLine[];
}

function periodCap(period: Period): string {
  return period === "annual" ? "This year" : "This month";
}

function periodNoun(period: Period): string {
  return period === "annual" ? "year" : "month";
}

function fill(template: string, subs: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(subs)) {
    out = out.replaceAll(`{${key}}`, value);
  }
  return out;
}

function themeLine(fact: FactOf<"ten-god-period">, period: Period, seedKey: string): ReadingLine {
  const theme = TEN_GOD_PERIOD_THEMES[fact.english];
  const noun = periodNoun(period);
  if (theme === undefined) {
    const text = fill(THEME_GENERIC, { periodCap: periodCap(period), tgCn: fact.god });
    return { text, factTag: `ten-god note · this ${noun}`, topic: "ten-gods" };
  }
  const template = pick(THEME_FRAMES, seedKey, `hz:${period}:theme:${fact.english}`);
  const text = fill(template, {
    periodCap: periodCap(period),
    periodNoun: noun,
    tgEn: fact.english,
    tgCn: fact.god,
    tgTheme: theme,
  });
  return {
    text,
    factTag: `${fact.english} · ${fact.god} · this ${noun}`,
    topic: `ten-god:${fact.english}`,
  };
}

function elementLine(fact: FactOf<"element-period">, period: Period): ReadingLine {
  const table = fact.favorable ? ELEMENT_PERIOD_FAVORABLE : ELEMENT_PERIOD_UNFAVORABLE;
  const text = fill(table[fact.element], { periodNoun: periodNoun(period) });
  const noun = periodNoun(period);
  const factTag = `${elementWord(fact.element)} ${noun}${fact.favorable ? " · suits you" : ""}`;
  return { text, factTag, topic: "elements" };
}

function transitLine(
  fact: FactOf<"transit-interaction">,
  period: Period,
  seedKey: string,
): ReadingLine {
  const room = fact.natalPalaces[0] ?? "day";
  const frames = TRANSIT_PERIOD_FRAMES[fact.interaction] ?? [TRANSIT_PERIOD_GENERIC];
  const template = pick(frames, seedKey, `hz:${period}:tr:${fact.interaction}:${fact.natalPalaces.join("")}`);
  const text = fill(template, { periodCap: periodCap(period), palace: palaceWord(room) });
  const factTag = `${interactionTag(fact.branches, fact.interaction, room)} · this ${periodNoun(period)}`;
  const line: ReadingLine = { text, factTag };
  if (TRANSIT_PERIOD_FRAMES[fact.interaction]) {
    line.topic = `interaction:${fact.interaction}`;
  }
  return line;
}

function periodLines(facts: readonly ReadingFact[], period: Period, seedKey: string): ReadingLine[] {
  const lines: ReadingLine[] = [];

  const tenGod = facts.find((fact): fact is FactOf<"ten-god-period"> => fact.kind === "ten-god-period");
  if (tenGod) {
    lines.push(themeLine(tenGod, period, seedKey));
  }

  const element = facts.find((fact): fact is FactOf<"element-period"> => fact.kind === "element-period");
  if (element) {
    lines.push(elementLine(element, period));
  }

  const transits = facts.filter(
    (fact): fact is FactOf<"transit-interaction"> => fact.kind === "transit-interaction",
  );
  if (transits.length > 0) {
    const chosen =
      transits.length === 1 ? transits[0]! : pick(transits, seedKey, `hz:${period}:trsel`);
    lines.push(transitLine(chosen, period, seedKey));
  }

  return lines;
}

/** Build the year and month outlooks from one date's horizon facts. */
export function horizonReading(horizons: HorizonFacts, seedKey: string): HorizonReading {
  return {
    annual: periodLines(horizons.annual, "annual", seedKey),
    monthly: periodLines(horizons.monthly, "monthly", seedKey),
  };
}
