/**
 * The reader's best hour on Today's hours card and its topic page (M24-13):
 * the day's easy and rough hours stay word for word, the personal hour is its
 * own line, said once when it is the easy hour.
 */

import { describe, expect, it } from "vitest";
import { computeChart, dailyFacts, type DayFact } from "@daymaster/bazi-engine";
import { dailyReading, plainGloss, topicPage } from "../src/index.js";
import type { TokenLine, TopicCard } from "../src/index.js";
import { assertPlain } from "./plain-terms.js";

const SEED = { chart: "chart-seed", date: "2026-09-29" };
const ZONE = "Asia/Jakarta";

const ROUGH: DayFact = { kind: "hour-interaction", scope: "day", interaction: "six-clash", hourBranch: "子", dayBranch: "午", startHour: 23, endHour: 1 };
const EASY: DayFact = { kind: "hour-interaction", scope: "day", interaction: "six-combine", hourBranch: "未", dayBranch: "午", startHour: 13, endHour: 15 };

function bestHour(overrides: Partial<Extract<DayFact, { kind: "best-hour" }>> = {}): DayFact {
  return {
    kind: "best-hour",
    scope: "day",
    hourBranch: "辰",
    hourStem: "丙",
    element: "fire",
    startHour: 7,
    endHour: 9,
    isEasyHour: false,
    score: 2,
    reasons: [{ source: "stem-element", element: "fire" }],
    ...overrides,
  };
}

function text(line: TokenLine | null): string {
  return line ? plainGloss(line) : "";
}

function hoursCard(facts: DayFact[]): TopicCard {
  const card = dailyReading(facts, SEED).cards.find((candidate) => candidate.topic === "hours");
  expect(card).toBeDefined();
  return card!;
}

describe("hours card", () => {
  it("keeps Easiest and Roughest word for word and adds the best hour on its own line", () => {
    const card = hoursCard([ROUGH, EASY, bestHour()]);
    expect(card.titles.map(text)).toEqual(["Easiest 1–3 pm"]);
    expect(text(card.line)).toBe("Roughest 11 pm–1 am.");
    expect(text(card.note)).toBe("7–9 am suits you best.");
    assertPlain(text(card.note));
  });

  it("says the window once when the best hour is the easy hour", () => {
    const card = hoursCard([ROUGH, EASY, bestHour({ hourBranch: "未", startHour: 13, endHour: 15, isEasyHour: true })]);
    expect(card.titles.map(text)).toEqual(["Easiest 1–3 pm"]);
    expect(text(card.line)).toBe("Roughest 11 pm–1 am.");
    expect(text(card.note)).toBe("The easy hour suits you best too.");
    expect(text(card.note)).not.toContain("1–3 pm");
    assertPlain(text(card.note));
  });

  it("reads as before with no best hour", () => {
    const card = hoursCard([ROUGH, EASY]);
    expect(card.note).toBeNull();
  });
});

describe("hours topic page", () => {
  it("says why the hour suits you, in plain words", () => {
    const page = topicPage("hours", [ROUGH, EASY, bestHour()]);
    const forYou = text(page!.forYou);
    expect(forYou).toContain("The goat hour, 1–3 pm, runs with today's sign");
    expect(forYou).toContain("7–9 am suits you best: it brings Fire, and your birth chart runs better with more of it.");
  });

  it("names the easy hour instead of repeating its window when they coincide", () => {
    const page = topicPage("hours", [ROUGH, EASY, bestHour({ hourBranch: "未", startHour: 13, endHour: 15, isEasyHour: true, element: "earth" })]);
    expect(text(page!.forYou)).toContain("The easy hour suits you best too: it brings Earth, and your birth chart runs better with more of it.");
  });

  it("is unchanged with no best hour", () => {
    expect(text(topicPage("hours", [ROUGH, EASY])!.forYou)).not.toContain("suits you best");
  });
});

describe("Fixture A over 60 days", () => {
  const chart = computeChart({
    instant: new Date("1994-12-08T16:30:00+07:00"),
    zone: ZONE,
    sex: "male",
    hourKnown: true,
  });

  it("every card names each window at most once and always carries the best-hour line", () => {
    for (let offset = 0; offset < 60; offset += 1) {
      const date = new Date(Date.UTC(2026, 9, 13 + offset)).toISOString().slice(0, 10);
      const card = hoursCard(dailyFacts(chart, date, ZONE));
      const all = [...card.titles.map(text), text(card.line), text(card.note)].join(" ");
      const windows = all.match(/\d+(?: [ap]m)?–\d+ [ap]m/g) ?? [];
      expect(new Set(windows).size, `${date}: ${all}`).toBe(windows.length);
      expect(card.note, date).not.toBeNull();
    }
  });
});
