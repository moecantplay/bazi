/**
 * Ahead's plain leads and cards for a month, a year or a decade (M24-07).
 * Everyday words only (VOICE.md rule 11): no signs, palaces, element names or
 * interaction names. One entry serves all three spans, so the screen's own
 * label says when; `{span}` ("this month", "this year", "this decade") is
 * still filled where an entry uses it. Every pool here is read through the
 * picker, so entries may hold choice groups (M24-11 R11).
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
      headline: "[One work commitment|One deadline|One of your duties] has to make room.",
      body: "Two demands [at work|on the job] may [compete for|claim] the same slot: two deadlines, or your [idea|project] and someone else's. You get to choose which one moves, and [choosing|settling it] ahead of time keeps it calm.",
      action: "Name the [commitment|meeting|duty] you'd drop first, and tell one [colleague|person].",
    }],
    family: [{
      headline: "[Family wishes and yours|Your family's hopes and your own] pull apart.",
      body: "Relatives may want you in one place while your own [aims|hopes] point elsewhere. Neither side has to lose outright; [decide|settle] what you can give, and say it [clearly|plainly].",
      action: "Have the [family conversation|family talk] you've been putting off.",
    }],
    home: [{
      headline: "[Home asks for some give|Life at home needs a little give].",
      body: "Two [wishes|needs] at home may [compete for|claim] the same space or the same hours. [Talk soon|Sit down and talk] about which one moves, and decide it as a pair.",
      action: "Settle one [home question|household decision] instead of letting it drift.",
    }],
    plans: [{
      headline: "A bigger [goal|ambition] may need [a new route|a detour|another route].",
      body: "What you're building toward may meet [a wall|an obstacle|a hard limit] that won't move. Adjusting [now|soon] costs less than defending a plan that no longer fits.",
      action: "Write down which part of the [plan|approach] you'd change first.",
    }],
  },
  punishment: {
    work: [{
      headline: "An old [work snag|snag at work|hitch in your job] keeps coming back.",
      body: "One familiar [irritation|annoyance] [at work|on the job] may return: the same delay, the same friction. It loosens once you name it and fix [the cause|its root] instead of each [new version|repeat].",
      action: "Write down the [snag|hold-up] that keeps repeating, and one fix.",
    }],
    family: [{
      headline: "[A familiar family friction|An old family pattern] returns.",
      body: "The same [argument|tension] with relatives may show up again. Decide ahead of time how you want to answer, and answer as [who you are now|the person you are now].",
      action: "[Pick|Write down] your answer to the family question you always dread.",
    }],
    home: [{
      headline: "The same [minor snag|old niggle|sore point] at home.",
      body: "[A chore, a habit or a tone|One household habit] may keep coming up. Talk about the pattern kindly, [once and in full|and let single slips go].",
      action: "Raise the recurring [chore dispute|household gripe] once, calmly.",
    }],
    plans: [{
      headline: "The same [obstacle|setback|roadblock] keeps turning up.",
      body: "A hitch in your longer [plans|aims] may repeat until its cause is fixed. It usually yields to [a slight change of approach|one new approach].",
      action: "List what the [setbacks|hold-ups] had in common.",
    }],
  },
  harm: {
    work: [{
      headline: "[Minor|Quiet] slips at work [add up|mount].",
      body: "[Misread emails|Little misreadings] can pile up [unnoticed|out of sight]. A second look and [an early question|a quick check-in] catch most of them.",
      action: "Double-check one [email|report|message] you'd normally send without looking.",
    }],
    family: [{
      headline: "[A little wear|Some fraying] in family ties.",
      body: "[Minor|Little] misunderstandings with [relatives|family] can build if nobody mentions them. Reaching out first, even briefly, [stops them growing|clears most of them].",
      action: "[Send a short message to|Call] the [relative|family member] you've drifted from.",
    }],
    home: [{
      headline: "[A quiet chill|Some unease] may creep in at home.",
      body: "Misread looks and short replies at home can grow into moods. [Find out|Check] instead of guessing, and talk before [a sulk|a silence] hardens.",
      action: "[Ask|Check with] the person you live with how they're really doing.",
    }],
    plans: [{
      headline: "A slow leak in [a bigger plan|your long game|a long-term goal].",
      body: "Part of your longer [plans|aims] may slip without anyone noticing. A regular look [catches the drift|stops the slide].",
      action: "Set one check-in date for your [biggest plan|main goal].",
    }],
  },
  "six-combine": {
    work: [{
      headline: "[Agreements at work|Yeses from colleagues] come easily.",
      body: "Colleagues may meet you halfway, and [requests|proposals] land softly. It's a [useful|fitting] stretch to settle [the loose ends|the open questions] that have been hanging.",
      action: "Bring up the [request|proposal] you've been holding back [at work|with your manager].",
    }],
    family: [{
      headline: "Family ties [feel warm|run warm|grow warmer].",
      body: "The people you come from are easier to reach. Visits and calls [go smoothly|land well], and [help|a hand] is easier to accept.",
      action: "Let [a relative|someone in the family] [take on|handle] one [errand|chore] on your list.",
    }],
    home: [{
      headline: "[Home is|You're both] on the same page.",
      body: "You and the person closest to you [often|may] want the same [outcome|next step]. It's a [fitting|timely] stretch to make a shared decision.",
      action: "Settle one household choice you've both been [putting off|circling].",
    }],
    plans: [{
      headline: "A bigger [plan|goal] finds [its fit|a match].",
      body: "Pieces of what you're building may click with [people or openings|allies and openings] that suit them. Say yes [when you see the fit|when it clicks].",
      action: "Push forward the [part of the plan|piece of your goal] that's been waiting.",
    }],
  },
  trine: {
    work: [{
      headline: "Work [pulls|leans] your way.",
      body: "Support [gathers|lines up] behind you [at work|in your job]. Bring others in [instead of carrying|so you're not carrying] it all alone; shared tasks move faster.",
      action: "Start the [task|assignment] that needs more than one pair of hands.",
    }, {
      headline: "Colleagues are [easier to rally|quick to sign on].",
      body: "[Coworkers|Teammates] often say yes when invited onto a project. Pick the one that stalled for lack of hands and gather a [crew|team] around it.",
      action: "[Get two colleagues to join|Bring two colleagues in on] one stalled task.",
    }, {
      headline: "[Help|Backing] at work arrives from more directions.",
      body: "A manager, a peer or someone in another team may offer to carry part of your load. [Say yes out loud|Accept gladly], and give each helper one clear [piece|part].",
      action: "[List|Jot down] who could share your heaviest task.",
    }],
    family: [{
      headline: "Family [pulls together|rallies round].",
      body: "Relatives [often|usually] move as a group, which makes [joint outings|shared projects] easier to pull off. Lean on that [instead of organising|so you're not organising] everything yourself.",
      action: "Suggest one [family outing|shared family project].",
    }, {
      headline: "Relatives are ready to share the load.",
      body: "Relatives [often|usually] show up when asked, for the move, the birthday or the hard week. Spread the jobs around so no one person carries [all of it|the whole weight].",
      action: "Hand one relative a [specific|clear] job from your list.",
    }, {
      headline: "Family gatherings [come together|fall into place] with little fuss.",
      body: "When several relatives are involved, dates often line up and agreement comes easily. Use that ease for the [reunion|big meal] that usually takes weeks to arrange.",
      action: "Propose a date for the next family get-together.",
    }],
    home: [{
      headline: "[Home runs like a team|Your household is in step].",
      body: "At home, everyone [leans|pulls] in the same direction. Split the chores and share the credit; [choices made side by side|decisions made as a household] hold.",
      action: "Hand one [chore|errand] to someone else.",
    }, {
      headline: "The people at home have your back.",
      body: "When you take on [a big project|a stretch goal], the household [often|usually] rallies around it. Let them in on it [soon|from the start], and their support lands where it's useful.",
      action: "Over dinner, name one goal you'd like [the household's help|a hand] with.",
    }, {
      headline: "Shared jobs at home get done faster.",
      body: "Chores, repairs and [projects|errands] for the house [move quickly|go quickly] when everyone pitches in. Split the list by what each person enjoys, and the dull jobs shrink.",
      action: "Choose one [home project|repair] and book an afternoon to [do it side by side|tackle it as a household].",
    }],
    plans: [{
      headline: "[Your bigger plans have|Your long game has] company.",
      body: "[Friends and colleagues|Those around you] [may|often] back what you're building. Let that support carry it instead of pushing harder on your own.",
      action: "Invite one person into [a plan|an idea] you've kept to yourself.",
    }, {
      headline: "Allies for your [long game|bigger aims] show up.",
      body: "[People who share your aims|Kindred spirits] may cross your path: a mentor, a partner, a friend with the same itch. Tell them what you're building, and see who leans in.",
      action: "Describe your [biggest plan|boldest goal] to one person who'd [understand|get] it.",
    }, {
      headline: "Long-range [plans|goals] move [better|faster] in company.",
      body: "Your longer aims [gain speed|pick up pace] once you stop carrying them alone. Share the next step with someone who can open a door that's out of your reach.",
      action: "[Ask|Invite] one person to handle the next stage of a long-range goal.",
    }],
  },
};

/** When nothing pulls on the chart: the period's character, by its English name. */
export const PERIOD_QUIET_LEADS: Record<string, readonly PeriodLeadText[]> = {
  "Friend": [{
    headline: "[Shoulder to shoulder|In good company].",
    body: "[Peers|Friends] in the same spot as you make the best allies. Share the load, and more gets done side by side than alone.",
    action: "Team up with [a friend|a colleague] facing the same task.",
  }, {
    headline: "Your peers make the hard parts lighter.",
    body: "Friends and colleagues in similar shoes make your best sounding board. [Swap notes often|Compare notes regularly], and the problems you share [shrink|ease].",
    action: "Call a friend who is [dealing with|facing] the same [hurdle|problem] you are.",
  }, {
    headline: "Joining forces [pays off|suits you].",
    body: "Group efforts go further: a study circle, a shared project, a running partner. Choose one and [show up for it regularly|turn up every week].",
    action: "Find one [club|group effort] to join, and put the first date in your calendar.",
  }],
  "Rob Wealth": [{
    headline: "Pace-setters at your elbow.",
    body: "Peers set the pace, which [sharpens you|wakes you up]. It's easy to spend time, and money, matching every move; [choose whose pace you follow|pick whose lead to follow].",
    action: "[Choose|Name] one person whose pace you won't try to match.",
  }, {
    headline: "[Other people's success|A friend's quick progress] may tug at you.",
    body: "Seeing [friends|peers] race ahead can push you to rush or overreach. Use the spark to sharpen your own [aims|goals], at your own speed.",
    action: "Write down one goal that is yours alone, whatever anyone else is doing.",
  }, {
    headline: "Competition [sharpens you|lifts your game].",
    body: "A rival, even a friendly one, [can draw out|often brings out] your best effort. Spell out shared costs and shared credit, so the contest stays fun.",
    action: "Decide with a teammate who owns which [part of the task|share of the effort].",
  }],
  "Eating God": [{
    headline: "[Cook, build or sketch|Tinker] for the joy of it.",
    body: "[Projects|Pastimes] done for their own sake go well. Pleasure is a fair reason to start.",
    action: "Start one [project|hobby] purely because you'd enjoy it.",
  }, {
    headline: "[Enjoyment|Fun] [leads the way|comes first].",
    body: "What you do for pleasure [feeds|nourishes] everything else. A long meal, a song, a sketch: these refill you for [whatever comes next|the busy stretches ahead].",
    action: "[Book|Block out] two hours this week for a pastime you love.",
  }, {
    headline: "Your easy, generous side shows.",
    body: "You're [warm|welcoming] company and quick to share. Host [a simple meal|a casual evening], and let others enjoy what you make.",
    action: "[Cook a dish|Bake or make a treat] and share it with one person.",
  }],
  "Hurting Officer": [{
    headline: "Your [sharp|critical] eye is busy.",
    body: "You spot [flaws|gaps] others miss, and the urge to say so is strong. Saying it kindly [stops|saves] the point from becoming a quarrel.",
    action: "Offer one improvement, and frame it as a question.",
  }, {
    headline: "You see how [routines|systems|processes] could run better.",
    body: "Weak spots in schedules and habits jump out at you. Pair each criticism with a fix, and [others|colleagues] [listen|hear it] instead of bristling.",
    action: "[Write|Rewrite] one complaint as a proposal before you share it.",
  }, {
    headline: "Your voice wants out.",
    body: "Self-expression comes [strongly|easily]: writing, performing, arguing a case. Give it a stage you choose, so it doesn't spill out at the wrong [moment|time].",
    action: "Put one strong opinion into [a written draft|a short post|a letter].",
  }],
  "Indirect Wealth": [{
    headline: "[Chances|Openings] turn up [unplanned|out of nowhere].",
    body: "[Surprise openings|Fresh leads] may appear: a side project, a stray introduction. Hold [a little|some] room in your week to say yes.",
    action: "Leave one evening [a week|each week] unplanned.",
  }, {
    headline: "Lucky breaks favour the flexible.",
    body: "[Chances|Openings] [often come|arrive] sideways, through a friend of a friend or a last-minute change. Answer the [unexpected call|odd message] and see where it [goes|leads].",
    action: "Say yes to one invitation you'd normally turn down.",
  }, {
    headline: "Variety brings openings.",
    body: "New places and new [faces|people] [pay off|repay the effort]. [Quick|Light] experiments cost little and can surprise you.",
    action: "[Go|Head] somewhere new this week, even just a different café.",
  }],
  "Direct Wealth": [{
    headline: "Steady effort pays its way.",
    body: "Showing up and following through [earns|gets] its reward. It's a stretch for [honouring promises|holding to your word] and finishing what you start.",
    action: "Finish one [task|chore] you've half-done.",
  }, {
    headline: "Reliability gets noticed.",
    body: "Being on time and doing what you said [builds|earns] trust. The rewards come slowly, and they last.",
    action: "Make one [modest|minor] promise and honour it exactly.",
  }, {
    headline: "Order and care pay you back.",
    body: "Tracking your time, [belongings|papers] and commitments makes [life|the weeks] smoother. A tidy system frees your attention for what matters.",
    action: "Spend twenty minutes putting one messy [corner|drawer] in order.",
  }],
  "Seven Killings": [{
    headline: "Pressure that builds strength.",
    body: "Demands run high, and meeting them [builds your nerve|toughens you up]. Pick the challenges worth [it|your effort] and let the rest go.",
    action: "Name the one demand you'll rise to, and one you'll drop.",
  }, {
    headline: "The [asks|requests] get bigger.",
    body: "Tough [jobs|assignments] may land on your desk, and you're more able than it feels. Take them one at a time, and [ask for|line up] backup before you need it.",
    action: "List what's on your plate and [mark|circle] the one that matters most.",
  }, {
    headline: "Courage gets a workout.",
    body: "[Moments|Situations] that call for a firm stance [may come up|turn up]. Each one you meet calmly makes the next [easier|lighter].",
    action: "Have one [difficult|honest] conversation you've been dodging.",
  }],
  "Direct Officer": [{
    headline: "[Doing it by the book|Following the proper steps] pays off.",
    body: "Rules, routines and fair play [run in your favour|back you up]. Structure gives you a frame to lean on.",
    action: "Set one routine and [stick with|hold to] it for a week.",
  }, {
    headline: "Fair dealing [gets noticed|earns respect].",
    body: "Those in charge often value careful, honest [effort|craft]. Playing by the rules may feel slow, and it builds [a solid name|your reputation].",
    action: "[Tidy up|Close out] one commitment so it's clearly done right.",
  }, {
    headline: "A clear schedule frees you up.",
    body: "Fixed times and clear roles [lighten your days|make the weeks lighter]. Decide what goes where, then let the [routine|timetable] carry you.",
    action: "Write next week's three fixed commitments into your calendar.",
  }],
  "Indirect Resource": [{
    headline: "[Learning on your own terms|Teaching yourself].",
    body: "Your best ideas [often come|arrive] from side roads: hunches, odd reading, conversations you didn't expect. Trust the [strange|winding] route.",
    action: "[Keep a list|Make a note] of the hunches you'd usually wave away.",
  }, {
    headline: "Odd ideas are worth following.",
    body: "Unusual books, strange questions and solo projects teach you [most|the most]. Give your curiosity [some unscheduled time|a free afternoon].",
    action: "[Spend an hour on|Give an hour to] a topic nobody asked you to learn.",
  }, {
    headline: "Time alone sharpens your thinking.",
    body: "Your mind [runs best|is clearest] in calm, solitary stretches. Protect a few hours of quiet, and let ideas surface [on their own|in their own time].",
    action: "Block out one [morning|evening] with no meetings or messages.",
  }],
  "Direct Resource": [{
    headline: "[Help|Support] reaches you more easily.",
    body: "Care [finds you|comes your way] from teachers, elders or friends. Letting yourself be [helped|looked after] is part of the [process|deal].",
    action: "[Ask for|Seek] advice from someone who's been there.",
  }, {
    headline: "[Sound|Wise] advice is easy to find.",
    body: "Teachers, elders and [old hands|seasoned friends] [are generous|give freely]. Bring them a real question, and listen to the whole answer.",
    action: "Write down one question for someone whose judgement you trust.",
  }, {
    headline: "Learning comes gently.",
    body: "Courses, books and patient teachers suit you. Study at a [steady|calm] pace and let what you learn settle.",
    action: "Pick one book or course and [do the first lesson|spend an hour on it].",
  }],
};

/** The period's element as one closing sentence of the lead's body. */
export const PERIOD_ELEMENT_SENTENCES: Record<Element, { suits: readonly string[]; against: readonly string[] }> = {
  wood: {
    suits: [
      "New starts [take hold|take root] easily.",
      "Fresh [projects|ideas] find room to grow.",
      "[New skills|Lessons] sink in [well|quickly].",
      "Modest beginnings [spread|branch out], so plant the seeds you care about.",
    ],
    against: [
      "[Projects|Commitments] sprawl easily, so [cap them at a few|prune them often].",
      "Too many fresh starts may compete for your [hours|evenings]; finish one before opening another.",
      "Growth comes fast and untidy, so [prune|cut back] what you don't need.",
      "Your [list|to-do list] can outgrow your week, so cross a few [items|tasks] off.",
    ],
  },
  fire: {
    suits: [
      "Being seen [helps you|lifts you].",
      "Your efforts get noticed, so put them where [others|people] can find them.",
      "Warmth and [a little|a dash of] showmanship carry you far.",
      "Speaking up [lands well|gets heard].",
    ],
    against: [
      "Tempers may run warm, so [take a breath|count to five] before answering.",
      "[Arguments|Disputes] can flare quickly, so let heated messages wait an hour.",
      "Excitement may outrun your [hours|stamina]; pace the big pushes.",
      "Attention can turn hot, so [choose|decide] which spotlight is worth stepping into.",
    ],
  },
  earth: {
    suits: [
      "Steady, patient [building|effort] suits you.",
      "Slow, solid progress [adds up|piles up].",
      "Routines hold well, so it's a [fine|ripe] time to lay foundations.",
      "Others [trust|lean on] a calm, dependable hand, and yours is one.",
    ],
    against: [
      "Duties may feel heavy, so [trim the list|shorten the list].",
      "Progress may feel like wading, so count the [quick|minor] wins.",
      "Obligations multiply easily; [turn down|decline] one new one.",
      "Old routines can harden into ruts, so change one [habit|detail].",
    ],
  },
  metal: {
    suits: [
      "Clear decisions come [easier|more readily].",
      "Cutting what you don't need feels [freeing|clean].",
      "Sharp, tidy [effort|craft] wins respect.",
      "A clean yes or a clean no comes more simply.",
    ],
    against: [
      "Edges feel sharp; softer handling [goes further|helps].",
      "Words may come out harder than you mean, so [read them twice|reread before sending].",
      "You may hold yourself to a strict standard; ease it a notch.",
      "[Minor|Passing] criticisms may sting more, so give feedback gently.",
    ],
  },
  water: {
    suits: [
      "Ideas and conversations flow toward you.",
      "Useful [news|information] reaches you, so [stay curious|listen closely].",
      "Long talks and slow thinking both repay you.",
      "[Schedules|Arrangements] bend easily, which helps when one has to change.",
    ],
    against: [
      "[Decisions|Projects] may move slower than you'd like, so give them time.",
      "Answers may be slow to arrive, so build in some waiting room.",
      "Moods can run deep; give yourself a quiet evening to sort through them.",
      "[Projects|Intentions] may drift, so write the next step down.",
    ],
  },
};

export const PERIOD_INTERACTION_CARDS: Record<InteractionType, Record<LifeArea, readonly CardText[]>> = {
  "six-clash": {
    work: [["[A work commitment has to give|Work asks you to choose]", "Decide [soon|first] which [commitment|meeting] moves."]],
    family: [["[Family wishes may collide|Relatives pull another way]", "[Settle soon|Agree ahead of time] whose wishes come first."]],
    home: [["[Two wishes at home|A tug-of-war at home]", "Talk [soon|openly] about which one gives way."]],
    plans: [["[A plan meets a fixed wall|Your long game hits a wall]", "[Adjust early|Change course soon] instead of defending it."]],
  },
  punishment: {
    work: [["A stone in the shoe [at work|on the job]", "[Minor|Petty], repeating, and lighter once named."]],
    family: [["[A familiar family friction|The old family argument]", "Decide your answer before it [comes|arrives]."]],
    home: [["[A recurring snag|The same gripe] at home", "Talk about the pattern, [kindly|gently]."]],
    plans: [["The same [obstacle|roadblock] again", "Try one [different|fresh] method on it."]],
  },
  harm: {
    work: [["[Minor slips|Easy mistakes] at work", "A second look catches most of them."]],
    family: [["[A little wear|Some fraying] in the family", "Reach out first, even [briefly|with a text]."]],
    home: [["[A quiet chill|Unspoken moods] at home", "[Ask|Check] instead of guessing."]],
    plans: [["A slow leak in [a bigger plan|the long game]", "Notice what's slipping and [plug it|patch it]."]],
  },
  "six-combine": {
    work: [["Easy agreement [at work|with colleagues]", "Settle [the loose ends|whatever's been hanging]."]],
    family: [["Warm family ties", "Let [a relative|someone close] [lend a hand|pitch in]."]],
    home: [["[Home is on the same page|In step at home]", "Make one decision [together|as a pair]."]],
    plans: [["[A neat fit|The right match] for a bigger plan", "Say yes when it clicks."]],
  },
  trine: {
    work: [
      ["Work [pulls|leans] your way", "Bring others in [instead of going solo|on the heavy lifting]."],
      ["[Help|Backup] at work is close by", "[Ask for|Accept] a hand on the task you've been carrying by yourself."],
      ["[Colleagues on your side|Colleagues in your corner]", "A shared push [at work|with your team] moves [stuck tasks|the backlog] along."],
    ],
    family: [
      ["Family pulls together", "[Group outings|Joint efforts] are easier to carry."],
      ["[Relatives in step|Kin in step]", "Let several [relatives|family members] each take a piece of [the plan|the effort]."],
      ["Family backing", "[Relatives stand behind you|Your people back you up] when it counts."],
    ],
    home: [
      ["[Home runs as a team|A team at home]", "Split the [chores|jobs], share the wins."],
      ["Many hands at home", "[Chores|Repairs and chores] go [quicker|faster] when everyone takes a share."],
      ["Home is behind you", "The people you live with [cheer|back] your bigger moves."],
    ],
    plans: [
      ["Your plans have company", "Let that support do some of the carrying."],
      ["Allies for the long game", "[Someone|A friend] may offer to [help build|join in building] what you're working toward."],
      ["[A plan with backers|Backers for your aims]", "Talk about your longer [plans|goals], and others may want in."],
    ],
  },
};

/** The period's character as a card, when the lead was a sign link. */
export const PERIOD_TEN_GOD_CARDS: Record<string, readonly CardText[]> = {
  "Friend": [
    ["[Side by side|Peers in step]", "Peers carrying the same load make [fine|welcome] company."],
    ["Company in the same boat", "Someone facing what you face is worth a [phone call|coffee]."],
    ["Strength in numbers", "Pair up on the [task|chore] you'd normally do alone."],
  ],
  "Rob Wealth": [
    ["Pace-setters at your elbow", "[Good drive|Plenty of drive]; choose whose pace you [match|follow]."],
    ["Friendly rivals", "[A little|Some] competition sharpens you, as long as you set your own finish line."],
    ["[Keeping up with others|Measuring yourself]", "Check your progress against your own last effort, and the race quiets down."],
  ],
  "Eating God": [
    ["Making for the joy of it", "[Crafts|Pastimes] done for their own sake go well."],
    ["Play pays off", "A hobby or a meal for friends [lifts|brightens] everything else."],
    ["Room for pleasure", "Make time for [a pastime|an outing] you enjoy with no goal attached."],
  ],
  "Hurting Officer": [
    ["A sharp, busy eye", "Say what you spot, [kindly|gently]."],
    ["Restless with the rules", "You may itch to [change|fix] the usual routine, so pick one rule to question."],
    ["Words with an edge", "Your honesty [lands best|goes down best] with a question in front of it."],
  ],
  "Indirect Wealth": [
    ["[Unplanned chances|Chances out of nowhere]", "[Leave|Hold] a little room to say yes."],
    ["[Side doors open|Detours worth taking]", "An odd invitation or a [side project|new hobby] may be [worth a look|worth exploring]."],
    ["Luck in the margins", "Openings [often arrive|turn up] through people you barely know."],
  ],
  "Direct Wealth": [
    ["Steady effort pays", "Finish what you [start|begin]."],
    ["Rewards for reliability", "[Honouring|Holding to] [minor|modest] promises earns you bigger ones."],
    ["Slow and sure", "Regular, unglamorous [effort|graft] adds up nicely."],
  ],
  "Seven Killings": [
    ["Pressure that builds strength", "Pick the challenges [worth it|worth taking on]."],
    ["High demands", "Hard [asks|requests] may come fast, and meeting one well builds your nerve."],
    ["A test worth taking", "Treat the toughest request as practice, and [ask for support early|line up support soon]."],
  ],
  "Direct Officer": [
    ["[Doing it by the book|Proper steps]", "Routines [run in your favour|pay off]."],
    ["Fair play counts", "Following the agreed process [gets you heard|earns you a hearing]."],
    ["[Structure helps|Structure frees you]", "A clear [plan|schedule] for the week makes the busy days lighter."],
  ],
  "Indirect Resource": [
    ["[Teaching yourself|Learning off the map]", "Answers [arrive sideways|come from odd corners]."],
    ["Hunches worth noting", "[Write down|Jot down] the odd idea before it slips away."],
    ["Quiet study", "Reading or research done alone [pays you back|repays you]."],
  ],
  "Direct Resource": [
    ["[Help|Support] comes easily", "Let yourself be looked after."],
    ["Mentors nearby", "Someone more experienced may be [glad|happy] to advise you."],
    ["Support to lean on", "Taking advice from [an elder|a teacher] goes smoothly."],
  ],
};
