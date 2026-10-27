/**
 * "What the day suits" on Today, in everyday words (VOICE.md rules 11 and 12):
 * each almanac day type as a plain heading, and what it favours, for the one
 * reason that explains the Watch chips. The old names live on topic pages.
 * Headings and reasons are pools stepped by day number (M24-11): the day type
 * follows the solar month as well as the day, so it has no fixed cycle to
 * count visits over.
 */

export const OFFICER_PLAIN: Record<string, { headings: readonly string[]; favours: string }> = {
  jian: { headings: ["Set up [the basics|the groundwork]", "Lay [the foundations|a solid base]", "[Made for|Ripe for] first steps", "Put the frame in place", "Start with the base"], favours: "setting up" },
  chu: { headings: ["Clear [out|away] the clutter", "Free up [some|more] room", "Out with what you don't need", "Declutter, inside and out", "Clear the decks"], favours: "clearing out" },
  man: { headings: ["Plenty to share", "There's enough to go [round|around]", "Suited to hosting and gathering", "A full table", "Share what you've got"], favours: "sharing and gathering" },
  ping: { headings: ["Even and steady", "Level ground", "No peaks and no dips", "Calm and even-handed", "[Hold|Strike] a balance"], favours: "holding a balance" },
  ding: { headings: ["What's placed stays put", "Settling and agreeing", "Let decisions set", "Arrangements hold firm", "Fix it in place"], favours: "settling arrangements" },
  zhi: { headings: ["Follow through", "[Hold to|Stand by] your word", "Stay at it", "Carry the project forward", "Stick with what's started"], favours: "following through" },
  po: { headings: ["[Made for|Suited to] endings", "Wrap it up", "Let an old project finish", "Close the chapter", "Clear the way for later"], favours: "endings" },
  wei: { headings: ["Step carefully", "Easy does it", "Double-check the details", "Mind your footing", "[Choose|Pick] the careful route"], favours: "care over speed" },
  cheng: { headings: ["[Bring|Draw] the strands together", "Pieces fall into place", "Join forces", "Tie up loose ends", "Everything lines up"], favours: "joining forces" },
  shou: { headings: ["Collect what's owed", "Gather in what's yours", "Bring the harvest [home|in]", "Chase up replies", "Call in your favours"], favours: "gathering in" },
  kai: { headings: ["Fresh starts", "Open a new chapter", "Launches and first days", "The door is open", "Cut the ribbon"], favours: "starting fresh" },
  bi: { headings: ["Finish and store", "Close up and put away", "Tidy endings", "Pack it away [until later|for a while]", "[Bring|Draw] it to a close"], favours: "finishing over starting" },
};

/** {acts}: the Watch chips, lower-cased and joined ("commitments and moving"). */
export const WATCH_REASONS: Record<"unsettled" | "officer" | "plain", readonly string[]> = {
  unsettled: [
    "With so much {area} still moving, {acts} may [sit|fit] better on a steadier date.",
    "The ground {area} is shifting, so {acts} can hold for [a while|a few days].",
    "Give {acts} [more time|a few days]; what's going on {area} needs to settle first.",
    "While the dust {area} settles, {acts} can be saved for later.",
    "There's enough going on {area} [already|for now], so let {acts} wait.",
    "Once matters {area} calm down, {acts} may [feel easier|go more smoothly].",
    "Hold {acts} back [a while|a few days] while the picture {area} shifts.",
    "Arrangements {area} are still shifting, which makes {acts} worth [a short wait|a pause].",
    "Leave {acts} until the footing {area} feels firmer.",
    "With a lot in motion {area}, {acts} might fit better later in the week.",
    "Surprises may turn up {area}, so {acts} can [wait|hold] until they pass.",
    "The picture {area} may change; {acts} can [follow later|wait for later].",
    "Some patience pays: {acts} can follow once the view {area} is clearer.",
    "Events {area} are moving fast, so give {acts} a later date.",
  ],
  officer: [
    "The moment favours {favours}, so {acts} can wait [a while|a few days].",
    "The pull is toward {favours}, leaving {acts} for a calmer [slot|stretch].",
    "[Focus|Lean] on {favours}, and save {acts} for another time.",
    "With the [tide|current] pulling toward {favours}, {acts} may [go easier|flow better] later.",
    "What pays now is {favours}; give {acts} a few more days.",
    "The grain runs toward {favours}, and {acts} can follow [after|in a while].",
    "Conditions suit {favours}; {acts} can [wait|hold] a bit.",
    "Throw yourself into {favours}, and pencil {acts} in for later.",
    "This stretch is built around {favours}; move {acts} to a later date.",
    "The momentum sits with {favours}; {acts} may go better another time.",
    "Put the focus on {favours} and let {acts} [take a later turn|wait for later].",
    "This is a time for {favours}; {acts} can be held over.",
    "The strength right now is in {favours}, so {acts} might wait [a bit|a while].",
    "Everything tilts toward {favours}; {acts} can find a better [date|slot] soon.",
  ],
  plain: ["{Acts} may sit better on another day."],
};

export const WATCH_AREA_PHRASE = {
  work: "at work",
  family: "in the family",
  home: "at home",
  plans: "in your bigger plans",
} as const;
