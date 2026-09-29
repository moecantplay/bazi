/**
 * Loads true solar time on demand (M19.8-08). It is the only runtime user of
 * astronomy-engine, and it is off by default, so the browser bundle leaves it
 * in a separate chunk. A caller that computes a chart with `trueSolarTime` on
 * awaits `ensureTrueSolarReady()` first; `pillars.ts` then applies it
 * synchronously, so every pillar function keeps its signature.
 */

type ApplyTrueSolarTime = typeof import("./true-solar-time.js").applyTrueSolarTime;

let loaded: ApplyTrueSolarTime | null = null;

/** Load the true-solar-time module. Safe to call any number of times. */
export async function ensureTrueSolarReady(): Promise<void> {
  if (loaded === null) {
    loaded = (await import("./true-solar-time.js")).applyTrueSolarTime;
  }
}

/** Apply true solar time; throws if `ensureTrueSolarReady()` hasn't finished. */
export function applyLoadedTrueSolarTime(instant: Date, zone: string, longitude: number): Date {
  if (loaded === null) {
    throw new Error(
      "True solar time isn't loaded: await ensureTrueSolarReady() before computing a chart with trueSolarTime on",
    );
  }
  return loaded(instant, zone, longitude);
}
