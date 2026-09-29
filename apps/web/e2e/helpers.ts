/**
 * Shared E2E helpers: the fixture profiles, deterministic localStorage seeding
 * against the new `daymaster.store.v2` document, and a pinned clock. Clock
 * pinning and seeding both use addInitScript on the context so they apply
 * before any app script runs, on every page.
 *
 * Unlike the pre-M19 app's six separate `daymaster.*.v1` keys, the app reads and
 * writes one versioned document (store.ts's DaymasterStore). seedProfile and
 * seedCompanion keep their old names for continuity, but each now does a
 * read-modify-write against that single key so they stay composable — calling
 * both in either order merges into one correct document, exactly like the old
 * app's independent keys did. seedStore is the general escape hatch for tests
 * that need finer control (multiple people, a pinned theme, etc). All three
 * bypass store-migration.ts entirely — that path has its own dedicated spec,
 * see store-migration.spec.ts.
 */

import type { BrowserContext, Page } from "@playwright/test";

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
 * The look every seeded store opens in. The whole suite runs once per look
 * (`E2E_LOOK=almanac|dial`, default trail), so every Today contract holds in
 * all three; specs that need a specific look seed `look` themselves.
 */
export const E2E_LOOK = process.env.E2E_LOOK ?? "trail";

/**
 * Merge a partial DaymasterStore into whatever this context has already
 * seeded (or start from an empty document). Runs in the page before any app
 * script, so multiple seed* calls on the same context compose regardless of
 * call order.
 */
export async function seedStore(context: BrowserContext, partial: Record<string, unknown>): Promise<void> {
  await context.addInitScript(
    ([key, partialJson, look]) => {
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
          theme: "system",
          look,
          // Seeded readers have already been told about looks; look-picker.spec.ts seeds without it.
          lookPromptSeen: true
        };
      }
      window.localStorage.setItem(key, JSON.stringify({ ...store, ...partialValue }));
    },
    [STORE_KEY, JSON.stringify(partial), E2E_LOOK] as const
  );
}

/**
 * Open every collapsed reading chapter (Editorial and Instrument start with
 * them closed; Explorer's cards are always open), leaving "What the day
 * suits" alone so specs that open that fold still control it.
 */
export async function openReading(page: Page): Promise<void> {
  const closed = page.locator('[data-reading-body] button[aria-expanded="false"]:not([data-go-deeper])');
  while ((await closed.count()) > 0) {
    await closed.first().click();
  }
}

/**
 * Walk onboarding for Fixture A (1994-12-08 16:30 Jakarta, male) up to and
 * including "Save chart", choosing `lookName` on the look step.
 */
export async function completeOnboarding(page: Page, lookName = "Explorer"): Promise<void> {
  await page.goto("/onboarding/");
  await page.fill('input[type="date"]', "1994-12-08");
  await page.getByRole("button", { name: "Next" }).click();
  await page.fill('input[type="time"]', "16:30");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Search for your birth city").fill("Jakarta");
  await page.getByRole("button", { name: /Jakarta/ }).first().click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("radio", { name: "Male", exact: true }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .locator(".overflow-y-auto")
    .first()
    .evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Show my chart" }).click();

  // The look step: the reader's own day previewed three ways.
  await page.getByRole("heading", { name: "Choose your look" }).waitFor();
  await page.getByRole("radio", { name: new RegExp(`^${lookName}`) }).click();
  await page.getByRole("button", { name: `Continue with ${lookName}` }).click();

  await page.getByText("Here is your chart.").waitFor();
  await page.getByRole("button", { name: "Save chart" }).click();
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

/**
 * Take the share sheet away and record clipboard writes instead of using the
 * real clipboard, so share flows run the same in every browser project:
 * WebKit has no clipboard permission to grant, and an emulated iPhone
 * exposes navigator.share, which would open a sheet no test can dismiss
 * (M19.8-09). Read what was copied with `copiedText`.
 */
export async function stubShareAndClipboard(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    for (const name of ["share", "canShare"]) {
      Object.defineProperty(Navigator.prototype, name, { value: undefined, configurable: true });
    }
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as unknown as { __copied?: string }).__copied = text;
        }
      }
    });
  });
}

/** The last text the app wrote to the (stubbed) clipboard. */
export async function copiedText(page: Page): Promise<string> {
  return page.evaluate(() => (window as unknown as { __copied?: string }).__copied ?? "");
}
