/**
 * Template banks for the day's layered guidance (VOICE.md rule 12). The prose
 * layer names the officer (translated in-line), then explains the strongest
 * chips by translating the engine's reasons into palace vocabulary and the
 * shared interaction glosses. Friction is postponement, never prohibition; no
 * "avoid", "don't", "inauspicious", or "bad luck" appears here.
 *
 * Branches never sit inline as lone characters (they vanish when the Han toggle
 * strips them); every branch citation rides the factTag, where a pair renders
 * as animal names. Prose leans on palace words and glosses instead.
 *
 * Placeholders: {officerCn} {officerEn} {officerGloss} name the officer;
 * {actLower} is the activity in lowercase; {palace} its palace word; {element}
 * the day's favourable element; {why} a short reason clause (date verdicts).
 */

/** Which translated reason a favouring line leans on. */
export type FavorsSource = "combine" | "element" | "officer";

/** Which translated reason a friction line leans on. */
export type FrictionSource = "clash" | "officer";

/** The opening line: names the officer, glossed in the same breath (rule 11). */
export const OFFICER_LINE_FRAMES: readonly string[] = [
  "A {officerCn} {officerEn} day — {officerGloss}.",
  "Today runs {officerCn} {officerEn}: {officerGloss}.",
  "{officerCn} {officerEn} shapes the day — {officerGloss}.",
];

/** Lines that explain why a favouring chip leans with the day. */
export const FAVORS_FRAMES: Record<FavorsSource, readonly string[]> = {
  combine: [
    "The day sets a combine on your {palace} — two who finish each other's sentences. Doors give with a push, so lean into {actLower}.",
    "A combine settles over your {palace} today, neighbours who already get along. Fair footing for {actLower}.",
  ],
  element: [
    "{element} runs warm for you today — fair light for {actLower}. Say yes to the thing you've already half-decided.",
    "The day's {element} sits with your grain, so {actLower} catch a following wind. Lean in where you've been hesitating.",
  ],
  officer: [
    "This is the day's kind of work — its grain leans toward {actLower}. Say yes to the thing you've already half-decided.",
    "The day's grain runs with {actLower}; the thing you've half-decided is worth a nod today.",
  ],
};

/** Lines that explain why a friction chip runs against the day (postponement). */
export const FRICTION_FRAMES: Record<FrictionSource, readonly string[]> = {
  clash: [
    "The day sets a clash across your {palace} — two schedules booked for the same hour, and something has to move. Give {actLower} one more day.",
    "A clash crosses your {palace} today, a door and a draft. Let {actLower} wait for steadier footing.",
  ],
  officer: [
    "The day's grain runs the other way from {actLower} — restless work today. The boxes will still be there tomorrow; let {actLower} wait a day.",
    "Today's grain is set against {actLower}. Nothing is lost by giving it another day.",
  ],
};

/** Closing line when the day pulls hard in no direction at all. */
export const EVEN_DAY_FRAMES: readonly string[] = [
  "Nothing in the day pulls hard either way — steady, even footing for doing the ordinary thing well.",
  "The day sits level, no strong current in it. A fair time for the small, unglamorous task.",
];

/** Detail line for an area row whose activity carries no leaning today. */
export const NEUTRAL_AREA_FRAMES: readonly string[] = [
  "Nothing in the day pulls at {actLower} either way; it goes the way you take it.",
  "For {actLower}, the day sits level — no current with it, none against.",
  "The day carries no particular grain for {actLower}. Ordinary footing, yours to use.",
];

/** A candidate day's verdict sentence in the finder, by how the day leans. */
export const DATE_VERDICT_FRAMES: Record<"favors" | "neutral" | "friction", readonly string[]> = {
  favors: [
    "For {actLower}, {why} — a fair window.",
    "For {actLower}, {why}, so the day leans your way.",
  ],
  neutral: [
    "For {actLower}, a workable if unremarkable window.",
    "For {actLower}, an even, unremarkable day.",
  ],
  friction: [
    "For {actLower}, {why} — another date will cost you less.",
    "For {actLower}, {why}, so a later date serves you better.",
  ],
};

/**
 * Short reason clauses that fill {why} in a date verdict. Fragments, not full
 * lines — voice-checked for banned words alongside the glosses, not for
 * sentence shape. {palace} and {element} are substituted at render time.
 */
export const DATE_WHY_CLAUSES = {
  combine: "a combine eases your home palace",
  element: "{element} runs warm for you",
  clash: "the day sets a clash on your {palace}",
  officerFavor: "the day's grain leans your way",
  officerAvoid: "the day's grain runs the other way",
  even: "the day stays even",
} as const;

/** Every guidance line template, rendered for the exhaustive voice sweep. */
export const DAY_GUIDANCE_TEMPLATES: readonly string[] = [
  ...OFFICER_LINE_FRAMES,
  ...Object.values(FAVORS_FRAMES).flat(),
  ...Object.values(FRICTION_FRAMES).flat(),
  ...EVEN_DAY_FRAMES,
  ...NEUTRAL_AREA_FRAMES,
  ...Object.values(DATE_VERDICT_FRAMES).flat(),
];
