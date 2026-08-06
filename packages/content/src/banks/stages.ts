/**
 * Life-stage (十二長生) lines. The daily line answers what/why/how in one
 * breath: which stage the day sits at (fact), what that stage is in ordinary
 * life (gloss), and the mood to work with. Stages are seasons of a cycle —
 * never good or bad days (VOICE.md §4, §8).
 */

import type { LifeStage } from "@daymaster/bazi-engine";
import type { DraftLine } from "../types.js";
import type { TokenLine } from "../tokens.js";
import { LIFE_STAGE_GLOSSES } from "../vocab.js";

/** The working mood of each stage, keyed by the engine's english label. */
const STAGE_DAY_MOODS: Record<string, string> = {
  Growth: "Favor small starts over grand openings; new things are eager but tender.",
  Bath: "Impressions land deep — choose your inputs like you'd choose bathwater.",
  "Coming of Age": "Show the work; the day is willing to take you seriously.",
  "Taking Office": "Momentum is on duty — routine effort goes further than usual.",
  Peak: "Spend the height on what matters; peaks are for planting flags, not storing them.",
  Decline: "Coast with intention — ease off the pace before the pace eases you off.",
  Illness: "Half speed is honest speed; trim the list instead of pushing through it.",
  Stillness: "Let the pause be a pause. Deciding can wait for the in-breath.",
  Storage: "Sort, keep, and file; the day favors consolidating over acquiring.",
  Severance: "Clearing is progress — an empty field is a field ready for seed.",
  Conception: "Ideas want privacy today; draft before you announce.",
  Nurture: "Tend the quiet things — what grows unseen still counts as growth.",
};

const GENERIC_MOOD = "Read it as the day's season within your longer cycle.";

/** Every stage line fragment, for exhaustive voice checking. */
export const STAGE_TEMPLATES: readonly string[] = [
  ...Object.values(STAGE_DAY_MOODS),
  GENERIC_MOOD,
];

/** "The day sits at your 'Peak' stage (帝旺) — noon sun… Spend the height…". */
export function stageDayLine(stage: LifeStage): DraftLine {
  const known = LIFE_STAGE_GLOSSES[stage.english] !== undefined;
  const gloss = LIFE_STAGE_GLOSSES[stage.english] ?? "one season of a twelve-season cycle";
  const mood = STAGE_DAY_MOODS[stage.english] ?? GENERIC_MOOD;
  const text = `The day sits at your '${stage.english}' stage (${stage.chinese}) — ${gloss}. ${mood}`;
  const runs: TokenLine = [
    { kind: "text", text: "The day sits at your '" },
    { kind: "term", term: stage.english, gloss, han: stage.chinese },
    { kind: "text", text: `' stage — ${gloss}. ${mood}` },
  ];
  const factTagRuns: TokenLine = [
    { kind: "term", term: stage.english, gloss, han: stage.chinese },
    { kind: "text", text: " · today" },
  ];
  const line: DraftLine = {
    text,
    factTag: `${stage.chinese} ${stage.english} · today`,
    factTagRuns,
    runs,
  };
  if (known) {
    line.topic = `stage:${stage.english}`;
  }
  return line;
}
