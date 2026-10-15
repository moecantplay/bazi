/**
 * The first week (M24-10): one note a day on the reader's opened days 2–7,
 * each part once, in a fixed order, only when that part is on screen, and the
 * same answer on a reload.
 */

import { describe, expect, it } from "vitest";
import { FIRST_WEEK_NOTES } from "@daymaster/content";
import {
  FIRST_WEEK_DAYS,
  INTRO_ORDER,
  addDays,
  firstWeekNote,
  partsOnScreen,
  startFirstWeek,
  todayColourFor,
  todayScreenModel,
  type FirstWeekState,
  type IntroPart
} from "../src/index.js";
import { FIXTURE_A, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

const EVERY_PART: readonly IntroPart[] = INTRO_ORDER;

/** Opens Today on each date in turn, as the web layer does, and returns each day's part. */
function walk(dates: readonly string[], onScreen: (dateISO: string) => readonly IntroPart[]): (IntroPart | null)[] {
  let state: FirstWeekState | null = startFirstWeek();
  const parts: (IntroPart | null)[] = [];
  for (const dateISO of dates) {
    if (state === null) {
      parts.push(null);
      continue;
    }
    const step = firstWeekNote(state, dateISO, onScreen(dateISO));
    if (step.part !== null) {
      expect(onScreen(dateISO)).toContain(step.part);
    }
    parts.push(step.part);
    state = step.next;
  }
  return parts;
}

function days(start: string, count: number, stride = 1): string[] {
  return Array.from({ length: count }, (_, index) => addDays(start, index * stride));
}

describe("firstWeekNote", () => {
  it("shows nothing on day one, one part a day on days 2–7, then finishes", () => {
    const parts = walk(days("2026-10-15", 9), () => EVERY_PART);
    expect(parts).toEqual([null, ...INTRO_ORDER.slice(0, FIRST_WEEK_DAYS - 1), null, null]);
  });

  it("counts opened days, not calendar days", () => {
    const parts = walk(days("2026-10-15", 7, 5), () => EVERY_PART);
    expect(parts).toEqual([null, ...INTRO_ORDER.slice(0, FIRST_WEEK_DAYS - 1)]);
  });

  it("gives the same part on a reload the same day, and leaves the state untouched", () => {
    const first = firstWeekNote(startFirstWeek(), "2026-10-15", EVERY_PART);
    const second = firstWeekNote(first.next!, "2026-10-16", EVERY_PART);
    const reload = firstWeekNote(second.next!, "2026-10-16", EVERY_PART);
    expect(reload.part).toBe(second.part);
    expect(reload.day).toBe(2);
    expect(reload.next).toBe(second.next);
  });

  it("drops today's note on a reload if its part has left the screen", () => {
    const first = firstWeekNote(startFirstWeek(), "2026-10-15", EVERY_PART);
    const second = firstWeekNote(first.next!, "2026-10-16", EVERY_PART);
    const withoutHours = EVERY_PART.filter((part) => part !== "hours");
    const reload = firstWeekNote(second.next!, "2026-10-16", withoutHours);
    expect(second.part).toBe("hours");
    expect(reload.part).toBeNull();
    expect(reload.next).toBe(second.next);
  });

  it("waits for a part that isn't on screen and never repeats one", () => {
    const withoutHours = EVERY_PART.filter((part) => part !== "hours");
    const parts = walk(days("2026-10-15", 4), (dateISO) => (dateISO === "2026-10-16" ? withoutHours : EVERY_PART));
    expect(parts).toEqual([null, "character", "hours", "pace"]);
  });

  it("shows nothing on a day when every part on screen has had its note", () => {
    const parts = walk(days("2026-10-15", 3), () => ["hours"]);
    expect(parts).toEqual([null, "hours", null]);
  });

  it("finishes on the eighth opened day", () => {
    let state: FirstWeekState | null = startFirstWeek();
    for (const dateISO of days("2026-10-15", FIRST_WEEK_DAYS)) {
      state = firstWeekNote(state!, dateISO, EVERY_PART).next;
    }
    expect(state).not.toBeNull();
    expect(firstWeekNote(state!, "2026-10-30", EVERY_PART)).toEqual({ part: null, day: 0, next: null });
  });
});

describe("partsOnScreen", () => {
  for (const [name, profile] of [["A", FIXTURE_A], ["unknown time", FIXTURE_UNKNOWN_TIME]] as const) {
    it(`fixture ${name}: lists only parts Today shows, in the fixed order, for 60 days`, () => {
      for (const dateISO of days("2026-10-15", 60)) {
        const model = todayScreenModel(profile, dateISO, dateISO);
        const parts = partsOnScreen(profile, dateISO, model.reading.cards);
        expect(parts).toEqual(INTRO_ORDER.filter((part) => parts.includes(part)));
        expect(parts).toEqual(expect.arrayContaining(["suits", "journal"]));
        const topics = model.reading.cards.map((card) => card.topic);
        expect(parts.includes("hours")).toBe(topics.includes("hours"));
        expect(parts.includes("small-signs")).toBe(topics.includes("stars"));
        expect(parts.includes("also-today")).toBe(topics.some((topic) => topic.startsWith("interaction:")));
        expect(parts.includes("character")).toBe(topics.some((topic) => topic.startsWith("ten-god:")));
        expect(parts.includes("pace")).toBe(topics.some((topic) => topic.startsWith("stage:")));
        expect(parts.includes("element")).toBe(topics.some((topic) => topic.startsWith("element:")));
        expect(parts.includes("colour")).toBe(todayColourFor(profile, dateISO) !== null);
      }
    });

    it(`fixture ${name}: a week walked from a real date gives six different parts`, () => {
      const parts = walk(days("2026-10-15", FIRST_WEEK_DAYS), (dateISO) =>
        partsOnScreen(profile, dateISO, todayScreenModel(profile, dateISO, dateISO).reading.cards)
      );
      const shown = parts.filter((part): part is IntroPart => part !== null);
      expect(parts[0]).toBeNull();
      expect(shown).toHaveLength(FIRST_WEEK_DAYS - 1);
      expect(new Set(shown).size).toBe(shown.length);
    });
  }
});

describe("INTRO_ORDER", () => {
  it("names every part that has a note, once", () => {
    expect([...INTRO_ORDER].sort()).toEqual(Object.keys(FIRST_WEEK_NOTES).sort());
  });
});
