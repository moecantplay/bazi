/**
 * TRIAL (2026-10-05 reshape trial build): Ahead's plain leads and cards for a
 * month, a year or a decade. Everyday words only (VOICE.md rule 11): no signs,
 * palaces, element names or interaction names. `{span}` becomes "this month",
 * "this year" or "this decade", so one entry serves all three.
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";

export interface PeriodLeadText {
  headline: string;
  body: string;
  action: string;
}

/** [title, line] */
export type PeriodCardText = readonly [string, string];

export const PERIOD_LEADS: Record<InteractionType, Record<LifeArea, PeriodLeadText>> = {
  "six-clash": {
    work: {
      headline: "Something at work has to make way {span}.",
      body: "Two things at work may want the same room {span}: a role and a new direction, or your plan and someone else's. You get to choose which gives way, and choosing early keeps it calm.",
      action: "Name the work commitment you'd drop first, and tell one person.",
    },
    family: {
      headline: "Family plans and yours pull apart {span}.",
      body: "Family may want you in one place while your own plans point elsewhere. Neither has to lose outright; decide early what you can give, and say it clearly.",
      action: "Have the family conversation you've been putting off.",
    },
    home: {
      headline: "Home asks for some give {span}.",
      body: "Two plans at home may want the same space or the same time {span}. Talk early about which one moves, and decide it together rather than alone.",
      action: "Settle one home plan instead of letting it drift.",
    },
    plans: {
      headline: "A bigger plan may need a new route {span}.",
      body: "What you're building toward may meet something that won't move. Adjusting early costs less than defending a plan that no longer fits.",
      action: "Write down which part of the plan you'd change first.",
    },
  },
  punishment: {
    work: {
      headline: "An old work snag keeps coming back {span}.",
      body: "One familiar irritation at work tends to return {span}: the same delay, the same friction. It loosens once you name it and fix the cause rather than each new version.",
      action: "Write down the work snag that keeps repeating, and one fix.",
    },
    family: {
      headline: "A familiar family friction returns {span}.",
      body: "An old pattern with family may show up again. Decide ahead of time how you want to answer, and answer as who you are now.",
      action: "Pick your answer to the family question you always dread.",
    },
    home: {
      headline: "The same small thing at home {span}.",
      body: "Something small at home may keep coming up: a chore, a habit, a tone. Talk about the pattern, kindly, rather than each time it happens.",
      action: "Raise the recurring home niggle once, calmly.",
    },
    plans: {
      headline: "The same obstacle keeps turning up {span}.",
      body: "A setback in your longer plans may repeat until its cause is fixed. It usually needs a small change of approach, not a bigger push.",
      action: "Ask why the same obstacle keeps returning.",
    },
  },
  harm: {
    work: {
      headline: "Small slips at work add up {span}.",
      body: "Little misreadings at work tend to pile up quietly {span}. A second look and an early question catch most of them.",
      action: "Double-check one thing you'd normally send without looking.",
    },
    family: {
      headline: "A little wear in family ties {span}.",
      body: "Small misunderstandings with family can build if nobody mentions them. Reaching out first, even briefly, keeps them small.",
      action: "Send a short message to the relative you've drifted from.",
    },
    home: {
      headline: "Something small may be off at home {span}.",
      body: "Quiet misreadings at home can grow into moods. Ask rather than guess, and check in before small things harden.",
      action: "Ask the person you live with how they're really doing.",
    },
    plans: {
      headline: "A slow leak in a bigger plan {span}.",
      body: "Something in your longer plans may slip without anyone noticing. A regular quick check keeps the drift small.",
      action: "Set one check-in date for your biggest plan.",
    },
  },
  "six-combine": {
    work: {
      headline: "Work agreements come easily {span}.",
      body: "At work, asks land softly and people tend to meet you halfway {span}. It's a good stretch to settle things that have been hanging.",
      action: "Bring up the work request you've been holding back.",
    },
    family: {
      headline: "Family ties feel warm {span}.",
      body: "The people you come from are easier to reach {span}. Visits, calls and shared plans tend to go well, and help is easier to accept.",
      action: "Let someone in your family help with something.",
    },
    home: {
      headline: "Home is on the same page {span}.",
      body: "You and the person closest to you tend to want the same things {span}. It's a good stretch to decide something together.",
      action: "Make one shared decision at home you've been putting off.",
    },
    plans: {
      headline: "A bigger plan finds a good fit {span}.",
      body: "Pieces of your longer plans may click with people or chances that suit them. Say yes to the fit when you see it.",
      action: "Push forward the part of a plan that's been waiting.",
    },
  },
  trine: {
    work: {
      headline: "Work pulls your way {span}.",
      body: "Support at work tends to line up behind you {span}. Bring others in rather than carrying everything alone; shared tasks move faster.",
      action: "Start the work task that needs more than one pair of hands.",
    },
    family: {
      headline: "Family pulls together {span}.",
      body: "Your family tends to move as a group {span}, which makes shared plans easier to carry. Lean on that rather than organising everything yourself.",
      action: "Suggest one shared family plan.",
    },
    home: {
      headline: "Home works as a team {span}.",
      body: "At home, everyone tends to pull the same way {span}. Split the work and share the credit; plans made together hold.",
      action: "Hand one home job to someone else.",
    },
    plans: {
      headline: "Your bigger plans have company {span}.",
      body: "The people around you tend to back your longer plans {span}. Let that support carry them instead of pushing harder on your own.",
      action: "Invite one person into a plan you've kept to yourself.",
    },
  },
};

/** When nothing pulls on the chart: the period's character, by its English name. */
export const PERIOD_QUIET_LEADS: Record<string, PeriodLeadText> = {
  "Friend": {
    headline: "Shoulder to shoulder {span}.",
    body: "People in the same spot as you make the best company {span}. Share the load, and more gets done side by side than alone.",
    action: "Team up with someone facing the same task.",
  },
  "Rob Wealth": {
    headline: "Pace-setters at your elbow {span}.",
    body: "Peers set the pace {span}, which keeps you sharp. It's easy to spend energy, and money, matching every move; choose whose pace you keep.",
    action: "Choose one person whose pace you won't try to match.",
  },
  "Eating God": {
    headline: "Make things for the joy of it {span}.",
    body: "Things done for their own sake tend to go well {span}: cooking, making, tinkering. Pleasure is a fair reason to start.",
    action: "Start one thing purely because you'd enjoy it.",
  },
  "Hurting Officer": {
    headline: "Your sharp eye is busy {span}.",
    body: "You spot what others miss {span}, and you'll want to say so. Saying it kindly keeps the point from becoming a quarrel.",
    action: "Offer one improvement, and frame it as a question.",
  },
  "Indirect Wealth": {
    headline: "Chances turn up off the plan {span}.",
    body: "Unplanned openings tend to appear {span}: a side project, a stray introduction. Keep a little room in your week to say yes.",
    action: "Leave one evening a week unplanned.",
  },
  "Direct Wealth": {
    headline: "Steady effort pays its way {span}.",
    body: "Plain, reliable work tends to be rewarded {span}. It's a stretch for keeping promises and finishing what you start.",
    action: "Finish one thing you've half-done.",
  },
  "Seven Killings": {
    headline: "Pressure that builds strength {span}.",
    body: "Demands run high {span}, and meeting them tends to make you stronger. Pick the challenges worth it and let the rest go.",
    action: "Name the one demand you'll rise to, and one you'll drop.",
  },
  "Direct Officer": {
    headline: "Doing things properly pays off {span}.",
    body: "Rules, routines and fair play tend to work in your favour {span}. Structure feels less like a cage and more like a frame.",
    action: "Set one routine and keep it for a week.",
  },
  "Indirect Resource": {
    headline: "Learning your own way {span}.",
    body: "Your best ideas tend to come from side roads {span}: hunches, odd reading, conversations you didn't plan. Trust the strange route.",
    action: "Keep a list of the hunches you'd usually wave away.",
  },
  "Direct Resource": {
    headline: "Help reaches you more easily {span}.",
    body: "Care and support tend to find you {span}, from teachers, elders or friends. Letting yourself be helped is part of the work.",
    action: "Ask for advice from someone who's been there.",
  },
};

/** The period's element as one closing sentence of the lead's body. */
export const PERIOD_ELEMENT_SENTENCES: Record<Element, { suits: string; against: string }> = {
  wood: { suits: "New starts take hold easily {span}.", against: "Plans sprawl easily {span}, so keep them few." },
  fire: { suits: "Being seen works in your favour {span}.", against: "Tempers may run warm {span}, so take a breath before answering." },
  earth: { suits: "Steady, patient building suits you {span}.", against: "Things may feel heavy {span}; keep the list short." },
  metal: { suits: "Clear decisions come easier {span}.", against: "Edges feel sharp {span}; softer handling goes further." },
  water: { suits: "Ideas and conversations flow your way {span}.", against: "Things may move slower than you'd like {span}; give them time." },
};

export const PERIOD_INTERACTION_CARDS: Record<InteractionType, Record<LifeArea, PeriodCardText>> = {
  "six-clash": {
    work: ["Something at work has to give", "Decide early which commitment moves."],
    family: ["Family plans may collide", "Settle whose plan comes first, early."],
    home: ["Two plans at home", "Talk early about which one gives way."],
    plans: ["A plan meets something that won't move", "Adjust early rather than defend it."],
  },
  punishment: {
    work: ["A stone in the shoe at work", "Small, repeating, and lighter once named."],
    family: ["A familiar family friction", "Decide your answer before it comes."],
    home: ["A small repeat at home", "Talk about the pattern, kindly."],
    plans: ["The same obstacle again", "It needs a small fix, not a bigger push."],
  },
  harm: {
    work: ["Small slips at work", "A second look catches most of them."],
    family: ["A little wear in the family", "Reach out first, even briefly."],
    home: ["Something small is off at home", "Ask rather than guess."],
    plans: ["A slow leak in a bigger plan", "Notice what's slipping and plug it."],
  },
  "six-combine": {
    work: ["Easy agreement at work", "Settle what's been hanging."],
    family: ["Warm family ties", "Let someone help you."],
    home: ["Home is on the same page", "Decide something together."],
    plans: ["A good fit for a bigger plan", "Say yes when it clicks."],
  },
  trine: {
    work: ["Work pulls your way", "Bring others in rather than going solo."],
    family: ["Family pulls together", "Shared plans are easier to carry."],
    home: ["Home works as a team", "Split the work, share the wins."],
    plans: ["Your plans have company", "Let support carry them."],
  },
};

/** The period's character as a card, when the lead was a sign link. */
export const PERIOD_TEN_GOD_CARDS: Record<string, PeriodCardText> = {
  "Friend": ["Doing it together", "Peers carrying the same load make good company."],
  "Rob Wealth": ["Pace-setters at your elbow", "Good drive; choose whose pace you keep."],
  "Eating God": ["Making for the joy of it", "Things done for their own sake go well."],
  "Hurting Officer": ["A sharp, busy eye", "Say what you spot, kindly."],
  "Indirect Wealth": ["Chances off the plan", "Keep a little room to say yes."],
  "Direct Wealth": ["Steady effort pays", "Finish what you start."],
  "Seven Killings": ["Pressure that builds strength", "Pick the challenges worth it."],
  "Direct Officer": ["Doing things properly", "Routines work in your favour."],
  "Indirect Resource": ["Learning your own way", "Answers arrive sideways."],
  "Direct Resource": ["Help comes easily", "Let yourself be looked after."],
};
