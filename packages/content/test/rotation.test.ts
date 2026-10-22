/** M24-11 R3: rotating picks step by the slot's visit count, else by day number, and list the slots they pick under. */

import { describe, expect, it } from "vitest";
import type { DayFact } from "@daymaster/bazi-engine";
import { dailyReading, dailySlots } from "../src/index.js";
import { fillSlots, firstUnused, pickerFor, steppedPicker, type RotationSlot } from "../src/rotation.js";
import { dailyFactSet } from "./collect.js";

const POOL = ["first", "second", "third"] as const;

describe("pickerFor", () => {
  it("steps one entry per visit, never repeating until the pool runs out", () => {
    const picks = [0, 1, 2].map((visit) => pickerFor({ chart: "chart", date: "2026-10-21", visits: { slot: visit } })(POOL, "slot"));
    expect(new Set(picks).size).toBe(3);
    const again = pickerFor({ chart: "chart", date: "2026-10-21", visits: { slot: 3 } })(POOL, "slot");
    expect(again).toBe(picks[0]);
  });

  it("falls back to the day number when the slot has no visit count", () => {
    const today = pickerFor({ chart: "chart", date: "2026-10-21" })(POOL, "slot");
    const tomorrow = pickerFor({ chart: "chart", date: "2026-10-22" })(POOL, "slot");
    expect(today).not.toBe(tomorrow);
  });

  it("lists every slot it picks under, with the pool size", () => {
    const record: RotationSlot[] = [];
    pickerFor({ chart: "chart", date: "2026-10-21" }, record)(POOL, "slot");
    expect(record).toEqual([{ slot: "slot", poolSize: 3 }]);
  });
});

describe("dailySlots", () => {
  const facts: DayFact[] = dailyFactSet("six-clash", "month", "daily");

  it("names the first screen's slots by the lead's situation, and every card's", () => {
    const slots = dailySlots(facts, "chart").map((entry) => entry.slot);
    expect(slots).toEqual(expect.arrayContaining(["headline:six-clash:work", "body:six-clash:work", "agency:six-clash:work"]));
    expect(slots.some((slot) => slot.startsWith("card:"))).toBe(true);
    expect(new Set(slots).size).toBe(slots.length);
  });

  it("is the slots dailyReading steps by: a visit count changes that slot's pick only", () => {
    const visits = Object.fromEntries(dailySlots(facts, "chart").map((entry) => [entry.slot, 0]));
    const base = dailyReading(facts, { chart: "chart", date: "2026-10-21", visits });
    const stepped = dailyReading(facts, { chart: "chart", date: "2026-10-21", visits: { ...visits, "headline:six-clash:work": 1 } });
    expect(stepped.headline).not.toEqual(base.headline);
    expect(stepped.body).toEqual(base.body);
    expect(stepped.agency).toEqual(base.agency);
  });
});

describe("steppedPicker", () => {
  it("steps every slot by the one number it is given", () => {
    const picks = [0, 1, 2].map((step) => steppedPicker("chart", step)(POOL, "slot"));
    expect(new Set(picks).size).toBe(3);
  });
});

describe("firstUnused", () => {
  it("takes the first entry the screen hasn't shown, else the first", () => {
    const shown = new Set(["first"]);
    expect(firstUnused(POOL, (entry) => shown.has(entry))).toBe("second");
    expect(firstUnused(["only"], () => true)).toBe("only");
  });
});

describe("fillSlots", () => {
  it("fills every placeholder", () => {
    expect(fillSlots("{window} suits you, {window}.", { window: "5–7 pm" })).toBe("5–7 pm suits you, 5–7 pm.");
  });
});
