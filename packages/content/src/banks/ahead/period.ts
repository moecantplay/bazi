/**
 * Ahead's plain leads and cards for a month, a year or a decade (M24-07).
 * Everyday words only (VOICE.md rule 11): no signs, palaces, element names or
 * interaction names. `{span}` becomes "this month", "this year" or "this
 * decade", so one entry serves all three.
 */

import type { Element, InteractionType } from "@daymaster/bazi-engine";
import type { LifeArea } from "../../readings/daily/life-areas.js";

import type { CardText } from "../../readings/plain/plain-reading.js";

export interface PeriodLeadText {
  headline: string;
  body: string;
  action: string;
}


export const PERIOD_LEADS: Record<InteractionType, Record<LifeArea, readonly PeriodLeadText[]>> = {
  "six-clash": {
    work: [{
      headline: "Something at work has to make way {span}.",
      body: "Two things at work may want the same room {span}: a role and a new direction, or your plan and someone else's. You get to choose which gives way, and choosing early keeps it calm.",
      action: "Name the work commitment you'd drop first, and tell one person.",
    }],
    family: [{
      headline: "Family plans and yours pull apart {span}.",
      body: "Family may want you in one place while your own plans point elsewhere. Neither has to lose outright; decide early what you can give, and say it clearly.",
      action: "Have the family conversation you've been putting off.",
    }],
    home: [{
      headline: "Home asks for some give {span}.",
      body: "Two plans at home may want the same space or the same time {span}. Talk early about which one moves, and decide it together rather than alone.",
      action: "Settle one home plan instead of letting it drift.",
    }],
    plans: [{
      headline: "A bigger plan may need a new route {span}.",
      body: "What you're building toward may meet something that won't move. Adjusting early costs less than defending a plan that no longer fits.",
      action: "Write down which part of the plan you'd change first.",
    }],
  },
  punishment: {
    work: [{
      headline: "An old work snag keeps coming back {span}.",
      body: "One familiar irritation at work tends to return {span}: the same delay, the same friction. It loosens once you name it and fix the cause rather than each new version.",
      action: "Write down the work snag that keeps repeating, and one fix.",
    }],
    family: [{
      headline: "A familiar family friction returns {span}.",
      body: "An old pattern with family may show up again. Decide ahead of time how you want to answer, and answer as who you are now.",
      action: "Pick your answer to the family question you always dread.",
    }],
    home: [{
      headline: "The same small thing at home {span}.",
      body: "Something small at home may keep coming up: a chore, a habit, a tone. Talk about the pattern, kindly, rather than each time it happens.",
      action: "Raise the recurring home niggle once, calmly.",
    }],
    plans: [{
      headline: "The same obstacle keeps turning up {span}.",
      body: "A setback in your longer plans may repeat until its cause is fixed. It usually yields to a small change of approach.",
      action: "List what the setbacks had in common each time.",
    }],
  },
  harm: {
    work: [{
      headline: "Small slips at work add up {span}.",
      body: "Little misreadings at work tend to pile up quietly {span}. A second look and an early question catch most of them.",
      action: "Double-check one thing you'd normally send without looking.",
    }],
    family: [{
      headline: "A little wear in family ties {span}.",
      body: "Small misunderstandings with family can build if nobody mentions them. Reaching out first, even briefly, keeps them small.",
      action: "Send a short message to the relative you've drifted from.",
    }],
    home: [{
      headline: "Something small may be off at home {span}.",
      body: "Quiet misreadings at home can grow into moods. Ask rather than guess, and check in before small things harden.",
      action: "Ask the person you live with how they're really doing.",
    }],
    plans: [{
      headline: "A slow leak in a bigger plan {span}.",
      body: "Something in your longer plans may slip without anyone noticing. A regular quick check keeps the drift small.",
      action: "Set one check-in date for your biggest plan.",
    }],
  },
  "six-combine": {
    work: [{
      headline: "Work agreements come easily {span}.",
      body: "At work, asks land softly and people tend to meet you halfway {span}. It's a good stretch to settle things that have been hanging.",
      action: "Bring up the work request you've been holding back.",
    }],
    family: [{
      headline: "Family ties feel warm {span}.",
      body: "The people you come from are easier to reach {span}. Visits, calls and shared plans tend to go well, and help is easier to accept.",
      action: "Let someone in your family help with something.",
    }],
    home: [{
      headline: "Home is on the same page {span}.",
      body: "You and the person closest to you tend to want the same things {span}. It's a good stretch to decide something together.",
      action: "Make one shared decision at home you've been putting off.",
    }],
    plans: [{
      headline: "A bigger plan finds a good fit {span}.",
      body: "Pieces of your longer plans may click with people or chances that suit them. Say yes to the fit when you see it.",
      action: "Push forward the part of a plan that's been waiting.",
    }],
  },
  trine: {
    work: [{
      headline: "Work pulls your way {span}.",
      body: "Support at work tends to line up behind you {span}. Bring others in rather than carrying everything alone; shared tasks move faster.",
      action: "Start the work task that needs more than one pair of hands.",
    }, {
      headline: "Colleagues are easier to rally {span}.",
      body: "People at work tend to say yes when you ask them to join in {span}. Pick the project that has stalled for lack of hands and gather a small crew around it.",
      action: "Ask two colleagues to join you on one stalled task.",
    }, {
      headline: "Help at work arrives from more directions {span}.",
      body: "A manager, a peer or someone in another team may offer to carry part of your load {span}. Say yes out loud, and give each helper one clear piece.",
      action: "Write a short list of who could help with your biggest task.",
    }],
    family: [{
      headline: "Family pulls together {span}.",
      body: "Your family tends to move as a group {span}, which makes shared plans easier to carry. Lean on that rather than organising everything yourself.",
      action: "Suggest one shared family plan.",
    }, {
      headline: "Relatives are ready to share the load {span}.",
      body: "Your family tends to show up when asked {span}, for the move, the birthday or the hard week. Spread the jobs around so no one person carries the whole thing.",
      action: "Ask one relative to take a specific job off your list.",
    }, {
      headline: "Family gatherings come together with little fuss {span}.",
      body: "Plans that involve several relatives tend to fall into place {span}: dates line up and people agree. Use that ease for the get-together that usually takes weeks to arrange.",
      action: "Propose a date for the next family get-together.",
    }],
    home: [{
      headline: "Home works as a team {span}.",
      body: "At home, everyone tends to pull the same way {span}. Split the work and share the credit; plans made together hold.",
      action: "Hand one home job to someone else.",
    }, {
      headline: "The people at home have your back {span}.",
      body: "When you take on something big {span}, the household tends to rally around it. Let them in on the plan early, and their help arrives where it's useful.",
      action: "Over dinner, name one goal you'd like the household's help with.",
    }, {
      headline: "Shared jobs at home get done faster {span}.",
      body: "Chores, repairs and plans for the house tend to move when everyone pitches in {span}. Split the list by what each person enjoys, and the dull jobs shrink.",
      action: "Choose one home project and book an afternoon to do it together.",
    }],
    plans: [{
      headline: "Your bigger plans have company {span}.",
      body: "The people around you tend to back your longer plans {span}. Let that support carry them instead of pushing harder on your own.",
      action: "Invite one person into a plan you've kept to yourself.",
    }, {
      headline: "Allies for your long game show up {span}.",
      body: "People who share your aims tend to cross your path {span}: a mentor, a partner, a friend with the same itch. Tell them what you're building, and see who leans in.",
      action: "Describe your biggest plan to one person who'd understand it.",
    }, {
      headline: "Long-range plans move better in company {span}.",
      body: "Your longer plans tend to gain speed {span} once you stop carrying them alone. Share the next step with someone who can open a door that's out of your reach.",
      action: "Ask one person to take on the next step of a long-range plan.",
    }],
  },
};

/** When nothing pulls on the chart: the period's character, by its English name. */
export const PERIOD_QUIET_LEADS: Record<string, readonly PeriodLeadText[]> = {
  "Friend": [{
    headline: "Shoulder to shoulder {span}.",
    body: "People in the same spot as you make the best company {span}. Share the load, and more gets done side by side than alone.",
    action: "Team up with someone facing the same task.",
  }, {
    headline: "Your peers make the hard parts lighter {span}.",
    body: "Friends and colleagues in similar shoes tend to be your best sounding board {span}. Swap notes often, and the problems you share get smaller.",
    action: "Call a friend who is dealing with the same thing you are.",
  }, {
    headline: "Joining forces works well {span}.",
    body: "Group efforts tend to go further {span}: a study circle, a shared project, a running partner. Choose one and show up for it regularly.",
    action: "Find one group effort to join, and put the first date in your calendar.",
  }],
  "Rob Wealth": [{
    headline: "Pace-setters at your elbow {span}.",
    body: "Peers set the pace {span}, which keeps you sharp. It's easy to spend time, and money, matching every move; choose whose pace you keep.",
    action: "Choose one person whose pace you won't try to match.",
  }, {
    headline: "Other people's success may tug at you {span}.",
    body: "Seeing friends race ahead can push you to rush or overreach {span}. Use the spark to sharpen your own plan, at your own speed.",
    action: "Write down one goal that is yours alone, whatever anyone else is doing.",
  }, {
    headline: "Competition keeps you sharp {span}.",
    body: "A rival, even a friendly one, tends to bring out your best work {span}. Keep shared costs and shared credit clear, so the contest stays fun.",
    action: "Agree with a teammate who owns which part of the shared work.",
  }],
  "Eating God": [{
    headline: "Make things for the joy of it {span}.",
    body: "Things done for their own sake tend to go well {span}: cooking, making, tinkering. Pleasure is a fair reason to start.",
    action: "Start one thing purely because you'd enjoy it.",
  }, {
    headline: "Enjoyment leads the way {span}.",
    body: "What you do for fun tends to feed everything else {span}. A long meal, a song, a sketch: these refill you for the work that follows.",
    action: "Book two hours this week for something you do purely for fun.",
  }, {
    headline: "Your easy, generous side shows {span}.",
    body: "You tend to be good company {span}, relaxed and quick to share. Host something small, and let others enjoy what you make.",
    action: "Cook or make something and share it with one person.",
  }],
  "Hurting Officer": [{
    headline: "Your sharp eye is busy {span}.",
    body: "You spot what others miss {span}, and you'll want to say so. Saying it kindly keeps the point from becoming a quarrel.",
    action: "Offer one improvement, and frame it as a question.",
  }, {
    headline: "You see how things could work better {span}.",
    body: "Flaws in plans and systems jump out at you {span}. Pair each criticism with a fix, and people tend to listen instead of bristling.",
    action: "Write one complaint as a proposal before you share it.",
  }, {
    headline: "Your voice wants out {span}.",
    body: "Self-expression comes strongly {span}: writing, performing, arguing a case. Give it a stage you choose, so it doesn't spill out at the wrong moment.",
    action: "Put one strong opinion into a written draft.",
  }],
  "Indirect Wealth": [{
    headline: "Chances turn up off the plan {span}.",
    body: "Unplanned openings tend to appear {span}: a side project, a stray introduction. Keep a little room in your week to say yes.",
    action: "Leave one evening a week unplanned.",
  }, {
    headline: "Lucky breaks favour the flexible {span}.",
    body: "Good chances tend to come sideways {span}, through a friend of a friend or a last-minute change. Answer the unexpected call and see where it goes.",
    action: "Say yes to one invitation you'd normally turn down.",
  }, {
    headline: "Variety brings openings {span}.",
    body: "Trying new places and meeting new people tends to pay off {span}. Small experiments cost little and can surprise you.",
    action: "Go somewhere new this week, even just a different café.",
  }],
  "Direct Wealth": [{
    headline: "Steady effort pays its way {span}.",
    body: "Plain, reliable work tends to be rewarded {span}. It's a stretch for keeping promises and finishing what you start.",
    action: "Finish one thing you've half-done.",
  }, {
    headline: "Reliability gets noticed {span}.",
    body: "Showing up on time and doing what you said tends to build trust {span}. The rewards come slowly, and they last.",
    action: "Make one small promise and keep it exactly.",
  }, {
    headline: "Order and care pay you back {span}.",
    body: "Keeping track of your time, things and commitments tends to make life smoother {span}. A tidy system frees your attention for what matters.",
    action: "Spend twenty minutes putting one messy corner in order.",
  }],
  "Seven Killings": [{
    headline: "Pressure that builds strength {span}.",
    body: "Demands run high {span}, and meeting them tends to make you stronger. Pick the challenges worth it and let the rest go.",
    action: "Name the one demand you'll rise to, and one you'll drop.",
  }, {
    headline: "The asks get bigger {span}.",
    body: "Tough requests may land on your desk {span}, and you're more able than it feels. Take them one at a time, and ask for backup before you need it.",
    action: "List what's on your plate and mark the one that matters most.",
  }, {
    headline: "Courage gets a workout {span}.",
    body: "Situations that ask you to stand firm tend to come up {span}. Each one you meet calmly makes the next one easier.",
    action: "Have one difficult conversation you've been dodging.",
  }],
  "Direct Officer": [{
    headline: "Doing things properly pays off {span}.",
    body: "Rules, routines and fair play tend to work in your favour {span}. Structure feels less like a cage and more like a frame.",
    action: "Set one routine and keep it for a week.",
  }, {
    headline: "Fair dealing is noticed {span}.",
    body: "People in charge tend to respect careful, honest work {span}. Playing by the rules may feel slow, and it builds a good name.",
    action: "Tidy up one commitment so it's clearly done right.",
  }, {
    headline: "A clear schedule frees you up {span}.",
    body: "Fixed times and clear roles tend to make your days lighter {span}. Decide what goes where, then let the plan carry you.",
    action: "Write next week's three fixed commitments into your calendar.",
  }],
  "Indirect Resource": [{
    headline: "Learning your own way {span}.",
    body: "Your best ideas tend to come from side roads {span}: hunches, odd reading, conversations you didn't plan. Trust the strange route.",
    action: "Keep a list of the hunches you'd usually wave away.",
  }, {
    headline: "Odd ideas are worth following {span}.",
    body: "Unusual books, strange questions and solo projects tend to teach you most {span}. Give your curiosity some unscheduled time.",
    action: "Spend an hour on a topic nobody asked you to learn.",
  }, {
    headline: "Time alone sharpens your thinking {span}.",
    body: "Your mind tends to work best in calm, solitary stretches {span}. Protect a few hours of quiet, and let ideas surface on their own.",
    action: "Block out one quiet morning with no meetings or messages.",
  }],
  "Direct Resource": [{
    headline: "Help reaches you more easily {span}.",
    body: "Care and support tend to find you {span}, from teachers, elders or friends. Letting yourself be helped is part of the work.",
    action: "Ask for advice from someone who's been there.",
  }, {
    headline: "Good advice is easy to find {span}.",
    body: "Teachers, elders and people who've been there tend to be generous {span}. Bring them a real question, and listen to the whole answer.",
    action: "Write down one question for someone whose judgement you trust.",
  }, {
    headline: "Learning comes gently {span}.",
    body: "Courses, books and patient teachers tend to suit you {span}. Study at a steady pace and let what you learn settle.",
    action: "Pick one book or course and do the first lesson.",
  }],
};

/** The period's element as one closing sentence of the lead's body. */
export const PERIOD_ELEMENT_SENTENCES: Record<Element, { suits: readonly string[]; against: readonly string[] }> = {
  wood: {
    suits: [
      "New starts take hold easily {span}.",
      "Fresh projects find room to grow {span}.",
      "Learning something new tends to stick {span}.",
      "Small beginnings have a way of spreading {span}, so plant the seeds you care about.",
    ],
    against: [
      "Plans sprawl easily {span}, so keep them few.",
      "Too many fresh starts may compete for your hours {span}; finish one before opening another.",
      "Growth comes fast and untidy {span}, so prune what you don't need.",
      "Your list tends to outgrow your week {span}, so cross a few things off.",
    ],
  },
  fire: {
    suits: [
      "Being seen tends to help you {span}.",
      "Your work tends to get noticed {span}, so put it where people can find it.",
      "Warmth and a little showmanship carry you far {span}.",
      "Speaking up tends to land well {span}.",
    ],
    against: [
      "Tempers may run warm {span}, so take a breath before answering.",
      "Things can flare quickly {span}, so let heated messages wait an hour.",
      "Excitement may outrun your hours {span}; pace the big pushes.",
      "Attention can turn hot {span}, so choose which spotlight is worth stepping into.",
    ],
  },
  earth: {
    suits: [
      "Steady, patient building suits you {span}.",
      "Slow, solid progress adds up {span}.",
      "Routines hold well {span}, so it's a good time to lay foundations.",
      "People tend to trust a calm, dependable hand {span}, and yours is one.",
    ],
    against: [
      "Things may feel heavy {span}; keep the list short.",
      "Progress may feel like wading {span}, so count the small wins.",
      "Obligations multiply easily {span}; turn down one new one.",
      "Old routines can harden into ruts {span}, so change one small thing.",
    ],
  },
  metal: {
    suits: [
      "Clear decisions come easier {span}.",
      "Cutting what you don't need feels good {span}.",
      "Sharp, tidy work tends to win respect {span}.",
      "A clean yes or a clean no comes more simply {span}.",
    ],
    against: [
      "Edges feel sharp {span}; softer handling goes further.",
      "Words may come out harder than you mean {span}, so read them twice.",
      "You may hold yourself to a strict standard {span}; ease it a notch.",
      "Small criticisms may sting more {span}, so give feedback gently.",
    ],
  },
  water: {
    suits: [
      "Ideas and conversations flow toward you {span}.",
      "Useful information tends to reach you {span}, so keep listening.",
      "Long talks and slow thinking both repay you {span}.",
      "Plans bend easily {span}, which helps when one has to change.",
    ],
    against: [
      "Things may move slower than you'd like {span}; give them time.",
      "Answers may be slow to arrive {span}, so build in some waiting room.",
      "Moods can run deep {span}; give yourself a quiet evening to sort through them.",
      "Plans may drift {span}, so write the next step down.",
    ],
  },
};

export const PERIOD_INTERACTION_CARDS: Record<InteractionType, Record<LifeArea, readonly CardText[]>> = {
  "six-clash": {
    work: [["Something at work has to give", "Decide early which commitment moves."]],
    family: [["Family plans may collide", "Settle whose plan comes first, early."]],
    home: [["Two plans at home", "Talk early about which one gives way."]],
    plans: [["A plan meets something that won't move", "Adjust early rather than defend it."]],
  },
  punishment: {
    work: [["A stone in the shoe at work", "Small, repeating, and lighter once named."]],
    family: [["A familiar family friction", "Decide your answer before it comes."]],
    home: [["A small repeat at home", "Talk about the pattern, kindly."]],
    plans: [["The same obstacle again", "Try one different method on it."]],
  },
  harm: {
    work: [["Small slips at work", "A second look catches most of them."]],
    family: [["A little wear in the family", "Reach out first, even briefly."]],
    home: [["Something small is off at home", "Ask rather than guess."]],
    plans: [["A slow leak in a bigger plan", "Notice what's slipping and plug it."]],
  },
  "six-combine": {
    work: [["Easy agreement at work", "Settle what's been hanging."]],
    family: [["Warm family ties", "Let someone help you."]],
    home: [["Home is on the same page", "Decide something together."]],
    plans: [["A good fit for a bigger plan", "Say yes when it clicks."]],
  },
  trine: {
    work: [
      ["Work pulls your way", "Bring others in rather than going solo."],
      ["Help at work is close by", "Ask for a hand on the task you've been carrying by yourself."],
      ["Colleagues on your side", "A shared push at work moves things along {span}."],
    ],
    family: [
      ["Family pulls together", "Shared plans are easier to carry."],
      ["Relatives in step", "Let several relatives each take a piece of the plan."],
      ["Family backing", "Relatives tend to back you up {span}."],
    ],
    home: [
      ["Home works as a team", "Split the work, share the wins."],
      ["Many hands at home", "Household jobs go quicker when everyone takes a share."],
      ["Home is behind you", "The people you live with tend to cheer your bigger moves {span}."],
    ],
    plans: [
      ["Your plans have company", "Let support carry them."],
      ["Allies for the long game", "Someone may offer to help build what you're working toward."],
      ["A plan with backers", "Talk about your longer plans {span}, and others may want in."],
    ],
  },
};

/** The period's character as a card, when the lead was a sign link. */
export const PERIOD_TEN_GOD_CARDS: Record<string, readonly CardText[]> = {
  "Friend": [
    ["Doing it together", "Peers carrying the same load make good company."],
    ["Company in the same boat", "Someone facing what you face is worth a phone call."],
    ["Strength in numbers", "Pair up on the job you'd normally do alone."],
  ],
  "Rob Wealth": [
    ["Pace-setters at your elbow", "Good drive; choose whose pace you keep."],
    ["Friendly rivals", "A little competition sharpens you, as long as you set your own finish line."],
    ["Keeping up with others", "Check your progress against your own last effort, and the race quiets down."],
  ],
  "Eating God": [
    ["Making for the joy of it", "Things done for their own sake go well."],
    ["Play pays off", "A hobby or a meal for friends tends to lift everything else."],
    ["Room for pleasure", "Make time for something you enjoy with no goal attached."],
  ],
  "Hurting Officer": [
    ["A sharp, busy eye", "Say what you spot, kindly."],
    ["Restless with the rules", "You may itch to fix how things are done, so pick one rule to question."],
    ["Words with an edge", "Your honesty lands best with a question in front of it."],
  ],
  "Indirect Wealth": [
    ["Chances off the plan", "Keep a little room to say yes."],
    ["Side doors open", "An odd invitation or a side project may be worth a look."],
    ["Luck in the margins", "Openings tend to arrive through people you barely know."],
  ],
  "Direct Wealth": [
    ["Steady effort pays", "Finish what you start."],
    ["Rewards for reliability", "Keeping small promises tends to earn you bigger ones."],
    ["Slow and sure", "Regular, unglamorous work adds up nicely {span}."],
  ],
  "Seven Killings": [
    ["Pressure that builds strength", "Pick the challenges worth it."],
    ["High demands", "Hard asks may come fast, and meeting one well builds your nerve."],
    ["A test worth taking", "Treat the toughest request as practice, and ask for support early."],
  ],
  "Direct Officer": [
    ["Doing things properly", "Routines work in your favour."],
    ["Fair play counts", "Following the agreed process tends to get you heard."],
    ["Structure helps", "A clear plan for the week makes the busy days lighter."],
  ],
  "Indirect Resource": [
    ["Learning your own way", "Answers arrive sideways."],
    ["Hunches worth noting", "Write down the odd idea before it slips away."],
    ["Quiet study", "Reading or research done alone tends to pay you back."],
  ],
  "Direct Resource": [
    ["Help comes easily", "Let yourself be looked after."],
    ["Mentors nearby", "Someone more experienced may be glad to advise you."],
    ["Support to lean on", "Accepting help from an elder or teacher goes smoothly {span}."],
  ],
};
