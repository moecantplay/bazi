/**
 * Area grouping (research 2026-07-16, M17): every daily body line carries an
 * area — transit lines file under the first natal palace they touch, day-level
 * lines under "overall" — so the UI can arrange the reading Co-Star-style by
 * life area without doing chart math.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading } from "../src/index.js";
import { dailyFactSet } from "./collect.js";
import { lineText } from "./token-utils.js";

describe("daily line areas", () => {
  it("files transit lines under the first natal palace they touch", () => {
    const facts = dailyFactSet("six-clash", "month", "daily");
    const reading = dailyReading(facts, "area-seed");
    const transit = reading.lines.find((line) => line.topic?.startsWith("interaction:"));
    expect(transit?.area).toBe("month");
  });

  it("files day-level lines under overall", () => {
    const facts: ReadingFact[] = [
      { kind: "element-day", element: "wood", favorable: true },
      { kind: "ten-god-day", god: "比肩", english: "Friend" },
    ];
    const reading = dailyReading(facts, "area-seed");
    expect(reading.lines.length).toBeGreaterThan(0);
    for (const line of reading.lines) {
      expect(line.area).toBe("overall");
    }
  });

  it("gives every body line an area", () => {
    const facts = dailyFactSet("six-combine", "year", "daily");
    const reading = dailyReading(facts, "area-seed");
    for (const line of reading.lines) {
      expect(line.area, `line has an area: "${lineText(line)}"`).toBeDefined();
    }
  });
});
