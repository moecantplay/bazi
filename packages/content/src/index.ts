/**
 * @daymaster/content — the reading content system (Milestone M3).
 *
 * Turns the engine's structured ReadingFacts into voice-compliant, second-person
 * reading lines. All selection is deterministic in a seedKey; this layer does
 * zero chart math. Every user-facing line obeys VOICE.md.
 */

export const CONTENT_VERSION = "0.1.0";

export {
  ACTIVITY_LABELS,
  BRANCH_ANIMALS,
  DISCLAIMER,
  DAY_MASTER_GLOSS,
  INTERACTION_GLOSSES,
  LIFE_STAGE_GLOSS,
  LIFE_STAGE_GLOSSES,
  LUCK_PILLAR_GLOSS,
  NAYIN_GLOSS,
  OFFICER_GLOSSES,
  STAR_GLOSSES,
  STEM_GLOSSES,
  STRENGTH_CHECK_GLOSSES,
  STRENGTH_CHECK_GLOSS_RUNS,
  TEN_GOD_GLOSSES,
  branchTokenRuns,
  hourWindowLabel,
  interactionTagRuns,
  interactionWord,
  joinBranchRuns,
  stemTokenRuns,
} from "./vocab.js";
export type { ActivityLabel } from "./vocab.js";
export type {
  ReadingLine,
  ReadingSection,
  ReadingSectionKey,
  NatalReading,
  DailyReading,
  DailySeed,
  TopicCard,
  TopicPage,
  StarEntry,
  TopicContext,
  TopicSore,
  TopicVisual,
  TopicWhere,
  SoreStatus,
  CompareReading,
  ReadingArea,
} from "./types.js";
export type { ContentRun, TokenLine } from "./tokens.js";
export { fillRuns, plainGloss, textRun } from "./tokens.js";
export { natalReading } from "./natal-reading.js";
export { dailyReading, dailySlots } from "./readings/daily/daily-reading.js";
export type { RotationSlot } from "./rotation.js";
export { rankTransits } from "./readings/daily/lead.js";
export { todaySuits, todaySuitsSlots } from "./readings/daily/today-suits.js";
export { dayTonePhrase, type DayToneKey } from "./banks/daily/day-tone.js";
export type { TodaySuits } from "./readings/daily/today-suits.js";
export { topicPage } from "./readings/topic-page.js";
export { compareReading } from "./compare-reading.js";
export { activityAreaLine, dayGuidance, dateVerdictLine } from "./day-guidance.js";
export type { GuidanceChip, DayGuidance } from "./day-guidance.js";
export { GLOSSARY, HOURS_TOPIC, READING_TOPIC, glossaryEntry } from "./glossary.js";
export { MARKS_TOPIC, type MarksTopic } from "./marks.js";
export type { GlossaryEntry } from "./glossary.js";
export { READ_MORE, readMoreEntry } from "./read-more.js";
export type { ReadMoreEntry } from "./read-more.js";

// The plain reading shape for screens past Today, and You (M24-08).
export type { CardText, PlainCard, PlainLead, PlainReading } from "./readings/plain/plain-reading.js";
export { youColours, youElements, youReading } from "./readings/you/you-reading.js";
export type { ElementLine, YouColours, YouElements } from "./readings/you/you-reading.js";
export { DAY_COLOUR_LINES, ELEMENT_COLOURS, type Colour } from "./banks/colours.js";
export { periodReading, periodSlots, type PeriodSeed, type PeriodSpan } from "./readings/ahead/period-reading.js";
export { pairReading } from "./readings/people/pair-reading.js";
export { OFFICER_DAY_HEADLINES, welcomeHeadline } from "./banks/welcome.js";
export { portraitLine } from "./banks/you/portrait.js";
export { FIRST_WEEK_NOTES, firstWeekKicker, type FirstWeekPart } from "./banks/first-week.js";
export { dayColour, dayColourSlot, type DayColour, type DayColourMode } from "./readings/daily/day-colour.js";
