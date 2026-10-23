/**
 * M20-26: the fuller topic page from the M20-22 mockups, written
 * out for three topics so the owner can feel it in the app. Every other
 * topic keeps its current lines inside the new layout. Sources are noted per
 * entry (M20-22 R13); none of this text is rendered from the source fields.
 */

import type { Element } from "@daymaster/bazi-engine";

export interface DepthVariant {
  tagline: string;
  forYou: string;
  goodFor: readonly string[];
  holdOff: readonly string[];
}

export interface TopicDepth {
  /** Where this entry's meaning comes from; never rendered. */
  source: string;
  strong: DepthVariant;
  weak: DepthVariant;
  how: readonly string[];
  where: readonly (readonly [string, string])[];
  work: readonly [string, string, string];
  /** Replaces the page's name origin when the source adds to it. */
  nameOrigin?: string;
}

const STEADY_HOW = [
  "This kind of day rewards plain, unglamorous effort. The report that gets finished, the form that finally gets sent, the chore that's off the list for good. What you can point to at the end of the day counts for more than a clever plan.",
  "It usually goes wrong in one way: saying yes to everything because each thing looks small. By mid-afternoon the list is longer than when you started. The days like this that go well are the ones where you pick a few things and see them through.",
];

/** Keyed by topic key. */
export const TOPIC_DEPTH: Record<string, TopicDepth> = {
  "ten-god:Direct Wealth": {
    source:
      "Zi Ping Zhen Quan ch. 33 論財: 財喜根深，不宜太露 (rooted, unshowy effort); 有財旺生官者，身强… (strong self carries it); 蓋孤財不貴，佩印幫身 (weak self needs backing). Dropped: 爲妻妾 (gendered), 財 as money (VOICE rule 12).",
    strong: {
      tagline: "Plain effort, solid results.",
      forYou: "Today hands you plenty to deal with, and your chart has the strength to carry it. Steady work sticks today: what you finish tends to hold, and people notice who did it.",
      goodFor: ["Finishing what's nearly done", "Putting your name on solid work", "Routine tasks you've been dodging"],
      holdOff: ["Cutting corners to look quick"],
    },
    weak: {
      tagline: "Do less, finish it, take the help.",
      forYou: "Today hands you plenty to deal with: tasks, errands, other people's asks. Your chart runs on the lighter side, so a full plate weighs more than it looks. Steady work still pays off today, as long as you don't carry all of it alone.",
      goodFor: ["Finishing what's nearly done", "Asking for a hand early", "Doing fewer things properly"],
      holdOff: ["Taking on someone else's tasks", "Saying yes before you've checked your list"],
    },
    how: STEADY_HOW,
    where: [
      ["Work", "Finishing beats starting. Close out the task that's nearly done before you open anything new."],
      ["People", "Someone may lean on you. Pick one thing to help with and let the rest wait."],
      ["Home", "A good day for the chore you keep stepping around."],
    ],
    work: ["Pick three tasks and write them where you'll see them.", "Ask for help with the biggest one before lunch.", "When the three are done, stop taking on new work for the day."],
    nameOrigin:
      "The old calendars give each day a character from how the day's element relates to the element at the centre of your birth chart. There are ten of these characters, known as the ten gods; despite the name, each one describes a role. What this page says about this one follows The True Meaning of Zi Ping, an eighteenth-century handbook.",
  },
  "stage:Coming of Age": {
    source: "San Ming Tong Hui vol. 2 論五行旺相休囚死並寄生十二宮: 冠帶，萬物漸榮秀，如人具衣冠也.",
    strong: {
      tagline: "Speak up today. People are listening.",
      forYou: "Your chart moves through a twelve-step cycle, one step a day. Today is step three: past the shaky start, with being in charge still ahead.",
      goodFor: ["Putting your name to something", "Speaking up when it counts", "Owning a decision"],
      holdOff: ["Waiting for permission you don't need"],
    },
    weak: {
      tagline: "Speak up today. People are listening.",
      forYou: "Your chart moves through a twelve-step cycle, one step a day. Today is step three: past the shaky start, with being in charge still ahead.",
      goodFor: ["Putting your name to something", "Speaking up when it counts", "Owning a decision"],
      holdOff: ["Waiting for permission you don't need"],
    },
    how: [
      "Think of the week a new job starts to feel like yours. You know enough to have opinions, and people start to act on them. Things you say today tend to carry more weight than usual.",
      "That cuts both ways. A half-formed idea said with confidence gets remembered too. The days like this that go well are the ones where you say less, and mean all of it.",
    ],
    where: [
      ["Work", "Speak up in the meeting, or send the proposal you've been polishing."],
      ["People", "Someone may ask what you think. Give them a straight answer."],
      ["Home", "A good day to settle the decision that keeps getting put off."],
    ],
    work: ["Choose one thing to put your name on today.", "Say it once, clearly, to the person who decides.", "Write down what you agreed to, so it's easy to follow through tomorrow."],
    nameOrigin:
      "The old calendars follow the element at the centre of your birth chart through twelve stages, like a life from first steps to rest. Each day lands you on one of them. The Complete Guide to the Three Fates, a sixteenth-century handbook, calls this stage the point where things start to flourish. It is like a young person dressing as an adult for the first time.",
  },
  "interaction:six-clash:year": {
    source: "San Ming Tong Hui vol. 2 論衝擊: 相衝者，十二支戰擊之神，大概為凶 (mostly trouble, so the page spends its words on the remedy).",
    strong: {
      tagline: "Two family plans, one day. Choose early.",
      forYou: "",
      goodFor: ["Saying which plan moves", "Rescheduling early", "A call instead of a message"],
      holdOff: ["Promising both sides you'll be there", "Sorting it out over text"],
    },
    weak: {
      tagline: "Two family plans, one day. Choose early.",
      forYou: "",
      goodFor: ["Saying which plan moves", "Rescheduling early", "A call instead of a message"],
      holdOff: ["Promising both sides you'll be there", "Sorting it out over text"],
    },
    how: [
      "Expect two things to want the same slot: a family visit and a plan at home, a parent's request and someone else's. It tends to show up as friction you can see, out in the open.",
      "Left alone, it tends to settle in the least convenient way. Handled early, you get to choose what moves.",
    ],
    where: [
      ["Family", "A relative's plans may run into yours, or two relatives' plans into each other. Decide early which one gives way, and tell people before the day fills up."],
      ["Home & partner", "The person closest to you may feel squeezed too. Talk it through together before either of you says yes to anyone."],
      ["Work", "Mostly clear. Just don't book anything that pulls the family knot tighter."],
    ],
    work: ["Before noon, write down the two plans that clash.", "Pick the plan that moves, and break the news to the people involved yourself.", "Offer the other side a real date they can hold you to."],
    nameOrigin:
      "Every day carries one of twelve animal signs, and your birth chart holds four, one for each part of life. When today's sign sits directly opposite one of yours, the two pull against each other. The Complete Guide to the Three Fates calls these signs that strike each other, and counts them as mostly trouble. That is why this page spends its words on what to do about it.",
  },
};

/** Added to a sign-link page when the chart already holds the same clash (owner, 2026-10-10: say it straight). */
export const CLASH_ALREADY_IN_CHART =
  "To be straight with you: this one usually lands harder on you than on most people. Your birth chart already carries this same tug between those two parts of life.";

/** The twelve stages in plain words, with a height for the hill drawing (rise to full strength, fall to rest). */
export const STAGE_STEPS: Record<string, { label: string; height: number }> = {
  "Growth": { label: "Starting", height: 34 },
  "Bath": { label: "Open", height: 46 },
  "Coming of Age": { label: "Ready", height: 60 },
  "Taking Office": { label: "Capable", height: 74 },
  "Peak": { label: "Full strength", height: 88 },
  "Decline": { label: "Easing off", height: 74 },
  "Illness": { label: "Half speed", height: 58 },
  "Stillness": { label: "Pause", height: 44 },
  "Storage": { label: "Putting away", height: 34 },
  "Severance": { label: "Clean slate", height: 22 },
  "Conception": { label: "Idea forming", height: 26 },
  "Nurture": { label: "Growing quietly", height: 30 },
};

/** Problem and remedy in everyday words (Shen Feng Tong Kao 病藥說; M20-23 moves the math into the engine). */
export const SORE_SPOT_WORDS: Record<Element, { problem: string; problemChip: string; remedyChip: string; action: string }> = {
  wood: { problem: "getting pulled in too many directions", problemChip: "Pulled in too many directions", remedyChip: "Something new to grow", action: "start one small new thing and give it ten minutes" },
  fire: { problem: "running too hot", problemChip: "Running too hot", remedyChip: "Warm company", action: "spend an hour with someone who lifts you up" },
  earth: { problem: "getting stuck in a rut", problemChip: "Stuck in a rut", remedyChip: "A steady routine", action: "keep to your usual routine, even the dull parts" },
  metal: { problem: "being too hard on yourself", problemChip: "Too hard on yourself", remedyChip: "Clear limits", action: "set a clear limit: three things, written down, done before anything new" },
  water: { problem: "drifting and overthinking", problemChip: "Drifting and overthinking", remedyChip: "Time to think", action: "give yourself an hour to think it through before you decide" },
};

export const SORE_STATUS_LABEL = {
  neither: "Today: neither",
  eases: "Today brings what eases it",
  presses: "Today presses on it",
  both: "Today presses on it, and helps",
} as const;

export const TOPIC_CLOSING = "This describes how a day tends to lean; what it becomes is up to you.";
