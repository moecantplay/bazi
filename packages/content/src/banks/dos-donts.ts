/**
 * Do's and don'ts: small, concrete, same-day suggestions derived from the
 * day's facts. A "do" is an action the day's grain makes cheaper; a "don't" is
 * one it makes expensive — phrased as postponement, never prohibition, and
 * never touching regulated domains (VOICE.md §4, §5).
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";
import type { ReadingLine } from "../types.js";

/** One candidate suggestion plus the fact tag that justifies it. */
export interface DoDontCandidate {
  text: string;
  factTag: string;
}

/** "Do" lines for a day whose element suits the reader. */
export const ELEMENT_DOS: Record<Element, string> = {
  wood: "Start the small thing you've been circling — one seed, not the whole field.",
  fire: "Say the thing out loud: share the draft, teach the trick, give the toast.",
  earth: "Do the steady, unglamorous step — the backup, the tidy-up, the follow-through.",
  metal: "Finish one thing completely; the last ten percent is where today shines.",
  water: "Reach out and reconnect — one message to someone you've been meaning to find.",
};

/** "Don't" lines for a day whose element runs against the reader's grain. */
export const ELEMENT_DONTS: Record<Element, string> = {
  wood: "Hold new launches for a smoother day; tend what's already planted instead.",
  fire: "Let the spotlight pass today — your work reads better from a quieter room.",
  earth: "Let slow things be slow today; don't force the foundation you haven't measured.",
  metal: "Keep the sharp reply in drafts overnight — edges run keen today.",
  water: "Give drifting a deadline: one anchored task before you follow the current.",
};

/** Do/don't pairs the day's interaction pattern makes cheaper or dearer. */
export const INTERACTION_DOS: Partial<Record<InteractionType, string>> = {
  "six-clash": "Make the overdue decision — clash days are for moving stuck furniture.",
  "six-combine": "Ask for the favor or propose the team-up; doors give with a push today.",
  trine: "Hand one task to the people who row with you instead of carrying it solo.",
  punishment: "Name the recurring annoyance out loud once, plainly and without blame.",
  harm: "Give today's plans a second read — small leaks are cheap to fix early.",
};

export const INTERACTION_DONTS: Partial<Record<InteractionType, string>> = {
  "six-clash": "Don't book the day back-to-back — leave room for something to move, because it will want to.",
  "six-combine": "Don't negotiate against yourself before anyone has said no.",
  trine: "Don't do the group's job alone out of habit; the current is with company today.",
  punishment: "Skip re-litigating the old argument — the stone in the shoe wants removing, not describing.",
  harm: "Don't lock in loose plans today; let the details firm up first.",
};

/** Suggestions unlocked when a transit lights a specific star. */
export const STAR_DOS: Record<string, string> = {
  "yima-travel-horse": "Change the scene — take the meeting on a walk, work an hour from somewhere new.",
  "taohua-peach-blossom": "Accept the invitation; being seen works in your favor today.",
  "tianyi-nobleman": "Ask the person who knows — help answers when called today.",
  "wenchang-scholar": "Give an hour to learning or writing; it compounds today.",
  "hongluan-phoenix": "Say yes to the coffee, the call, the introduction.",
  "tianxi-joy": "Mark a small win properly — cake counts.",
};

export const STAR_DONTS: Record<string, string> = {
  "kongwang-void": "Don't hang the whole plan on one hook today — add a second anchor.",
  "zaisha-calamity": "Save the risky shortcut for another day; take the road you know.",
  "yangren-blade": "Don't swing the big decision at full speed — aim first, then cut once.",
  "feiren-flying-blade": "Skip the rushed version of anything sharp — words included.",
  "sangmen-mourning": "Don't shrug off an ending today; give it the nod it's asking for.",
};

/** Fallbacks so a reading always has at least one of each. */
export const GENERIC_DOS: readonly string[] = [
  "Take the ten-minute version of the task you keep postponing.",
  "Send the message you drafted in your head this morning.",
  "Clear one small surface — desk, inbox, or kitchen table.",
];

export const GENERIC_DONTS: readonly string[] = [
  "Don't crowd the day — leave one hour unbooked and let it be slack.",
  "Skip the third opinion; you've already heard the two that matter.",
  "Don't reread the sent message — it landed how it landed.",
];

/** Every do/don't line, for exhaustive voice checking. */
export const DO_DONT_TEMPLATES: readonly string[] = [
  ...Object.values(ELEMENT_DOS),
  ...Object.values(ELEMENT_DONTS),
  ...Object.values(INTERACTION_DOS),
  ...Object.values(INTERACTION_DONTS),
  ...Object.values(STAR_DOS),
  ...Object.values(STAR_DONTS),
  ...GENERIC_DOS,
  ...GENERIC_DONTS,
];

/** Wrap a candidate as a reading line. */
export function doDontLine(candidate: DoDontCandidate): ReadingLine {
  return { text: candidate.text, factTag: candidate.factTag };
}
