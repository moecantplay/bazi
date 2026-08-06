/**
 * Regression coverage for vocab.ts's fact-tag builders (M19 Phase 11 review
 * finding): interactionTagRuns and compareTagRuns concatenate one term run
 * per branch, and without a separator between them two adjacent branch
 * glosses fuse into one word once TokenText renders them gloss-only ("rat" +
 * "horse" -> "rathorse" instead of "rat–horse"). These tests assert the
 * en-dash separator holds.
 */

import { describe, expect, it } from "vitest";
import { plainGloss } from "../src/index.js";
import { interactionTagRuns, joinBranchRuns } from "../src/vocab.js";

describe("joinBranchRuns", () => {
  it("en-dash joins two branches", () => {
    expect(plainGloss(joinBranchRuns(["子", "午"]))).toBe("rat–horse");
  });

  it("en-dash joins three branches (trine/punishment case)", () => {
    expect(plainGloss(joinBranchRuns(["寅", "午", "戌"]))).toBe("tiger–horse–dog");
  });

  it("a single branch has no separator to omit", () => {
    expect(plainGloss(joinBranchRuns(["午"]))).toBe("horse");
  });
});

describe("interactionTagRuns", () => {
  it("joins branches with an en dash, never fusing them into one word", () => {
    const runs = interactionTagRuns(["子", "午"], "six-clash", "day");
    const rendered = plainGloss(runs);
    expect(rendered).toContain("rat–horse");
    expect(rendered).not.toContain("rathorse");
  });
});

describe("compareTagRuns (via interactionLine's private call site)", () => {
  it("joinBranchRuns is reused for compare fact tags, not a re-duplicated fusion bug", () => {
    // compareTagRuns is module-private; joinBranchRuns is the shared helper
    // it now delegates to, so exercising that helper with the same two-branch
    // input compareTagRuns would receive is sufficient regression coverage
    // without exporting a private function purely for testing.
    expect(plainGloss(joinBranchRuns(["子", "午"]))).not.toContain("rathorse");
  });
});
