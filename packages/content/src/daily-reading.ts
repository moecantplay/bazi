/**
 * Assemble a daily reading. Body lines are prioritised: transit interactions
 * first, then the element of the day, the day's Ten God, at most one activated
 * star, and the day's life stage. Do's and don'ts (1–2 each) are derived from
 * the same facts; the agency line is always present and rendered last.
 *
 * Deterministic in (facts, seedKey). No chart math — facts carry everything.
 */

import type { Palace, ReadingFact } from "@daymaster/bazi-engine";
import type { DailyReading, DraftLine } from "./types.js";
import { finalizeLine } from "./types.js";
import { textRun, type TokenLine } from "./tokens.js";
import { pick, pickDistinct } from "./hash.js";
import { transitInteractionLine } from "./banks/transit-interactions.js";
import { elementDayLine, tenGodDayLine } from "./banks/transit-days.js";
import { starDayLine } from "./banks/stars.js";
import { stageDayLine } from "./banks/stages.js";
import {
  ELEMENT_DOS,
  ELEMENT_DONTS,
  GENERIC_DOS,
  GENERIC_DONTS,
  INTERACTION_DOS,
  INTERACTION_DONTS,
  STAR_DOS,
  STAR_DONTS,
  doDontLine,
  type DoDontCandidate,
} from "./banks/dos-donts.js";
import { AGENCY_POOLS, agencyTagForPalace, type AgencyTag } from "./banks/agency.js";
import {
  ELEMENT_HEADLINES,
  GENERIC_HEADLINES,
  INTERACTION_HEADLINES,
} from "./banks/headlines.js";
import { STAR_GLOSSES, elementWord, interactionWord, joinBranchRuns, transitWhen } from "./vocab.js";

type FactOf<K extends ReadingFact["kind"]> = Extract<ReadingFact, { kind: K }>;

const MAX_TRANSIT_LINES = 2;
const MAX_SUGGESTIONS = 2;

function factsOf<K extends ReadingFact["kind"]>(
  facts: readonly ReadingFact[],
  kind: K,
): FactOf<K>[] {
  return facts.filter((fact): fact is FactOf<K> => fact.kind === kind);
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
): DraftLine[] {
  return chosen.map((fact) => ({
    ...transitInteractionLine(
      {
        interaction: fact.interaction,
        branches: fact.branches,
        natalPalaces: fact.natalPalaces,
        transitPalace: fact.transitPalace,
        transitBranch: fact.transitBranch,
      },
      seedKey,
    ),
    // Area grouping (research 2026-07-16): a transit line files under the
    // first natal palace it touches; the UI titles the section by palace.
    area: fact.natalPalaces[0] ?? ("overall" as const),
  }));
}

/** Collect every justified do/don't candidate, in stable fact order. */
function suggestionCandidates(
  facts: readonly ReadingFact[],
  chosenTransits: readonly FactOf<"transit-interaction">[],
): { dos: DoDontCandidate[]; donts: DoDontCandidate[] } {
  const dos: DoDontCandidate[] = [];
  const donts: DoDontCandidate[] = [];

  for (const transit of chosenTransits) {
    const tagRuns: TokenLine = [
      ...joinBranchRuns(transit.branches),
      { kind: "text", text: ` ${interactionWord(transit.interaction)} · ${transitWhen(transit.transitPalace)}` },
    ];
    const topic = `interaction:${transit.interaction}`;
    const doText = INTERACTION_DOS[transit.interaction];
    if (doText) {
      dos.push({ text: doText, factTagRuns: tagRuns, topic });
    }
    const dontText = INTERACTION_DONTS[transit.interaction];
    if (dontText) {
      donts.push({ text: dontText, factTagRuns: tagRuns, topic });
    }
  }

  const elementDay = facts.find(
    (fact): fact is FactOf<"element-day"> => fact.kind === "element-day",
  );
  if (elementDay) {
    if (elementDay.favorable) {
      dos.push({
        text: ELEMENT_DOS[elementDay.element],
        factTagRuns: textRun(`${elementWord(elementDay.element)} day · suits you`),
        topic: "elements",
      });
    } else {
      donts.push({
        text: ELEMENT_DONTS[elementDay.element],
        factTagRuns: textRun(`${elementWord(elementDay.element)} day · against your grain`),
        topic: "elements",
      });
    }
  }

  for (const star of factsOf(facts, "star-day")) {
    const tagRuns: TokenLine = [
      { kind: "term", term: star.english, gloss: STAR_GLOSSES[star.star] ?? star.english, han: star.chinese },
      { kind: "text", text: ` · ${transitWhen(star.transitPalace)}` },
    ];
    const topic = `star:${star.star}`;
    const doText = STAR_DOS[star.star];
    if (doText) {
      dos.push({ text: doText, factTagRuns: tagRuns, topic });
    }
    const dontText = STAR_DONTS[star.star];
    if (dontText) {
      donts.push({ text: dontText, factTagRuns: tagRuns, topic });
    }
  }

  return { dos, donts };
}

/** 1–2 suggestions: justified candidates first, generic fallback when dry. */
function chooseSuggestions(
  candidates: readonly DoDontCandidate[],
  fallback: readonly string[],
  seedKey: string,
  salt: string,
): DraftLine[] {
  if (candidates.length === 0) {
    return [{ text: pick(fallback, seedKey, salt), factTag: null }];
  }
  return pickDistinct(candidates, MAX_SUGGESTIONS, seedKey, salt).map(doDontLine);
}

/**
 * The headline hook, keyed off a displayed transit interaction — preferring one
 * of the day itself over a year/month theme, since headlines speak about the
 * day — else the element of the day, else generic.
 */
function headlineLine(
  chosen: readonly FactOf<"transit-interaction">[],
  elementDay: FactOf<"element-day"> | undefined,
  seedKey: string,
): DraftLine {
  const first = chosen.find((fact) => fact.transitPalace === "daily") ?? chosen[0];
  // An unknown interaction kind (future engine enum) falls through to element.
  const pool = first ? INTERACTION_HEADLINES[first.interaction] : undefined;
  if (first && pool) {
    return { text: pick(pool, seedKey, `headline:${first.interaction}`), factTag: null };
  }
  if (elementDay) {
    const pool = ELEMENT_HEADLINES[elementDay.favorable ? "favorable" : "unfavorable"];
    return { text: pick(pool, seedKey, "headline:element"), factTag: null };
  }
  return { text: pick(GENERIC_HEADLINES, seedKey, "headline:generic"), factTag: null };
}

/** Pick the agency line, echoing a DISPLAYED transit's palace when one exists. */
function agencyLine(
  chosen: readonly FactOf<"transit-interaction">[],
  seedKey: string,
): DraftLine {
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
  const transits = factsOf(facts, "transit-interaction");
  const chosen = chooseTransits(transits, seedKey);
  const lines: DraftLine[] = [...transitLines(chosen, seedKey)];

  // Day-level lines (element, ten god, star, stage) file under "overall" —
  // the UI's "The day itself" section.
  const elementDay = facts.find(
    (fact): fact is FactOf<"element-day"> => fact.kind === "element-day",
  );
  if (elementDay) {
    lines.push({ ...elementDayLine(elementDay.element, elementDay.favorable), area: "overall" });
  }

  const tenGod = facts.find((fact): fact is FactOf<"ten-god-day"> => fact.kind === "ten-god-day");
  if (tenGod) {
    lines.push({ ...tenGodDayLine(tenGod.english, tenGod.god), area: "overall" });
  }

  const starDays = factsOf(facts, "star-day");
  if (starDays.length > 0) {
    const star = pick(starDays, seedKey, "stardaysel");
    lines.push({ ...starDayLine(star, star.transitPalace), area: "overall" });
  }

  const stageDay = facts.find((fact): fact is FactOf<"stage-day"> => fact.kind === "stage-day");
  if (stageDay) {
    lines.push({ ...stageDayLine(stageDay.stage), area: "overall" });
  }

  const candidates = suggestionCandidates(facts, chosen);
  return {
    headline: finalizeLine(headlineLine(chosen, elementDay, seedKey)),
    lines: lines.map(finalizeLine),
    dos: chooseSuggestions(candidates.dos, GENERIC_DOS, seedKey, "dos").map(finalizeLine),
    donts: chooseSuggestions(candidates.donts, GENERIC_DONTS, seedKey, "donts").map(finalizeLine),
    agency: finalizeLine(agencyLine(chosen, seedKey)),
  };
}
