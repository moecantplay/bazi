import { describe, expect, it } from "vitest";
import type { ReadingArea, ReadingLine } from "@daymaster/content";
import { readingSections } from "../src/reading-sections.js";

function line(text: string, area?: ReadingArea): ReadingLine {
  return { runs: [{ kind: "text", text }], factTagRuns: null, area };
}

describe("readingSections", () => {
  const career = line("career clash", "month");
  const roots = line("roots trine", "year");
  const grain = line("fire day suits you", "overall");
  const oddAngle = line("odd angle", "overall");
  const hours = line("rough and easy hours", "hours");

  it("groups lines by area in order of first appearance, with area titles", () => {
    const sections = readingSections([career, roots, grain, oddAngle, hours], undefined);

    expect(sections.map((section) => section.title)).toEqual(["Career", "Roots", "The day itself", "The hours"]);
    expect(sections[2]?.lines).toEqual([grain, oddAngle]);
  });

  it("drops the line already shown as the day's one idea, so it is said once", () => {
    const sections = readingSections([career, grain, oddAngle], grain);

    expect(sections.find((section) => section.area === "overall")?.lines).toEqual([oddAngle]);
  });

  it("drops a section entirely when its only line is the one idea", () => {
    const sections = readingSections([career, grain], grain);

    expect(sections.map((section) => section.area)).toEqual(["month"]);
  });

  it("files lines without an area under the day itself", () => {
    const loose = line("no area");

    expect(readingSections([loose], undefined)).toEqual([{ area: "overall", title: "The day itself", lines: [loose] }]);
  });
});
