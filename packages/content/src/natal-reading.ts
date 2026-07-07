/**
 * Assemble a natal reading from natal facts. Deterministic in (facts, seedKey):
 * the same inputs always produce byte-identical sections and lines.
 *
 * This layer only pattern-matches on facts and formats strings. It computes no
 * relations and derives no new facts.
 */

import type { Element, ReadingFact } from "@daymaster/bazi-engine";
import type { NatalReading, ReadingLine, ReadingSection } from "./types.js";
import { pick, pickDistinct } from "./hash.js";
import { elementWord } from "./vocab.js";
import { DAY_MASTER_LINES } from "./banks/day-master.js";
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

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

function firstFact<K extends ReadingFact["kind"]>(
  facts: readonly ReadingFact[],
  kind: K,
): FactOf<K> | undefined {
  return facts.find((fact): fact is FactOf<K> => fact.kind === kind);
}

function dayMasterSection(facts: readonly ReadingFact[], seedKey: string): ReadingSection | null {
  const fact = firstFact(facts, "day-master");
  if (!fact) {
    return null;
  }
  const block = DAY_MASTER_LINES[fact.stem];
  const factTag = `${fact.stem} · day-master`;
  const opener = block[0] as string;
  const rest = pickDistinct(block.slice(1), 2, seedKey, `dm:${fact.stem}`);
  const lines: ReadingLine[] = [opener, ...rest].map((text) => ({ text, factTag }));
  return { title: "Your day-master", lines };
}

function elementsSection(facts: readonly ReadingFact[], seedKey: string): ReadingSection | null {
  const lines: ReadingLine[] = [];

  const balance = firstFact(facts, "element-balance");
  if (balance) {
    const dominant = balance.dominant;
    lines.push({
      text: pick(DOMINANT_LINES[dominant], seedKey, `edom:${dominant}`),
      factTag: `${elementWord(dominant)} dominant`,
    });

    if (balance.missing.length > 0) {
      const missing = pick(balance.missing, seedKey, `emisspick:${balance.missing.join("")}`);
      lines.push({
        text: pick(MISSING_LINES[missing], seedKey, `emiss:${missing}`),
        factTag: `${elementWord(missing)} absent`,
      });
    } else {
      lines.push({
        text: pick(BALANCED_LINES, seedKey, "ebalanced"),
        factTag: "balanced elements",
      });
    }
  }

  const strength = firstFact(facts, "strength");
  if (strength) {
    const pool = strength.value === "strong" ? STRONG_LINES : WEAK_LINES;
    lines.push({
      text: pick(pool, seedKey, `str:${strength.value}`),
      factTag: `${strength.value} day-master`,
    });
  }

  if (lines.length === 0) {
    return null;
  }
  return { title: "Your elements", lines };
}

function suitsSection(facts: readonly ReadingFact[], seedKey: string): ReadingSection | null {
  const favorable = firstFact(facts, "favorable");
  if (!favorable || favorable.elements.length === 0) {
    return null;
  }

  const shown = pickDistinct(favorable.elements, 2, seedKey, `fav:${favorable.elements.join("")}`);
  const lines: ReadingLine[] = shown.map((element: Element) => ({
    text: FAVORABLE_LINES[element],
    factTag: `${elementWord(element)} · suits you`,
  }));

  const careerElement = pick(favorable.elements, seedKey, `career:${favorable.elements.join("")}`);
  lines.push({
    text: CAREER_LINES[careerElement],
    factTag: `${elementWord(careerElement)} · inclinations`,
  });

  return { title: "What tends to suit you", lines };
}

function structureSection(facts: readonly ReadingFact[], seedKey: string): ReadingSection | null {
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
  return { title: "Your chart's structure", lines };
}

/** Build the full natal reading. Sections with no lines are omitted. */
export function natalReading(facts: ReadingFact[], seedKey: string): NatalReading {
  const sections = [
    dayMasterSection(facts, seedKey),
    elementsSection(facts, seedKey),
    suitsSection(facts, seedKey),
    structureSection(facts, seedKey),
  ].filter((section): section is ReadingSection => section !== null);
  return { sections };
}
