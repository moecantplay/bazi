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
    "A deadline and a meeting may want the same slot at work. Decide [by mid-morning|soon] which one moves, and tell whoever it affects [in good time|promptly].",
    "Work may hand you two priorities that can't both win. Pick the one that [gives way|yields] while it's still your call.",
    "Your approach at work may [collide with|bump into] a colleague's, and both can't stand as they are. Say plainly what you can shift, and [find out|check] what they can.",
    "Your workday may be double-booked, by [colleagues|meetings] or by deadlines. Choose the one that matters more and [move|reschedule] the other [soon|by noon].",
    "Expect a tug-of-war at work between the [schedule|agenda] and what just landed. The sooner you name which one wins, the calmer the afternoon.",
  ],
  family: [
    "A family [arrangement|commitment] may [crash|bump] straight into one of yours: a visit, a call, an expectation. Choose which gives way, and say it kindly and soon.",
    "A relative may need your time just when you've promised it elsewhere. Sort out [which wins|the order] this morning, and let both sides know.",
    "Family expectations and your own [hopes|agenda] may pull in opposite directions. Neither has to lose outright; decide what you can give and offer [that clearly|it plainly].",
    "Family may expect you in one place while you'd [planned|promised] another. A clear message [now|by lunch] beats a late apology.",
    "Two family needs may land [at once|in the same hours], each wanting all of you. Offer part of your time to each, and say which part.",
  ],
  home: [
    "You and whoever you share your home with may want [different evenings|different nights]. Neither of you is wrong; talk it over [soon|at breakfast] and choose which wish gives way.",
    "Plans at home may collide: two ideas of how the evening goes, or whose turn it is. A [brief|short] chat now saves a [drawn-out|tense] one later.",
    "A chore, a decision or an errand at home may have to switch hands. Find out what matters most to the other person, then [make|state] your case.",
    "Home may pull two ways tonight: rest or outings, company or quiet. Say what you need [first|by afternoon], and [hear theirs too|listen to theirs].",
    "A [minor|brief] standoff at home is possible over timing or chores. Give ground on [the point|whatever] you care about least.",
  ],
  plans: [
    "Your biggest goal may bump into an urgent [task|request], and both want your attention. Protect [an hour|a slice of time] for the goal while you still can.",
    "What you're building toward and what's in front of you may pull against each other. Decide which one gets the morning, and give the other a fixed slot [later|after lunch].",
    "A bigger plan may need to change course, because the ground under it has moved. Adjusting now [is cheaper than|beats] defending [a route|an approach] that no longer fits.",
    "An urgent request may try to borrow time from a bigger goal. Lend it [an hour|some], but [guard|protect] one slot for the goal.",
    "New facts may arrive that your project didn't expect. Let it bend; a [modest|minor] change now saves a bigger one later.",
  ],
};

export const CLASH_HEADLINES: Pool = {
  work: ["A meeting or deadline at work has to give. [You choose|You pick] which.", "Two priorities at work, room for one.", "Work [wants|needs] you to pick a lane.", "Two calls on your time at work.", "A work collision you can steer."],
  family: ["Family [arrangements|commitments] and yours want the same hours.", "A family tug-of-war you can settle [now|soon].", "Your [relatives|loved ones] want you somewhere else.", "Two family [requests|demands] on your evening.", "Family [wants|needs] you; your schedule does too."],
  home: ["Home has two [agendas|wishes] for the same evening.", "Two ideas of tonight, one evening to share.", "At home, [a wish|an arrangement] has to give.", "Rest or outings? Home may want both.", "A [minor|brief] home standoff you can settle."],
  plans: ["Your bigger aim [collides|competes] with the rush.", "One [big|major] plan may need a new route.", "A test of which plans are worth holding.", "Urgent [errands|requests] tug at your biggest goal.", "A bigger plan meets a new fact."],
};

export const CLASH_AGENCY: Pool = {
  work: [
    "Tell a colleague [plainly|straight] what you've been meaning to say.",
    "Move one meeting or deadline [by lunch|this morning], and say why.",
    "List the two biggest [requests|demands] at work and push one to tomorrow.",
    "Reply to the overlapping invite with a new time.",
    "Tell your [manager|team] which of two tasks you'll finish first.",
  ],
  family: [
    "Call the relative whose [plans overlap|schedule overlaps] with yours and settle it.",
    "Tell your family what you can manage this week.",
    "Offer one relative a specific time that [suits|fits] you.",
    "Send one family message that says what you can offer.",
    "Put one family date in the [calendar|diary] that suits you both.",
  ],
  home: [
    "[Check|Find out] at breakfast what everyone wants from tonight.",
    "Suggest a middle way for tonight [while views are still loose|ahead of any standoff].",
    "Put the question to whoever shares your evenings: which plan counts most?",
    "Tell [the household|everyone at home] one wish for tonight, by noon.",
    "Give way on one minor point at home without [keeping score|counting].",
  ],
  plans: [
    "Block thirty minutes for the [goal|project] that matters most.",
    "Write down one plan you're ready to change, and how.",
    "Tell [a friend|a colleague] about the goal you're adjusting.",
    "Guard one half hour for your [biggest|dearest] aim.",
    "Write down what changed, and what your [plan|project] does next.",
  ],
};

export const PUNISHMENT_BODIES: Pool = {
  work: [
    "A familiar irritation at work may [return|resurface]: the same delay, the same misunderstanding. [Name it|Say it] out loud once and it often loses its grip.",
    "A work [issue|problem] that nags may nag again. Fixing the cause, even roughly, beats [dodging|sidestepping] it one more time.",
    "An old sore point with a colleague or a process may flare [up|again]. Contain it by dealing with it directly and briefly.",
    "A process that always trips you up may do it again. Note exactly where it [snags|sticks], so the fix is easy to [request|raise].",
    "The same misunderstanding at work may repeat. Say it back in your own words once, and it's far less likely to [return|recur].",
  ],
  family: [
    "A familiar family friction may [circle back|return]: the same comment, the same tone. Noticing the pattern [draws|pulls] most of the sting out of it.",
    "An old family sore point may get pressed. Answer as the person you are now, and let the [years-old|old] version of the argument rest.",
    "Family habits may grate, [familiar as ever|in the usual way]. You don't have to fix them; just decide how you'll respond [in advance|ahead of time].",
    "An old family pattern may play out again, familiar lines and all. [Stepping out of|Dropping] your usual part changes the scene more than arguing does.",
    "A family niggle that never quite goes away may surface. Treat it lightly; it rarely needs [solving on the spot|an answer right away].",
  ],
  home: [
    "A recurring friction at home may [show up again|resurface]: the dishes, the timing, the same remark. Talk kindly about the pattern itself, and the next round [gets smaller|shrinks].",
    "A minor snag at home may [nag|rub], like a stone in your shoe. Stop and tip it out: one honest conversation beats a week of limping.",
    "An old household niggle may [return|resurface]. Laughing about it [together|as a pair] usually [beats|does more than] winning it.",
    "A familiar issue at home may crop up again. Swap roles on it for [an evening|a night] and see if it eases.",
    "A home routine that chafes may rub again. Change one [part|step] of it instead of the whole [setup|arrangement].",
  ],
  plans: [
    "A recurring setback may [resurface|return] in your [bigger|far-reaching] plans. A [modest|minor] fix to the plan often clears it faster than a bigger push.",
    "The same obstacle may block a bigger goal again. Look at why it [returns|recurs]; the answer is usually simpler than the workaround.",
    "A slow, nagging problem in [a project|your venture] may itch. Deal with it while it's [minor|still minor] and you're paying attention.",
    "Progress on a distant goal may hit the same wall again. Try a side door: a different [hour|time], a different helper, a [smaller|shorter] step.",
    "A familiar stall may return to a bigger plan. Notice what usually [happens|occurs] just ahead of it; that's the [step|habit] to change.",
  ],
};

export const PUNISHMENT_HEADLINES: Pool = {
  work: ["The same snag at work, one more time.", "A work niggle that won't [stay quiet|settle].", "Time to fix the [step|part] that [snags|sticks].", "An old work habit trips you again.", "Break a [stale|tired] work loop."],
  family: ["A [sore|tender] family nerve, touched again.", "The family rerun you've seen [already|a hundred times].", "Family habits [rub|grate] again.", "An old family script, playing again.", "A family niggle, [minor|faint] as ever."],
  home: ["The same [gripe|quarrel] at home, again.", "A household niggle that wants fixing properly.", "Time to settle an old argument at home.", "Home's usual friction, one more round.", "A familiar rub at home."],
  plans: ["The same obstacle [on the road ahead|in your path].", "A recurring snag in the bigger plan.", "What [slows|stalls] your big plan again?", "Your [big|main] plan hits a familiar wall.", "A repeat stall on [what you're building|your project]."],
};

export const PUNISHMENT_AGENCY: Pool = {
  work: [
    "Write down the [repeat|recurring] snag at work, and one way to end it.",
    "Fix one recurring annoyance at work by noon.",
    "Raise the nagging issue with the one [colleague|person] who can change it.",
    "[Check with|Consult] a colleague about fixing the step that [fails|breaks].",
    "Write one line in a shared doc that [ends|settles] a repeat question.",
  ],
  family: [
    "Decide one calm reply to the family comment you always hear.",
    "Call one relative and [stick to easy topics|chat about easy topics].",
    "Go for a [short|brisk] walk after any family call that stings.",
    "Answer the usual family question in a new way.",
    "Set aside five quiet minutes [ahead of|prior to] any family call.",
  ],
  home: [
    "Agree on one house rule that settles an old argument.",
    "[Lift|Clear] one chore off someone's plate unprompted.",
    "Say sorry first about the [minor gripe|petty point], even if it's half yours.",
    "Try tonight's chores in a different order.",
    "Leave a kind note about the gripe that [returns|recurs].",
  ],
  plans: [
    "Write down the one obstacle that [recurs|returns], and one fix.",
    "Spend twenty minutes on the boring fix your plan [needs|has been waiting for].",
    "[Check with|Consult] an outsider on why the plan stalls.",
    "Try one new approach on the stage that [stalls|drags].",
    "Note when the plan last stalled, and why.",
  ],
};

export const HARM_BODIES: Pool = {
  work: [
    "Details at work can slip: a misread email, a number copied wrong. They're cheap to fix [now|this afternoon] and costly next week.",
    "Work may look smooth while a [detail|step] goes wrong underneath. A second look [at anything outgoing|ahead of sending] catches most of it.",
    "A quiet mix-up at work may grow if nobody names it. [Raise|Pose] the obvious question; it's rarely as obvious as it seems.",
    "A file, a date or a half-made promise may go astray at work. A quick checklist [as you close up|at the end of the shift] catches it.",
    "Work details may drift while the big picture looks [sound|healthy]. Spend five minutes on the fine print.",
  ],
  family: [
    "An old family habit may rub: a comment that lands wrong, a favour that feels like a duty. It stays minor if you deal with it [promptly|soon].",
    "Some distance or a misread message may creep into a family [bond|relationship]. Reaching out first, even briefly, stops it from settling in.",
    "A family bond may wear thin in [one spot|places], like a tap dripping overnight. Nothing breaks, and a kind word now saves a harder talk later.",
    "A message in the family may be read the wrong way. [Make|Write] it short and warm, and [check|confirm] rather than assume.",
    "A gap may open in the family without anyone meaning it. A quick call [closes|bridges] it sooner than a [lengthy|big] one later.",
  ],
  home: [
    "A misreading at home may go unnoticed: a tone taken the wrong way, a plan only one of you heard. Checking in [soon|by evening] stops it [turning|hardening] into a mood.",
    "A [faint|slight] strain may wear between you and whoever shares your space. Nothing dramatic; just the kind of [itch|gripe] that grows if it goes unsaid.",
    "Home may feel slightly off without a clear reason. [Check|Find out] rather than guess; the truth is often smaller than the worry.",
    "An arrangement at home may be heard two different ways. Say it once more, plainly, and [check|confirm] it landed.",
    "Irritations at home may pile up quietly. Name the first one gently, [while it's the only one|while it stands alone].",
  ],
  plans: [
    "A habit your bigger plans rest on may quietly [slip|wear thin]. Noticing it now is most of the fix.",
    "A cherished goal may lose ground without anyone noticing. A quick look at where it stands [holds the drift in check|stops the drift].",
    "A slow leak may be draining a [plan|project] you care about, with time or attention going elsewhere. Plug it gently rather than starting over.",
    "Time meant for your bigger goals may leak away in [scraps|crumbs]. Guard one block of it, however short.",
    "Your focus on the [bigger aim|distant goal] may slip. Re-reading why you started brings it back.",
  ],
};

export const HARM_HEADLINES: Pool = {
  work: ["Work looks smooth. Check underneath [first|anyway].", "A snag hides under a smooth workday.", "Slips at work, easy to catch [now|in time].", "Mind the [fine print|details] at work.", "Work's details want a second pass."],
  family: ["A quiet family friction worth catching [soon|in time].", "[Faint|Slight] wear in a family bond.", "A relative [could use|would welcome] a gentle check-in.", "A family message may land sideways.", "Close a [minor|narrow] family gap [soon|now]."],
  home: ["[A detail|One detail] is off at home. [Raise|Mention] it.", "A quiet misreading at home, easy to fix.", "Home [needs|could use] a [brief|short] check-in.", "A mix-up at home, quickly cleared.", "Quiet irritations at home, best named [soon|now]."],
  plans: ["A [far-reaching|big] plan springs a slow leak.", "Your bigger plan needs a quick check.", "[Slight|Quiet] drift in what you're building.", "Leaks in [the main plan|a big project].", "Remember why you started the [plan|project]."],
};

export const HARM_AGENCY: Pool = {
  work: [
    "Reread one [email|message] at work, then send it.",
    "Confirm one detail at work you've been assuming.",
    "Double-check the numbers on anything leaving your desk.",
    "[Check|Verify] one date or number you've been [taking|accepting] on trust.",
    "Tidy one loose end at work [by evening|ahead of logging off].",
  ],
  family: [
    "Answer the family message you've been leaving on read.",
    "Send a short, warm note to one relative.",
    "[Find out|Check] how one relative is really doing.",
    "Call one relative just to say hello.",
    "Send a photo or [note|voice message] to a relative you miss.",
  ],
  home: [
    "[Find out|Check] how the person you live with is really doing.",
    "Clear up one [niggle|stray chore] at home by bedtime.",
    "Say the [minor|quiet] gripe you've been holding back at home.",
    "Say tonight's plan out loud once, just to be sure.",
    "Name one [irritation|annoyance] that's been bothering you, kindly.",
  ],
  plans: [
    "Write down one [habit|resource] your bigger plan quietly depends on.",
    "Spend ten minutes checking where your biggest goal stands.",
    "Restart one [habit|routine] that moves a big goal along.",
    "Put one [modest|concrete] step toward a big goal on your list.",
    "Reread the note where you first wrote the plan down.",
  ],
};
