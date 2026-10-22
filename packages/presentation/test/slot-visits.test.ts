/**
 * M24-11 R3: each slot's visit count, from one 60-day scan with no history.
 * Over 150 days (two block boundaries), every slot's count goes up by exactly
 * one from each occurrence to the next, which holds only if what each slot
 * depends on really repeats with the day pillar.
 */

import { describe, expect, it } from "vitest";
import { addDays } from "../src/dates.js";
import { slotVisits } from "../src/slot-visits.js";
import { FIXTURE_A, FIXTURE_D, FIXTURE_UNKNOWN_TIME } from "./fixtures.js";

const START = "2026-09-01";
const DAYS = 150;

describe.each([
  ["A", FIXTURE_A],
  ["unknown time", FIXTURE_UNKNOWN_TIME],
  ["D", FIXTURE_D]
] as const)("slot visits — fixture %s", (_name, profile) => {
  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = addDays(START, index);
    return { date, visits: slotVisits(profile, date) };
  });

  it("counts one more for each occurrence of a slot", () => {
    const last = new Map<string, { date: string; visit: number }>();
    for (const { date, visits } of days) {
      for (const [slot, visit] of Object.entries(visits)) {
        const previous = last.get(slot);
        if (previous) {
          expect(visit, `${slot}: ${previous.date} → ${date}`).toBe(previous.visit + 1);
        }
        last.set(slot, { date, visit });
      }
    }
  });

  it("covers the first screen, the cards and Today's colour", () => {
    const slots = new Set(days.flatMap(({ visits }) => Object.keys(visits)));
    for (const prefix of ["headline:", "body:", "agency:", "card:", "colour-line:"]) {
      expect([...slots].some((slot) => slot.startsWith(prefix)), prefix).toBe(true);
    }
  });

  it("is the same whichever day is asked first", () => {
    const date = days[70]!.date;
    expect(slotVisits(profile, date)).toEqual(days[70]!.visits);
  });
});

describe("slot visits — the block memo", () => {
  const LONDON = { ...FIXTURE_A, readingZone: "Europe/London" };
  const profiles = [FIXTURE_A, FIXTURE_D, LONDON];
  const dates = Array.from({ length: 70 }, (_, index) => addDays("2026-10-01", index));

  it("serves no other chart, zone or block, in any order", () => {
    // Alternating profiles misses the one-entry memo on every call: these are fresh computations.
    const fresh = new Map<string, unknown>();
    for (const date of dates) {
      for (const [index, profile] of profiles.entries()) {
        fresh.set(`${index}|${date}`, slotVisits(profile, date));
      }
    }
    for (const [index, profile] of profiles.entries()) {
      for (const date of [...dates].reverse()) {
        expect(slotVisits(profile, date), `${index} ${date}`).toEqual(fresh.get(`${index}|${date}`));
      }
    }
  });
});

