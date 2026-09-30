/**
 * "What the day suits" on Today, in everyday words (VOICE.md rules 11 and 12):
 * each almanac day type as a plain heading, and what it favours, for the one
 * reason that explains the Watch chips. The old names live on topic pages.
 */

export const OFFICER_PLAIN: Record<string, { heading: string; favours: string }> = {
  jian: { heading: "A day for setting things up", favours: "setting things up" },
  chu: { heading: "A day for clearing out", favours: "clearing out" },
  man: { heading: "A day for sharing plenty", favours: "sharing and gathering" },
  ping: { heading: "An even, steady day", favours: "keeping things level" },
  ding: { heading: "A day for things to stay put", favours: "settling things" },
  zhi: { heading: "A day for following through", favours: "following through" },
  po: { heading: "A day for endings more than beginnings", favours: "endings" },
  wei: { heading: "A day to step carefully", favours: "care over speed" },
  cheng: { heading: "A day for bringing things together", favours: "bringing things together" },
  shou: { heading: "A day for collecting what's owed", favours: "gathering in" },
  kai: { heading: "A day for fresh starts", favours: "starting things" },
  bi: { heading: "A day for finishing and storing", favours: "finishing over starting" },
};

/** {acts}: the Watch chips, lower-cased and joined ("commitments and moving"). */
export const WATCH_REASONS = {
  unsettled: "With plans {area} still moving, {acts} go better on a steadier day.",
  officer: "Today favours {favours}, so {acts} can wait for another day.",
  plain: "{Acts} sit better on another day.",
} as const;

export const WATCH_AREA_PHRASE = {
  work: "at work",
  family: "in the family",
  home: "at home",
  plans: "in your bigger plans",
} as const;
