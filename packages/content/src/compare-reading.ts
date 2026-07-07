/**
 * Assemble a two-chart comparison reading from CompareFacts. Deterministic in
 * (facts, seedKey): same pair of charts, same lines. Order: how the
 * day-masters meet, then up to MAX_INTERACTION_LINES cross interactions
 * (seed-chosen when there are more), then element support.
 */

import type { CompareFact, InteractionType, Palace } from "@daymaster/bazi-engine";
import type { CompareReading, ReadingLine } from "./types.js";
import { pick, pickDistinct } from "./hash.js";
import { TEN_GOD_GLOSSES, elementWord, interactionWord, palaceWord } from "./vocab.js";
import {
  COMPARE_GENERIC_TEMPLATES,
  COMPARE_INTERACTION_TEMPLATES,
  MIRROR_PUNISHMENT_TEMPLATES,
  RELATION_LINES,
  SEEN_TEMPLATES,
  SUPPORT_LINES,
} from "./banks/compare.js";

type FactOf<K extends CompareFact["kind"]> = Extract<CompareFact, { kind: K }>;

const MAX_INTERACTION_LINES = 3;

function dayMasterLines(fact: FactOf<"compare-day-masters">, seedKey: string): ReadingLine[] {
  const factTag = `${fact.aStem} × ${fact.bStem} · day-masters`;
  const relationText = pick(RELATION_LINES[fact.relation], seedKey, `cmp:rel:${fact.relation}`)
    .replaceAll("{aElement}", elementWord(fact.aElement))
    .replaceAll("{bElement}", elementWord(fact.bElement));

  const seen = (template: string, god: { english: string; chinese: string }): string =>
    template
      .replaceAll("{god}", god.english)
      .replaceAll("{chinese}", god.chinese)
      .replaceAll("{gloss}", TEN_GOD_GLOSSES[god.english] ?? "one of the ten flavors of relation");

  return [
    { text: relationText, factTag },
    { text: seen(SEEN_TEMPLATES.aSeesB, fact.aSeesB), factTag: `${fact.aSeesB.english} · ${fact.aSeesB.chinese}` },
    { text: seen(SEEN_TEMPLATES.bSeesA, fact.bSeesA), factTag: `${fact.bSeesA.english} · ${fact.bSeesA.chinese}` },
  ];
}

function interactionTemplates(fact: FactOf<"compare-interaction">): readonly string[] {
  if (fact.interaction === "punishment" && fact.punishmentKind === "self") {
    return MIRROR_PUNISHMENT_TEMPLATES;
  }
  return COMPARE_INTERACTION_TEMPLATES[fact.interaction] ?? COMPARE_GENERIC_TEMPLATES;
}

function compareTag(
  branches: readonly [string, string],
  interaction: InteractionType,
  aPalace: Palace,
  bPalace: Palace,
): string {
  return `${branches.join("")} ${interactionWord(interaction)} · your ${palaceWord(aPalace)} × their ${palaceWord(bPalace)}`;
}

function interactionLine(fact: FactOf<"compare-interaction">, seedKey: string): ReadingLine {
  const salt = `cmp:${fact.interaction}:${fact.branches.join("")}:${fact.aPalace}:${fact.bPalace}`;
  const text = pick(interactionTemplates(fact), seedKey, salt)
    .replaceAll("{aBranch}", fact.branches[0])
    .replaceAll("{bBranch}", fact.branches[1])
    .replaceAll("{aPalace}", palaceWord(fact.aPalace))
    .replaceAll("{bPalace}", palaceWord(fact.bPalace))
    .replaceAll("{element}", fact.element ? elementWord(fact.element) : "");
  return {
    text,
    factTag: compareTag(fact.branches, fact.interaction, fact.aPalace, fact.bPalace),
  };
}

function supportLine(fact: FactOf<"compare-element-support">): ReadingLine {
  const text = SUPPORT_LINES[fact.direction].replaceAll("{element}", elementWord(fact.element));
  return { text, factTag: `${elementWord(fact.element)} · support` };
}

/** Build the full comparison reading. */
export function compareReading(facts: CompareFact[], seedKey: string): CompareReading {
  const lines: ReadingLine[] = [];

  const dayMasters = facts.find(
    (fact): fact is FactOf<"compare-day-masters"> => fact.kind === "compare-day-masters",
  );
  if (dayMasters) {
    lines.push(...dayMasterLines(dayMasters, seedKey));
  }

  const interactions = facts.filter(
    (fact): fact is FactOf<"compare-interaction"> => fact.kind === "compare-interaction",
  );
  const chosen =
    interactions.length <= MAX_INTERACTION_LINES
      ? interactions
      : pickDistinct(interactions, MAX_INTERACTION_LINES, seedKey, "cmpsel");
  lines.push(...chosen.map((fact) => interactionLine(fact, seedKey)));

  for (const fact of facts) {
    if (fact.kind === "compare-element-support") {
      lines.push(supportLine(fact));
    }
  }

  return { lines };
}
