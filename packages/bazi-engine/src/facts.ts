/**
 * Reading facts: structured, deterministic observations derived from a chart.
 *
 * `natalFacts` describes the static chart; `dailyFacts` compares a transit date's
 * day pillar against the natal branches — day-only, by design: month/year/decade
 * transit facts are horizons.ts's job (Ahead), not Today's. Same chart +
 * same date always yields identical facts.
 *
 * Every fact carries its `scope` (M24-03), and each producer returns a type
 * narrowed to its own: `NatalFact`, `DayFact`, `PeriodFact`. A screen that
 * takes `DayFact[]` cannot be handed a year's facts.
 */

import { SIX_CLASHES, SIX_COMBINES } from "../data/interactions-tables.js";
import { ELEMENT_PRODUCTION_ORDER } from "../data/tables.js";
import { elementOfStem, polarityOfStem } from "./attributes.js";
import { bestHourFact, type BestHour } from "./best-hour.js";
import { interactions, natalPalacedBranches } from "./interactions.js";
import { lifeStage } from "./life-stages.js";
import { dailyPillar, hourBlockWindow } from "./pillars.js";
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

/** What a fact is about: the birth chart, or a day, month, year or decade of transit. */
export type FactScope = "natal" | "day" | "month" | "year" | "decade";

/** The scopes a transit can have: everything but the birth chart. */
export type TransitScope = Exclude<FactScope, "natal">;

/** The scopes horizons.ts reads a period pillar at. */
export type PeriodScope = Exclude<TransitScope, "day">;

/** A single structured observation about a chart or a transit period. */
export type ReadingFact =
  | { kind: "day-master"; scope: "natal"; stem: Stem; element: Element; polarity: Polarity }
  | {
      kind: "strength";
      scope: "natal";
      value: "strong" | "weak";
      /** The verdict was decided by a single weighted point or less. */
      narrow: boolean;
      /** 得令/得地/得勢 — the three checks behind the verdict. */
      seasonal: boolean;
      rooted: boolean;
      backed: boolean;
    }
  | { kind: "element-balance"; scope: "natal"; counts: Record<Element, number>; dominant: Element; missing: Element[] }
  | {
      kind: "natal-interaction";
      scope: "natal";
      interaction: InteractionType;
      branches: Branch[];
      palaces: Palace[];
      element?: Element;
      completeness?: "full" | "half";
      punishmentKind?: "mutual" | "self";
    }
  | { kind: "favorable"; scope: "natal"; elements: Element[] }
  | { kind: "star"; scope: "natal"; star: string; chinese: string; english: string; palace: Palace }
  | { kind: "life-stage"; scope: "natal"; palace: Palace; branch: Branch; stage: LifeStage }
  | { kind: "na-yin"; scope: "natal"; palace: Palace; chinese: string; english: string; element: Element }
  | {
      kind: "transit-interaction";
      scope: TransitScope;
      interaction: InteractionType;
      branches: Branch[];
      natalPalaces: Palace[];
      transitPalace: Palace;
      /** The branch the transit itself brought (the rest are natal). */
      transitBranch: Branch;
    }
  | {
      /**
       * The two-hour block (時辰) whose branch clashes or combines with the
       * day's own branch — the day's rough hour and easy hour, the almanac's
       * 時辰吉凶 read. Unlike transit-interaction facts (in force all day),
       * these hold only within their block, in wall-clock hours of the zone.
       */
      kind: "hour-interaction";
      scope: "day";
      interaction: "six-clash" | "six-combine";
      hourBranch: Branch;
      dayBranch: Branch;
      /** Block start, 0–23 (子 starts at 23 and wraps past midnight). */
      startHour: number;
      /** Block end, exclusive, 0–23. */
      endHour: number;
    }
  /** The reader's best hour — the block that suits the chart most (best-hour.ts). */
  | BestHour
  | { kind: "element-day"; scope: "day"; element: Element; favorable: boolean }
  | { kind: "ten-god-day"; scope: "day"; god: string; english: string }
  | { kind: "element-period"; scope: PeriodScope; element: Element; favorable: boolean }
  | { kind: "ten-god-period"; scope: PeriodScope; god: string; english: string }
  | { kind: "star-day"; scope: "day"; star: string; chinese: string; english: string; transitPalace: Palace }
  | { kind: "stage-day"; scope: "day"; stage: LifeStage };

/** A fact about the birth chart alone. */
export type NatalFact = ReadingFact & { scope: "natal" };

/** A fact about one transit day: Today's only input. */
export type DayFact = ReadingFact & { scope: "day" };

/** A fact about a month, a year or a decade: Ahead's input. */
export type PeriodFact = ReadingFact & { scope: PeriodScope };

type TransitInteractionFact = Extract<ReadingFact, { kind: "transit-interaction" }>;

/** The palace a transit pillar takes for each scope. */
const TRANSIT_PALACE: Record<TransitScope, Palace> = {
  day: "daily",
  month: "monthly",
  year: "annual",
  decade: "luck",
};

const TRANSIT_PALACES: readonly Palace[] = Object.values(TRANSIT_PALACE);

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
export function natalFacts(chart: Chart): NatalFact[] {
  const facts: NatalFact[] = [
    {
      kind: "day-master",
      scope: "natal",
      stem: chart.dayMaster,
      element: elementOfStem(chart.dayMaster),
      polarity: polarityOfStem(chart.dayMaster),
    },
    {
      kind: "strength",
      scope: "natal",
      value: chart.strength.value,
      narrow: chart.strength.narrow,
      seasonal: chart.strength.seasonalSupport,
      rooted: chart.strength.rooted,
      backed: chart.strength.backed,
    },
    {
      kind: "element-balance",
      scope: "natal",
      counts: chart.fiveElementCounts,
      dominant: dominantElement(chart.fiveElementCounts),
      missing: missingElements(chart.fiveElementCounts),
    },
  ];

  for (const interaction of chart.interactions) {
    facts.push({
      kind: "natal-interaction",
      scope: "natal",
      interaction: interaction.type,
      branches: [...interaction.branches],
      palaces: [...interaction.palaces],
      ...interactionExtras(interaction),
    });
  }

  facts.push({ kind: "favorable", scope: "natal", elements: chart.favorableElements });

  for (const hit of chart.shensha) {
    facts.push({
      kind: "star",
      scope: "natal",
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
      facts.push({ kind: "life-stage", scope: "natal", palace, branch: pillar.branch, stage: stages.dayMaster });
    }
  }

  facts.push({
    kind: "na-yin",
    scope: "natal",
    palace: "day",
    chinese: chart.naYin.day.chinese,
    english: chart.naYin.day.english,
    element: chart.naYin.day.element,
  });
  return facts;
}

/** Transit interactions between a single transit branch and the natal branches. */
export function transitInteractionFacts<S extends TransitScope>(
  chart: Chart,
  branch: Branch,
  scope: S,
): (TransitInteractionFact & { scope: S })[] {
  const transitPalace = TRANSIT_PALACE[scope];
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
    .map((interaction) => ({
      kind: "transit-interaction" as const,
      scope,
      interaction: interaction.type,
      branches: [...interaction.branches],
      natalPalaces: interaction.palaces.filter((palace) => !TRANSIT_PALACES.includes(palace)),
      transitPalace,
      transitBranch: branch,
    }));
}

function partnerOf(
  pairs: readonly (readonly [Branch, Branch])[],
  branch: Branch,
): Branch | undefined {
  const pair = pairs.find(([a, b]) => a === branch || b === branch);
  if (!pair) {
    return undefined;
  }
  return pair[0] === branch ? pair[1] : pair[0];
}

/**
 * The day's rough hour (its branch's clash partner) and easy hour (its combine
 * partner), always one each — every branch has exactly one of both.
 */
export function hourInteractionFacts(dayBranch: Branch): DayFact[] {
  const facts: DayFact[] = [];
  const clashHour = partnerOf(SIX_CLASHES, dayBranch);
  if (clashHour) {
    facts.push({ kind: "hour-interaction", scope: "day", interaction: "six-clash", hourBranch: clashHour, dayBranch, ...hourBlockWindow(clashHour) });
  }
  const combineHour = partnerOf(SIX_COMBINES, dayBranch);
  if (combineHour) {
    facts.push({ kind: "hour-interaction", scope: "day", interaction: "six-combine", hourBranch: combineHour, dayBranch, ...hourBlockWindow(combineHour) });
  }
  return facts;
}

function withBestHour(chart: Chart, dayTransit: Pillar): DayFact[] {
  const bestHour = bestHourFact(chart, dayTransit);
  return bestHour ? [bestHour] : [];
}

/** Facts for a transit date compared against the natal chart. Day-only — see file header. */
export function dailyFacts(chart: Chart, dateISO: string, zone: string): DayFact[] {
  const dayTransit = dailyPillar(dateISO, zone);

  const dayElement = elementOfStem(dayTransit.stem);
  const tenGod = tenGods(chart.dayMaster, dayTransit.stem);

  // Stars the day transit lights up, read from the natal reference points.
  const starHits = shensha(
    {
      dayStem: chart.dayMaster,
      dayPillar: chart.day,
      yearBranch: chart.year.branch,
      monthBranch: chart.month.branch,
    },
    [{ palace: "daily", pillar: dayTransit }],
  );

  return [
    ...transitInteractionFacts(chart, dayTransit.branch, "day"),
    ...hourInteractionFacts(dayTransit.branch),
    ...withBestHour(chart, dayTransit),
    {
      kind: "element-day",
      scope: "day",
      element: dayElement,
      favorable: chart.favorableElements.includes(dayElement),
    },
    { kind: "ten-god-day", scope: "day", god: tenGod.chinese, english: tenGod.english },
    ...starHits.map(
      (hit): DayFact => ({
        kind: "star-day",
        scope: "day",
        star: hit.key,
        chinese: hit.chinese,
        english: hit.english,
        transitPalace: hit.palace,
      }),
    ),
    { kind: "stage-day", scope: "day", stage: lifeStage(chart.dayMaster, dayTransit.branch) },
  ];
}
