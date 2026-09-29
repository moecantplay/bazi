/**
 * True solar time loads on demand (M19.8-08): astronomy-engine stays out of
 * the default browser bundle, so a chart with trueSolarTime on needs
 * `ensureTrueSolarReady()` first. This file runs in its own module scope,
 * so nothing is preloaded when it starts.
 */

import { describe, expect, it } from "vitest";
import { dayPillar, ensureTrueSolarReady, type EngineConfig } from "../src/index.js";

const TRUE_SOLAR: EngineConfig = { lateZiHour: "midnight", trueSolarTime: true };
const instant = new Date("2000-06-15T00:30:00Z");

describe("true solar time preload", () => {
  it("a civil-time chart never needs it", () => {
    expect(() => dayPillar(instant, "UTC")).not.toThrow();
  });

  it("says what to do when a true-solar chart is computed before the preload", () => {
    expect(() => dayPillar(instant, "UTC", TRUE_SOLAR, -30)).toThrow(/ensureTrueSolarReady/);
  });

  it("works once preloaded, and preloading twice is harmless", async () => {
    await ensureTrueSolarReady();
    await ensureTrueSolarReady();
    const solar = dayPillar(instant, "UTC", TRUE_SOLAR, -30);
    const civil = dayPillar(instant, "UTC");
    expect(`${solar.stem}${solar.branch}`).not.toBe(`${civil.stem}${civil.branch}`);
  });
});
