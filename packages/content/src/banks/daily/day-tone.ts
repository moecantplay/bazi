/**
 * The day's tone in Today's header, where the day-pillar label was (M20-24).
 * Plain words (VOICE.md rule 11), in the week legend's own vocabulary
 * (DESIGN.md §Instrument: leans your way, take it slow, even).
 */

export type DayToneKey = "favoured" | "friction" | "even";

const DAY_TONE_PHRASE: Record<DayToneKey, string> = {
  favoured: "Leans your way",
  friction: "Take it slow",
  even: "An even day"
};

export function dayTonePhrase(tone: DayToneKey): string {
  return DAY_TONE_PHRASE[tone];
}
