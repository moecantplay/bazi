/**
 * M20-26: the fuller topic page for Fixture A on the dates the
 * owner reviewed in the mockups (6 and 9 October 2026).
 */

import { describe, expect, it } from "vitest";
import { plainGloss, type TopicPage } from "@daymaster/content";
import { chartFor } from "../src/chart.js";
import { topicPageFor } from "../src/topic-page.js";
import { chartSoreSpot } from "../src/sore-spot.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

const TODAY = "2026-10-10";

function pageFor(date: string, topic: string, profile = FIXTURE_A): TopicPage {
  const page = topicPageFor(profile, date, TODAY, topic);
  expect(page, `${date} ${topic}`).not.toBeNull();
  return page!;
}

describe("topic depth", () => {
  it("reads Fixture A's sore spot from its first helpful element: water harms fire, eased by earth and wood", () => {
    expect(chartSoreSpot(chartFor(FIXTURE_A))).toEqual({ wounds: "fire", problem: "water", remedies: ["earth", "wood"] });
  });

  it("6 Oct: the written-out steady-work page for a weak chart, and a water day that both presses and eases", () => {
    const page = pageFor("2026-10-06", "ten-god:Direct Wealth");
    expect(plainGloss(page.tagline ?? [])).toBe("Do less, finish it, take the help.");
    expect(plainGloss(page.forYou ?? [])).toMatch(/lighter side/);
    expect(page.how).toHaveLength(2);
    expect(page.where.map((row) => row.label)).toEqual(["Work", "People", "Home"]);
    expect(page.work).toHaveLength(3);
    expect(page.sore?.status).toBe("both");
    expect(page.recurrences).toEqual(["2026-10-16", "2026-10-26", "2026-11-05"]);
  });

  it("9 Oct: the stage page draws the twelve steps with today marked", () => {
    const page = pageFor("2026-10-09", "stage:Coming of Age");
    expect(page.visual?.kind).toBe("stage-arc");
    if (page.visual?.kind !== "stage-arc") return;
    expect(page.visual.steps).toHaveLength(12);
    expect(page.visual.steps.filter((step) => step.today).map((step) => step.label)).toEqual(["Ready"]);
    expect([page.visual.yesterday, page.visual.today, page.visual.tomorrow]).toEqual(["Open", "Ready", "Capable"]);
    expect(page.sore?.status).toBe("eases");
  });

  it("9 Oct: the family clash says straight that the chart already carries it, and marks the signs", () => {
    const page = pageFor("2026-10-09", "interaction:six-clash:year");
    expect(page.how.map((line) => plainGloss(line)).join(" ")).toMatch(/To be straight with you/);
    expect(page.visual?.kind).toBe("signs");
    if (page.visual?.kind !== "signs") return;
    expect(page.visual.signs.map((sign) => `${sign.area}:${sign.animal}:${sign.mark}`)).toEqual([
      "Family:Dog:met",
      "Work:Rat:null",
      "Home & partner:Dragon:same",
      "Long-term plans:Monkey:null",
    ]);
  });

  it("an unknown birth time draws three signs, not four", () => {
    for (let day = 0; day < 30; day += 1) {
      const date = `2026-10-${String(day + 1).padStart(2, "0")}`;
      const page = topicPageFor(FIXTURE_UNKNOWN_TIME, date, TODAY, "interaction:six-clash:year");
      if (page?.visual?.kind === "signs") {
        expect(page.visual.signs).toHaveLength(3);
        return;
      }
    }
  });

  it("every page ends on the closing line and never lists a date outside Today's range", () => {
    const page = pageFor("2026-10-09", "interaction:six-clash:year");
    expect(plainGloss(page.closing)).toBe("This describes how a day tends to lean, not what will happen.");
    expect(page.recurrences.every((date) => date > "2026-10-09" && date <= "2026-11-09")).toBe(true);
  });
});
