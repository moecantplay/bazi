/**
 * Plain wording for the cards below Today's first screen (VOICE.md rule 11):
 * a title and one sentence per fact, no system terms. The old names live on
 * each card's topic page.
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";

/** [title, sentence] */
export type CardText = readonly [string, string];

/** A sign link that isn't today's lead: a pool per interaction × area, stepped by visit (M24-11). */
export const INTERACTION_CARDS: Record<InteractionType, Record<LifeArea, readonly CardText[]>> = {
  "six-clash": {
    work: [["Two things at work want one slot", "Decide early which gives way."], ["A choice to make at work", "Something at work has to move; pick what."]],
    family: [["Family plans may collide", "Settle whose plan comes first early on."], ["A family scheduling knot", "Choose what you can give, and say so."]],
    home: [["Two plans at home", "Talk early about which one gives way."], ["Something at home has to give", "Decide it together rather than alone."]],
    plans: [["A plan meets a hurry", "Protect a little time for the long game."], ["A bigger plan may need rerouting", "Adjust early rather than defend it."]],
  },
  punishment: {
    work: [["An old work niggle returns", "Name it once and it loosens."], ["The same work snag again", "Find what keeps causing it, and fix that once."]],
    family: [["A familiar family friction", "Decide your answer before it comes."], ["An old family sore spot", "Answer from who you are now."]],
    home: [["A small repeat at home", "Talk about the pattern, kindly."], ["A household niggle", "Laugh about it together if you can."]],
    plans: [["A recurring setback", "Adjust one small thing before you try any harder."], ["The same obstacle again", "Ask why it keeps coming back."]],
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
    work: [["Work pulls your way", "Bring others in rather than going solo."], ["Support at work", "Start the task that needs more hands."], ["Colleagues fall in step", "Put a shared goal on the table and people tend to join."]],
    family: [["Family is on your side", "The people you come from are easier to lean on today."], ["Your relatives pull together", "A good day for a shared plan."], ["A good day to gather the family", "Suggest the meal everyone keeps meaning to arrange."]],
    home: [["Home works as a team", "Split the work and share the wins."], ["Everyone at home pulls one way", "Plans made together tend to hold."], ["The household runs smoothly", "Tackle the job at home that needs everyone at once."]],
    plans: [["A bigger plan has company", "Let support carry it rather than pushing alone."], ["Pieces of a goal fit together", "Move the ready parts first."], ["Allies for the long goal", "Tell someone what you're building; they may want to help."]],
  },
};

/** The day's element as its effect, when it didn't join the first screen. Each a pool, stepped by visit (M24-11). */
export const ELEMENT_CARDS: Record<Element, { suits: readonly CardText[]; against: readonly CardText[] }> = {
  wood: {
    suits: [
      ["Room to grow today", "New starts and fresh plans take hold more easily."],
      ["Good soil for a new habit", "Begin one small routine today and give it a week."],
      ["Ideas sprout quickly today", "Get the rough first version down while it's fresh."],
    ],
    against: [
      ["Plans sprawl a little today", "Keep to one or two things rather than starting many."],
      ["Too many branches at once", "Close one task before you open the next tab."],
      ["Restless to start everything", "Pick the one start that matters and park the rest."],
      ["Growth runs ahead of you", "Prune your list to what fits in the hours you have."],
    ],
  },
  fire: {
    suits: [
      ["You come across well today", "Be seen today, and share what you know."],
      ["Your warmth carries further", "A short message or a quick hello lands better than usual."],
      ["A day to speak up", "Ideas you voice today get a fair hearing."],
    ],
    against: [
      ["Tempers run a little warm", "Take a breath before you answer anything sharp."],
      ["Things heat up quickly", "Let a hot message sit for ten minutes before sending."],
      ["Short fuses around you", "Lower your voice a notch and others tend to follow."],
      ["A day that runs hot", "Leave a gap in your schedule so nothing boils over."],
    ],
  },
  earth: {
    suits: [
      ["Steady ground under you", "Solid, patient work goes further than usual."],
      ["A good day to dig in", "Long tasks that need patience move along without much fuss."],
      ["People can lean on you today", "Your calm makes you the one others check with."],
    ],
    against: [
      ["The day may feel heavy", "Keep the list short and move at your own pace."],
      ["Slow going today", "Expect things to take longer, and plan a little slack."],
      ["Stuck in the mud a little", "One small finished task gets you moving again."],
      ["Weighed down by the to-do list", "Hand off or drop one item so the rest feel lighter."],
    ],
  },
  metal: {
    suits: [
      ["You're thinking clearly", "Decisions and edits come easier than usual."],
      ["A sharp eye today", "Cut what isn't working from a draft, a plan or a cupboard."],
      ["Good for making the call", "Choose between the options you've been weighing for a while."],
    ],
    against: [
      ["Edges feel sharper today", "Softer handling goes further with people."],
      ["Words may cut deeper", "Read your reply once more before it goes out."],
      ["A critical streak runs through the day", "Mention one thing you like before the thing you'd change."],
      ["Everyone's a little brittle today", "Ask before you correct, and give people room to disagree."],
    ],
  },
  water: {
    suits: [
      ["Things flow your way", "Conversations and ideas move easily today."],
      ["Easy to adapt today", "When plans change, you find the new route quickly."],
      ["Good for listening", "People tell you more than usual if you leave a pause."],
    ],
    against: [
      ["Things move slower than you'd like", "Let them take the time they take."],
      ["A day that wanders", "Write the next step somewhere you'll see it tomorrow."],
      ["Hard to get a firm answer", "Give people a clear date to reply by, kindly."],
      ["Murky going today", "When things blur, ask the one question that settles it."],
    ],
  },
};

/** The day's character, by its English name. Each a pool, stepped by visit (M24-11). */
export const TEN_GOD_CARDS: Record<string, readonly CardText[]> = {
  "Friend": [["A day for doing it together", "People in the same spot as you are the best company today."], ["Strength in company", "Work alongside a friend or sibling and the hours go quicker."]],
  "Rob Wealth": [["A competitive streak", "Someone close may want the same thing you do. Keep it friendly."], ["Someone's after the same prize", "Say what you want early, and the race stays good-natured."]],
  "Eating God": [["A day to make things for fun", "Cook, draw, tinker: things done for the joy of it go well."], ["Pleasure is productive today", "An hour on a hobby or a slow meal leaves you sharper."]],
  "Hurting Officer": [["Clever, a little cheeky", "You spot the shortcut others miss. Say it kindly."], ["A sharp tongue and a sharp eye", "Your ideas are sharp today; deliver them with a smile."]],
  "Indirect Wealth": [["A day for lucky finds", "Unplanned chances show up, so keep an eye out."], ["Chance favours the curious", "Follow up the odd lead or offer that turns up today."]],
  "Direct Wealth": [["A day for steady work", "Plain, reliable effort pays off today."], ["Steady effort adds up", "Chip away at the dull task; by evening it shows."]],
  "Seven Killings": [["Pressure that sharpens you", "Demands run high, and meeting them builds strength."], ["High expectations all round", "Meet one demand properly before you turn to the next."]],
  "Direct Officer": [["A day for doing things properly", "Rules, routines and fair play work in your favour."], ["Fair play gets noticed", "Do it by the book today and people trust you for it."]],
  "Indirect Resource": [["Good for learning sideways", "Answers come from odd angles: a side conversation, a walk, a stray article."], ["Hunches are worth a look", "Follow up the thought that arrives while you're busy with something else."]],
  "Direct Resource": [["A day to be looked after", "Help and care reach you more easily today. Let them."], ["Support is close by", "Ask the person who usually helps; they're glad to today."]],
};

/** Your pace: the day's stage in the twelve-stage cycle, by its English name. Each a pool, stepped by visit (M24-11). */
export const STAGE_CARDS: Record<string, readonly CardText[]> = {
  "Growth": [["Something new is starting", "Fresh and eager, still finding its feet."], ["Something young needs tending", "Small, regular attention helps whatever you've just begun."]],
  "Bath": [["Open and a little exposed", "Impressions land easily today, good and bad."], ["Easily swayed today", "Other people's moods rub off on you, so pick your company."]],
  "Coming of Age": [["Ready to be taken seriously", "Step forward today and let yourself be counted."], ["Grown into the role", "Speak with the confidence you've earned; people are ready to listen."]],
  "Taking Office": [["Capable and in motion", "Plenty of drive for the work at hand."], ["Up to the job", "You have the stamina for a long, demanding stretch today."]],
  "Peak": [["You're at full strength", "Plenty in the tank, with little held back for later."], ["Top of your form", "Spend your best hours on the work that counts most."]],
  "Decline": [["Just past your peak", "Still strong. Ease the pace before it eases you."], ["Coasting down from a high", "Wrap up what's open before you take on anything new."]],
  "Illness": [["Running at half speed", "Trim the list rather than push through it."], ["Low on reserves today", "Do the essentials well and let the extras wait."]],
  "Stillness": [["A pause day", "Good for waiting before you decide."], ["A quiet, waiting kind of day", "Gather what you need to know, and decide once things settle."]],
  "Storage": [["A day to put things away", "Sorting and keeping go better than starting."], ["Good for tidying away", "File, save and label things, so they're easy to find later."]],
  "Severance": [["A clean slate", "Something has ended, so there's room to begin."], ["Something has run its course", "Let it go cleanly and enjoy the extra space."]],
  "Conception": [["An idea taking shape", "Something new is forming that isn't visible yet."], ["The seed of a plan", "Keep the new idea to yourself a little longer while it forms."]],
  "Nurture": [["Growing quietly", "Progress happens out of sight today; let it."], ["Quiet progress underway", "Keep feeding the slow project; it's further along than it looks."]],
};

/** A stage the bank has no entry for. */
export const STAGE_CARD_FALLBACK: CardText = ["Your pace today", "Take the day at the speed it offers."];

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
