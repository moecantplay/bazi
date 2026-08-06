/**
 * Assemble a two-chart comparison reading from CompareFacts. Deterministic in
 * (facts, seedKey): same pair of charts, same lines. Order: how the
 * day-masters meet, then up to MAX_INTERACTION_LINES cross interactions
 * (seed-chosen when there are more), then element support.
 */

import type { CompareFact, InteractionType, Palace } from "@daymaster/bazi-engine";
import type { CompareReading, DraftLine } from "./types.js";
import { finalizeLine } from "./types.js";
import type { TokenLine } from "./tokens.js";
import { fillRuns } from "./tokens.js";
import { pick, pickDistinct } from "./hash.js";
import {
  TEN_GOD_CHINESE,
  TEN_GOD_GLOSSES,
  branchTokenRuns,
  joinBranchRuns,
  elementWord,
  interactionWord,
  palaceWord,
  stemTokenRuns,
} from "./vocab.js";
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

function dayMasterLines(fact: FactOf<"compare-day-masters">, seedKey: string): DraftLine[] {
  const factTag = `${fact.aStem} × ${fact.bStem} · day-masters`;
  const factTagRuns: TokenLine = [
    ...stemTokenRuns(fact.aStem),
    { kind: "text", text: " × " },
    ...stemTokenRuns(fact.bStem),
    { kind: "text", text: " · day-masters" },
  ];
  const relationText = pick(RELATION_LINES[fact.relation], seedKey, `cmp:rel:${fact.relation}`)
    .replaceAll("{aElement}", elementWord(fact.aElement))
    .replaceAll("{bElement}", elementWord(fact.bElement));

  const seen = (template: string, god: { english: string; chinese: string }): string =>
    template
      .replaceAll("{god}", god.english)
      .replaceAll("{chinese}", god.chinese)
      .replaceAll("{gloss}", TEN_GOD_GLOSSES[god.english] ?? "one of the ten flavors of relation");

  const tenGodTopic = (english: string): string =>
    TEN_GOD_GLOSSES[english] ? `ten-god:${english}` : "ten-gods";

  /** A "{english} · {chinese}" fact tag as term runs — the god's gloss, its own classical character. */
  const seenTagRuns = (god: { english: string; chinese: string }): TokenLine => [
    {
      kind: "term",
      term: god.english,
      gloss: TEN_GOD_GLOSSES[god.english] ?? "one of the ten flavors of relation",
      han: TEN_GOD_CHINESE[god.english] ?? god.chinese,
    },
  ];

  return [
    { text: relationText, factTag, factTagRuns, topic: "day-master" },
    {
      text: seen(SEEN_TEMPLATES.aSeesB, fact.aSeesB),
      factTag: `${fact.aSeesB.english} · ${fact.aSeesB.chinese}`,
      factTagRuns: seenTagRuns(fact.aSeesB),
      topic: tenGodTopic(fact.aSeesB.english),
    },
    {
      text: seen(SEEN_TEMPLATES.bSeesA, fact.bSeesA),
      factTag: `${fact.bSeesA.english} · ${fact.bSeesA.chinese}`,
      factTagRuns: seenTagRuns(fact.bSeesA),
      topic: tenGodTopic(fact.bSeesA.english),
    },
  ];
}

function interactionTemplates(fact: FactOf<"compare-interaction">): readonly string[] {
  if (fact.interaction === "punishment" && fact.punishmentKind === "self") {
    return MIRROR_PUNISHMENT_TEMPLATES;
  }
  return COMPARE_INTERACTION_TEMPLATES[fact.interaction] ?? COMPARE_GENERIC_TEMPLATES;
}

/** Structured fact tag: term runs for each branch, en-dash joined (see joinBranchRuns). */
function compareTagRuns(
  branches: readonly [string, string],
  interaction: InteractionType,
  aPalace: Palace,
  bPalace: Palace,
): TokenLine {
  return [
    ...joinBranchRuns(branches),
    {
      kind: "text",
      text: ` ${interactionWord(interaction)} · your ${palaceWord(aPalace)} × their ${palaceWord(bPalace)}`,
    },
  ];
}

function interactionLine(fact: FactOf<"compare-interaction">, seedKey: string): DraftLine {
  const salt = `cmp:${fact.interaction}:${fact.branches.join("")}:${fact.aPalace}:${fact.bPalace}`;
  const template = pick(interactionTemplates(fact), seedKey, salt);
  const runs = fillRuns(template, {
    aBranch: branchTokenRuns(fact.branches[0]),
    bBranch: branchTokenRuns(fact.branches[1]),
    aPalace: [{ kind: "text", text: palaceWord(fact.aPalace) }],
    bPalace: [{ kind: "text", text: palaceWord(fact.bPalace) }],
    element: [{ kind: "text", text: fact.element ? elementWord(fact.element) : "" }],
  });
  return {
    runs,
    factTagRuns: compareTagRuns(fact.branches, fact.interaction, fact.aPalace, fact.bPalace),
    topic: `interaction:${fact.interaction}`,
  };
}

function supportLine(fact: FactOf<"compare-element-support">): DraftLine {
  const text = SUPPORT_LINES[fact.direction].replaceAll("{element}", elementWord(fact.element));
  return { text, factTag: `${elementWord(fact.element)} · support`, topic: "elements" };
}

/** Build the full comparison reading. */
export function compareReading(facts: CompareFact[], seedKey: string): CompareReading {
  const lines: DraftLine[] = [];

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

  return { lines: lines.map(finalizeLine) };
}
