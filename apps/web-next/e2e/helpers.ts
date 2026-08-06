/**
 * Shared E2E helpers: the fixture profiles, deterministic localStorage seeding
 * against the new `daymaster.store.v2` document, and a pinned clock. Clock
 * pinning and seeding both use addInitScript on the context so they apply
 * before any app script runs, on every page.
 *
 * Unlike apps/web's six separate `daymaster.*.v1` keys, the new app reads and
 * writes one versioned document (store.ts's DaymasterStore). seedProfile and
 * seedCompanion keep their old names for continuity, but each now does a
 * read-modify-write against that single key so they stay composable — calling
 * both in either order merges into one correct document, exactly like the old
 * app's independent keys did. seedStore is the general escape hatch for tests
 * that need finer control (multiple people, a pinned theme, etc). All three
 * bypass store-migration.ts entirely — that path has its own dedicated spec,
 * see store-migration.spec.ts.
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

export const STORE_KEY = "daymaster.store.v2";

/**
 * Merge a partial DaymasterStore into whatever this context has already
 * seeded (or start from an empty document). Runs in the page before any app
 * script, so multiple seed* calls on the same context compose regardless of
 * call order.
 */
export async function seedStore(context: BrowserContext, partial: Record<string, unknown>): Promise<void> {
  await context.addInitScript(
    ([key, partialJson]) => {
      const partialValue = JSON.parse(partialJson);
      let store: Record<string, unknown> | null = null;
      try {
        const raw = window.localStorage.getItem(key);
        store = raw ? JSON.parse(raw) : null;
      } catch {
        store = null;
      }
      if (!store || store.app !== "daymaster") {
        store = {
          app: "daymaster",
          version: 2,
          updatedAt: new Date().toISOString(),
          profile: null,
          people: [],
          activePersonId: null,
          theme: "system"
        };
      }
      window.localStorage.setItem(key, JSON.stringify({ ...store, ...partialValue }));
    },
    [STORE_KEY, JSON.stringify(partial)] as const
  );
}

/** Seed the stored profile before the app loads. */
export async function seedProfile(context: BrowserContext, profile: unknown): Promise<void> {
  await seedStore(context, { profile });
}

/** Seed one saved comparison person, already selected, before the app loads. */
export async function seedCompanion(context: BrowserContext, birth: unknown): Promise<void> {
  const person = { id: "seeded-person", name: "Them", birth };
  await seedStore(context, { people: [person], activePersonId: person.id });
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

/** The Today date-strip label for an ISO date (mirrors presentation's formatLong). */
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
