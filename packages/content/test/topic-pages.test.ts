/**
 * Topic pages (M20-21 R11): every card's "Read more" and the reading's own
 * lead open a page with a plain title, the old name once, how it applies
 * today, how it tends to go, how to work with it and where the name comes from.
 */

import { describe, expect, it } from "vitest";
import type { ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading, plainGloss, topicPage } from "../src/index.js";
import { ELEMENT_SUITS, INTERACTION_SUITS, STAGE_SUITS, TEN_GOD_SUITS, type TopicSuits } from "../src/banks/topics/suits.js";
import { ELEMENTS, INTERACTIONS, NATAL_PALACES, STAGE_LABELS, STAR_KEYS, TEN_GODS } from "./collect.js";
import { assertPlain } from "./plain-terms.js";

const BANNED: readonly RegExp[] = [/\benergy\b/i, /\buniverse\b/i, /\bdestiny\b/i, /\bfate\b/i, /\byou will\b/i, /\byou can't\b/i, /\bmust\b/i, /\bshould\b/i];

function assertVoice(line: string): void {
  expect(line.length).toBeGreaterThan(0);
  for (const pattern of BANNED) {
    expect(pattern.test(line), `banned by ${pattern}: "${line}"`).toBe(false);
  }
}

function dayWith(extra: ReadingFact[], english = "Friend", stage = "Peak"): ReadingFact[] {
  return [
    ...extra,
    { kind: "element-day", element: "fire", favorable: true },
    { kind: "ten-god-day", god: "比肩", english },
    { kind: "stage-day", stage: { chinese: "階", english: stage } },
    { kind: "hour-interaction", interaction: "six-clash", hourBranch: "子", dayBranch: "午", startHour: 23, endHour: 1 },
    { kind: "hour-interaction", interaction: "six-combine", hourBranch: "未", dayBranch: "午", startHour: 13, endHour: 15 },
    ...STAR_KEYS.map((star): ReadingFact => ({ kind: "star-day", star, chinese: "星", english: star, transitPalace: "daily" })),
  ];
}

describe("topic pages", () => {
  it("every topic Today can link to has a page", () => {
    const days: ReadingFact[][] = [];
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        days.push(dayWith([{ kind: "transit-interaction", interaction, branches: ["子", "午"], natalPalaces: [palace], transitPalace: "daily", transitBranch: "午" }]));
      }
    }
    for (const english of TEN_GODS) {
      days.push(dayWith([], english));
    }
    for (const stage of STAGE_LABELS) {
      days.push(dayWith([], "Friend", stage));
    }
    for (const element of ELEMENTS) {
      days.push([...dayWith([]).filter((fact) => fact.kind !== "element-day"), { kind: "element-day", element, favorable: false }]);
    }
    for (const facts of days) {
      const reading = dailyReading(facts, { chart: "c", date: "2026-09-29" });
      for (const topic of [reading.leadTopic, ...reading.cards.map((card) => card.topic)]) {
        const page = topicPage(topic, facts);
        expect(page, `no page for ${topic}`).not.toBeNull();
        if (!page) continue;
        assertVoice(plainGloss(page.title));
        assertVoice(plainGloss(page.nameOrigin));
        for (const line of [...page.how, ...page.work]) {
          assertVoice(plainGloss(line));
        }
        if (topic === "stars") {
          expect(page.stars.length).toBe(STAR_KEYS.length);
          for (const star of page.stars) {
            assertVoice(plainGloss(star.title));
            assertVoice(plainGloss(star.line));
            expect(plainGloss(star.oldName).length).toBeGreaterThan(0);
          }
        } else {
          expect(page.forYou, `${topic} needs "For you today"`).not.toBeNull();
        }
        if (topic !== "stars" && topic !== "hours") {
          expect(page.goodFor.length, `${topic} needs "Good for"`).toBeGreaterThan(0);
          expect(page.holdOff.length, `${topic} needs "Hold off on"`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("an interaction page names the old name once and the signs in plain words", () => {
    const facts = dayWith([{ kind: "transit-interaction", interaction: "six-clash", branches: ["子", "午"], natalPalaces: ["month"], transitPalace: "daily", transitBranch: "午" }]);
    const page = topicPage("interaction:six-clash:month", facts);
    expect(page && plainGloss(page.oldName ?? [])).toBe("The old calendars call this a clash.");
    expect(page && plainGloss(page.forYou ?? [])).toMatch(/horse/);
    expect(page && plainGloss(page.forYou ?? [])).toMatch(/rat/);
    expect(page && plainGloss(page.forYou ?? [])).toMatch(/work/);
  });

  it("every topic has 2–3 things it's good for and 1–2 to hold off on, in plain words", () => {
    const entries: [string, TopicSuits | undefined][] = [
      ...TEN_GODS.map((english): [string, TopicSuits | undefined] => [english, TEN_GOD_SUITS[english]]),
      ...STAGE_LABELS.map((stage): [string, TopicSuits | undefined] => [stage, STAGE_SUITS[stage]]),
      ...ELEMENTS.flatMap((element): [string, TopicSuits][] => [
        [`${element} suits`, ELEMENT_SUITS[element].suits],
        [`${element} against`, ELEMENT_SUITS[element].against],
      ]),
      ...INTERACTIONS.map((interaction): [string, TopicSuits] => [interaction, INTERACTION_SUITS[interaction]]),
    ];
    for (const [key, entry] of entries) {
      expect(entry, `no suits for ${key}`).toBeDefined();
      if (!entry) continue;
      expect(entry.goodFor.length, key).toBeGreaterThanOrEqual(2);
      expect(entry.goodFor.length, key).toBeLessThanOrEqual(3);
      expect(entry.holdOff.length, key).toBeGreaterThanOrEqual(1);
      expect(entry.holdOff.length, key).toBeLessThanOrEqual(2);
      for (const item of [...entry.goodFor, ...entry.holdOff]) {
        assertVoice(item);
        assertPlain(item);
        expect(item, `no closing full stop: "${item}"`).not.toMatch(/\.$/);
      }
    }
  });

  it("an unknown topic has no page", () => {
    expect(topicPage("nonsense", dayWith([]))).toBeNull();
    expect(topicPage("interaction:six-clash:month", dayWith([]))).toBeNull();
  });
});
