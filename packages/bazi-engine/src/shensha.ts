/**
 * Shensha (神煞, symbolic stars): classical table-lookup stars keyed off the
 * day stem, the year/day branches, the month branch, or the day pillar's
 * sexagenary decade. Rules live in data/shensha-tables.ts with sources.
 *
 * A star rule produces one or more marks (a branch, or for 天德/月德 sometimes
 * a stem); the star lands on every supplied pillar showing that mark. Pass the
 * natal pillars for a chart, or a transit pillar (luck/annual/daily) to ask
 * which stars that period activates.
 */

import {
  HONGLUAN_BRANCH,
  HONGYAN_BRANCH,
  HUAGAI_BRANCH,
  JIANGXING_BRANCH,
  LUSHEN_BRANCH,
  SHENSHA_DEFINITIONS,
  STEM_COMBINE,
  TAIJI_BRANCHES,
  TAOHUA_BRANCH,
  TIANDE_MARK,
  TIANYI_BRANCHES,
  WENCHANG_BRANCH,
  YANGREN_BRANCH,
  YIMA_BRANCH,
  YUEDE_STEM,
  ZAISHA_BRANCH,
  type ShenshaKey,
} from "../data/shensha-tables.js";
import { SIX_CLASHES, SIX_COMBINES } from "../data/interactions-tables.js";
import { STEMS } from "../data/tables.js";
import { branchAt, branchIndex, pillarToSexagenaryIndex } from "./sexagenary.js";
import type { Branch, Palace, Pillar, ShenshaHit, Stem } from "./types.js";

/** The reference points every star rule keys off. */
export interface ShenshaContext {
  dayStem: Stem;
  dayPillar: Pillar;
  yearBranch: Branch;
  monthBranch: Branch;
}

/** A pillar to test for stars, tagged with the palace it sits in. */
export interface ShenshaTarget {
  palace: Palace;
  pillar: Pillar;
}

/** What one rule marks: branches and/or stems that carry the star. */
interface Marks {
  branches?: readonly Branch[];
  stems?: readonly Stem[];
}

function isStem(value: Stem | Branch): value is Stem {
  return (STEMS as readonly string[]).includes(value);
}

/** The six-clash partner of a branch. */
function clashOf(branch: Branch): Branch {
  const pair = SIX_CLASHES.find((clash) => clash.includes(branch))!;
  return pair[0] === branch ? pair[1] : pair[0];
}

/** The six-combine partner of a branch. */
function combineOf(branch: Branch): Branch {
  const pair = SIX_COMBINES.find((combine) => combine.includes(branch))!;
  return pair[0] === branch ? pair[1] : pair[0];
}

/**
 * 空亡 (void) branches of the day pillar's decade: 甲子旬→戌亥, 甲戌旬→申酉,
 * 甲申旬→午未, 甲午旬→辰巳, 甲辰旬→寅卯, 甲寅旬→子丑.
 * Source: 淵海子平 論空亡 — the two branches each decade of sixty leaves unused.
 */
export function voidBranches(dayPillar: Pillar): [Branch, Branch] {
  const decade = Math.floor(pillarToSexagenaryIndex(dayPillar) / 10);
  return [branchAt(10 - 2 * decade), branchAt(11 - 2 * decade)];
}

/** Dual-keyed trine star: marks from both the year branch and the day branch. */
function dualKeyed(table: Readonly<Record<Branch, Branch>>, context: ShenshaContext): Marks {
  const marks = new Set<Branch>([table[context.yearBranch], table[context.dayPillar.branch]]);
  return { branches: [...marks] };
}

function marksFor(key: ShenshaKey, context: ShenshaContext): Marks {
  const { dayStem, dayPillar, yearBranch, monthBranch } = context;
  switch (key) {
    case "tianyi-nobleman":
      return { branches: TIANYI_BRANCHES[dayStem] };
    case "wenchang-scholar":
      return { branches: [WENCHANG_BRANCH[dayStem]] };
    case "lushen-emolument":
      return { branches: [LUSHEN_BRANCH[dayStem]] };
    case "yangren-blade": {
      const blade = YANGREN_BRANCH[dayStem];
      return { branches: blade ? [blade] : [] };
    }
    case "feiren-flying-blade": {
      const blade = YANGREN_BRANCH[dayStem];
      return { branches: blade ? [clashOf(blade)] : [] };
    }
    case "yima-travel-horse":
      return dualKeyed(YIMA_BRANCH, context);
    case "taohua-peach-blossom":
      return dualKeyed(TAOHUA_BRANCH, context);
    case "jiangxing-general":
      return dualKeyed(JIANGXING_BRANCH, context);
    case "huagai-canopy":
      return dualKeyed(HUAGAI_BRANCH, context);
    case "zaisha-calamity":
      return dualKeyed(ZAISHA_BRANCH, context);
    case "tiande-virtue": {
      const mark = TIANDE_MARK[monthBranch];
      return isStem(mark) ? { stems: [mark] } : { branches: [mark] };
    }
    case "tiande-companion": {
      const mark = TIANDE_MARK[monthBranch];
      return isStem(mark) ? { stems: [STEM_COMBINE[mark]] } : { branches: [combineOf(mark)] };
    }
    case "yuede-virtue":
      return { stems: [YUEDE_STEM[monthBranch]] };
    case "taiji-nobleman":
      return { branches: TAIJI_BRANCHES[dayStem] };
    case "hongyan-charm":
      return { branches: [HONGYAN_BRANCH[dayStem]] };
    case "hongluan-phoenix":
      return { branches: [HONGLUAN_BRANCH[yearBranch]] };
    case "tianxi-joy":
      return { branches: [clashOf(HONGLUAN_BRANCH[yearBranch])] };
    case "sangmen-mourning":
      // 喪門 = two branches ahead of the year branch. Source: 三命通會 論喪門吊客.
      return { branches: [branchAt(branchIndex(yearBranch) + 2)] };
    case "kongwang-void":
      return { branches: voidBranches(dayPillar) };
  }
}

/**
 * Every star hit on the supplied pillars, in (target order × table order).
 * The same context must be the natal chart even when the targets are transit
 * pillars — stars are always read from the natal reference points.
 */
export function shensha(context: ShenshaContext, targets: readonly ShenshaTarget[]): ShenshaHit[] {
  const hits: ShenshaHit[] = [];
  for (const target of targets) {
    for (const definition of SHENSHA_DEFINITIONS) {
      const marks = marksFor(definition.key, context);
      const branchHit = marks.branches?.includes(target.pillar.branch) ?? false;
      const stemHit = marks.stems?.includes(target.pillar.stem) ?? false;
      if (branchHit || stemHit) {
        hits.push({
          key: definition.key,
          chinese: definition.chinese,
          english: definition.english,
          palace: target.palace,
        });
      }
    }
  }
  return hits;
}
