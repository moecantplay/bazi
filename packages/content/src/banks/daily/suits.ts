/**
 * "What the day suits" on Today, in everyday words (VOICE.md rules 11 and 12):
 * each almanac day type as a plain heading, and what it favours, for the one
 * reason that explains the Watch chips. The old names live on topic pages.
 * Headings and reasons are pools stepped by day number (M24-11): the day type
 * follows the solar month as well as the day, so it has no fixed cycle to
 * count visits over.
 */

export const OFFICER_PLAIN: Record<string, { headings: readonly string[]; favours: string }> = {
  jian: { headings: ["A day for setting things up", "Lay the groundwork today", "Good for first steps and foundations", "Put the frame in place", "The base comes first today"], favours: "setting things up" },
  chu: { headings: ["A day for clearing out", "Make some space today", "Out with what you don't need", "Good for decluttering, inside and out", "Clear the decks"], favours: "clearing out" },
  man: { headings: ["A day for sharing plenty", "There's enough to go round", "Good for hosting and gathering", "A full table today", "Share what you've got"], favours: "sharing and gathering" },
  ping: { headings: ["An even, steady day", "Level ground today", "No peaks and no dips", "Calm and even-handed", "Good for keeping things balanced"], favours: "keeping things level" },
  ding: { headings: ["A day for things to stay put", "Good for settling and agreeing", "Let decisions set today", "Things hold their place", "Fix it in place today"], favours: "settling things" },
  zhi: { headings: ["A day for following through", "Keep your word today", "Good for keeping at it", "Carry the plan forward", "Stick with what's started"], favours: "following through" },
  po: { headings: ["A day for endings more than beginnings", "Good for wrapping things up", "Let something finish today", "Close the chapter", "Clearing the way for later"], favours: "endings" },
  wei: { headings: ["A day to step carefully", "Easy does it today", "Good for double-checking", "Mind your footing today", "Take the careful route"], favours: "care over speed" },
  cheng: { headings: ["A day for bringing things together", "Pieces fall into place", "Good for joining forces", "Tie the loose ends together", "Everything lines up today"], favours: "bringing things together" },
  shou: { headings: ["A day for collecting what's owed", "Gather in what's yours", "Bring the harvest home", "Good for chasing replies", "Call in your favours"], favours: "gathering in" },
  kai: { headings: ["A day for fresh starts", "Open something new", "Good for launches and first days", "The door is open today", "Begin it today"], favours: "starting things" },
  bi: { headings: ["A day for finishing and storing", "Close up and put away", "Good for tidy endings", "Pack it away for now", "Bring things to a close"], favours: "finishing over starting" },
};

/** {acts}: the Watch chips, lower-cased and joined ("commitments and moving"). */
export const WATCH_REASONS: Record<"unsettled" | "officer" | "plain", readonly string[]> = {
  unsettled: [
    "With plans {area} still moving, {acts} go better on a steadier day.",
    "Things {area} are in flux today, so {acts} can hold for a day or two.",
    "Give {acts} another day; things {area} need to settle first.",
    "While things {area} sort themselves out, {acts} can be saved for later.",
    "There's enough going on {area} today, so let {acts} wait.",
    "Once things {area} calm down, {acts} may come easier.",
    "Hold {acts} back a day while plans {area} shift.",
    "Plans {area} are still shifting, which makes {acts} worth one more day.",
    "Leave {acts} until things {area} feel firmer.",
    "With a lot in motion {area}, {acts} might fit better later in the week.",
    "Today may bring surprises {area}, so {acts} can keep until they pass.",
    "The picture {area} may change today; {acts} can come later.",
    "Some patience pays: {acts} can follow once things {area} are clearer.",
    "Today keeps things {area} on the go, so give {acts} a later date.",
  ],
  officer: [
    "Today favours {favours}, so {acts} can wait for another day.",
    "The day leans toward {favours}, leaving {acts} for a calmer slot.",
    "Today is about {favours}, so save {acts} for another time.",
    "With the day pulling toward {favours}, {acts} may run easier later.",
    "What today rewards is {favours}; give {acts} a few more days.",
    "Today's grain runs toward {favours}, and {acts} can follow after.",
    "Today suits {favours}; {acts} can keep a day.",
    "Put your effort into {favours} today, and pencil {acts} in for later.",
    "It's a day built around {favours}; move {acts} to a later date.",
    "Today's pull is toward {favours}; {acts} may go better another time.",
    "Make {favours} the focus today and let {acts} take a later turn.",
    "Today belongs to {favours}; {acts} can be held over.",
    "The day's strength is {favours}, so {acts} might wait a little.",
    "Everything today tilts toward {favours}; {acts} can find a better day soon.",
  ],
  plain: ["{Acts} sit better on another day."],
};

export const WATCH_AREA_PHRASE = {
  work: "at work",
  family: "in the family",
  home: "at home",
  plans: "in your bigger plans",
} as const;
