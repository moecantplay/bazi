/**
 * The Welcome screen's chart-free headline, one per day officer (M24-05). It
 * describes the day itself, not a chart, so it reads true for anyone (M20-18:
 * today's own reading, no person yet). Everyday words only (VOICE.md rule 11).
 */

export const OFFICER_DAY_HEADLINES: Record<string, string> = {
  jian: "A day for setting things in motion.",
  chu: "A good day for clearing things out.",
  man: "A full, generous day that likes company.",
  ping: "An even, steady day.",
  ding: "A settled day: what you set down stays put.",
  zhi: "A day for following through on what you've started.",
  po: "A day better for endings than beginnings.",
  wei: "A day to step carefully rather than leap.",
  cheng: "A day when things like to come together.",
  shou: "A day for gathering in what's owed to you.",
  kai: "A day of open doors and fresh starts.",
  bi: "A quiet day for wrapping up and resting.",
};

/** The officer's headline, or a neutral fallback for an unknown key. */
export function welcomeHeadline(officerKey: string): string {
  return OFFICER_DAY_HEADLINES[officerKey] ?? "Today has its own grain.";
}
