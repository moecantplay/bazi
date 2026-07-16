/**
 * Day-guidance content: chip ordering and caps, the friction-chip-has-an-
 * explaining-line invariant, determinism, factTag presence, and the officer
 * named in the first line. Fixtures are hand-built DayQuality objects so each
 * reason branch is exercised without recomputing chart math.
 */

import { describe, expect, it } from "vitest";
import {
  ACTIVITIES,
  DAY_OFFICERS,
  type ActivityAssessment,
  type ActivityKey,
  type ActivityReason,
  type DateCandidate,
  type DayOfficerDefinition,
  type DayQuality,
  type Pillar,
} from "@daymaster/bazi-engine";
import {
  ACTIVITY_LABELS,
  OFFICER_GLOSSES,
  activityAreaLine,
  dateVerdictLine,
  dayGuidance,
  stripHanCharacters,
} from "../src/index.js";
import { NEUTRAL_AREA_FRAMES } from "../src/banks/day-guidance.js";

const CHENG = DAY_OFFICERS.find((officer) => officer.key === "cheng")!;
const PO = DAY_OFFICERS.find((officer) => officer.key === "po")!;
const PILLAR: Pillar = { stem: "甲", branch: "子" };

function officerReason(officer: DayOfficerDefinition, direction: 1 | -1): ActivityReason {
  return { source: "officer", chinese: officer.chinese, english: officer.english, direction };
}

function assessment(
  activity: ActivityKey,
  leaning: ActivityAssessment["leaning"],
  score: number,
  reasons: ActivityReason[],
): ActivityAssessment {
  const definition = ACTIVITIES.find((entry) => entry.key === activity)!;
  return { activity, chinese: definition.chinese, classical: definition.classical, leaning, score, reasons };
}

function quality(officer: DayOfficerDefinition, assessments: ActivityAssessment[]): DayQuality {
  return { date: "2026-07-08", pillar: PILLAR, officer, assessments };
}

/** A rich day: four favours and four friction chips, so caps and order show. */
function richQuality(): DayQuality {
  return quality(CHENG, [
    assessment("commit", "favors", 4, [
      officerReason(CHENG, 1),
      { source: "element-day", element: "wood" },
      { source: "day-combine", transitBranch: "丑", natalBranch: "子" },
    ]),
    assessment("launch", "favors", 3, [officerReason(CHENG, 1), { source: "element-day", element: "wood" }]),
    assessment("sign", "favors", 3, [officerReason(CHENG, 1)]),
    assessment("study", "favors", 2, [officerReason(CHENG, 1)]),
    assessment("move", "friction", -4, [
      officerReason(CHENG, -1),
      { source: "day-breaker", transitBranch: "午", natalBranch: "子" },
    ]),
    assessment("travel", "friction", -3, [
      { source: "palace-clash", palace: "year", transitBranch: "午", natalBranch: "子" },
    ]),
    assessment("rest", "friction", -2, [officerReason(CHENG, -1)]),
    assessment("gather", "friction", -2, [officerReason(CHENG, -1)]),
    assessment("clear", "neutral", 0, []),
    assessment("ask", "neutral", 1, [officerReason(CHENG, 1)]),
  ]);
}

describe("dayGuidance chips", () => {
  it("orders favours before friction, capped at three per group", () => {
    const { chips } = dayGuidance(richQuality(), "seed");
    expect(chips).toHaveLength(6);
    expect(chips.slice(0, 3).map((chip) => chip.leaning)).toEqual(["favors", "favors", "favors"]);
    expect(chips.slice(3).map((chip) => chip.leaning)).toEqual(["friction", "friction", "friction"]);
  });

  it("orders each group by strength, ties by the engine activity order", () => {
    const { chips } = dayGuidance(richQuality(), "seed");
    expect(chips.map((chip) => chip.activity)).toEqual([
      "commit", // |4|
      "launch", // |3|, activity index 1 before sign's 2
      "sign", //   |3|
      "move", //   |4|
      "travel", // |3|
      "rest", //   |2|, activity index 7 before gather's 9
    ]);
  });

  it("carries the modern label and the classical characters on each chip", () => {
    const { chips } = dayGuidance(richQuality(), "seed");
    const commit = chips.find((chip) => chip.activity === "commit")!;
    expect(commit.label).toBe(ACTIVITY_LABELS.commit.label);
    expect(commit.chinese).toBe(ACTIVITY_LABELS.commit.chinese);
  });

  it("drops neutral assessments entirely", () => {
    const { chips } = dayGuidance(richQuality(), "seed");
    expect(chips.map((chip) => chip.activity)).not.toContain("clear");
    expect(chips.map((chip) => chip.activity)).not.toContain("ask");
  });
});

describe("dayGuidance lines", () => {
  it("names the officer, glossed, in the first line with a factTag", () => {
    const { lines } = dayGuidance(richQuality(), "seed");
    expect(lines[0]!.text).toContain(CHENG.chinese);
    expect(lines[0]!.text).toContain(CHENG.english);
    expect(lines[0]!.text).toContain(OFFICER_GLOSSES[CHENG.key]!);
    expect(lines[0]!.factTag).toBe("成 Success day");
  });

  it("gives every line a non-null factTag", () => {
    for (const seed of ["a", "b", "c"]) {
      for (const line of dayGuidance(richQuality(), seed).lines) {
        expect(line.factTag, line.text).not.toBeNull();
      }
    }
  });

  it("pairs any friction chip with a friction-explaining line (VOICE rule 12)", () => {
    const guidance = dayGuidance(richQuality(), "seed");
    expect(guidance.chips.some((chip) => chip.leaning === "friction")).toBe(true);
    // The clash-driven friction line cites the clash on a palace in its factTag.
    const explains = guidance.lines.some((line) => line.factTag?.includes("clash"));
    expect(explains).toBe(true);
  });

  it("explains a friction chip driven purely by the officer (no interactions)", () => {
    // 破 Break avoids launches, with no favourable element and no interactions:
    // launch is friction from the officer alone and must still be explained.
    const breakDay = quality(PO, [
      assessment("launch", "friction", -2, [officerReason(PO, -1)]),
      assessment("clear", "favors", 2, [officerReason(PO, 1)]),
    ]);
    const guidance = dayGuidance(breakDay, "seed");
    expect(guidance.lines.length).toBeGreaterThanOrEqual(2);
    const frictionLine = guidance.lines.find((line) => line.factTag === "破 Break day" && line !== guidance.lines[0]);
    expect(frictionLine, "a friction line explains the officer-only avoid").toBeDefined();
  });

  it("falls back to an even-day line when nothing leans", () => {
    const flat = quality(
      CHENG,
      ACTIVITIES.map((entry) => assessment(entry.key, "neutral", 0, [])),
    );
    const guidance = dayGuidance(flat, "seed");
    expect(guidance.chips).toHaveLength(0);
    expect(guidance.lines).toHaveLength(2);
    expect(guidance.lines[1]!.factTag).toBe("成 Success day");
  });

  it("is byte-identical for the same quality and seedKey", () => {
    const q = richQuality();
    expect(dayGuidance(q, "same")).toEqual(dayGuidance(q, "same"));
  });

  it("varies line choices across seeds for some day", () => {
    const q = richQuality();
    let differences = 0;
    for (let index = 0; index < 20; index += 1) {
      const a = JSON.stringify(dayGuidance(q, `L${index}`).lines);
      const b = JSON.stringify(dayGuidance(q, `R${index}`).lines);
      if (a !== b) {
        differences += 1;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });

  it("stays readable after the Han toggle strips characters", () => {
    for (const line of dayGuidance(richQuality(), "seed").lines) {
      const stripped = stripHanCharacters(line.text);
      expect(stripped.length).toBeGreaterThan(0);
      expect(stripped).not.toMatch(/[㐀-鿿]/);
    }
  });
});

describe("activityAreaLine", () => {
  it("explains a leaning activity with the same frames as its chip", () => {
    const line = activityAreaLine(richQuality(), "travel", "seed");
    // travel's friction is a clash on the roots palace; the line cites it.
    expect(line.factTag).toContain("clash");
    expect(line.text.toLowerCase()).toContain("travel");
  });

  it("reads even footing for a neutral activity, citing the officer", () => {
    const line = activityAreaLine(richQuality(), "clear", "seed");
    const actLower = ACTIVITY_LABELS.clear.label.toLowerCase();
    const rendered = NEUTRAL_AREA_FRAMES.map((frame) => frame.replaceAll("{actLower}", actLower));
    expect(rendered).toContain(line.text);
    expect(line.factTag).toBe("成 Success day");
    expect(line.topic).toBe("officer:cheng");
  });

  it("covers every modelled activity with a non-empty, strip-safe line", () => {
    for (const entry of ACTIVITIES) {
      const line = activityAreaLine(richQuality(), entry.key, "seed");
      expect(line.text.length, entry.key).toBeGreaterThan(0);
      expect(line.factTag, entry.key).not.toBeNull();
      const stripped = stripHanCharacters(line.text);
      expect(stripped).not.toMatch(/[㐀-鿿]/);
    }
  });

  it("is deterministic in (quality, activity, seedKey)", () => {
    const q = richQuality();
    expect(activityAreaLine(q, "move", "s")).toEqual(activityAreaLine(q, "move", "s"));
  });
});

function candidate(officer: DayOfficerDefinition, perChart: ActivityAssessment[]): DateCandidate {
  return {
    date: "2026-07-08",
    pillar: PILLAR,
    officer,
    perChart,
    combined: Math.min(...perChart.map((entry) => entry.score)),
  };
}

describe("dateVerdictLine", () => {
  it("steers away gently when the combined score is friction", () => {
    const line = dateVerdictLine(
      candidate(PO, [
        assessment("move", "friction", -3, [
          { source: "day-breaker", transitBranch: "午", natalBranch: "子" },
        ]),
      ]),
      "seed",
    );
    expect(line.text).toContain(PO.english);
    expect(line.text.toLowerCase()).toContain("moving");
    expect(line.text).toMatch(/another date|later date/);
    expect(line.factTag).toBe("破 Break day");
  });

  it("reads as a fair window when the combined score favours", () => {
    const line = dateVerdictLine(
      candidate(CHENG, [
        assessment("commit", "favors", 3, [
          { source: "day-combine", transitBranch: "丑", natalBranch: "子" },
        ]),
      ]),
      "seed",
    );
    expect(line.text).toMatch(/fair window|leans your way/);
    expect(line.text.toLowerCase()).toContain("commitments");
  });

  it("draws the reason from the chart that drags a shared date down", () => {
    // Two charts: the first favours, the second breaks — combined is friction.
    const line = dateVerdictLine(
      candidate(CHENG, [
        assessment("commit", "favors", 3, [officerReason(CHENG, 1)]),
        assessment("commit", "friction", -3, [
          { source: "day-breaker", transitBranch: "午", natalBranch: "子" },
        ]),
      ]),
      "seed",
    );
    expect(line.text).toMatch(/clash|another date|later date/);
  });

  it("is deterministic and strip-safe", () => {
    const c = candidate(CHENG, [assessment("sign", "neutral", 1, [])]);
    expect(dateVerdictLine(c, "s")).toEqual(dateVerdictLine(c, "s"));
    expect(stripHanCharacters(dateVerdictLine(c, "s").text)).not.toMatch(/[㐀-鿿]/);
  });
});
