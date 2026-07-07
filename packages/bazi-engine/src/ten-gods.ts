/**
 * Ten Gods (十神): the relationship of any stem to the day master.
 *
 * The relationship is fixed by (a) how the other stem's element relates to the
 * day master's element and (b) whether their polarities match. The mapping is
 * taken directly from the project brief §11.
 *
 * Source: project brief §11
 */

import { elementOfStem, polarityOfStem } from "./attributes.js";
import { relate, type ElementRelation } from "./five-elements.js";
import type { Stem, TenGod } from "./types.js";

/** Ten God for each element relation, split by matching / opposing polarity. */
const TEN_GOD_TABLE: Readonly<
  Record<ElementRelation, { same: TenGod; opposite: TenGod }>
> = {
  same: {
    same: { chinese: "比肩", english: "Friend" },
    opposite: { chinese: "劫财", english: "Rob Wealth" },
  },
  output: {
    same: { chinese: "食神", english: "Eating God" },
    opposite: { chinese: "伤官", english: "Hurting Officer" },
  },
  wealth: {
    same: { chinese: "偏财", english: "Indirect Wealth" },
    opposite: { chinese: "正财", english: "Direct Wealth" },
  },
  officer: {
    same: { chinese: "七杀", english: "Seven Killings" },
    opposite: { chinese: "正官", english: "Direct Officer" },
  },
  resource: {
    same: { chinese: "偏印", english: "Indirect Resource" },
    opposite: { chinese: "正印", english: "Direct Resource" },
  },
};

/** The Ten God of `other` as seen from the `dayMaster`. */
export function tenGods(dayMaster: Stem, other: Stem): TenGod {
  const relation = relate(elementOfStem(dayMaster), elementOfStem(other));
  const samePolarity = polarityOfStem(dayMaster) === polarityOfStem(other);
  return TEN_GOD_TABLE[relation][samePolarity ? "same" : "opposite"];
}
