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
    work: [["Two [tasks|demands] at work want one slot", "Decide [by mid-morning|by lunch] which one gives way."], ["A choice to make at work", "[One commitment|One deadline] has to move; pick which."]],
    family: [["Family [arrangements|schedules] may collide", "Settle [the order|who goes first] while there's still slack."], ["A family scheduling knot", "Choose what you can give, and [say so|tell them]."]],
    home: [["Two [ideas|wishes] at home", "Talk it through and agree [which one waits|what moves]."], ["Home [has to bend|needs a compromise]", "Decide it [as a pair|side by side] rather than alone."]],
    plans: [["A [goal|project] meets a hurry", "Protect [an hour|a slice of time] for the bigger aim."], ["A bigger plan may need rerouting", "[Change course|Adjust the route] while it's still cheap to."]],
  },
  punishment: {
    work: [["An old work niggle returns", "[Name it|Say it out loud] once and it [loosens|eases off]."], ["The same work snag again", "Find [its cause|where it starts], and fix that once."]],
    family: [["A familiar family friction", "Decide your answer [ahead of time|in advance]."], ["An old family sore spot", "[Answer|Respond] from who you are now."]],
    home: [["A [familiar|worn] loop at home", "Talk about the pattern, [kindly|gently]."], ["A household niggle", "[Laugh it off|Joke about it] as a pair if you can."]],
    plans: [["A recurring setback", "[Adjust|Tweak] one detail, then try again."], ["The same obstacle again", "[Look into|Find out] why it [returns|recurs]."]],
  },
  harm: {
    work: [["[Minor|Tiny] slips at work", "A second [look|read] catches most of them."], ["A quiet snag at work", "[Put|Raise] the obvious question [by noon|first thing]."]],
    family: [["[Some|Slight] wear in the family", "Reach out first, even briefly."], ["A family misreading", "A kind word now [saves|spares you] a harder talk."]],
    home: [["A [slight|faint] unease at home", "[Check|Find out] rather than guess."], ["A quiet misreading at home", "[Check in|Talk it over] gently, and soon."]],
    plans: [["A slow leak in a bigger [plan|goal]", "Notice what's slipping and plug it gently."], ["Drift in a [far-off|distant] goal", "A quick check [holds it in place|stops the slide]."]],
  },
  "six-combine": {
    work: [["Easy agreement at work", "[Requests|Proposals] land softly."], ["Work [clicks|flows]", "Settle [the question|the issue] that's been hanging."]],
    family: [["Family [feels easy|is easy company]", "A call or visit is likely [welcome|appreciated]."], ["Warm family ties", "[Accept a relative's help|Say yes to a relative's offer]."]],
    home: [["[Accord|Harmony] at home", "The person closest to you is on your wavelength."], ["Home is on the same page", "[Settle|Reach] a joint decision this evening."]],
    plans: [["A helping hand for a bigger [plan|goal]", "Say yes to the [help that fits|offer]."], ["A [distant|far-off] goal moves [more easily|with less strain]", "Push the part that's been waiting."]],
  },
  trine: {
    work: [["Work pulls your way", "Bring others in [rather than going solo|and share the load]."], ["[Backing|Support] at work", "Start the job that needs [more hands|a crew]."], ["Colleagues fall in step", "Put a shared goal on the table and [others|the rest] [often|usually] join."]],
    family: [["Family is on your side", "Relatives are easier to lean on than usual."], ["Your relatives [pull in one direction|line up behind you]", "[Suggest|Float] a shared plan."], ["[Gather|Round up] the family", "Suggest the meal everyone [has been meaning|has wanted] to arrange."]],
    home: [["Home [acts|pulls] as a team", "Hand out the jobs fairly and enjoy [the result|what gets done]."], ["Everyone at home [faces|leans] one way", "[Arrangements|Decisions] made as a household [hold|stick]."], ["The household [hums along|moves smoothly]", "Tackle the [chore|job] that needs everyone at once."]],
    plans: [["A bigger [plan|goal] has company", "Let support carry it [rather than pushing alone|for a stretch]."], ["Pieces of a goal [fit|line up]", "Move the ready parts first."], ["Allies for [the bigger aim|your next goal]", "Tell [a friend|an ally] what you're building; they may want to help."]],
  },
};

/** The day's element as its effect, when it didn't join the first screen. Each a pool, stepped by visit (M24-11). */
export const ELEMENT_CARDS: Record<Element, { suits: readonly CardText[]; against: readonly CardText[] }> = {
  wood: {
    suits: [
      ["Room to grow", "New starts and fresh [ideas|projects] [take root|catch on] readily."],
      ["[Fertile|Rich] soil for a new habit", "Begin one [brief|modest] routine and give it a week."],
      ["Ideas sprout quickly", "Get the rough [first version|draft] down while it's fresh."],
    ],
    against: [
      ["Attention [sprawls|spreads thin]", "Stick to one or two [aims|priorities] rather than starting [many|a dozen]."],
      ["Too many branches at once", "[Finish|Close] one task, then open the next tab."],
      ["Restless to start [everything|it all]", "Pick the one start that matters and park the rest."],
      ["Growth [outpaces|races ahead of] you", "Prune your list to what you can [finish|manage] by evening."],
    ],
  },
  fire: {
    suits: [
      ["You [make a fine impression|land well with others]", "[Show up|Step forward] and share what you know."],
      ["Your warmth carries further", "A [short message|quick hello] lands better than usual."],
      ["[Speak up|Say it out loud]", "Ideas you voice get a fair hearing."],
    ],
    against: [
      ["Tempers [flare|simmer]", "[Breathe once|Count to five], then answer anything sharp."],
      ["Moods heat up quickly", "Let a hot message sit [ten|twenty] minutes, then decide."],
      ["Short fuses around you", "Lower your voice a notch and others [often|usually] follow."],
      ["[A hot-headed stretch|Heat in the air]", "Leave a gap in your schedule so nothing boils over."],
    ],
  },
  earth: {
    suits: [
      ["Steady ground under you", "[Solid|Patient], careful effort goes further than usual."],
      ["[Time|Room] to dig in", "Slow [jobs|chores] that need patience move along without [much fuss|a fuss]."],
      ["Others can lean on you", "Your calm makes you the one [friends|others] check with."],
    ],
    against: [
      ["Heavy going", "[Trim|Shorten] the list and move at your own pace."],
      ["Sluggish going", "Expect everything to [drag|stretch out], and build in [some|extra] slack."],
      ["[Stuck in the mud|Mired in mud]", "One finished [job|errand], however minor, gets you moving again."],
      ["Weighed down by the to-do list", "Hand off or drop one item so the rest feel [lighter|easier]."],
    ],
  },
  metal: {
    suits: [
      ["You're thinking clearly", "Decisions and edits [feel|go] easier than usual."],
      ["A sharp eye", "Cut what isn't [pulling its weight|earning its place] from a draft, a project or a cupboard."],
      ["Ready to make the call", "Choose between the options you've been [weighing|turning over] for a while."],
    ],
    against: [
      ["Edges feel sharper", "Softer handling goes further with [others|everyone]."],
      ["Words may cut deeper", "[Reread|Read over] your reply once more, then send it."],
      ["A critical streak [in the air|around you]", "Mention one [detail|point] you like, then the one you'd change."],
      ["Everyone's [a bit|rather] brittle", "Correct gently, and give others room to disagree."],
    ],
  },
  water: {
    suits: [
      ["The current flows your way", "Conversations and ideas [move|travel] easily."],
      ["Easy to adapt", "When [plans|arrangements] change, you find the new route quickly."],
      ["A listening ear", "Others tell you more than usual if you [leave|allow] a pause."],
    ],
    against: [
      ["Progress [moves|drifts] slower than you'd like", "[Give|Allow] it the time it needs."],
      ["[Attention|Focus] wanders", "Write the next step [where you'll see it tomorrow|on a note you'll find tomorrow]."],
      ["Hard to get a firm answer", "Give [others|your contacts] a clear date to reply by, kindly."],
      ["Murky going", "When [details|facts] blur, [pose|put] the one question that settles it."],
    ],
  },
};

/** The day's character, by its English name. Each a pool, stepped by visit (M24-11). */
export const TEN_GOD_CARDS: Record<string, readonly CardText[]> = {
  "Friend": [["Stronger side by side", "[Peers|Friends] in the same spot as you are the best company."], ["Strength in [company|numbers]", "[Team up|Pair up] with a friend or sibling and [errands|chores] go quicker."]],
  "Rob Wealth": [["A competitive streak", "A friend may [chase the same prize|eye the same goal]. Play it [fair|friendly]."], ["A rival for the same prize", "Say what you want [up front|plainly], and the race stays [friendly|light]."]],
  "Eating God": [["Hands-on fun", "Cook, draw, tinker: [whatever you do|anything done] for joy goes well."], ["Pleasure [pays off|is productive]", "[An afternoon|A spell] on a hobby or a [lazy|leisurely] meal leaves you sharper."]],
  "Hurting Officer": [["Clever, [a bit|slightly] cheeky", "You spot the shortcut others miss. Say it [kindly|gently]."], ["A sharp tongue and a [keen|quick] eye", "Your ideas [cut deep|hit home]; deliver them with a smile."]],
  "Indirect Wealth": [["[Lucky|Happy] finds", "Unplanned chances show up, so [watch for them|stay alert]."], ["Chance favours the curious", "Follow up the odd [lead|offer] that turns up."]],
  "Direct Wealth": [["Diligence pays", "Reliable, unglamorous [chores|routines] [pay off|add up]."], ["Persistence adds up", "Chip away at the [dull chore|tedious job]; by evening it shows."]],
  "Seven Killings": [["Pressure that sharpens you", "Demands [climb|pile up], and meeting them builds strength."], ["High expectations all round", "Meet one demand properly, then turn to the next."]],
  "Direct Officer": [["Do it properly", "Rules and routines [serve you well|are on your side], so play it straight."], ["Fair play gets noticed", "Do it by the book and [others trust you|everyone trusts you] for it."]],
  "Indirect Resource": [["Learning sideways", "Answers [arrive|turn up] from odd angles: a side conversation, a walk, a stray article."], ["Hunches are worth a look", "Follow the thought that arrives while you're busy [elsewhere|on another job]."]],
  "Direct Resource": [["[Looked after|Cared for]", "Help and care reach you more easily. Let them."], ["Support is close by", "[Turn to|Call on] the person who usually helps; they're glad to."]],
};

/** Your pace: the day's stage in the twelve-stage cycle, by its English name. Each a pool, stepped by visit (M24-11). */
export const STAGE_CARDS: Record<string, readonly CardText[]> = {
  "Growth": [["A new [start|beginning] stirs", "Fresh and eager, still finding its feet."], ["[A young project|A fresh start] needs tending", "Brief, regular attention helps whatever you've just begun."]],
  "Bath": [["Open and [a bit|slightly] exposed", "Impressions [land|sink in] easily, kind and unkind alike."], ["Easily swayed", "The moods around you rub off, so pick your company [with care|well]."]],
  "Coming of Age": [["Ready to be taken seriously", "Step forward and let yourself be counted."], ["Grown into the role", "Speak with the confidence you've earned; [the room is|others are] ready to listen."]],
  "Taking Office": [["Capable and in motion", "Plenty of drive for [the job|whatever's] at hand."], ["Up to the job", "You have the stamina for a [lengthy|tough], demanding stretch."]],
  "Peak": [["You're at full strength", "Plenty in the tank, with [hardly anything|not much] held back for later."], ["Top of your form", "Spend your peak on the [job|problem] that counts most."]],
  "Decline": [["Just past your peak", "Still strong. Ease [the pace|off] while it's your choice."], ["Coasting down from a high", "Wrap up what's open, then [turn to|pick up] anything new."]],
  "Illness": [["[Going|Moving] at half speed", "Trim the list rather than push through it."], ["Low on reserves", "[Do|Handle] the essentials well and let the extras wait."]],
  "Stillness": [["A [pause|breather]", "[Wait|Hold off] a while, then decide."], ["A quiet, waiting stretch", "Gather what you need to know, and decide once [matters settle|the dust settles]."]],
  "Storage": [["[Put|Pack] it all away", "Sorting and storing go better than starting."], ["Tidy [away|up]", "File, save and label [what you have|your papers], so it's easy to find later."]],
  "Severance": [["A clean slate", "[A phase|An era] has ended, so there's room to begin."], ["[An old habit ends|A season closes]", "Let it go cleanly and enjoy the extra space."]],
  "Conception": [["An idea taking shape", "[A new venture|A fresh project] is forming, still out of sight."], ["The seed of a project", "Hold it [close|to yourself] until it firms up."]],
  "Nurture": [["Growing quietly", "Progress happens out of sight; let it."], ["[Quiet|Hidden] progress underway", "[Go on feeding|Stay with] the project; it's further along than it looks."]],
};

/** A stage the bank has no entry for. */
export const STAGE_CARD_FALLBACK: CardText = ["Your pace", "Move at the speed that feels right."];

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
