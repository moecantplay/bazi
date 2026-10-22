/**
 * "What the day suits" on Today, in everyday words (VOICE.md rules 11 and 12):
 * each almanac day type as a plain heading, and what it favours, for the one
 * reason that explains the Watch chips. The old names live on topic pages.
 * Headings and reasons are pools stepped by day number (M24-11): the day type
 * follows the solar month as well as the day, so it has no fixed cycle to
 * count visits over.
 */

export const OFFICER_PLAIN: Record<string, { headings: readonly string[]; favours: string }> = {
  jian: { headings: ["A day for setting things up"], favours: "setting things up" },
  chu: { headings: ["A day for clearing out"], favours: "clearing out" },
  man: { headings: ["A day for sharing plenty"], favours: "sharing and gathering" },
  ping: { headings: ["An even, steady day"], favours: "keeping things level" },
  ding: { headings: ["A day for things to stay put"], favours: "settling things" },
  zhi: { headings: ["A day for following through"], favours: "following through" },
  po: { headings: ["A day for endings more than beginnings"], favours: "endings" },
  wei: { headings: ["A day to step carefully"], favours: "care over speed" },
  cheng: { headings: ["A day for bringing things together"], favours: "bringing things together" },
  shou: { headings: ["A day for collecting what's owed"], favours: "gathering in" },
  kai: { headings: ["A day for fresh starts"], favours: "starting things" },
  bi: { headings: ["A day for finishing and storing"], favours: "finishing over starting" },
};

/** {acts}: the Watch chips, lower-cased and joined ("commitments and moving"). */
export const WATCH_REASONS: Record<"unsettled" | "officer" | "plain", readonly string[]> = {
  unsettled: ["With plans {area} still moving, {acts} go better on a steadier day."],
  officer: ["Today favours {favours}, so {acts} can wait for another day."],
  plain: ["{Acts} sit better on another day."],
};

export const WATCH_AREA_PHRASE = {
  work: "at work",
  family: "in the family",
  home: "at home",
  plans: "in your bigger plans",
} as const;
