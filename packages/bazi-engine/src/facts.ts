/**
 * Reading facts: structured, deterministic observations derived from a chart.
 *
 * `natalFacts` describes the static chart; `dailyFacts` compares a transit date
 * (its day pillar and governing annual pillar) against the natal branches. Same
 * chart + same date always yields identical facts.
 */

import { DateTime } from "luxon";
import { ELEMENT_PRODUCTION_ORDER } from "../data/tables.js";
import { elementOfStem, polarityOfStem } from "./attributes.js";
import { interactions, natalPalacedBranches } from "./interactions.js";
import { dailyPillar, yearPillar } from "./pillars.js";
import { tenGods } from "./ten-gods.js";
import type {
  Branch,
  Chart,
  Element,
  Interaction,
  InteractionType,
  Palace,
  Polarity,
  Stem,
} from "./types.js";

/** A single structured observation about a chart or a transit day. */
export type ReadingFact =
  | { kind: "day-master"; stem: Stem; element: Element; polarity: Polarity }
  | { kind: "strength"; value: "strong" | "weak" }
  | { kind: "element-balance"; counts: Record<Element, number>; dominant: Element; missing: Element[] }
  | {
      kind: "natal-interaction";
      interaction: InteractionType;
      branches: Branch[];
      palaces: Palace[];
      element?: Element;
      completeness?: "full" | "half";
      punishmentKind?: "mutual" | "self";
    }
  | { kind: "favorable"; elements: Element[] }
  | {
      kind: "transit-interaction";
      interaction: InteractionType;
      branches: Branch[];
      natalPalaces: Palace[];
      transitPalace: Palace;
    }
  | { kind: "element-day"; element: Element; favorable: boolean }
  | { kind: "ten-god-day"; god: string; english: string };

const TRANSIT_PALACES: readonly Palace[] = ["daily", "annual"];

function dominantElement(counts: Record<Element, number>): Element {
  return ELEMENT_PRODUCTION_ORDER.reduce((best, element) =>
    counts[element] > counts[best] ? element : best,
  );
}

function missingElements(counts: Record<Element, number>): Element[] {
  return ELEMENT_PRODUCTION_ORDER.filter((element) => counts[element] === 0);
}

interface InteractionExtras {
  element?: Element;
  completeness?: "full" | "half";
  punishmentKind?: "mutual" | "self";
}

function interactionExtras(interaction: Interaction): InteractionExtras {
  if (interaction.type === "trine") {
    return { element: interaction.element, completeness: interaction.completeness };
  }
  if (interaction.type === "punishment") {
    return { punishmentKind: interaction.kind };
  }
  return {};
}

/** Static facts about the natal chart. */
export function natalFacts(chart: Chart): ReadingFact[] {
  const facts: ReadingFact[] = [
    {
      kind: "day-master",
      stem: chart.dayMaster,
      element: elementOfStem(chart.dayMaster),
      polarity: polarityOfStem(chart.dayMaster),
    },
    { kind: "strength", value: chart.strength.value },
    {
      kind: "element-balance",
      counts: chart.fiveElementCounts,
      dominant: dominantElement(chart.fiveElementCounts),
      missing: missingElements(chart.fiveElementCounts),
    },
  ];

  for (const interaction of chart.interactions) {
    facts.push({
      kind: "natal-interaction",
      interaction: interaction.type,
      branches: [...interaction.branches],
      palaces: [...interaction.palaces],
      ...interactionExtras(interaction),
    });
  }

  facts.push({ kind: "favorable", elements: chart.favorableElements });
  return facts;
}

/** Transit interactions between a single transit branch and the natal branches. */
function transitInteractionFacts(
  chart: Chart,
  branch: Branch,
  transitPalace: Palace,
): ReadingFact[] {
  const combined = [
    ...natalPalacedBranches({
      year: chart.year.branch,
      month: chart.month.branch,
      day: chart.day.branch,
      hour: chart.hour ? chart.hour.branch : null,
    }),
    { branch, palace: transitPalace },
  ];
  return interactions(combined)
    .filter((interaction) => interaction.palaces.includes(transitPalace))
    .map((interaction): ReadingFact => ({
      kind: "transit-interaction",
      interaction: interaction.type,
      branches: [...interaction.branches],
      natalPalaces: interaction.palaces.filter((palace) => !TRANSIT_PALACES.includes(palace)),
      transitPalace,
    }));
}

/** Facts for a transit date compared against the natal chart. */
export function dailyFacts(chart: Chart, dateISO: string, zone: string): ReadingFact[] {
  const dayTransit = dailyPillar(dateISO, zone);
  const noon = DateTime.fromISO(dateISO, { zone }).set({ hour: 12 }).toJSDate();
  const annualBranch = yearPillar(noon, zone).branch;

  const dayElement = elementOfStem(dayTransit.stem);
  const tenGod = tenGods(chart.dayMaster, dayTransit.stem);

  return [
    ...transitInteractionFacts(chart, dayTransit.branch, "daily"),
    ...transitInteractionFacts(chart, annualBranch, "annual"),
    {
      kind: "element-day",
      element: dayElement,
      favorable: chart.favorableElements.includes(dayElement),
    },
    { kind: "ten-god-day", god: tenGod.chinese, english: tenGod.english },
  ];
}
