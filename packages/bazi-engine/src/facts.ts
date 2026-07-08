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
import { lifeStage } from "./life-stages.js";
import { dailyPillar, yearPillar } from "./pillars.js";
import { shensha } from "./shensha.js";
import { tenGods } from "./ten-gods.js";
import type {
  Branch,
  Chart,
  Element,
  Interaction,
  InteractionType,
  LifeStage,
  Palace,
  Pillar,
  Polarity,
  Stem,
} from "./types.js";

/** A single structured observation about a chart or a transit day. */
export type ReadingFact =
  | { kind: "day-master"; stem: Stem; element: Element; polarity: Polarity }
  | {
      kind: "strength";
      value: "strong" | "weak";
      /** 得令/得地/得勢 — the three checks behind the verdict. */
      seasonal: boolean;
      rooted: boolean;
      backed: boolean;
    }
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
  | { kind: "star"; star: string; chinese: string; english: string; palace: Palace }
  | { kind: "life-stage"; palace: Palace; branch: Branch; stage: LifeStage }
  | { kind: "na-yin"; palace: Palace; chinese: string; english: string; element: Element }
  | {
      kind: "transit-interaction";
      interaction: InteractionType;
      branches: Branch[];
      natalPalaces: Palace[];
      transitPalace: Palace;
      /** The branch the transit itself brought (the rest are natal). */
      transitBranch: Branch;
    }
  | { kind: "element-day"; element: Element; favorable: boolean }
  | { kind: "ten-god-day"; god: string; english: string }
  | {
      kind: "element-period";
      period: "annual" | "monthly";
      element: Element;
      favorable: boolean;
    }
  | { kind: "ten-god-period"; period: "annual" | "monthly"; god: string; english: string }
  | { kind: "star-day"; star: string; chinese: string; english: string; transitPalace: Palace }
  | { kind: "stage-day"; stage: LifeStage };

const TRANSIT_PALACES: readonly Palace[] = ["daily", "monthly", "annual"];

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
    {
      kind: "strength",
      value: chart.strength.value,
      seasonal: chart.strength.seasonalSupport,
      rooted: chart.strength.rooted,
      backed: chart.strength.backed,
    },
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

  for (const hit of chart.shensha) {
    facts.push({
      kind: "star",
      star: hit.key,
      chinese: hit.chinese,
      english: hit.english,
      palace: hit.palace,
    });
  }

  const stagePalaces = [
    ["year", chart.year],
    ["month", chart.month],
    ["day", chart.day],
    ["hour", chart.hour],
  ] as const satisfies readonly (readonly ["year" | "month" | "day" | "hour", Pillar | null])[];
  for (const [palace, pillar] of stagePalaces) {
    const stages = chart.lifeStages[palace];
    if (pillar && stages) {
      facts.push({ kind: "life-stage", palace, branch: pillar.branch, stage: stages.dayMaster });
    }
  }

  facts.push({
    kind: "na-yin",
    palace: "day",
    chinese: chart.naYin.day.chinese,
    english: chart.naYin.day.english,
    element: chart.naYin.day.element,
  });
  return facts;
}

/** Transit interactions between a single transit branch and the natal branches. */
export function transitInteractionFacts(
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
      transitBranch: branch,
    }));
}

/** Facts for a transit date compared against the natal chart. */
export function dailyFacts(chart: Chart, dateISO: string, zone: string): ReadingFact[] {
  const dayTransit = dailyPillar(dateISO, zone);
  const noon = DateTime.fromISO(dateISO, { zone }).set({ hour: 12 }).toJSDate();
  const annualTransit = yearPillar(noon, zone);

  const dayElement = elementOfStem(dayTransit.stem);
  const tenGod = tenGods(chart.dayMaster, dayTransit.stem);

  // Stars the transit pillars light up, read from the natal reference points.
  const starHits = shensha(
    {
      dayStem: chart.dayMaster,
      dayPillar: chart.day,
      yearBranch: chart.year.branch,
      monthBranch: chart.month.branch,
    },
    [
      { palace: "daily", pillar: dayTransit },
      { palace: "annual", pillar: annualTransit },
    ],
  );

  return [
    ...transitInteractionFacts(chart, dayTransit.branch, "daily"),
    ...transitInteractionFacts(chart, annualTransit.branch, "annual"),
    {
      kind: "element-day",
      element: dayElement,
      favorable: chart.favorableElements.includes(dayElement),
    },
    { kind: "ten-god-day", god: tenGod.chinese, english: tenGod.english },
    ...starHits.map(
      (hit): ReadingFact => ({
        kind: "star-day",
        star: hit.key,
        chinese: hit.chinese,
        english: hit.english,
        transitPalace: hit.palace,
      }),
    ),
    { kind: "stage-day", stage: lifeStage(chart.dayMaster, dayTransit.branch) },
  ];
}
