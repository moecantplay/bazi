/**
 * Today's first screen when nothing pulls on the chart and the day's character
 * leads, keyed by its English name. Everyday words only (VOICE.md rules 11 and
 * 13); the character's old name lives on its topic page. Each body is two
 * sentences, and the element's sentence always follows it.
 */

export const QUIET_BODIES: Record<string, readonly string[]> = {
  "Friend": [
    "The mood is calm and level, and [better|sweeter] in company. [Peers|Friends] in the same spot as you are the best help.",
    "A quiet stretch, best shared. [Any task|Any errand] done alongside a peer goes further than it would alone.",
    "Not much pulls at you. A friend, a sibling or a colleague makes the ordinary [parts|hours] better.",
  ],
  "Rob Wealth": [
    "A friendly rivalry runs under the calm. [A sibling|A peer] may be after the same prize as you, so [play it light|stay light-hearted].",
    "Quiet, with a competitive edge. Say what you're after plainly, so it doesn't turn into [silent jostling|elbowing].",
    "Credit and attention may feel scarce. Share them [generously|freely] and you lose nothing.",
  ],
  "Eating God": [
    "There's room for play. [Pursuits|Pastimes] done for the joy of it go well: cooking, making, tinkering.",
    "Light and easy. It rewards enjoying [yourself|the moment] [without counting|without a scorecard].",
    "Gentle and [a bit|slightly] indulgent. Make [a dish|a sketch|a gift] for the pleasure of it, and share it if you like.",
  ],
  "Hurting Officer": [
    "[There's space|There's room] to be inventive. You're likely to spot the shortcut others miss.",
    "Sharp and restless. Your ideas are [strong|sound]; how you say them decides whether they land.",
    "Some rule-bending is in the air. Improve [a process|a routine], and leave out the part about the old way being wrong.",
  ],
  "Indirect Wealth": [
    "Calm, with room for luck. Chances show up unplanned: an offer, a lead, a [lucky|happy] find.",
    "Happy accidents [are likely|are in the air]. Hold your plans loose enough to leave room for one.",
    "Easy going, with [a surprise|an unexpected turn] in it. Pay attention to the offer you almost ignore.",
  ],
  "Direct Wealth": [
    "Level going that suits [steady|careful] tasks. Plain, reliable effort pays off more than clever shortcuts.",
    "Practical and level. Tidy up the loose ends that quietly [cost|drain] you.",
    "The unglamorous task done well [pays|is rewarded]. Finish [one job|a task] rather than start [another|a new one].",
  ],
  "Seven Killings": [
    "Not much pulls from outside, though pressure may [build|rise] from within. Meeting demands one at a time builds strength.",
    "A demanding stretch. Pick the hardest [task|job] and do it first, while you're fresh.",
    "A lot is asked of you. You needn't meet all of it; choose what matters and let the rest wait.",
  ],
  "Direct Officer": [
    "Steady going, suited to doing it properly. Rules, routines and fair play [count|tip] in your favour.",
    "Order helps. Following the process, even the boring parts, saves trouble later.",
    "Reliability is rewarded. [Minor|Modest] promises kept now earn more trust than you'd think.",
  ],
  "Indirect Resource": [
    "Quiet, with room to think. Answers [arrive|turn up] sideways: a side conversation, a walk, a stray article.",
    "Learning [by your own route|your own way] pays off. Step away from a problem and it may solve itself.",
    "Calm and curious. [Follow|Chase] the odd question; it leads somewhere useful.",
  ],
  "Direct Resource": [
    "Care is close at hand. Help and advice reach you more easily.",
    "Gentle going. Care is on offer, so [accept|welcome] it without explaining why you don't need it.",
    "Soft and supportive. [An elder|A mentor] may offer help or wisdom; listen.",
  ],
};

export const QUIET_HEADLINES: Record<string, readonly string[]> = {
  "Friend": ["Calm, and better shared.", "[Fine|Easy] company is the point.", "Find your [crowd|allies]."],
  "Rob Wealth": ["Friendly rivalry in the air.", "[A friend|A rival] may want what you want.", "Rivalry, best held friendly."],
  "Eating God": ["Making for the fun of it.", "Enjoy [a treat|an hour] without counting.", "Play counts."],
  "Hurting Officer": ["Room for one clever workaround.", "Your best ideas [surface|show up].", "Sharp ideas, gentle delivery."],
  "Indirect Wealth": ["Lucky finds are close by.", "Leave room for a happy accident.", "[An unplanned offer|A surprise] may be worth a yes."],
  "Direct Wealth": ["Steady effort pays.", "Plain, useful tasks win out.", "Finish what's half-done."],
  "Seven Killings": ["Demands that build strength.", "Pressure you can use.", "[Tackle|Face] the hard [part|task] first."],
  "Direct Officer": ["Do it properly.", "Order [counts|tips] in your favour.", "Honour the minor promises."],
  "Indirect Resource": ["Learning sideways.", "Answers from odd angles.", "Let the answer find you."],
  "Direct Resource": ["Let yourself be looked after.", "Let [a friend|a relative] help you.", "Support is on offer."],
};

export const QUIET_AGENCY: Record<string, readonly string[]> = {
  "Friend": ["Invite a friend [along on|to join you for] one errand.", "Message [a friend|a peer] in the same boat as you.", "Eat lunch with [a colleague|a friend] instead of alone."],
  "Rob Wealth": ["Congratulate [a rival|a friend] on a win you wish were yours.", "Say out loud what you're hoping for this week.", "Split one treat or chore fairly, unprompted."],
  "Eating God": ["Make [a sketch|a snack|a playlist] just because you like making it.", "Cook [a meal|a treat] for [a friend|someone else] tonight.", "Spend half an hour on a hobby."],
  "Hurting Officer": ["Suggest one better way to do a routine task, [briefly|in a sentence or two].", "Write down the idea, then argue for it.", "Fix one [nuisance|annoyance] that's always bothered you."],
  "Indirect Wealth": ["Accept one unexpected invitation.", "[Walk|Travel] a different route and look around.", "Reply to the message you nearly ignored."],
  "Direct Wealth": ["Finish one task you've left at ninety percent.", "Sort one form or [admin task|piece of paperwork].", "Do the dull job first and enjoy the rest."],
  "Seven Killings": ["Do the task you're dreading [by noon|first thing].", "Say no to one demand that isn't yours.", "Break the biggest job into three [short|bite-sized] steps."],
  "Direct Officer": ["Finish one task exactly the way it's meant to be done.", "Arrive ten minutes ahead of time for one [meeting|appointment].", "Follow through on one [minor|modest] promise."],
  "Indirect Resource": ["Step away from the problem for an hour, then return.", "Read [an article|a chapter] outside your usual field.", "[Pose|Raise] an odd question in a meeting."],
  "Direct Resource": ["Accept one offer of help.", "Talk a decision over with [a friend|a mentor] you trust.", "Rest for twenty minutes without apologising."],
};
