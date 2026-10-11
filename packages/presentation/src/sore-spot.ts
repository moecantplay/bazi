/**
 * M20-26: the chart's sore spot (problem) and what eases it
 * (remedies), after Shen Feng Tong Kao 病藥說類第九: the problem is the
 * element that harms the chart's helpful element; a remedy removes it, by
 * controlling it or by turning it into the helpful element. A stopgap until
 * M20-23 moves this into the engine as a sourced fact.
 */

import {
  controlledBy,
  elementOfBranch,
  produces,
  type Chart,
  type Element,
  type Pillar,
  type ReadingFact,
} from "@daymaster/bazi-engine";
import type { SoreStatus, TopicContext } from "@daymaster/content";

const NATAL_PALACES = ["year", "month", "day", "hour"] as const;

/** The chart's problem and remedies, or null when the problem element is absent from the chart. */
export function chartSoreSpot(chart: Chart): { wounds: Element; problem: Element; remedies: Element[] } | null {
  const wounds = chart.favorableElements[0];
  if (!wounds) {
    return null;
  }
  const problem = controlledBy(wounds);
  if (chart.fiveElementCounts[problem] === 0) {
    return null;
  }
  return { wounds, problem, remedies: [controlledBy(problem), produces(problem)] };
}

/** Whether a day eases the sore spot, presses on it, both or neither. */
export function daySoreSpot(chart: Chart, day: Pillar, facts: readonly ReadingFact[]): TopicContext["sore"] {
  const spot = chartSoreSpot(chart);
  if (spot === null) {
    return null;
  }
  const elementDay = facts.find((fact) => fact.kind === "element-day");
  const dayElements = [elementDay?.kind === "element-day" ? elementDay.element : null, elementOfBranch(day.branch)];
  const easing = [...spot.remedies, spot.wounds].find((element) => dayElements.includes(element)) ?? null;
  const rootClashed = facts.some(
    (fact) =>
      fact.kind === "transit-interaction" &&
      fact.interaction === "six-clash" &&
      fact.natalPalaces.some((palace) => {
        const pillar = NATAL_PALACES.includes(palace as (typeof NATAL_PALACES)[number]) ? chart[palace as (typeof NATAL_PALACES)[number]] : null;
        return pillar !== null && elementOfBranch(pillar.branch) === spot.wounds;
      })
  );
  const presses = rootClashed || dayElements.includes(spot.problem);
  const status: SoreStatus = presses && easing ? "both" : presses ? "presses" : easing ? "eases" : "neither";
  return { problem: spot.problem, remedies: spot.remedies, status, easing };
}
