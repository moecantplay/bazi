/**
 * Agency pools: small, concrete things doable before dinner (VOICE.md §6).
 * Every daily reading ends with exactly one.
 *
 * Pools are tagged by palace so that when the day's transit touches a room, the
 * action can echo it (career palace -> a work-shaped action). Selection stays
 * deterministic. None of these assume a four-pillar chart.
 */

import type { Palace } from "@daymaster/bazi-engine";

/** Palace groups an agency pool can be keyed to. */
export type AgencyTag = "general" | "roots" | "career" | "home" | "horizon";

const GENERAL: readonly string[] = [
  "Take the walk you keep postponing — no phone, just the walk.",
  "Send the one message you've been drafting in your head.",
  "Say no to one thing today, cleanly and without a paragraph of apology.",
  "Reread the draft once more before you send it.",
  "Clear one small mess that's been quietly annoying you.",
  "Drink a glass of water and step outside for five minutes.",
  "Write down the thing you're avoiding — just the first sentence of it.",
  "Ask one question you've been assuming the answer to.",
  "Put one thing back where it belongs.",
  "Make the call you've been turning into a bigger deal than it is.",
];

const ROOTS: readonly string[] = [
  "Call a family member you've been meaning to reach.",
  "Write down one thing you're grateful your upbringing gave you.",
  "Reach back to an old friend with no agenda.",
  "Look at an old photo and let it be what it is.",
  "Ask a relative to tell you a story you haven't heard.",
];

const CAREER: readonly string[] = [
  "Send the work message you've been sitting on.",
  "Tidy one corner of your desk or one file you keep reopening.",
  "Finish the small work task that's been following you around all week.",
  "Tell a colleague the thing you've been meaning to say plainly.",
  "Close one open loop at work before you log off.",
];

const HOME: readonly string[] = [
  "Say the small kind thing to the person closest to you, out loud.",
  "Share one meal today without a screen in the room.",
  "Ask the person you live with how their day actually went, and wait for the real answer.",
  "Fix one small thing at home you keep stepping around.",
  "Put your phone in another room for one evening hour.",
];

const HORIZON: readonly string[] = [
  "Spend ten minutes on the long project, not the urgent one.",
  "Write one sentence toward the thing you're building for later.",
  "Teach someone younger one small thing you know.",
  "Sketch the next step of a plan you keep only in your head.",
  "Do one small thing today that only pays off years from now.",
];

export const AGENCY_POOLS: Record<AgencyTag, readonly string[]> = {
  general: GENERAL,
  roots: ROOTS,
  career: CAREER,
  home: HOME,
  horizon: HORIZON,
};

/** Map a natal palace to the agency pool that echoes it. */
export function agencyTagForPalace(palace: Palace): AgencyTag {
  switch (palace) {
    case "year":
      return "roots";
    case "month":
      return "career";
    case "day":
      return "home";
    case "hour":
      return "horizon";
    default:
      return "general";
  }
}
