/**
 * Assemble the year (流年), month (流月), or decade (大运) outlook from the
 * engine's period facts. Each period reads in up to three lines — a ten-god
 * theme, the element weather, and one transit note when the period's pillar
 * touches a natal palace.
 *
 * Deterministic in (facts, seedKey). Zero chart math: the facts carry the
 * pillar's element, its ten-god relation, and any interactions already.
 */

import type { ReadingFact } from "@daymaster/bazi-engine";
import type { DraftLine, ReadingLine } from "./types.js";
import { finalizeLine } from "./types.js";
import type { TokenLine } from "./tokens.js";
import { fillRuns, textRun } from "./tokens.js";
import { pick } from "./hash.js";
import { TEN_GOD_GLOSSES, elementWord, interactionTagRuns, palaceWord } from "./vocab.js";
import {
  ELEMENT_PERIOD_FAVORABLE,
  ELEMENT_PERIOD_UNFAVORABLE,
  TEN_GOD_PERIOD_THEMES,
  THEME_FRAMES,
  THEME_GENERIC,
  TRANSIT_PERIOD_FRAMES,
  TRANSIT_PERIOD_GENERIC,
} from "./banks/horizons.js";

export type Period = "annual" | "monthly" | "luck";
type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

function periodCap(period: Period): string {
  if (period === "annual") return "This year";
  if (period === "monthly") return "This month";
  return "This decade";
}

function periodNoun(period: Period): string {
  if (period === "annual") return "year";
  if (period === "monthly") return "month";
  return "decade";
}

function fill(template: string, subs: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(subs)) {
    out = out.replaceAll(`{${key}}`, value);
  }
  return out;
}

function themeLine(fact: FactOf<"ten-god-period">, period: Period, seedKey: string): DraftLine {
  const theme = TEN_GOD_PERIOD_THEMES[fact.english];
  const noun = periodNoun(period);
  if (theme === undefined) {
    const text = fill(THEME_GENERIC, { periodCap: periodCap(period), tgCn: fact.god });
    return {
      runs: textRun(text),
      factTagRuns: textRun(`ten-god note · this ${noun}`),
      topic: "ten-gods",
    };
  }
  const template = pick(THEME_FRAMES, seedKey, `hz:${period}:theme:${fact.english}`);
  // Every THEME_FRAMES template carries "{tgEn} ({tgCn})" contiguous — collapse
  // it into one term run the same way day-guidance.ts collapses the officer pair.
  const normalized = template.replace("{tgEn} ({tgCn})", "{tgTerm}");
  const runs = fillRuns(normalized, {
    periodCap: [{ kind: "text", text: periodCap(period) }],
    periodNoun: [{ kind: "text", text: noun }],
    tgTerm: [{ kind: "term", term: fact.english, gloss: TEN_GOD_GLOSSES[fact.english] ?? theme, han: fact.god }],
    tgTheme: [{ kind: "text", text: theme }],
  });
  return {
    runs,
    factTagRuns: [
      { kind: "term", term: fact.english, gloss: TEN_GOD_GLOSSES[fact.english] ?? theme, han: fact.god },
      { kind: "text", text: ` · this ${noun}` },
    ],
    topic: `ten-god:${fact.english}`,
  };
}

function elementLine(fact: FactOf<"element-period">, period: Period): DraftLine {
  const table = fact.favorable ? ELEMENT_PERIOD_FAVORABLE : ELEMENT_PERIOD_UNFAVORABLE;
  const text = fill(table[fact.element], { periodNoun: periodNoun(period) });
  const noun = periodNoun(period);
  const factTag = `${elementWord(fact.element)} ${noun}${fact.favorable ? " · suits you" : ""}`;
  return {
    runs: textRun(text),
    factTagRuns: textRun(factTag),
    topic: "elements",
  };
}

function transitLine(
  fact: FactOf<"transit-interaction">,
  period: Period,
  seedKey: string,
): DraftLine {
  const room = fact.natalPalaces[0] ?? "day";
  const frames = TRANSIT_PERIOD_FRAMES[fact.interaction] ?? [TRANSIT_PERIOD_GENERIC];
  const template = pick(frames, seedKey, `hz:${period}:tr:${fact.interaction}:${fact.natalPalaces.join("")}`);
  const runs: TokenLine = fillRuns(template, {
    periodCap: [{ kind: "text", text: periodCap(period) }],
    palace: [{ kind: "text", text: palaceWord(room) }],
  });
  const line: DraftLine = {
    runs,
    factTagRuns: [
      ...interactionTagRuns(fact.branches, fact.interaction, room),
      { kind: "text", text: ` · this ${periodNoun(period)}` },
    ],
  };
  if (TRANSIT_PERIOD_FRAMES[fact.interaction]) {
    line.topic = `interaction:${fact.interaction}`;
  }
  return line;
}

export function periodLines(facts: readonly ReadingFact[], period: Period, seedKey: string): DraftLine[] {
  const lines: DraftLine[] = [];

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

/** The annual (流年) reading alone, for an arbitrarily selected year. */
export function annualReading(facts: readonly ReadingFact[], seedKey: string): ReadingLine[] {
  return periodLines(facts, "annual", seedKey).map(finalizeLine);
}

/** The monthly (流月) reading alone, for an arbitrarily selected calendar month. */
export function monthlyReading(facts: readonly ReadingFact[], seedKey: string): ReadingLine[] {
  return periodLines(facts, "monthly", seedKey).map(finalizeLine);
}
