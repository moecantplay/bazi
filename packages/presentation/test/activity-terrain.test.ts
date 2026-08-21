import { describe, expect, it } from "vitest";
import { ACTIVITIES, type ActivityAssessment, type ActivityKey } from "@daymaster/bazi-engine";
import { activityTerrain } from "../src/activity-terrain.js";

function assessment(activity: ActivityKey, leaning: ActivityAssessment["leaning"], score: number): ActivityAssessment {
  const definition = ACTIVITIES.find((entry) => entry.key === activity)!;
  return { activity, chinese: definition.chinese, classical: definition.classical, leaning, score, reasons: [] };
}

/** One assessment per canonical activity, in table order, covering all three leanings. */
function allAssessments(): ActivityAssessment[] {
  return ACTIVITIES.map((definition, index) => {
    const leaning = index % 3 === 0 ? "favors" : index % 3 === 1 ? "neutral" : "friction";
    return assessment(definition.key, leaning, 0);
  });
}

describe("activityTerrain", () => {
  it("returns one cell per assessment, in the same order", () => {
    const assessments = allAssessments();
    const cells = activityTerrain(assessments);
    expect(cells).toHaveLength(assessments.length);
    expect(cells.map((cell) => cell.key)).toEqual(assessments.map((a) => a.activity));
  });

  it("plots x evenly across all activities", () => {
    const cells = activityTerrain(allAssessments());
    for (const [index, cell] of cells.entries()) {
      expect(cell.x).toBeCloseTo(((index + 0.5) / cells.length) * 100);
    }
  });

  it("maps leaning to elevation: favors highest, neutral middle, friction lowest", () => {
    const cells = activityTerrain([
      assessment("commit", "favors", 3),
      assessment("launch", "neutral", 0),
      assessment("sign", "friction", -3)
    ]);
    const [favors, neutral, friction] = cells;
    expect(favors?.y).toBeLessThan(neutral!.y);
    expect(neutral?.y).toBeLessThan(friction!.y);
  });

  it("carries the modern label and classical gloss for each activity", () => {
    const cells = activityTerrain([assessment("gather", "favors", 2)]);
    expect(cells[0]).toMatchObject({
      key: "gather",
      label: "Gatherings",
      classical: "meeting friends and kin"
    });
  });

  it("is deterministic for the same assessments", () => {
    const assessments = allAssessments();
    expect(activityTerrain(assessments)).toEqual(activityTerrain(assessments));
  });
});
