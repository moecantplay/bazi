/**
 * Core value types for the Daymaster BaZi engine.
 *
 * A BaZi chart is built from Heavenly Stems (天干) and Earthly Branches (地支).
 * M1 covers only these primitive types plus the pillar they combine into;
 * derived chart-level types (hidden stems, ten gods, luck pillars) arrive in M2.
 */

/** The ten Heavenly Stems (天干), in canonical order 甲…癸. */
export type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

/** The twelve Earthly Branches (地支), in canonical order 子…亥. */
export type Branch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

/** The five Chinese elements (五行). */
export type Element = "wood" | "fire" | "earth" | "metal" | "water";

/** Yin/Yang polarity (阴阳). */
export type Polarity = "yang" | "yin";

/** A single pillar (柱): one stem paired with one branch. */
export interface Pillar {
  stem: Stem;
  branch: Branch;
}

/**
 * How to treat a birth in the "late zi" hour (23:00–23:59:59 local).
 * - `"midnight"`: the day pillar flips at local midnight (the zi hour that
 *   begins at 23:00 still belongs to the current civil day).
 * - `"shift-day"`: a 23:00–23:59:59 birth is assigned the NEXT day's pillar.
 */
export type LateZiHour = "midnight" | "shift-day";

/** Engine configuration knobs affecting day/hour boundaries. */
export interface EngineConfig {
  lateZiHour: LateZiHour;
  /**
   * When true, day/hour boundaries use apparent solar time at the birth
   * location (longitude correction + equation of time) instead of civil
   * clock time. Requires a longitude to be supplied to day/hour functions.
   */
  trueSolarTime: boolean;
}

/** Default engine configuration: civil midnight boundary, no true solar time. */
export const DEFAULT_CONFIG: EngineConfig = {
  lateZiHour: "midnight",
  trueSolarTime: false,
};

/** One month-boundary solar term (jié) instant embedded in the data table. */
export interface SolarTermEntry {
  /** Term name, e.g. 立春. */
  name: string;
  /** Target apparent ecliptic longitude of the sun, in degrees. */
  longitude: number;
  /** Exact instant of the term as an ISO-8601 UTC timestamp. */
  iso: string;
}

/** Biological sex, used only to determine luck-pillar direction. */
export type Sex = "male" | "female";

/** A slot a branch can occupy: the four natal palaces plus transit palaces. */
export type Palace =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "luck"
  | "annual"
  | "monthly"
  | "daily";

/** A branch tagged with the palace it sits in. */
export interface PalacedBranch {
  branch: Branch;
  palace: Palace;
}

/** A Ten God (十神) relationship label. */
export interface TenGod {
  chinese: string;
  english: string;
}

/** Kinds of branch interaction the engine detects. */
export type InteractionType = "six-combine" | "six-clash" | "trine" | "punishment" | "harm";

interface InteractionBase {
  type: InteractionType;
  /** Participating branches (reference-table order) and their palaces, aligned. */
  branches: Branch[];
  palaces: Palace[];
}

export interface CombineInteraction extends InteractionBase {
  type: "six-combine";
}
export interface ClashInteraction extends InteractionBase {
  type: "six-clash";
}
export interface HarmInteraction extends InteractionBase {
  type: "harm";
}
export interface TrineInteraction extends InteractionBase {
  type: "trine";
  element: Element;
  /** `"full"` = all three branches present; `"half"` = exactly two of three. */
  completeness: "full" | "half";
}
export interface PunishmentInteraction extends InteractionBase {
  type: "punishment";
  kind: "mutual" | "self";
}

/** Any detected branch interaction. */
export type Interaction =
  | CombineInteraction
  | ClashInteraction
  | HarmInteraction
  | TrineInteraction
  | PunishmentInteraction;

/** Day-master strength verdict with the scores behind it. */
export interface StrengthResult {
  value: "strong" | "weak";
  /** Weighted count of elements that support the day master. */
  supporterScore: number;
  /** Weighted count of elements that drain the day master. */
  drainerScore: number;
  /** 得令 — whether the month branch's element supports the day master. */
  seasonalSupport: boolean;
  /** 得地 — whether the day master has a same-element root in any branch's hidden stems. */
  rooted: boolean;
  /** 得勢 — whether supporters are the strict majority of the other visible stems. */
  backed: boolean;
}

/** One of the twelve life stages (十二長生), e.g. 長生 "Growth". */
export interface LifeStage {
  chinese: string;
  english: string;
}

/** The two life stages a pillar displays. */
export interface PillarLifeStages {
  /** The day master's stage at this pillar's branch. */
  dayMaster: LifeStage;
  /** The pillar stem's own stage at its own branch (自坐). */
  self: LifeStage;
}

/** Life stages for every natal pillar; `hour` is null for unknown-time charts. */
export interface ChartLifeStages {
  year: PillarLifeStages;
  month: PillarLifeStages;
  day: PillarLifeStages;
  hour: PillarLifeStages | null;
}

/** A pillar's Na Yin (納音) melodic element. */
export interface NaYin {
  chinese: string;
  english: string;
  element: Element;
}

/** Na Yin for every natal pillar; `hour` is null for unknown-time charts. */
export interface ChartNaYin {
  year: NaYin;
  month: NaYin;
  day: NaYin;
  hour: NaYin | null;
}

/** One symbolic star (神煞) landing on a pillar. */
export interface ShenshaHit {
  /** Stable machine key, e.g. "wenchang-scholar". */
  key: string;
  chinese: string;
  english: string;
  /** The pillar the star lands on. */
  palace: Palace;
}

/** The exact luck-pillar starting offset after birth (3 days = 1 year rule). */
export interface LuckStart {
  years: number;
  months: number;
  days: number;
  /** ISO calendar date (local to the birth zone) the first pillar takes effect. */
  startISO: string;
}

/** One 10-year luck pillar (大运). */
export interface LuckPillar {
  pillar: Pillar;
  /** Age (whole years, floored) at which the pillar takes effect. */
  startAge: number;
  /** Gregorian calendar year in which the pillar takes effect. */
  startYear: number;
}

/** Input echoes carried on the chart for downstream (transit) computation. */
export interface ChartMeta {
  zone: string;
  sex: Sex;
  hourKnown: boolean;
  config: EngineConfig;
}

/** Input to {@link computeChart}. */
export interface ChartInput {
  instant: Date;
  zone: string;
  sex: Sex;
  /** When false, the hour pillar and everything derived from it are omitted. */
  hourKnown: boolean;
  longitude?: number;
  config?: EngineConfig;
}

/** Hidden stems per pillar; `hour` is null for an unknown-time chart. */
export interface ChartHiddenStems {
  year: Stem[];
  month: Stem[];
  day: Stem[];
  hour: Stem[] | null;
}

/** Ten gods of each visible non-day stem vs the day master. */
export interface ChartTenGods {
  year: TenGod;
  month: TenGod;
  hour: TenGod | null;
}

/** A fully derived natal chart. */
export interface Chart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  dayMaster: Stem;
  hiddenStems: ChartHiddenStems;
  tenGods: ChartTenGods;
  /** Counts of visible stem elements plus branch elements (hour only if known). */
  fiveElementCounts: Record<Element, number>;
  strength: StrengthResult;
  favorableElements: Element[];
  interactions: Interaction[];
  lifeStages: ChartLifeStages;
  naYin: ChartNaYin;
  /** Symbolic stars landing on the natal pillars. */
  shensha: ShenshaHit[];
  /** 胎元, the conception pillar derived from the month pillar. */
  taiYuan: Pillar;
  luckPillars: LuckPillar[];
  /** Exact offset after birth when the first luck pillar takes effect. */
  luckStart: LuckStart;
  meta: ChartMeta;
}
