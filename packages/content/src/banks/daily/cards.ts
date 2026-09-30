/**
 * Plain wording for the cards below Today's first screen (VOICE.md rule 11):
 * a title and one sentence per fact, no system terms. The old names live on
 * each card's topic page.
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";

/** [title, sentence] */
export type CardText = readonly [string, string];

/** A sign link that isn't today's lead: two variants per interaction × area. */
export const INTERACTION_CARDS: Record<InteractionType, Record<LifeArea, readonly CardText[]>> = {
  "six-clash": {
    work: [["Two things at work want one slot", "Decide early which gives way."], ["A choice to make at work", "Something at work has to move; pick what."]],
    family: [["Family plans may collide", "Settle whose plan comes first early on."], ["A family scheduling knot", "Choose what you can give, and say so."]],
    home: [["Two plans at home", "Talk early about which one gives way."], ["Something at home has to give", "Decide it together rather than alone."]],
    plans: [["A plan meets a hurry", "Protect a little time for the long game."], ["A bigger plan may need rerouting", "Adjust early rather than defend it."]],
  },
  punishment: {
    work: [["An old work niggle returns", "Name it once and it loosens."], ["The same work snag again", "Fix the cause, not just today's version."]],
    family: [["A familiar family friction", "Decide your answer before it comes."], ["An old family sore spot", "Answer from who you are now."]],
    home: [["A small repeat at home", "Talk about the pattern, kindly."], ["A household niggle", "Laugh about it together if you can."]],
    plans: [["A recurring setback", "It needs a small fix, not a bigger push."], ["The same obstacle again", "Ask why it keeps coming back."]],
  },
  harm: {
    work: [["Small slips at work", "A second look catches most of them."], ["A quiet snag at work", "Ask the obvious question early."]],
    family: [["A little wear in the family", "Reach out first, even briefly."], ["A family misreading", "A kind word now saves a harder talk."]],
    home: [["Something small is off at home", "Ask rather than guess."], ["A quiet misreading at home", "Check in before it becomes a mood."]],
    plans: [["A slow leak in a bigger plan", "Notice what's slipping and plug it gently."], ["Drift in a long-term goal", "A quick check keeps it small."]],
  },
  "six-combine": {
    work: [["Easy agreement at work", "Asks land softly today."], ["Work clicks today", "Settle something that's been hanging."]],
    family: [["Family comes easily", "A call or visit is likely welcome."], ["Warm family ties", "Let someone help you."]],
    home: [["Easy agreement at home", "The person closest to you is on your wavelength."], ["Home is on the same page", "A good evening to decide something together."]],
    plans: [["A helping hand for a bigger plan", "Say yes to the fit."], ["A long plan moves more easily", "Push the part that's been waiting."]],
  },
  trine: {
    work: [["Work pulls your way", "Bring others in rather than going solo."], ["Support at work", "Start the task that needs more hands."]],
    family: [["Family is on your side", "The people you come from are easier to lean on today."], ["Your relatives pull together", "A good day for a shared plan."]],
    home: [["Home works as a team", "Split the work and share the wins."], ["Everyone at home pulls one way", "Plans made together tend to hold."]],
    plans: [["A bigger plan has company", "Let support carry it rather than pushing alone."], ["Pieces of a goal fit together", "Move the ready parts first."]],
  },
};

/** The day's element as its effect, when it didn't join the first screen. */
export const ELEMENT_CARDS: Record<Element, { suits: CardText; against: CardText }> = {
  wood: { suits: ["Room to grow today", "New starts and fresh plans take hold more easily."], against: ["Plans sprawl a little today", "Keep to one or two things rather than starting many."] },
  fire: { suits: ["You come across well today", "A good day to be seen and to share what you know."], against: ["Tempers run a little warm", "Take a breath before you answer anything sharp."] },
  earth: { suits: ["Steady ground under you", "Solid, patient work goes further than usual."], against: ["The day may feel heavy", "Keep the list short and move at your own pace."] },
  metal: { suits: ["You're thinking clearly", "Decisions and edits come easier than usual."], against: ["Edges feel sharper today", "Softer handling goes further with people."] },
  water: { suits: ["Things flow your way", "Conversations and ideas move easily today."], against: ["Things move slower than you'd like", "Let them take the time they take."] },
};

/** The day's character, by its English name. */
export const TEN_GOD_CARDS: Record<string, CardText> = {
  "Friend": ["A day for doing it together", "People in the same spot as you are the best company today."],
  "Rob Wealth": ["A competitive streak", "Someone close may want the same thing you do. Keep it friendly."],
  "Eating God": ["A day to make things for fun", "Cook, draw, tinker: things done for the joy of it go well."],
  "Hurting Officer": ["Clever, a little cheeky", "You spot the shortcut others miss. Say it kindly."],
  "Indirect Wealth": ["A day for lucky finds", "Unplanned chances show up, so keep an eye out."],
  "Direct Wealth": ["A day for steady work", "Plain, reliable effort pays off today."],
  "Seven Killings": ["Pressure that sharpens you", "Demands run high, and meeting them builds strength."],
  "Direct Officer": ["A day for doing things properly", "Rules, routines and fair play work in your favour."],
  "Indirect Resource": ["Good for learning sideways", "Answers come from odd angles: a side conversation, a walk, a stray article."],
  "Direct Resource": ["A day to be looked after", "Help and care reach you more easily today. Let them."],
};

/** Your pace: the day's stage in the twelve-stage cycle, by its English name. */
export const STAGE_CARDS: Record<string, CardText> = {
  "Growth": ["Something new is starting", "Fresh and eager, still finding its feet."],
  "Bath": ["Open and a little exposed", "Impressions land easily today, good and bad."],
  "Coming of Age": ["Ready to be taken seriously", "A good day to step up and be counted."],
  "Taking Office": ["Capable and in motion", "Plenty of drive for the work in front of you."],
  "Peak": ["You're at full strength", "Plenty in the tank, with little held back for later."],
  "Decline": ["Just past your peak", "Still strong. Ease the pace before it eases you."],
  "Illness": ["Running at half speed", "Trim the list rather than push through it."],
  "Stillness": ["A pause day", "Good for waiting before you decide."],
  "Storage": ["A day to put things away", "Sorting and keeping go better than starting."],
  "Severance": ["A clean slate", "Something has ended, so there's room to begin."],
  "Conception": ["An idea taking shape", "Something new is forming that isn't visible yet."],
  "Nurture": ["Growing quietly", "Progress happens out of sight today; let it."],
};

/** Small signs: one plain title per star key. */
export const STAR_TITLES: Record<string, string> = {
  "tianyi-nobleman": "Someone helpful turns up",
  "tiande-virtue": "Goodwill is on your side",
  "tiande-companion": "Kindness comes back to you",
  "yuede-virtue": "A gentle run of goodwill",
  "taiji-nobleman": "Drawn to the big questions",
  "wenchang-scholar": "Study and writing come easier",
  "lushen-emolument": "Your effort pays its way",
  "jiangxing-general": "People look to you to decide",
  "huagai-canopy": "Time alone pays off",
  "yima-travel-horse": "Good for a change of scene",
  "taohua-peach-blossom": "You get noticed",
  "hongluan-phoenix": "Connection comes knocking",
  "tianxi-joy": "Small good news",
  "hongyan-charm": "Quiet charm works for you",
  "yangren-blade": "Strong will today; aim it",
  "feiren-flying-blade": "Rushing causes small cuts",
  "zaisha-calamity": "Take things a little slower",
  "sangmen-mourning": "Be gentle with old sadness",
  "kongwang-void": "Plans may land lighter than booked",
};

export const CARD_KICKERS = {
  interaction: "Also today",
  element: "The day's element",
  tenGod: "The day's character",
  hours: "Hours",
  stage: "Your pace",
  stars: "Small signs",
} as const;
