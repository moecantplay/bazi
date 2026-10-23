/**
 * Assemble a natal reading from natal facts. Deterministic in (facts, seedKey):
 * the same inputs always produce byte-identical sections and lines.
 *
 * This layer only pattern-matches on facts and formats strings. It computes no
 * relations and derives no new facts.
 */

import type { Element, NatalFact } from "@daymaster/bazi-engine";
import type { DraftLine, NatalReading, ReadingSection } from "./types.js";
import { finalizeLine } from "./types.js";
import type { TokenLine } from "./tokens.js";
import { pick, pickDistinct } from "./hash.js";
import { STRENGTH_CHECK_GLOSSES, STRENGTH_CHECK_GLOSS_RUNS, elementWord } from "./vocab.js";
import { DAY_MASTER_LINES } from "./banks/day-master.js";
import { natalStarLine } from "./banks/stars.js";
import {
  BALANCED_LINES,
  CAREER_LINES,
  DOMINANT_LINES,
  FAVORABLE_LINES,
  MISSING_LINES,
  STRONG_LINES,
  WEAK_LINES,
} from "./banks/elements.js";
import { natalInteractionLine } from "./banks/natal-interactions.js";

type FactOf<K extends NatalFact["kind"]> = Extract<NatalFact, { kind: K }>;

function firstFact<K extends NatalFact["kind"]>(
  facts: readonly NatalFact[],
  kind: K,
): FactOf<K> | undefined {
  return facts.find((fact): fact is FactOf<K> => fact.kind === kind);
}

function dayMasterSection(facts: readonly NatalFact[], seedKey: string): ReadingSection | null {
  const fact = firstFact(facts, "day-master");
  if (!fact) {
    return null;
  }
  const block = DAY_MASTER_LINES[fact.stem];
  const factTag = `${fact.stem} · day-master`;
  const opener = block[0] as string;
  const rest = pickDistinct(block.slice(1), 2, seedKey, `dm:${fact.stem}`);
  const lines: DraftLine[] = [opener, ...rest].map((text) => ({
    text,
    factTag,
    topic: "day-master",
  }));
  return { key: "day-master", title: "Your day-master", lines: lines.map(finalizeLine) };
}

/**
 * How far the most common element leads the next. A chart is balanced when
 * the lead is at most 1 and dominated only from 2 up, so the paragraph never
 * says both (M20-17; owner, 2026-09-29).
 */
function elementLead(counts: Record<Element, number>): number {
  const [top = 0, second = 0] = Object.values(counts).sort((a, b) => b - a);
  return top - second;
}

const DOMINANT_LEAD = 2;

function elementsSection(facts: readonly NatalFact[], seedKey: string): ReadingSection | null {
  const lines: DraftLine[] = [];

  const balance = firstFact(facts, "element-balance");
  if (balance) {
    const clearLeader = elementLead(balance.counts) >= DOMINANT_LEAD;
    if (clearLeader) {
      const dominant = balance.dominant;
      lines.push({
        text: pick(DOMINANT_LINES[dominant], seedKey, `edom:${dominant}`),
        factTag: `${elementWord(dominant)} dominant`,
        topic: "elements",
      });
    }

    if (balance.missing.length > 0) {
      const missing = pick(balance.missing, seedKey, `emisspick:${balance.missing.join("")}`);
      lines.push({
        text: pick(MISSING_LINES[missing], seedKey, `emiss:${missing}`),
        factTag: `${elementWord(missing)} absent`,
        topic: "elements",
      });
    } else if (!clearLeader) {
      lines.push({
        text: pick(BALANCED_LINES, seedKey, "ebalanced"),
        factTag: "balanced elements",
        topic: "elements",
      });
    }
  }

  const strength = firstFact(facts, "strength");
  if (strength) {
    const pool = strength.value === "strong" ? STRONG_LINES : WEAK_LINES;
    lines.push({
      text: pick(pool, seedKey, `str:${strength.value}`),
      factTag: `${strength.value} day-master`,
      topic: "strength",
    });
    lines.push(...strengthWhyLines(strength));
  }

  if (lines.length === 0) {
    return null;
  }
  return { key: "elements", title: "Your elements", lines: lines.map(finalizeLine) };
}

/** How many of the three checks pass, said in words. */
const PASS_SUBJECTS = ["None of the three", "One of the three", "Two of the three", "All three"] as const;

/**
 * The tally sentence: how many checks pass, the strong/weak reading it gives,
 * and whether the call was narrow. Only phrasing; the count comes from the fact.
 */
function strengthTally(strength: FactOf<"strength">, passes: number): string {
  const subject = PASS_SUBJECTS[passes] ?? `${passes} of the three`;
  const verb = passes <= 1 ? "runs" : "run";
  const narrow = strength.narrow ? ", by a narrow margin" : "";
  if (strength.value === "strong") {
    return `${subject} ${verb} in your favor, so the chart reads strong${narrow}.`;
  }
  const lead = passes === 0 ? subject : `Only ${subject.toLowerCase()}`;
  return `${lead} ${verb} in your favor, so the chart reads weak${narrow}.`;
}

/**
 * Explain the strong/weak reading via its three checks (令 season, 地 ground,
 * 勢 numbers), each glossed in ordinary terms so the reader sees the why. The
 * checks and the tally are two lines: together they need three sentences to
 * keep each under 25 words (Plain writing rule 2), and a line holds at most two
 * (VOICE.md rule 2).
 */
function strengthWhyLines(strength: FactOf<"strength">): DraftLine[] {
  const checks = [
    STRENGTH_CHECK_GLOSSES.seasonal[strength.seasonal ? "yes" : "no"],
    STRENGTH_CHECK_GLOSSES.rooted[strength.rooted ? "yes" : "no"],
    STRENGTH_CHECK_GLOSSES.backed[strength.backed ? "yes" : "no"],
  ];
  const text = `Three checks sit behind that reading: you ${checks[0]}. You ${checks[1]}, and you ${checks[2]}.`;
  const runs: TokenLine = [
    { kind: "text", text: "Three checks sit behind that reading: you " },
    ...STRENGTH_CHECK_GLOSS_RUNS.seasonal[strength.seasonal ? "yes" : "no"],
    { kind: "text", text: ". You " },
    ...STRENGTH_CHECK_GLOSS_RUNS.rooted[strength.rooted ? "yes" : "no"],
    { kind: "text", text: ", and you " },
    ...STRENGTH_CHECK_GLOSS_RUNS.backed[strength.backed ? "yes" : "no"],
    { kind: "text", text: "." },
  ];
  const passes = [strength.seasonal, strength.rooted, strength.backed].filter(Boolean).length;
  return [
    { text, factTag: "strength · three checks", topic: "strength", runs },
    { text: strengthTally(strength, passes), factTag: "strength · tally", topic: "strength" },
  ];
}

function starsSection(facts: readonly NatalFact[], seedKey: string): ReadingSection | null {
  const stars = facts.filter((fact): fact is FactOf<"star"> => fact.kind === "star");
  if (stars.length === 0) {
    return null;
  }
  // One line per distinct star (first palace wins), at most three, seed-chosen.
  const distinct = new Map<string, FactOf<"star">>();
  for (const star of stars) {
    if (!distinct.has(star.star)) {
      distinct.set(star.star, star);
    }
  }
  const shown = pickDistinct([...distinct.values()], 3, seedKey, "starsel");
  const lines = shown.map((star) =>
    natalStarLine({ star: star.star, chinese: star.chinese, english: star.english }, star.palace),
  );
  return { key: "stars", title: "Your stars", lines: lines.map(finalizeLine) };
}

function suitsSection(facts: readonly NatalFact[], seedKey: string): ReadingSection | null {
  const favorable = firstFact(facts, "favorable");
  if (!favorable || favorable.elements.length === 0) {
    return null;
  }

  const shown = pickDistinct(favorable.elements, 2, seedKey, `fav:${favorable.elements.join("")}`);
  const lines: DraftLine[] = shown.map((element: Element) => ({
    text: FAVORABLE_LINES[element],
    factTag: `${elementWord(element)} · suits you`,
    topic: "favorable",
  }));

  const careerElement = pick(favorable.elements, seedKey, `career:${favorable.elements.join("")}`);
  lines.push({
    text: CAREER_LINES[careerElement],
    factTag: `${elementWord(careerElement)} · inclinations`,
    topic: "favorable",
  });

  return { key: "favorable", title: "What tends to suit you", lines: lines.map(finalizeLine) };
}

function structureSection(facts: readonly NatalFact[], seedKey: string): ReadingSection | null {
  const interactions = facts.filter(
    (fact): fact is FactOf<"natal-interaction"> => fact.kind === "natal-interaction",
  );
  if (interactions.length === 0) {
    return null;
  }
  const lines = interactions.map((fact) =>
    natalInteractionLine(
      {
        interaction: fact.interaction,
        branches: fact.branches,
        palaces: fact.palaces,
        element: fact.element,
        completeness: fact.completeness,
        punishmentKind: fact.punishmentKind,
      },
      seedKey,
    ),
  );
  return { key: "structure", title: "Your chart's structure", lines: lines.map(finalizeLine) };
}

/** Build the full natal reading. Sections with no lines are omitted. */
export function natalReading(facts: readonly NatalFact[], seedKey: string): NatalReading {
  const sections = [
    dayMasterSection(facts, seedKey),
    elementsSection(facts, seedKey),
    suitsSection(facts, seedKey),
    structureSection(facts, seedKey),
    starsSection(facts, seedKey),
  ].filter((section): section is ReadingSection => section !== null);
  return { sections };
}
