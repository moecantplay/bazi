/**
 * The single gateway to the reading streak (`daymaster.streak.v1`): how many
 * consecutive civil days the Today screen has been opened. Purely local, never
 * part of a backup — it describes a habit on this device, not the chart.
 */

import { addDays } from "./dates";

const STREAK_KEY = "daymaster.streak.v1";

interface StoredStreak {
  count: number;
  lastOpen: string; // YYYY-MM-DD
}

function loadStreak(): StoredStreak | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const streak = parsed as Record<string, unknown>;
    if (typeof streak.count !== "number" || typeof streak.lastOpen !== "string") {
      return null;
    }
    return { count: streak.count, lastOpen: streak.lastOpen };
  } catch {
    return null;
  }
}

/**
 * Record that Today was opened on `todayIso` and return the current streak:
 * unchanged for a repeat visit, +1 the day after the last one, else back to 1.
 */
export function recordTodayOpen(todayIso: string): number {
  const existing = loadStreak();
  let count = 1;
  if (existing !== null) {
    if (existing.lastOpen === todayIso) {
      count = existing.count;
    } else if (addDays(existing.lastOpen, 1) === todayIso) {
      count = existing.count + 1;
    }
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STREAK_KEY, JSON.stringify({ count, lastOpen: todayIso }));
    } catch {
      // Storage denied: the streak just won't persist.
    }
  }
  return count;
}

/** Remove the stored streak (part of delete-my-data). */
export function clearStreak(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STREAK_KEY);
  } catch {
    // Nothing to clean up if storage is unreachable.
  }
}
