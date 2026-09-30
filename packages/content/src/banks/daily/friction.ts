/**
 * Today's first screen when the lead grinds: a clash (two things want the
 * same slot), a punishment (a small, familiar irritation returns) or a harm
 * (a slow leak). Everyday words only (VOICE.md rules 11 and 13): the body says
 * how it could show up and how to ease or head it off. Each body is two
 * sentences; the element's sentence may follow it.
 */

import type { LifeArea } from "../../readings/daily/life-areas.js";

type Pool = Record<LifeArea, readonly string[]>;

export const CLASH_BODIES: Pool = {
  work: [
    "Two things at work may want the same slot today, like a deadline and a meeting. Decide early which one moves, and tell whoever it affects before it becomes a scramble.",
    "Work may hand you two priorities that can't both win today. Pick the one that gives way while it's still your call.",
    "A plan at work may run into someone else's today, and both can't stand as they are. Say plainly what you can shift, and ask what they can.",
    "Your time may be double-booked at work today, by people or by plans. Choose the one that matters more and reschedule the other early.",
    "Expect a tug-of-war at work between what was planned and what just landed. The sooner you name which one wins, the calmer the afternoon.",
  ],
  family: [
    "A family plan may run straight into one of yours today: a visit, a call, an expectation. Choose early which gives way, and say it kindly rather than late.",
    "Someone in your family may need your time just when you've promised it elsewhere. Sort out which comes first this morning, and let both sides know.",
    "Family expectations and your own plans may pull in opposite directions today. Neither has to lose outright; decide what you can give and offer that clearly.",
    "Family may expect you in one place while you'd planned another. A clear, early message beats a late apology.",
    "Two family needs may land on the same day, each wanting all of you. Offer part of your time to each, and say which part.",
  ],
  home: [
    "You and whoever you share your home with may want different things from tonight. Neither of you is wrong; talk early and pick together which plan gives way.",
    "Plans at home may collide today: two ideas of how the evening goes, or whose turn it is. A short, early conversation saves a long, late one.",
    "Something at home may have to switch hands today: a chore, a plan, a decision. Ask what matters most to the other person before you defend your side.",
    "Home may pull two ways tonight: rest or plans, company or quiet. Say what you need early, and ask the same back.",
    "A small standoff at home is possible today over timing or chores. Give ground on the thing you care about least.",
  ],
  plans: [
    "A long-term plan may bump into something urgent today, and both want your attention. Protect a small piece of time for the long game before the urgent thing takes it all.",
    "What you're building toward and what's in front of you may pull against each other today. Decide which one gets the morning, and give the other a fixed slot later.",
    "A bigger plan may need to change course today, because the ground under it has moved. Adjusting now is cheaper than defending a plan that no longer fits.",
    "Something urgent may try to borrow time from a bigger goal today. Lend it a little, but keep one slot the long game owns.",
    "New facts may arrive today that your plans didn't expect. Let the plan bend; a small change today saves a bigger one later.",
  ],
};

export const CLASH_HEADLINES: Pool = {
  work: ["Something at work has to give. You get to choose what.", "Two priorities at work, room for one.", "Work asks you to pick a lane today.", "Two calls on your time at work.", "A work collision you can steer."],
  family: ["Family plans and yours want the same hours.", "A family tug-of-war you can settle early.", "Your people want you somewhere else today.", "One day, two family calls on your time.", "Family asks; your plans ask too."],
  home: ["Home has two plans for the same evening.", "Two ideas of tonight, one evening to share.", "At home, something has to give today.", "Rest or plans? Home may want both.", "A small home standoff you can settle."],
  plans: ["The long game and today's rush collide.", "One long plan may need a new route.", "Today tests which plans are worth keeping.", "Urgent things tug at the long game today.", "A bigger plan meets a new fact."],
};

export const CLASH_AGENCY: Pool = {
  work: [
    "Tell a colleague the thing you've been meaning to say plainly.",
    "Move one meeting or deadline before lunch, and say why.",
    "Write down today's two biggest work asks and push one to tomorrow.",
    "Reply to the overlapping invite with a new time today.",
    "Tell your manager which of two tasks you'll finish first.",
  ],
  family: [
    "Call the relative whose plans overlap with yours and settle it now.",
    "Tell your family what you can manage this week.",
    "Offer one family member a specific time that works for you.",
    "Send one family message today that says what you can offer.",
    "Put one family date in the calendar that suits you both.",
  ],
  home: [
    "Ask at breakfast what everyone wants from tonight.",
    "Suggest a middle way for tonight before anyone digs in.",
    "Ask whoever shares your evening which plan matters more to them.",
    "Tell the people at home one thing you want from tonight, before noon.",
    "Give way on one minor point at home without keeping score.",
  ],
  plans: [
    "Block thirty minutes today for the plan that matters most.",
    "Write down one plan you're ready to change, and how.",
    "Tell one person about the goal you're adjusting.",
    "Guard one half hour for the goal that matters most.",
    "Write down what changed, and what your plan does next.",
  ],
};

export const PUNISHMENT_BODIES: Pool = {
  work: [
    "A small, familiar irritation at work may come back today: the same delay, the same misunderstanding. Name it out loud once and it tends to lose its grip.",
    "Something at work that keeps nagging may nag again today. Fixing the cause, even roughly, beats working around it one more time.",
    "An old sore point with a colleague or a process may flare a little today. Keep it small by dealing with it directly and briefly.",
    "A process that always trips you up may do it again today. Note exactly where it catches, so the fix is easy to ask for.",
    "The same small misunderstanding at work may repeat today. Say it back in your own words once, and it's far less likely to return.",
  ],
  family: [
    "A familiar family friction may come round again today: the same comment, the same tone. Noticing the pattern takes a lot of the sting out of it.",
    "An old family sore point may get pressed today. Answer from where you are now, not from where the argument started years ago.",
    "Family habits may grate a little today, small and familiar. You don't have to fix them; just decide how you'll respond before it happens.",
    "An old family pattern may play out again today, familiar lines and all. Stepping out of your usual part changes the scene more than arguing does.",
    "A family niggle that never quite goes away may surface today. Treat it lightly; it rarely needs solving today.",
  ],
  home: [
    "A small, recurring friction at home may show up again today: the dishes, the timing, the same remark. Talk about the pattern, not just today's version of it.",
    "Something small at home may keep catching today, like a stone in your shoe. Stop and take it out: one honest conversation beats a week of limping.",
    "An old household niggle may come back today. Laughing about it together usually works better than winning it.",
    "A familiar little issue at home may come up again today. Swap roles on it for a day and see if it eases.",
    "A home routine that keeps rubbing may rub again. Change one small part of it instead of the whole thing.",
  ],
  plans: [
    "A recurring setback may show up again in your long-range plans today. It's a sign the plan needs a small fix, not a bigger push.",
    "The same obstacle may block a bigger goal again today. Look at why it keeps returning; the answer is usually simpler than the workaround.",
    "A slow, nagging problem in something you're building may itch today. Deal with it while it's small and you're paying attention.",
    "A long-term goal may hit the same wall again today. Try a side door: a different time, a different helper, a smaller step.",
    "A familiar stall may return to a bigger plan today. Notice what usually comes just before it; that's the thing to change.",
  ],
};

export const PUNISHMENT_HEADLINES: Pool = {
  work: ["The same small snag at work, one more time.", "A work niggle that won't stay quiet.", "Time to fix the thing that keeps catching.", "An old work habit trips you again.", "Break a small work loop today."],
  family: ["A familiar family nerve, touched again.", "The family rerun you've seen before.", "Familiar family habits rub a little today.", "An old family script, playing again.", "A familiar family niggle, small as ever."],
  home: ["The same small thing at home, again.", "A household niggle that wants fixing properly.", "Time to settle a small, familiar argument at home.", "Home's usual friction, one more round.", "A small, familiar rub at home."],
  plans: ["The same obstacle on the long road.", "A recurring snag in the bigger plan.", "What keeps slowing your big plan?", "The long plan hits a familiar wall.", "A repeat stall on something you're building."],
};

export const PUNISHMENT_AGENCY: Pool = {
  work: [
    "Write down the work snag that keeps repeating, and one way to end it.",
    "Fix one small recurring annoyance at work before noon.",
    "Raise the nagging issue with the one person who can change it.",
    "Ask one colleague how they'd fix the step that keeps failing.",
    "Write one line in a shared doc that ends a repeat question.",
  ],
  family: [
    "Decide one calm reply to the family comment you always hear.",
    "Call one family member and keep it light.",
    "Take a short walk after any family call that stings.",
    "Answer the usual family question in a new way.",
    "Spend five quiet minutes before any family call today.",
  ],
  home: [
    "Agree on one small house rule that ends a repeat argument.",
    "Take one chore off someone's plate without being asked.",
    "Say sorry first about the small thing, even if it's half yours.",
    "Try tonight's chores in a different order.",
    "Leave a kind note about the thing that keeps coming up.",
  ],
  plans: [
    "Write down the one obstacle that keeps coming back, and one fix.",
    "Spend twenty minutes on the boring fix your plan keeps needing.",
    "Ask someone outside the plan why it keeps stalling.",
    "Try one new approach to the step that keeps stalling.",
    "Note when the plan last stalled, and why.",
  ],
};

export const HARM_BODIES: Pool = {
  work: [
    "Small things at work can slip today: a misread email, a number copied wrong. They're cheap to fix today and costly next week.",
    "Work may look smooth while something small goes wrong underneath, like a missed step. A second look before anything goes out catches most of it.",
    "A quiet misunderstanding at work may grow if nobody names it today. Ask the obvious question; it's rarely as obvious as it seems.",
    "Something small may go astray at work today: a file, a date, a promise half-made. A quick checklist before you close up catches it.",
    "Work details may drift today while the big picture looks fine. Spend five minutes on the small print.",
  ],
  family: [
    "An old family habit may rub today: a comment that lands wrong, a favour that feels like a duty. It stays small if you deal with it early.",
    "A little distance or a misread message may creep into a family relationship today. Reaching out first, even briefly, stops it from settling in.",
    "Something small in the family may wear a little today, like a tap dripping overnight. Nothing breaks, and a kind word now saves a harder talk later.",
    "A message in the family may be read the wrong way today. Keep it short and warm, and ask rather than assume.",
    "A small family distance may open today without anyone meaning it. A quick call closes it faster than a long one later.",
  ],
  home: [
    "A small misreading at home may go unnoticed today: a tone taken the wrong way, a plan only one of you heard. Checking in early keeps it from turning into a mood.",
    "Something small may wear between you and whoever you live with today. Nothing dramatic; just the kind of thing that grows if it goes unsaid.",
    "Home may feel slightly off today without a clear reason. Ask rather than guess; the answer is usually smaller than the worry.",
    "A plan at home may be heard two different ways today. Say it once more, plainly, and check it landed.",
    "Small irritations at home may pile up quietly today. Name the first one gently, before the second arrives.",
  ],
  plans: [
    "Something your bigger plans rest on may quietly wear today, like a habit that slips. Noticing it now is most of the fix.",
    "A long-term goal may lose a little ground today without anyone noticing. A quick look at where it stands keeps the drift small.",
    "A slow leak may be draining a plan you care about, with time or attention going elsewhere. Plug it gently rather than starting over.",
    "Time meant for your bigger goals may leak away today in small pieces. Guard one block of it, however short.",
    "Your focus on the long game may slip a little today. Re-reading why you started brings it back.",
  ],
};

export const HARM_HEADLINES: Pool = {
  work: ["Work looks smooth. Check underneath before you lean on it.", "A small snag hides under a smooth workday.", "Small slips at work, easy to catch early.", "Mind the small print at work.", "Work's details want a second pass."],
  family: ["A quiet family friction worth catching early.", "Small wear in a family bond today.", "Something in the family needs a gentle check-in.", "A family message may land sideways.", "Close a small family gap early."],
  home: ["Something small is off at home. Ask about it.", "A quiet misreading at home, easy to fix.", "Home needs a small check-in today.", "A small mix-up at home, easy to clear.", "Quiet irritations at home, best named early."],
  plans: ["A long-range plan springs a slow leak today.", "Your bigger plan needs a quick check.", "Small drift in something you're building.", "Small leaks in the long plan.", "Remember why you started the long plan."],
};

export const HARM_AGENCY: Pool = {
  work: [
    "Reread one work plan or message before you send it.",
    "Confirm one detail at work you've been assuming.",
    "Double-check the numbers on anything leaving your desk today.",
    "Check one date or number you've been taking on trust.",
    "Tidy one loose end at work before you log off.",
  ],
  family: [
    "Answer the family message you've been leaving on read.",
    "Send a short, warm note to one relative today.",
    "Ask one family member how they really are.",
    "Call one relative just to say hello.",
    "Send a photo or note to someone in the family.",
  ],
  home: [
    "Ask the person you live with how their day really went.",
    "Clear up one small thing at home before bed.",
    "Say the small thing you've been holding back at home.",
    "Say tonight's plan out loud once, just to be sure.",
    "Name one small thing that bothered you, kindly.",
  ],
  plans: [
    "Write down one thing your long-term plan quietly depends on.",
    "Spend ten minutes checking where your biggest goal stands.",
    "Restart one small habit that keeps a big goal moving.",
    "Put one small step toward a big goal on today's list.",
    "Reread the note where you first wrote the plan down.",
  ],
};
