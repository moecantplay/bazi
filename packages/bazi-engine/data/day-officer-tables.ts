/**
 * The Twelve Day Officers (建除十二神) and their activity leanings.
 *
 * Sequence and rule per standard Tong Shu (通書) almanac convention, descending
 * from the Qing imperial compendium 協紀辨方書 (1741): the officer of a day is
 * the day's earthly branch measured from the month branch — the day whose
 * branch equals the month branch is 建, and the cycle 建除滿平定執破危成收開閉
 * advances one officer per day. Because the month branch itself advances at
 * each jié, the officer repeats on the boundary day (the classical rule falls
 * out of the arithmetic; asserted in tests).
 *
 * Cross-checked 2026-07-08 against:
 * - wonyanconsult.com/post/navigating-the-12-day-officers-in-the-chinese-almanac-tong-shu
 *   (per-officer activity guidance)
 * - fourpillars.pro/articles/45 (值神 sequence + month/day branch rule)
 * - Sinarmas printed almanac, page for 2026-06-21 (丙寅 day in a 甲午 month =
 *   成): lists Engagement, Wedding, Grand Opening, Trading, Start Learning,
 *   Moving, Travelling as favourable — matching 成 below (golden test).
 *
 * Per-officer 宜/忌 lists vary by almanac publisher. This table keeps a
 * conservative common core — only leanings the sources above agree on — and is
 * flagged as interpretive in PROGRESS.md. Activity keys are the classical
 * almanac categories this app models; publisher categories outside daily-app
 * scope (burial, worship, stove set-up, fishing, hunting) are deliberately
 * unmodelled.
 */

/** A classical almanac activity category, keyed for modern surfaces. */
export interface ActivityDefinition {
  /** Stable key used by content/web for labels and glosses. */
  key: ActivityKey;
  /** Classical category name as printed in a Tong Shu. */
  chinese: string;
  /** Literal English rendering of the classical category. */
  classical: string;
}

export type ActivityKey =
  | "commit"
  | "launch"
  | "sign"
  | "move"
  | "travel"
  | "study"
  | "clear"
  | "rest"
  | "ask"
  | "gather";

export const ACTIVITIES: readonly ActivityDefinition[] = [
  { key: "commit", chinese: "嫁娶", classical: "marriage and betrothal" },
  { key: "launch", chinese: "開市", classical: "opening a business" },
  { key: "sign", chinese: "立券交易", classical: "contracts and trading" },
  { key: "move", chinese: "移徙", classical: "moving house" },
  { key: "travel", chinese: "出行", classical: "setting out on a journey" },
  { key: "study", chinese: "入學", classical: "starting studies" },
  { key: "clear", chinese: "破屋壞垣", classical: "demolition and clearing" },
  { key: "rest", chinese: "安床", classical: "setting up the bed" },
  { key: "ask", chinese: "上官赴任", classical: "assuming a post" },
  { key: "gather", chinese: "會親友", classical: "meeting friends and kin" },
];

export const ACTIVITY_KEYS: readonly ActivityKey[] = ACTIVITIES.map(
  (activity) => activity.key,
);

/** One of the twelve officers, with its conservative 宜/忌 core. */
export interface DayOfficerDefinition {
  /** Pinyin key, stable for content/web lookups. */
  key: string;
  chinese: string;
  english: string;
  /** 宜 — activities the almanac tradition favours on this officer's day. */
  favors: readonly ActivityKey[];
  /** 忌 — activities the tradition counsels postponing. */
  avoids: readonly ActivityKey[];
}

/**
 * Officers in cycle order; index 0 (建) is the day whose branch equals the
 * month branch.
 */
export const DAY_OFFICERS: readonly DayOfficerDefinition[] = [
  {
    key: "jian",
    chinese: "建",
    english: "Establish",
    favors: ["ask", "travel", "study"],
    avoids: ["clear"],
  },
  {
    key: "chu",
    chinese: "除",
    english: "Remove",
    favors: ["clear", "rest"],
    avoids: [],
  },
  {
    key: "man",
    chinese: "滿",
    english: "Full",
    favors: ["gather", "sign", "launch"],
    avoids: [],
  },
  {
    key: "ping",
    chinese: "平",
    english: "Balance",
    favors: ["sign", "gather"],
    avoids: [],
  },
  {
    key: "ding",
    chinese: "定",
    english: "Stable",
    favors: ["commit", "launch", "study"],
    avoids: [],
  },
  {
    key: "zhi",
    chinese: "執",
    english: "Hold",
    favors: ["sign", "launch"],
    avoids: [],
  },
  {
    key: "po",
    chinese: "破",
    english: "Break",
    favors: ["clear"],
    avoids: ["commit", "launch", "sign", "move", "travel", "gather"],
  },
  {
    key: "wei",
    chinese: "危",
    english: "Danger",
    favors: ["rest"],
    avoids: ["travel"],
  },
  {
    key: "cheng",
    chinese: "成",
    english: "Success",
    favors: ["commit", "launch", "sign", "move", "travel", "study", "gather"],
    avoids: ["clear"],
  },
  {
    key: "shou",
    chinese: "收",
    english: "Receive",
    favors: ["sign", "study", "ask"],
    avoids: [],
  },
  {
    key: "kai",
    chinese: "開",
    english: "Open",
    favors: ["launch", "gather", "study", "move"],
    avoids: ["clear"],
  },
  {
    key: "bi",
    chinese: "閉",
    english: "Close",
    favors: ["rest"],
    avoids: ["commit", "launch", "move", "travel"],
  },
];

/**
 * Which natal-branch relations shift which activities, and by how much. The
 * personal layer on top of the officer base; interpretive, one school —
 * documented alongside the scoring in src/day-quality.ts.
 */
export type BranchRelationModifier = Partial<Record<ActivityKey, number>>;

/**
 * A transit day whose branch clashes your natal day branch is your personal
 * breaker day (日破): classical date selection sets aside major undertakings,
 * hardest on the home palace. Endings (clear) are unaffected.
 */
export const DAY_BREAKER_MODIFIER: BranchRelationModifier = {
  commit: -2,
  launch: -2,
  sign: -2,
  move: -2,
  travel: -1,
  study: -1,
  ask: -1,
  gather: -1,
  rest: -1,
};

/** A transit branch combining (六合) your natal day branch eases the home palace. */
export const DAY_COMBINE_MODIFIER: BranchRelationModifier = {
  commit: 1,
  gather: 1,
  rest: 1,
};

/** A clash on the career palace (natal month branch) unsettles work moves. */
export const CAREER_CLASH_MODIFIER: BranchRelationModifier = {
  launch: -1,
  sign: -1,
  ask: -1,
};

/** A clash on the roots (natal year branch) unsettles ground moves. */
export const ROOTS_CLASH_MODIFIER: BranchRelationModifier = {
  move: -1,
  travel: -1,
};
