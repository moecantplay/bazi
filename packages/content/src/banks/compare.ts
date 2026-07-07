/**
 * Two-chart comparison lines (M8): how two people's charts meet. The primary
 * reader is "you"; the other person is "they/them" — never named, never
 * third-person chart-speak. Every template obeys VOICE.md, including the
 * plain-meaning rule (§11): no mechanic term without an everyday translation.
 *
 * This package phrases CompareFacts the engine already found; it computes no
 * relations of its own.
 */

import type { ElementRelation, InteractionType } from "@daymaster/bazi-engine";

/**
 * Day-master relation lines, keyed by how YOUR element relates to THEIRS.
 * {aElement}/{bElement} are title-cased element words.
 */
export const RELATION_LINES: Record<ElementRelation, readonly string[]> = {
  same: [
    "Your day-masters share one element — {aElement} meeting {aElement}, the same weather in two skies. Understanding comes cheap between you; stretching each other takes intent.",
    "You are both {aElement} at the core, two people who pack the same bag. Easy company, with the same blind spots twice.",
  ],
  output: [
    "In the element cycle, your {aElement} feeds their {bElement} the way rain feeds a garden. You tend to hand them momentum — keep an eye on your own jug.",
    "Your {aElement} produces their {bElement}: between you, you are often the one giving. Generosity that names its limits lasts longer.",
  ],
  wealth: [
    "In the element cycle, your {aElement} shapes their {bElement} the way a carver works wood. You tend to set direction between you; a light hand keeps it kind.",
    "Your {aElement} steers their {bElement}. That can read as leadership or as pressure — worth asking which one they would say.",
  ],
  officer: [
    "Their {bElement} shapes your {aElement} the way a riverbank steers a river. Their structure can focus you or crowd you; naming which it is helps.",
    "In the element cycle, their {bElement} presses on your {aElement}. Met squarely, that pressure builds backbone rather than resentment.",
  ],
  resource: [
    "Their {bElement} feeds your {aElement} the way soil feeds a tree. Around them you refill — the fair question is what flows back.",
    "In the element cycle, their {bElement} produces your {aElement}: they are often the one giving. Receiving well is its own craft.",
  ],
};

/** How they read from your chart's seat: {god} {chinese} {gloss}. */
export const SEEN_TEMPLATES = {
  aSeesB: "To your chart, they read as {god} ({chinese}) — {gloss}.",
  bSeesA: "To their chart, you read as {god} ({chinese}) — {gloss}.",
} as const;

/**
 * Cross-interaction templates: {aBranch}/{bBranch} are the two characters,
 * {aPalace}/{bPalace} the palace words, {element} the trine's element.
 */
export const COMPARE_INTERACTION_TEMPLATES: Record<InteractionType, readonly string[]> = {
  "six-combine": [
    "Your {aPalace} {aBranch} falls into combine with their {bPalace} {bBranch} — two people finishing each other's sentences. Where those rooms meet, things tend to move as a pair.",
    "{aBranch} and {bBranch} sit in combine across your {aPalace} and their {bPalace}. Cooperation comes easily there — the ease of neighbors who already get along.",
  ],
  "six-clash": [
    "Your {aPalace} {aBranch} clashes with their {bPalace} {bBranch} — two schedules booked for the same hour. Sparks there are movement, not verdicts.",
    "A clash runs between your {aPalace} and their {bPalace}: {aBranch} against {bBranch}, a door and a draft. Friction with uses — the kind that cuts knots rather than ties them.",
  ],
  trine: [
    "Your {aBranch} and their {bBranch} are two of the three {element} trine branches — two friends waiting on a third before the plan really moves. Together you carry a shared current of {element}.",
    "{aBranch} in your {aPalace} and {bBranch} in their {bPalace} lean toward the same {element} trine, a crew that rows in time. Around each other, {element} flows more easily.",
  ],
  punishment: [
    "Your {aBranch} and their {bBranch} form a punishment — a stone in the shoe of the relationship, small but recurring. Named plainly, it mostly quiets.",
    "{aBranch} in your {aPalace} meets their {bBranch} in a punishment: the squeaky stair between you. It loosens when you face it together instead of stepping around it.",
  ],
  harm: [
    "Your {aPalace} {aBranch} forms a harm with their {bPalace} {bBranch} — a slow leak rather than a burst pipe. Small erosions between you stay small when caught early.",
    "{aBranch} and {bBranch} sit in harm across your {aPalace} and their {bPalace}: the overnight drip of a kitchen tap. Attention serves better than force there.",
  ],
};

/** Mirror self-punishment (the same branch in both charts) gets its own phrasing. */
export const MIRROR_PUNISHMENT_TEMPLATES: readonly string[] = [
  "{aBranch} appears in your {aPalace} and their {bPalace} alike — a mirror punishment, two people strict with themselves in the same way. Gentleness here is contagious.",
  "You both carry {aBranch}, and matching branches press on each other — the same bar raised in two houses. Easing your grip tends to ease theirs.",
];

/** Fallback for an interaction type this bank has no specific lines for. */
export const COMPARE_GENERIC_TEMPLATES: readonly string[] = [
  "{aBranch} in your {aPalace} touches {bBranch} in their {bPalace}. Read it as shared weather — something to work with, not against.",
];

/** Element support, one line per direction: {element} is title-cased. */
export const SUPPORT_LINES = {
  "b-to-a":
    "{element} tends to suit you, and their chart runs rich in it — like living near the well you drink from.",
  "a-to-b":
    "{element} tends to suit them, and your chart runs rich in it — you carry water they're glad to drink.",
} as const;

/** Every compare template, for exhaustive voice checking. */
export const COMPARE_TEMPLATES: readonly string[] = [
  ...Object.values(RELATION_LINES).flat(),
  ...Object.values(SEEN_TEMPLATES),
  ...Object.values(COMPARE_INTERACTION_TEMPLATES).flat(),
  ...MIRROR_PUNISHMENT_TEMPLATES,
  ...COMPARE_GENERIC_TEMPLATES,
  ...Object.values(SUPPORT_LINES),
];
