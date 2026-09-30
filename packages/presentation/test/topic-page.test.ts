import { describe, expect, it } from "vitest";
import { plainGloss } from "@daymaster/content";
import { addDays } from "../src/dates.js";
import { todayScreenModel } from "../src/today-screen.js";
import { topicPageFor } from "../src/topic-page.js";
import { READING_FIXTURES } from "./fixtures.js";

const TODAY = "2026-09-29";

describe("topicPageFor", () => {
  it("every card and every lead Today shows over a month opens a page", () => {
    for (const [, profile] of READING_FIXTURES) {
      for (let index = 0; index < 30; index += 1) {
        const date = addDays(TODAY, index);
        const { reading } = todayScreenModel(profile, date, TODAY);
        for (const topic of [reading.leadTopic, ...reading.cards.map((card) => card.topic)]) {
          const page = topicPageFor(profile, date, TODAY, topic);
          expect(page, `${date} ${topic}`).not.toBeNull();
          expect(plainGloss(page!.title).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("is null outside Today's range or for a topic the day doesn't carry", () => {
    const [, profile] = READING_FIXTURES[0]!;
    expect(topicPageFor(profile, addDays(TODAY, 31), TODAY, "hours")).toBeNull();
    expect(topicPageFor(profile, TODAY, TODAY, "stage:Nonsense")).toBeNull();
  });
});
