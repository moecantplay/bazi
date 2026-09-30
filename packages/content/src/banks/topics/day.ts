/**
 * Topic pages for the day-level facts (M20-21 R11): the day's character, its
 * element, your pace, the hours and the small signs. Plain first; each page
 * then gives the old name once and where it comes from.
 */

export const TEN_GOD_TOPICS: Record<string, { how: string; work: string }> = {
  "Friend": { how: "People in the same position as you, peers and siblings, are the best company today. Shared work goes further than solo effort.", work: "Pair up on something you'd normally do alone." },
  "Rob Wealth": { how: "A friendly competitive edge runs through the day: someone near you may want the same thing, the same credit or the same slot. It's rivalry, not hostility.", work: "Say out loud what you're after, so it doesn't turn into quiet jostling." },
  "Eating God": { how: "Work done for the joy of it goes well: cooking, making, playing. The day rewards enjoying things without keeping score.", work: "Make something small just because you like making it." },
  "Hurting Officer": { how: "You're sharp and a little rule-bending today, quick to spot what could be done better.", work: "Offer the better way, and leave out the part about the old way being wrong." },
  "Indirect Wealth": { how: "Chances show up unplanned: an offer, a lead, a lucky find. They reward attention more than planning.", work: "Say yes to one unexpected invitation." },
  "Direct Wealth": { how: "Plain, steady effort pays off today, more than bright ideas or shortcuts.", work: "Finish the task that's nearly done before you start a new one." },
  "Seven Killings": { how: "The day brings pressure: demands, deadlines, people who expect a lot. Met one at a time, it builds strength.", work: "Take on the hardest thing first, and let one lesser demand wait." },
  "Direct Officer": { how: "Order, fairness and doing things properly work in your favour today. Shortcuts cost more than they save.", work: "Keep one small promise exactly as you made it." },
  "Indirect Resource": { how: "Answers come sideways today: from a side conversation, a walk, an article you didn't mean to read.", work: "Step away from the problem for an hour and let it come back to you." },
  "Direct Resource": { how: "Care and help reach you more easily: advice, support, someone looking out for you.", work: "Accept the help that's offered without explaining why you don't need it." },
};

export const TEN_GOD_NAME_ORIGIN =
  "The old calendars give each day a character from how the day's element relates to the element at the centre of your birth chart. There are ten of these characters, known as the ten gods, though they describe roles, not deities.";

export const QUIET_FOR_YOU = "None of today's signs pull on your birth chart, so the day's character leads.";

export const ELEMENT_TOPIC = {
  suits: {
    forYou: (element: string) => `Your birth chart runs better with more ${element}, and today brings it.`,
    work: "Use the easier footing for something you've been putting off.",
  },
  against: {
    forYou: (element: string) => `Your birth chart already has plenty of what ${element} brings, so today can feel like a bit much.`,
    work: "Go a little softer than usual, and save bigger pushes for another day.",
  },
} as const;

export const ELEMENT_NAME_ORIGIN =
  "The old calendars sort everything into five elements: Wood, Fire, Earth, Metal and Water. Your birth chart runs better with more of some and less of others, and each day brings one.";

export const STAGE_WORK: Record<string, string> = {
  "Growth": "Start small, and let the new thing find its feet.",
  "Bath": "Be a little choosy about whose opinions you take in today.",
  "Coming of Age": "Put your name to something you've been holding back.",
  "Taking Office": "Take on the task that needs someone capable.",
  "Peak": "Spend today's drive on the one thing that matters most, and leave something for tomorrow.",
  "Decline": "Finish things rather than start them.",
  "Illness": "Cut the list down instead of pushing through it.",
  "Stillness": "Let decisions wait a day if they can.",
  "Storage": "Put one thing away properly.",
  "Severance": "Clear away one thing that's finished.",
  "Conception": "Write the idea down before it's ready.",
  "Nurture": "Keep tending the quiet project; it's growing.",
};

export const STAGE_NAME_ORIGIN =
  "The old calendars follow the element at the centre of your birth chart through twelve stages, like a life from first shoots to rest. Each day lands you on one of them.";

export const HOURS_TOPIC = {
  how: "Plans made in the easy window tend to settle without a fuss. In the rough window, small things jostle.",
  work: ["Put the conversation that matters in the easy window.", "Keep the rough window for routine work."],
  nameOrigin: "The day splits into twelve two-hour blocks, each with its own animal sign. One block pulls with today's sign and one pulls against it; the old almanacs call them the day's lucky and unlucky hours.",
};

export const STAR_LINES: Record<string, string> = {
  "tianyi-nobleman": "Help tends to appear when you ask for it. Ask.",
  "tiande-virtue": "Trouble tends to shrink near you today.",
  "tiande-companion": "Kindness you give tends to come back.",
  "yuede-virtue": "A gentle run of goodwill surrounds you.",
  "taiji-nobleman": "Big questions feel close. Give them a quiet half hour.",
  "wenchang-scholar": "Reading, writing and study come easier.",
  "lushen-emolument": "Effort turns into something you can keep.",
  "jiangxing-general": "Others may look to you to make the call. Have an opinion ready.",
  "huagai-canopy": "Time alone pays off today.",
  "yima-travel-horse": "A change of scene helps, even a short one.",
  "taohua-peach-blossom": "You get noticed more than usual.",
  "hongluan-phoenix": "Connection comes more easily today.",
  "tianxi-joy": "Small good news is likelier. Share it.",
  "hongyan-charm": "Warmth works better than argument today.",
  "yangren-blade": "Your will is strong today. Point it at one thing so it doesn't cut the wrong way.",
  "feiren-flying-blade": "Rushing causes small cuts. Slow down the fast parts.",
  "zaisha-calamity": "Small bumps are likelier. Allow a little extra time.",
  "sangmen-mourning": "Old sadness may surface. Be gentle with it.",
  "kongwang-void": "Plans may land lighter than you booked them. Keep expectations loose.",
};

export const STARS_NAME_ORIGIN =
  "The old calendars mark some days with small signs, called stars. Each points to one kind of luck, care or caution, and a day can carry several.";
