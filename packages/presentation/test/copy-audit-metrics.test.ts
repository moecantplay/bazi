/**
 * The copy audit's counting (M20-02 R2), checked against hand-counted text.
 * This tests the arithmetic, not the copy.
 */

import { describe, expect, it } from "vitest";
import { emDashCount, measureViews, sentencesOf, slotNames, wordCount, type AuditView } from "../scripts/copy-audit/metrics.js";

function view(key: string, slots: [string, string][]): AuditView {
  return { key, slots: slots.map(([slot, text]) => ({ slot, text })) };
}

describe("sentencesOf", () => {
  it("splits after . ! ? and on line breaks, keeping the punctuation", () => {
    expect(sentencesOf("Go slow. Ask first! Why not?\nA title")).toEqual(["Go slow.", "Ask first!", "Why not?", "A title"]);
  });

  it("keeps a title with no full stop as one sentence and drops blanks", () => {
    expect(sentencesOf("  A good day to start  ")).toEqual(["A good day to start"]);
    expect(sentencesOf("   ")).toEqual([]);
  });
});

describe("wordCount and emDashCount", () => {
  it("counts words the way the M20-21 budget test does", () => {
    expect(wordCount("It's a slow — steady day, mostly.")).toBe(6);
  });

  it("counts em-dashes, not hyphens or en-dashes", () => {
    expect(emDashCount("one — two — three - four – five")).toBe(2);
  });
});

describe("measureViews", () => {
  const views = [
    view("day 1", [
      ["headline", "Keep your plans small today."],
      ["body", "Keep your plans small and they hold. Rest — then go."]
    ]),
    view("day 2", [
      ["headline", "Keep your plans small today."],
      ["body", "A clear run for talking."]
    ])
  ];
  const metrics = measureViews(views);

  it("counts sentences and the unique ratio", () => {
    // Day 1: 3 sentences, day 2: 2. "Keep your plans small today." twice → 4 unique of 5.
    expect(metrics.sentences).toBe(5);
    expect(metrics.uniqueSentences).toBe(4);
    expect(metrics.uniqueRatio).toBe(0.8);
  });

  it("lists only sentences that repeat, most repeated first", () => {
    expect(metrics.topRepeats).toEqual([{ sentence: "Keep your plans small today.", count: 2 }]);
  });

  it("measures words and em-dashes per view", () => {
    // Day 1: 5 + 7 + 3 = 15 words, 1 em-dash. Day 2: 5 + 5 = 10 words, none.
    expect(metrics.wordsPerView).toEqual({ min: 10, average: 12.5, max: 15 });
    expect(metrics.emDashesPerView).toEqual({ average: 0.5, max: 1 });
  });

  it("counts sentence pairs on one view that share a 4-word phrase", () => {
    // Day 1's headline and first body sentence share "keep your plans small"; day 2 has no pair.
    expect(metrics.withinViewRepeats.pairs).toBe(1);
    expect(metrics.withinViewRepeats.examples).toEqual([
      { view: "day 1", first: "Keep your plans small today.", second: "Keep your plans small and they hold.", phrase: "keep your plans small" }
    ]);
  });

  it("pairs only different sentences, and counts a sentence said twice on one view as a duplicate", () => {
    const twice = measureViews([
      view("pair", [
        ["card line", "Together you move faster. Together you move faster."],
        ["body", "Together you move faster with help."]
      ])
    ]);
    // The two identical lines are one duplicate, not a pair; each pairs once with the body sentence.
    expect(twice.withinViewRepeats.pairs).toBe(2);
    expect(twice.withinViewDuplicates).toEqual({ extra: 1, examples: [{ view: "pair", sentence: "Together you move faster.", count: 2 }] });
    expect(metrics.withinViewDuplicates.extra).toBe(0);
  });

  it("never matches a 4-word phrase across ; or :", () => {
    const split = measureViews([view("day", [["body", "Keep it short; plans hold well. Short plans hold well today."]])]);
    // Across the semicolon the first sentence reads "short plans hold well", but that phrase spans the break.
    expect(split.withinViewRepeats.pairs).toBe(0);
  });

  it("caps the repeat list at 25, ties in plain code-point order", () => {
    const many = Array.from({ length: 30 }, (_, index) => `Line ${String.fromCharCode(97 + (index % 26))}${index}.`);
    const repeated = measureViews([view("one", [["body", many.join(" ")]]), view("two", [["body", many.join(" ")]])]);
    expect(repeated.topRepeats).toHaveLength(25);
    expect(repeated.topRepeats[0]).toEqual({ sentence: "Line a0.", count: 2 });
    expect(measureViews([view("x", [["t", "b. B. b. B."]])]).topRepeats.map((entry) => entry.sentence)).toEqual(["B.", "b."]);
  });

  it("measures one slot by keeping only views that have it", () => {
    const body = measureViews(views, "body");
    expect(body.views).toBe(2);
    expect(body.sentences).toBe(3);
    expect(body.withinViewRepeats.pairs).toBe(0);
  });

  it("returns zeros for no views", () => {
    const empty = measureViews([]);
    expect(empty.views).toBe(0);
    expect(empty.uniqueRatio).toBe(0);
    expect(empty.wordsPerView).toEqual({ min: 0, average: 0, max: 0 });
  });
});

describe("slotNames", () => {
  it("lists every slot once, in first-seen order", () => {
    expect(slotNames([view("a", [["headline", "x"], ["body", "y"]]), view("b", [["card", "z"], ["body", "w"]])])).toEqual([
      "headline",
      "body",
      "card"
    ]);
  });
});
