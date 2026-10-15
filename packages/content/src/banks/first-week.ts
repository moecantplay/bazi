/**
 * The first-week notes on Today (M24-10): on each of a new reader's opened
 * days 2–7, one note says what one part of the page is for. Each names the
 * part by the words on screen and says where it sits. Everyday words only
 * (VOICE.md rule 11), one or two sentences (rule 2).
 */

export type FirstWeekPart =
  | "hours"
  | "character"
  | "pace"
  | "element"
  | "also-today"
  | "small-signs"
  | "suits"
  | "colour"
  | "journal";

export const FIRST_WEEK_NOTES: Record<FirstWeekPart, string> = {
  hours: "Hours, below, is for timing things: give the call that matters the easiest window, and save the roughest for errands.",
  character: "The day's character, below, is its temperament, like the mood a room has before anyone speaks. Start with the task that matches it.",
  pace: "Your pace, below, is your own fuel gauge, whatever the day around you is doing. Let it set how long today's list gets.",
  element: "The day's element, below, is the weather behind everything else on the page. When it runs with you, lean in; when it doesn't, go a notch gentler.",
  "also-today": "Also today, below, holds the side plots: smaller things stirring at work, at home or with family while the headline has the stage. Start with the one that sounds familiar.",
  "small-signs": "Small signs, below, come only on some days, like notes left on the fridge. Read more to see what each could mean for you.",
  suits: "What the day suits, further down, helps you pick a day for the bigger things: a trip, a clear-out, the big ask. Look there before you pencil one in.",
  colour: "Today's colour, further down, turns the reading into something you can hold. Keep it where your eye will catch it during the day.",
  journal: "Near the bottom, mark whether today rang true or didn't fit, and jot what happened if you like. Page back to an earlier day and your words are still there.",
};

/** The note's kicker: which day of the first week this is. */
export function firstWeekKicker(day: number): string {
  return `Your first week · day ${day}`;
}
