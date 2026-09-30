/**
 * The composed daily reading (M20-21): one lead fact, a first screen written
 * as one piece in everyday words, and a plain topic card for every other fact.
 */

import { describe, expect, it } from "vitest";
import type { Element, InteractionType, Palace, ReadingFact } from "@daymaster/bazi-engine";
import { dailyReading, plainGloss } from "../src/index.js";
import type { DailyReading } from "../src/index.js";
import {
  AGENCY,
  BODY_BASES,
  HEADLINES,
  LIFE_AREAS,
  MODIFIERS,
  QUIET_AGENCY,
  QUIET_BODIES,
  QUIET_HEADLINES,
} from "../src/readings/daily/pools.js";
import { ELEMENTS, INTERACTIONS, NATAL_PALACES, STAGE_LABELS, STAR_KEYS, TEN_GODS, dailyFactSet } from "./collect.js";
import { assertPlain, sentenceCount, sharedFourGrams, wordsOf } from "./plain-terms.js";

const SEED = { chart: "chart-seed", date: "2026-09-29" };
const FRICTION: readonly InteractionType[] = ["six-clash", "punishment", "harm"];
const BANNED: readonly RegExp[] = [/\benergy\b/i, /\buniverse\b/i, /\bdestiny\b/i, /\bfate\b/i, /\byou will\b/i, /\byou can't\b/i, /\bmust\b/i, /\bshould\b/i];
const FIRST_SCREEN_BUDGET = 70;

function text(line: { runs: Parameters<typeof plainGloss>[0] }): string {
  return plainGloss(line.runs);
}

function assertVoice(line: string): void {
  for (const pattern of BANNED) {
    expect(pattern.test(line), `banned by ${pattern}: "${line}"`).toBe(false);
  }
}

function transit(interaction: InteractionType, palace: Palace): ReadingFact {
  return { kind: "transit-interaction", interaction, branches: ["子", "午"], natalPalaces: [palace], transitPalace: "daily", transitBranch: "午" };
}

function baseDay(element: Element, favorable: boolean, english = "Friend"): ReadingFact[] {
  return [
    { kind: "element-day", element, favorable },
    { kind: "ten-god-day", god: "比肩", english },
    { kind: "stage-day", stage: { chinese: "帝旺", english: "Peak" } },
    { kind: "hour-interaction", interaction: "six-clash", hourBranch: "子", dayBranch: "午", startHour: 23, endHour: 1 },
    { kind: "hour-interaction", interaction: "six-combine", hourBranch: "未", dayBranch: "午", startHour: 13, endHour: 15 },
  ];
}

function firstScreen(reading: DailyReading): string[] {
  return [text(reading.headline), text(reading.body), text(reading.agency)];
}

describe("lead", () => {
  it("the strongest interaction leads, whatever order the facts arrive in", () => {
    const facts = [transit("trine", "year"), transit("six-clash", "month"), ...baseDay("fire", true)];
    expect(dailyReading(facts, SEED).leadTopic).toBe("interaction:six-clash:month");
    expect(dailyReading([...facts].reverse(), SEED).leadTopic).toBe("interaction:six-clash:month");
  });

  it("harm leads over a combine", () => {
    const facts = [transit("six-combine", "day"), transit("harm", "year"), ...baseDay("earth", true)];
    expect(dailyReading(facts, SEED).leadTopic).toBe("interaction:harm:year");
  });

  it("the day's character leads when nothing pulls on the chart", () => {
    const reading = dailyReading(baseDay("metal", true, "Hurting Officer"), SEED);
    expect(reading.leadTopic).toBe("ten-god:Hurting Officer");
    expect(reading.cards.some((card) => card.topic.startsWith("ten-god:"))).toBe(false);
  });
});

describe("cards", () => {
  it("every non-lead fact has exactly one card and the lead has none", () => {
    const facts = [transit("six-clash", "month"), transit("trine", "year"), ...baseDay("fire", false),
      { kind: "star-day", star: "yima-travel-horse", chinese: "驛馬", english: "Travel Horse", transitPalace: "daily" } as ReadingFact];
    const reading = dailyReading(facts, SEED);
    const topics = reading.cards.map((card) => card.topic);
    expect(topics).toEqual(["interaction:trine:year", "element:fire", "ten-god:Friend", "hours", "stage:Peak", "stars"]);
    expect(topics).not.toContain(reading.leadTopic);
  });

  it("the element joins the first screen instead of a card when it changes the advice", () => {
    const friction = dailyReading([transit("six-clash", "month"), ...baseDay("fire", true)], SEED);
    expect(friction.cards.some((card) => card.topic.startsWith("element:"))).toBe(false);
    const agreeing = dailyReading([transit("six-clash", "month"), ...baseDay("fire", false)], SEED);
    expect(agreeing.cards.some((card) => card.topic === "element:fire")).toBe(true);
    const support = dailyReading([transit("trine", "day"), ...baseDay("water", false)], SEED);
    expect(support.cards.some((card) => card.topic.startsWith("element:"))).toBe(false);
  });

  it("card text is plain for every star, stage, day character, element and interaction", () => {
    const facts: ReadingFact[] = [];
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        facts.push(transit(interaction, palace));
      }
    }
    for (const key of STAR_KEYS) {
      facts.push({ kind: "star-day", star: key, chinese: "星", english: key, transitPalace: "daily" });
    }
    const readings: DailyReading[] = [];
    for (const english of TEN_GODS) {
      for (const element of ELEMENTS) {
        readings.push(dailyReading([...facts, ...baseDay(element, false, english)], SEED));
      }
    }
    for (const stage of STAGE_LABELS) {
      readings.push(dailyReading([...facts, ...baseDay("wood", true).filter((fact) => fact.kind !== "stage-day"),
        { kind: "stage-day", stage: { chinese: "階", english: stage } }], SEED));
    }
    for (const reading of readings) {
      for (const card of reading.cards) {
        for (const title of card.titles) {
          assertPlain(plainGloss(title));
          assertVoice(plainGloss(title));
        }
        if (card.line) {
          assertPlain(plainGloss(card.line));
          assertVoice(plainGloss(card.line));
          expect(sentenceCount(plainGloss(card.line))).toBeLessThanOrEqual(2);
        }
      }
    }
  });
});

describe("pools", () => {
  it("every cell's pool size steps to a new entry each time the cell recurs", () => {
    // A sign-link situation recurs 3, 4, 6, 8, 9 or 12 days apart and the pick
    // advances one entry a day, so its pool size may divide none of those:
    // with 3 entries a 12-day cycle would land on the same one every time.
    const RECURRENCES = [3, 4, 6, 8, 9, 12];
    for (const interaction of INTERACTIONS) {
      for (const area of LIFE_AREAS) {
        for (const [name, pool] of [["body", BODY_BASES], ["headline", HEADLINES], ["agency", AGENCY]] as const) {
          const size = pool[interaction][area].length;
          expect(size, `${name} ${interaction}:${area}`).toBeGreaterThanOrEqual(5);
          expect(RECURRENCES.filter((days) => days % size === 0), `${name} ${interaction}:${area} size ${size}`).toEqual([]);
        }
      }
    }
    // A quiet day's character recurs every 10 days (the stem cycle).
    for (const english of TEN_GODS) {
      expect(10 % (QUIET_BODIES[english]?.length ?? 1), `quiet body ${english}`).not.toBe(0);
      expect(10 % (QUIET_HEADLINES[english]?.length ?? 1), `quiet headline ${english}`).not.toBe(0);
      expect(10 % (QUIET_AGENCY[english]?.length ?? 1), `quiet agency ${english}`).not.toBe(0);
      expect(QUIET_BODIES[english]?.length ?? 0, `quiet body ${english}`).toBeGreaterThanOrEqual(3);
      expect(QUIET_HEADLINES[english]?.length ?? 0, `quiet headline ${english}`).toBeGreaterThanOrEqual(3);
      expect(QUIET_AGENCY[english]?.length ?? 0, `quiet agency ${english}`).toBeGreaterThanOrEqual(3);
    }
    for (const element of ELEMENTS) {
      expect(MODIFIERS[element].suits.length).toBeGreaterThanOrEqual(3);
      expect(MODIFIERS[element].against.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every entry is plain and voice-clean", () => {
    const all: string[] = [
      ...INTERACTIONS.flatMap((interaction) => LIFE_AREAS.flatMap((area) => [
        ...BODY_BASES[interaction][area], ...HEADLINES[interaction][area], ...AGENCY[interaction][area]])),
      ...Object.values(QUIET_BODIES).flat(), ...Object.values(QUIET_HEADLINES).flat(), ...Object.values(QUIET_AGENCY).flat(),
      ...ELEMENTS.flatMap((element) => [...MODIFIERS[element].suits, ...MODIFIERS[element].against]),
    ];
    for (const entry of all) {
      assertPlain(entry);
      assertVoice(entry);
    }
  });

  it("any combination of a cell's entries fits the first screen and says nothing twice", () => {
    type Combo = { headlines: readonly string[]; bases: readonly string[]; modifiers: readonly string[]; agencies: readonly string[]; label: string };
    const combos: Combo[] = [];
    for (const interaction of INTERACTIONS) {
      const tone = FRICTION.includes(interaction) ? "suits" : "against";
      for (const area of LIFE_AREAS) {
        for (const element of ELEMENTS) {
          combos.push({ headlines: HEADLINES[interaction][area], bases: BODY_BASES[interaction][area],
            modifiers: ["", ...MODIFIERS[element][tone]], agencies: AGENCY[interaction][area], label: `${interaction}:${area}:${element}` });
        }
      }
    }
    for (const english of TEN_GODS) {
      for (const element of ELEMENTS) {
        for (const tone of ["suits", "against"] as const) {
          combos.push({ headlines: QUIET_HEADLINES[english] ?? [], bases: QUIET_BODIES[english] ?? [],
            modifiers: MODIFIERS[element][tone], agencies: QUIET_AGENCY[english] ?? [], label: `quiet:${english}:${element}:${tone}` });
        }
      }
    }
    for (const combo of combos) {
      for (const headline of combo.headlines) {
        expect(wordsOf(headline).length, `headline over 12 words: "${headline}"`).toBeLessThanOrEqual(12);
        for (const base of combo.bases) {
          for (const modifier of combo.modifiers) {
            const body = modifier ? `${base} ${modifier}` : base;
            const sentences = sentenceCount(body);
            expect(sentences, `body must be 2–3 sentences (${combo.label}): "${body}"`).toBeGreaterThanOrEqual(2);
            expect(sentences, `body must be 2–3 sentences (${combo.label}): "${body}"`).toBeLessThanOrEqual(3);
            for (const agency of combo.agencies) {
              const words = wordsOf(`${headline} ${body} ${agency}`).length;
              expect(words, `over ${FIRST_SCREEN_BUDGET} words (${combo.label}): ${headline} | ${body} | ${agency}`).toBeLessThanOrEqual(FIRST_SCREEN_BUDGET);
              const pairs: [string, string][] = [[headline, body], [headline, agency], [body, agency]];
              for (const [a, b] of pairs) {
                expect(sharedFourGrams(a, b), `repeats across the first screen (${combo.label}): "${a}" / "${b}"`).toEqual([]);
              }
            }
          }
        }
      }
    }
  });
});

describe("determinism", () => {
  it("the same facts and seed give the same reading", () => {
    for (const interaction of INTERACTIONS) {
      const facts = dailyFactSet(interaction, "month", "daily");
      expect(dailyReading(facts, SEED)).toEqual(dailyReading(facts, SEED));
    }
  });

  it("first-screen text is plain for every interaction, area and seed", () => {
    for (const interaction of INTERACTIONS) {
      for (const palace of NATAL_PALACES) {
        for (const date of ["2026-09-29", "2026-09-30", "2026-10-01"]) {
          const reading = dailyReading(dailyFactSet(interaction, palace, "daily"), { chart: "x", date });
          for (const line of firstScreen(reading)) {
            assertPlain(line);
          }
        }
      }
    }
  });
});
