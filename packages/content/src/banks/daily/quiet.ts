/**
 * Today's first screen when nothing pulls on the chart and the day's character
 * leads, keyed by its English name. Everyday words only (VOICE.md rules 11 and
 * 13); the character's old name lives on its topic page. Each body is two
 * sentences, and the element's sentence always follows it.
 */

export const QUIET_BODIES: Record<string, readonly string[]> = {
  "Friend": [
    "The day is calm and level, and better in company. People in the same spot as you are the best help.",
    "A quiet day, best shared. Doing something alongside a peer goes further than doing it alone.",
    "Little pulls at you today. A friend, a sibling or a colleague makes the ordinary parts better.",
  ],
  "Rob Wealth": [
    "A calm day with a friendly rivalry in it. Someone close may be after the same thing you are, so keep it light.",
    "A quiet day with a competitive edge. Say what you're after plainly, so it doesn't turn into quiet jostling.",
    "The day is even, but credit and attention may feel scarce. Share them generously and you lose nothing.",
  ],
  "Eating God": [
    "A calm day that leaves room for play. Things done for the joy of it go well: cooking, making, tinkering.",
    "A light, easy day. It rewards enjoying things without keeping score.",
    "The day is gentle and a little indulgent. Make something for the pleasure of it, and share it if you like.",
  ],
  "Hurting Officer": [
    "The day leaves space to be inventive. You're likely to spot the shortcut others miss.",
    "A sharp, restless day. Your ideas are good; how you say them decides whether they land.",
    "The day invites a little rule-bending. Improve something, and leave out the part about the old way being wrong.",
  ],
  "Indirect Wealth": [
    "A calm day with room for luck. Chances show up unplanned: an offer, a lead, a lucky find.",
    "A day for happy accidents. Keep your plans loose enough to leave room for one.",
    "The day is easy, with something unexpected in it. Pay attention to the offer you almost ignore.",
  ],
  "Direct Wealth": [
    "An even day that suits steady work. Plain, reliable effort pays off more than clever shortcuts.",
    "A practical, level day. Tidy up the loose ends that quietly cost you.",
    "The day rewards the unglamorous task done well. Finish something rather than start something.",
  ],
  "Seven Killings": [
    "Little pulls from outside today, but pressure may come from within. Meeting demands one at a time builds strength.",
    "A demanding day. Pick the hardest thing and do it first, while you're fresh.",
    "The day asks a lot. You needn't meet all of it; choose what matters and let the rest wait.",
  ],
  "Direct Officer": [
    "A steady day that suits doing things properly. Rules, routines and fair play work in your favour.",
    "An orderly day. Following the process, even the boring parts, saves trouble later.",
    "The day rewards being reliable. Small promises kept now earn more trust than you'd think.",
  ],
  "Indirect Resource": [
    "A quiet day that leaves room to think. Answers come sideways: a side conversation, a walk, a stray article.",
    "A day for learning by your own route. Step away from a problem and it may solve itself.",
    "The day is calm and curious. Follow the odd question; it leads somewhere useful.",
  ],
  "Direct Resource": [
    "A calm day with room to be cared for. Help and advice reach you more easily.",
    "A gentle day. Care is on offer, so take it without explaining why you don't need it.",
    "The day is soft and supportive. Someone may offer help or wisdom; listen.",
  ],
};

export const QUIET_HEADLINES: Record<string, readonly string[]> = {
  "Friend": ["A calm day, better shared.", "Good company is the point today.", "Find your people today."],
  "Rob Wealth": ["Friendly rivalry runs through the day.", "Someone may want what you want.", "Keep today's rivalry friendly."],
  "Eating God": ["A day for making things for fun.", "Enjoy something without counting.", "Play counts today."],
  "Hurting Officer": ["A quiet day with room for one clever workaround.", "Your best ideas come out today.", "Sharp ideas, gentle delivery."],
  "Indirect Wealth": ["A day for lucky finds.", "Leave room for a happy accident.", "Something unplanned may be worth a yes."],
  "Direct Wealth": ["Steady effort pays today.", "A day for plain, useful work.", "Finish what's half-done."],
  "Seven Killings": ["A demanding day that builds strength.", "Pressure you can use.", "Take on the hard thing first."],
  "Direct Officer": ["A day for doing things properly.", "Order works in your favour.", "Keep your word on the small things."],
  "Indirect Resource": ["Good for learning sideways.", "Answers come from odd angles today.", "Let the problem come to you."],
  "Direct Resource": ["A day to be looked after.", "Let someone help you today.", "Support is on offer."],
};

export const QUIET_AGENCY: Record<string, readonly string[]> = {
  "Friend": ["Ask a friend to do one errand or task with you.", "Message someone in the same boat as you.", "Eat lunch with someone instead of alone."],
  "Rob Wealth": ["Congratulate someone on a win you wish were yours.", "Say out loud what you're hoping for this week.", "Split one thing fairly before anyone asks."],
  "Eating God": ["Make something small just because you like making it.", "Cook something for someone else tonight.", "Spend half an hour on a hobby."],
  "Hurting Officer": ["Suggest one better way to do a routine task, and keep it short.", "Write down the idea before you argue for it.", "Fix one small thing that's always bothered you."],
  "Indirect Wealth": ["Say yes to one unexpected invitation.", "Take a different route today and look around.", "Reply to the message you nearly ignored."],
  "Direct Wealth": ["Finish one task you've left at ninety percent.", "Sort one form or admin task today.", "Do the dull job first and enjoy the rest."],
  "Seven Killings": ["Do the task you're dreading before noon.", "Say no to one demand that isn't yours.", "Break the biggest job into three small steps."],
  "Direct Officer": ["Finish one task exactly the way it's meant to be done.", "Show up early to one thing today.", "Follow through on one small promise."],
  "Indirect Resource": ["Step away from the problem for an hour and come back.", "Read something outside your usual field.", "Ask an odd question in a meeting."],
  "Direct Resource": ["Accept one offer of help today.", "Ask someone you trust for advice.", "Rest for twenty minutes without apologising."],
};
