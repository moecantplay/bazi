/**
 * M24-11: a card and the topic page it opens share a title, because both pick
 * from the same pool by the same visit. The card's line opens the page only
 * where the fuller page (M20-26) has no opening of its own, so the title is
 * the check. Interaction, hours and small-signs pages have titles of their own.
 */

import { describe, expect, it } from "vitest";
import { plainGloss } from "@daymaster/content";
import { addDays } from "../src/dates.js";
import { todayScreenModel } from "../src/today-screen.js";
import { topicPageFor } from "../src/topic-page.js";
import { FIXTURE_A, FIXTURE_D } from "./fixtures.js";

const MIRRORED = ["element:", "ten-god:", "stage:"];

describe.each([
  ["A", FIXTURE_A],
  ["D", FIXTURE_D]
] as const)("topic pages mirror their card — fixture %s", (_name, profile) => {
  it("over 60 days, every element, character and pace card", () => {
    let checked = 0;
    for (let index = 0; index < 60; index += 1) {
      const date = addDays("2026-10-20", index);
      for (const card of todayScreenModel(profile, date, date).reading.cards) {
        if (!MIRRORED.some((prefix) => card.topic.startsWith(prefix))) {
          continue;
        }
        const page = topicPageFor(profile, date, date, card.topic);
        expect(page, `${date} ${card.topic}`).not.toBeNull();
        expect(plainGloss(page!.title), `${date} ${card.topic}`).toBe(plainGloss(card.titles[0]!));
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(60);
  });
});
