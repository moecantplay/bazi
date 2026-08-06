import { describe, expect, it } from "vitest";
import { textRun, type ReadingLine } from "@daymaster/content";
import { groupGuidanceByFactTag, guidanceBoardFor } from "../src/guidance-board.js";
import type { GuidanceChip } from "../src/guidance.js";

const FAVORS_CHIP: GuidanceChip = {
  activity: "travel",
  leaning: "favors",
  label: "Good day to travel",
  chinese: "出行"
};
const FRICTION_CHIP: GuidanceChip = {
  activity: "sign",
  leaning: "friction",
  label: "Hold off signing",
  chinese: "立券交易"
};

describe("guidanceBoardFor", () => {
  it("splits chips into favors and watch (friction) tiles", () => {
    const board = guidanceBoardFor([FAVORS_CHIP, FRICTION_CHIP]);
    expect(board.favors).toEqual([FAVORS_CHIP]);
    expect(board.watch).toEqual([FRICTION_CHIP]);
  });

  it("returns empty tiles for no chips", () => {
    expect(guidanceBoardFor([])).toEqual({ favors: [], watch: [] });
  });
});

function line(text: string, factTag: string | null): ReadingLine {
  return { runs: textRun(text), factTagRuns: factTag ? textRun(factTag) : null };
}

describe("groupGuidanceByFactTag", () => {
  it("groups consecutive lines sharing the same fact tag into one block", () => {
    const lines = [line("a", "success day"), line("b", "success day"), line("c", "clash")];
    expect(groupGuidanceByFactTag(lines)).toEqual([
      [line("a", "success day"), line("b", "success day")],
      [line("c", "clash")]
    ]);
  });

  it("starts a new group when the same tag reappears non-consecutively", () => {
    const lines = [line("a", "x"), line("b", "y"), line("c", "x")];
    expect(groupGuidanceByFactTag(lines)).toEqual([[line("a", "x")], [line("b", "y")], [line("c", "x")]]);
  });

  it("groups lines with a null fact tag together when consecutive", () => {
    const lines = [line("a", null), line("b", null)];
    expect(groupGuidanceByFactTag(lines)).toEqual([[line("a", null), line("b", null)]]);
  });

  it("returns an empty array for no lines", () => {
    expect(groupGuidanceByFactTag([])).toEqual([]);
  });
});
