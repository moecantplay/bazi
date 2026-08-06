/**
 * Assemble the day's layered guidance (VOICE.md rule 12): a scannable chip
 * layer and a prose layer that explains it. Chips carry only non-neutral
 * assessments, favours before friction, each group capped at three and ordered
 * by strength then the engine's activity order. The prose names the officer
 * (translated in-line), then explains the strongest favouring and friction
 * chips by translating the engine's reasons; a friction chip is always paired
 * with a line that explains it.
 *
 * Deterministic in (quality, seedKey). Zero chart math — every score, leaning,
 * and reason is read from the DayQuality as given.
 */

import {
  ACTIVITIES,
  type ActivityAssessment,
  type ActivityKey,
  type ActivityReason,
  type DateCandidate,
  type DayOfficerDefinition,
  type DayQuality,
} from "@daymaster/bazi-engine";
import type { DraftLine, ReadingLine } from "./types.js";
import { finalizeLine } from "./types.js";
import type { ContentRun, TokenLine } from "./tokens.js";
import { fillRuns } from "./tokens.js";
import { pick } from "./hash.js";
import {
  ACTIVITY_LABELS,
  OFFICER_GLOSSES,
  elementWord,
  interactionTagRuns,
  palaceWord,
} from "./vocab.js";
import {
  DATE_VERDICT_FRAMES,
  DATE_WHY_CLAUSES,
  EVEN_DAY_FRAMES,
  FAVORS_FRAMES,
  FRICTION_FRAMES,
  NEUTRAL_AREA_FRAMES,
  OFFICER_LINE_FRAMES,
} from "./banks/day-guidance.js";

/** One almanac chip: an activity that leans, with its modern and classical names. */
export interface GuidanceChip {
  activity: ActivityKey;
  label: string;
  /** Classical category characters, so the Han toggle can hide them. */
  chinese: string;
  leaning: "favors" | "friction";
}

/** The day's guidance: the chip layer and the prose layer that explains it. */
export interface DayGuidance {
  chips: GuidanceChip[];
  lines: ReadingLine[];
}

const MAX_CHIPS_PER_GROUP = 3;

/** The engine's activity order, for breaking ties between equal-strength chips. */
const ACTIVITY_ORDER: Record<ActivityKey, number> = Object.fromEntries(
  ACTIVITIES.map((activity, index) => [activity.key, index]),
) as Record<ActivityKey, number>;

/** Substitute every {placeholder} present in `subs` into the template. */
function fill(template: string, subs: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(subs)) {
    out = out.replaceAll(`{${key}}`, value);
  }
  return out;
}

/** The officer's name as a term run, glossed the same way its prose is. */
function officerTermRun(officer: DayOfficerDefinition): Extract<ContentRun, { kind: "term" }> {
  return {
    kind: "term",
    term: officer.english,
    gloss: OFFICER_GLOSSES[officer.key] ?? "the day's own grain",
    han: officer.chinese,
  };
}

/** Structured equivalent of the `"${officer.chinese} ${officer.english} day"` factTag. */
function officerTagRuns(officer: DayOfficerDefinition): TokenLine {
  return [officerTermRun(officer), { kind: "text", text: " day" }];
}

/**
 * Structured equivalent of an OFFICER_LINE_FRAMES template: the adjacent
 * `{officerCn} {officerEn}` pair collapses into one term run (every frame
 * carries them contiguous, space-joined), `{officerGloss}` becomes plain
 * text — the same short gloss the term run itself carries as metadata.
 */
function officerFrameRuns(template: string, officer: DayOfficerDefinition): TokenLine {
  const normalized = template.replace("{officerCn} {officerEn}", "{officerTerm}");
  return fillRuns(normalized, {
    officerTerm: [officerTermRun(officer)],
    officerGloss: [{ kind: "text", text: OFFICER_GLOSSES[officer.key] ?? "the day's own grain" }],
  });
}

/** Strongest first (|score|), ties broken by the engine's activity order. */
function byStrength(a: ActivityAssessment, b: ActivityAssessment): number {
  const delta = Math.abs(b.score) - Math.abs(a.score);
  return delta !== 0 ? delta : ACTIVITY_ORDER[a.activity] - ACTIVITY_ORDER[b.activity];
}

function toChip(assessment: ActivityAssessment): GuidanceChip {
  const label = ACTIVITY_LABELS[assessment.activity];
  return {
    activity: assessment.activity,
    label: label.label,
    chinese: label.chinese,
    leaning: assessment.leaning as "favors" | "friction",
  };
}

/** Favours chips then friction chips, each ordered and capped. */
function buildChips(assessments: readonly ActivityAssessment[]): GuidanceChip[] {
  const favors = assessments
    .filter((assessment) => assessment.leaning === "favors")
    .sort(byStrength)
    .slice(0, MAX_CHIPS_PER_GROUP);
  const friction = assessments
    .filter((assessment) => assessment.leaning === "friction")
    .sort(byStrength)
    .slice(0, MAX_CHIPS_PER_GROUP);
  return [...favors, ...friction].map(toChip);
}

/** Find the single reason of a given source within an assessment, narrowed. */
function reasonOf<S extends ActivityReason["source"]>(
  reasons: readonly ActivityReason[],
  source: S,
): Extract<ActivityReason, { source: S }> | undefined {
  return reasons.find((reason): reason is Extract<ActivityReason, { source: S }> => reason.source === source);
}

/** The translated reason a line leans on, resolved to copy and a fact tag. */
interface ResolvedReason {
  kind: "combine" | "element" | "officerFavor" | "clash" | "officerAvoid";
  /** Palace word for the {palace} slot (empty when the line names none). */
  palace: string;
  /** Element word for the {element} slot (empty when the line names none). */
  element: string;
  /** Structured fact-tag citation. */
  factTagRuns: TokenLine;
  /** Glossary key for the concept behind the tag. */
  topic: string;
}

/** Which reason best explains why an assessment leans the way it does. */
function resolveReason(
  officer: DayQuality["officer"],
  assessment: ActivityAssessment,
  leaning: "favors" | "friction",
): ResolvedReason | null {
  const reasons = assessment.reasons;

  if (leaning === "favors") {
    const combine = reasonOf(reasons, "day-combine");
    if (combine) {
      const branches = [combine.transitBranch, combine.natalBranch];
      return {
        kind: "combine",
        palace: palaceWord("day"),
        element: "",
        factTagRuns: interactionTagRuns(branches, "six-combine", "day"),
        topic: "interaction:six-combine",
      };
    }
    const element = reasonOf(reasons, "element-day");
    if (element) {
      return {
        kind: "element",
        palace: "",
        element: elementWord(element.element),
        factTagRuns: [{ kind: "text", text: `${elementWord(element.element)} day · suits you` }],
        topic: "elements",
      };
    }
    const officerReason = reasonOf(reasons, "officer");
    if (officerReason && officerReason.direction === 1) {
      return {
        kind: "officerFavor",
        palace: "",
        element: "",
        factTagRuns: officerTagRuns(officer),
        topic: `officer:${officer.key}`,
      };
    }
    return null;
  }

  const breaker = reasonOf(reasons, "day-breaker");
  if (breaker) {
    const branches = [breaker.transitBranch, breaker.natalBranch];
    return {
      kind: "clash",
      palace: palaceWord("day"),
      element: "",
      factTagRuns: interactionTagRuns(branches, "six-clash", "day"),
      topic: "interaction:six-clash",
    };
  }
  const palaceClash = reasonOf(reasons, "palace-clash");
  if (palaceClash) {
    const branches = [palaceClash.transitBranch, palaceClash.natalBranch];
    return {
      kind: "clash",
      palace: palaceWord(palaceClash.palace),
      element: "",
      factTagRuns: interactionTagRuns(branches, "six-clash", palaceClash.palace),
      topic: "interaction:six-clash",
    };
  }
  const officerReason = reasonOf(reasons, "officer");
  if (officerReason && officerReason.direction === -1) {
    return {
      kind: "officerAvoid",
      palace: "",
      element: "",
      factTagRuns: officerTagRuns(officer),
      topic: `officer:${officer.key}`,
    };
  }
  return null;
}

const FRAME_BY_KIND: Record<ResolvedReason["kind"], readonly string[]> = {
  combine: FAVORS_FRAMES.combine,
  element: FAVORS_FRAMES.element,
  officerFavor: FAVORS_FRAMES.officer,
  clash: FRICTION_FRAMES.clash,
  officerAvoid: FRICTION_FRAMES.officer,
};

function officerLine(officer: DayQuality["officer"], seedKey: string): DraftLine {
  const template = pick(OFFICER_LINE_FRAMES, seedKey, `guid:officer:${officer.key}`);
  const text = fill(template, {
    officerCn: officer.chinese,
    officerEn: officer.english,
    officerGloss: OFFICER_GLOSSES[officer.key] ?? "the day's own grain",
  });
  return {
    text,
    factTagRuns: officerTagRuns(officer),
    topic: `officer:${officer.key}`,
    runs: officerFrameRuns(template, officer),
  };
}

function evenDayLine(officer: DayQuality["officer"], seedKey: string): DraftLine {
  const text = pick(EVEN_DAY_FRAMES, seedKey, `guid:even:${officer.key}`);
  return {
    text,
    factTagRuns: officerTagRuns(officer),
    topic: `officer:${officer.key}`,
  };
}

/** Explain one chip's leaning, or null if no reason accounts for it. */
function explainLine(
  officer: DayQuality["officer"],
  assessment: ActivityAssessment,
  leaning: "favors" | "friction",
  seedKey: string,
): DraftLine | null {
  const resolved = resolveReason(officer, assessment, leaning);
  if (resolved === null) {
    return null;
  }
  const frames = FRAME_BY_KIND[resolved.kind];
  const template = pick(frames, seedKey, `guid:expl:${assessment.activity}:${resolved.kind}`);
  const subs = {
    actLower: ACTIVITY_LABELS[assessment.activity].label.toLowerCase(),
    palace: resolved.palace,
    element: resolved.element,
  };
  const text = fill(template, subs);
  const runs = fillRuns(template, {
    actLower: [{ kind: "text", text: subs.actLower }],
    palace: [{ kind: "text", text: subs.palace }],
    element: [{ kind: "text", text: subs.element }],
  });
  return { text, factTagRuns: resolved.factTagRuns, topic: resolved.topic, runs };
}

/** Build the day's chips and the prose that explains them. */
export function dayGuidance(quality: DayQuality, seedKey: string): DayGuidance {
  const chips = buildChips(quality.assessments);
  const officer = quality.officer;
  const byActivity = new Map(quality.assessments.map((a) => [a.activity, a]));
  const lines: DraftLine[] = [officerLine(officer, seedKey)];

  const topFavors = chips.find((chip) => chip.leaning === "favors");
  if (topFavors) {
    const line = explainLine(officer, byActivity.get(topFavors.activity)!, "favors", seedKey);
    if (line) {
      lines.push(line);
    }
  }
  const topFriction = chips.find((chip) => chip.leaning === "friction");
  if (topFriction) {
    const line = explainLine(officer, byActivity.get(topFriction.activity)!, "friction", seedKey);
    if (line) {
      lines.push(line);
    }
  }
  if (lines.length === 1) {
    lines.push(evenDayLine(officer, seedKey));
  }
  return { chips, lines: lines.map(finalizeLine) };
}

/**
 * One area row's detail: why this activity leans the way it does today, or its
 * even footing when nothing pulls at it. Leaning rows reuse the same frames as
 * the chip explanations, so a chip and its area row never tell two stories.
 */
export function activityAreaLine(
  quality: DayQuality,
  activity: ActivityKey,
  seedKey: string,
): ReadingLine {
  const assessment = quality.assessments.find((entry) => entry.activity === activity);
  const officer = quality.officer;
  if (assessment && assessment.leaning !== "neutral") {
    const line = explainLine(officer, assessment, assessment.leaning, seedKey);
    if (line) {
      return finalizeLine(line);
    }
  }
  const template = pick(NEUTRAL_AREA_FRAMES, seedKey, `guid:area:${activity}`);
  const actLower = ACTIVITY_LABELS[activity].label.toLowerCase();
  return finalizeLine({
    text: fill(template, { actLower }),
    factTagRuns: officerTagRuns(officer),
    topic: `officer:${officer.key}`,
    runs: fillRuns(template, { actLower: [{ kind: "text", text: actLower }] }),
  });
}

/** The assessment driving a candidate's combined score for a leaning. */
function driverAssessment(
  candidate: DateCandidate,
  leaning: "favors" | "friction",
): ActivityAssessment {
  if (leaning === "friction") {
    return candidate.perChart.reduce((lowest, current) =>
      current.score < lowest.score ? current : lowest,
    );
  }
  return candidate.perChart[0] as ActivityAssessment;
}

/** One line for a candidate day in the finder: officer, then the activity verdict. */
export function dateVerdictLine(candidate: DateCandidate, seedKey: string): ReadingLine {
  const officer = candidate.officer;
  const activity = (candidate.perChart[0] as ActivityAssessment).activity;
  const actLower = ACTIVITY_LABELS[activity].label.toLowerCase();
  const leaning: "favors" | "neutral" | "friction" =
    candidate.combined >= 2 ? "favors" : candidate.combined <= -2 ? "friction" : "neutral";

  const introTemplate = pick(
    OFFICER_LINE_FRAMES,
    seedKey,
    `date:officer:${officer.key}:${candidate.date}`,
  );
  const intro = fill(introTemplate, {
    officerCn: officer.chinese,
    officerEn: officer.english,
    officerGloss: OFFICER_GLOSSES[officer.key] ?? "the day's own grain",
  });

  let why = "";
  if (leaning !== "neutral") {
    const resolved = resolveReason(officer, driverAssessment(candidate, leaning), leaning);
    const kind = resolved?.kind ?? (leaning === "favors" ? "officerFavor" : "officerAvoid");
    why = fill(DATE_WHY_CLAUSES[kind], {
      element: resolved?.element ?? "",
      palace: resolved?.palace ?? "home palace",
    });
  }
  const verdictTemplate = pick(
    DATE_VERDICT_FRAMES[leaning],
    seedKey,
    `date:verdict:${activity}:${leaning}:${candidate.date}`,
  );
  const verdict = fill(verdictTemplate, { actLower, why });
  const introRuns = officerFrameRuns(introTemplate, officer);
  const verdictRuns = fillRuns(verdictTemplate, {
    actLower: [{ kind: "text", text: actLower }],
    why: [{ kind: "text", text: why }],
  });
  return finalizeLine({
    text: `${intro} ${verdict}`,
    factTagRuns: officerTagRuns(officer),
    topic: `officer:${officer.key}`,
    runs: [...introRuns, { kind: "text", text: " " }, ...verdictRuns],
  });
}
