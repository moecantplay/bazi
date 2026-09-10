/**
 * The day's hours line: the one timed line in a daily reading. Asserts the
 * clock windows render as people say them, the tag cites both hours, and the
 * line only appears when the facts carry both the clash and combine hour.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { HOURS_TOPIC, dailyReading, hourWindowLabel } from "../src/index.js";
import { dailyFactSet } from "./collect.js";
import { assertGlossed, lineFactTag, lineText } from "./token-utils.js";

describe("hourWindowLabel", () => {
  it("keeps one meridiem when the block stays on one side of noon", () => {
    expect(hourWindowLabel(9, 11)).toBe("9–11 am");
    expect(hourWindowLabel(13, 15)).toBe("1–3 pm");
    expect(hourWindowLabel(3, 5)).toBe("3–5 am");
  });

  it("repeats the meridiem when the block crosses noon or midnight", () => {
    expect(hourWindowLabel(11, 13)).toBe("11 am–1 pm");
    expect(hourWindowLabel(23, 1)).toBe("11 pm–1 am");
  });
});

describe("the day's hours line", () => {
  const facts = dailyFactSet("six-clash", "month", "daily");
  const reading = dailyReading(facts, "seed");
  const hours = reading.lines.find((line) => line.topic === HOURS_TOPIC);

  it("closes the day-itself section with both windows named", () => {
    expect(hours).toBeDefined();
    expect(reading.lines[reading.lines.length - 1]).toBe(hours);
    expect(hours!.area).toBe("overall");
    const text = lineText(hours!);
    expect(text).toContain("11 pm–1 am");
    expect(text).toContain("1–3 pm");
    expect(text).toContain("rat");
    expect(text).toContain("goat");
    assertGlossed(hours!.runs);
  });

  it("cites both hours in the tag", () => {
    expect(lineFactTag(hours!)).toBe("rat hour clash · 11 pm–1 am — goat hour combine · 1–3 pm");
  });

  it("is omitted when the facts carry no hour pair", () => {
    const without = facts.filter((fact: ReadingFact) => fact.kind !== "hour-interaction");
    expect(dailyReading(without, "seed").lines.some((line) => line.topic === HOURS_TOPIC)).toBe(false);
  });
});
