/**
 * Shared E2E helpers: the fixture profiles, deterministic localStorage seeding,
 * and a pinned clock. Clock pinning and seeding both use addInitScript on the
 * context so they apply before any app script runs, on every page.
 */

import type { BrowserContext } from "@playwright/test";

const JAKARTA = {
  name: "Jakarta",
  country: "Indonesia",
  lat: -6.2146,
  lng: 106.8451,
  tz: "Asia/Jakarta"
};

/** Fixture A: 1994-12-08 16:30 Asia/Jakarta, male. Pillars 甲戌 丙子 戊辰 庚申. */
export const FIXTURE_A = {
  birth: { date: "1994-12-08", time: "16:30", city: JAKARTA, sex: "male" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

/** A late-Zi birth (23:30): the case where the late-Zi toggle changes the day. */
export const FIXTURE_LATE_ZI = {
  birth: { date: "1994-12-08", time: "23:30", city: JAKARTA, sex: "male" },
  config: { lateZiHour: "midnight", trueSolarTime: false },
  createdAt: "2026-01-01T00:00:00.000Z"
};

export const PROFILE_KEY = "daymaster.profile.v1";

/** Seed the stored profile before the app loads. */
export async function seedProfile(context: BrowserContext, profile: unknown): Promise<void> {
  await context.addInitScript(
    ([key, json]) => {
      window.localStorage.setItem(key, json);
    },
    [PROFILE_KEY, JSON.stringify(profile)] as const
  );
}

export const COMPARE_KEY = "daymaster.compare.v1";

/** Seed the stored comparison companion before the app loads. */
export async function seedCompanion(context: BrowserContext, birth: unknown): Promise<void> {
  await context.addInitScript(
    ([key, json]) => {
      window.localStorage.setItem(key, json);
    },
    [COMPARE_KEY, JSON.stringify(birth)] as const
  );
}

/** Pin `new Date()` / `Date.now()` to a fixed instant for date-dependent screens. */
export async function pinClock(context: BrowserContext, iso: string): Promise<void> {
  await context.addInitScript((isoStr: string) => {
    const fixed = new Date(isoStr).getTime();
    const RealDate = Date;
    class FakeDate extends RealDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixed);
        } else {
          // @ts-expect-error forward arbitrary Date constructor args
          super(...args);
        }
      }
      static now() {
        return fixed;
      }
    }
    // @ts-expect-error replace the global Date with the pinned subclass
    window.Date = FakeDate;
  }, iso);
}

/** The Today date-strip label for an ISO date (mirrors lib/dates.formatLong). */
export function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Add whole days to a YYYY-MM-DD label (UTC arithmetic). */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d) + days * 86_400_000);
  const mm = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getUTCDate()}`.padStart(2, "0");
  return `${date.getUTCFullYear()}-${mm}-${dd}`;
}
