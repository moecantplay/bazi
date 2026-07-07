/**
 * Assemble a daily reading. Body lines are prioritised: transit interactions
 * first, then the element of the day, then the day's Ten God. Every reading is
 * 2–4 body lines plus one agency line, which is always present and rendered
 * last.
 *
 * Deterministic in (facts, seedKey). No chart math — facts carry everything.
 */

import type { Palace, ReadingFact } from "@daymaster/bazi-engine";
import type { DailyReading, ReadingLine } from "./types.js";
import { pick, pickDistinct } from "./hash.js";
import { transitInteractionLine } from "./banks/transit-interactions.js";
import { elementDayLine, tenGodDayLine } from "./banks/transit-days.js";
import { AGENCY_POOLS, agencyTagForPalace, type AgencyTag } from "./banks/agency.js";

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

const MAX_TRANSIT_LINES = 2;

function transitFacts(facts: readonly ReadingFact[]): FactOf<"transit-interaction">[] {
  return facts.filter(
    (fact): fact is FactOf<"transit-interaction"> => fact.kind === "transit-interaction",
  );
}

/** Up to MAX_TRANSIT_LINES transit facts, seed-chosen when there are more. */
function chooseTransits(
  transits: readonly FactOf<"transit-interaction">[],
  seedKey: string,
): FactOf<"transit-interaction">[] {
  return transits.length <= MAX_TRANSIT_LINES
    ? [...transits]
    : pickDistinct(transits, MAX_TRANSIT_LINES, seedKey, "trsel");
}

function transitLines(
  chosen: readonly FactOf<"transit-interaction">[],
  seedKey: string,
): ReadingLine[] {
  return chosen.map((fact) =>
    transitInteractionLine(
      {
        interaction: fact.interaction,
        branches: fact.branches,
        natalPalaces: fact.natalPalaces,
        transitPalace: fact.transitPalace,
      },
      seedKey,
    ),
  );
}

/** Pick the agency line, echoing a DISPLAYED transit's palace when one exists. */
function agencyLine(
  chosen: readonly FactOf<"transit-interaction">[],
  seedKey: string,
): ReadingLine {
  let tag: AgencyTag = "general";
  const first = chosen[0];
  if (first) {
    const room: Palace | undefined = first.natalPalaces[0];
    if (room) {
      tag = agencyTagForPalace(room);
    }
  }
  const text = pick(AGENCY_POOLS[tag], seedKey, `agency:${tag}`);
  return { text, factTag: null };
}

/** Build the full daily reading. */
export function dailyReading(facts: ReadingFact[], seedKey: string): DailyReading {
  const transits = transitFacts(facts);
  const chosen = chooseTransits(transits, seedKey);
  const lines: ReadingLine[] = [...transitLines(chosen, seedKey)];

  const elementDay = facts.find(
    (fact): fact is FactOf<"element-day"> => fact.kind === "element-day",
  );
  if (elementDay) {
    lines.push(elementDayLine(elementDay.element, elementDay.favorable));
  }

  const tenGod = facts.find((fact): fact is FactOf<"ten-god-day"> => fact.kind === "ten-god-day");
  if (tenGod) {
    lines.push(tenGodDayLine(tenGod.english, tenGod.god));
  }

  return { lines, agency: agencyLine(chosen, seedKey) };
}
