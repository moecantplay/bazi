import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  analyticsAllowed,
  analyticsConfig,
  dropPending,
  sinceFirstChartBucket,
  streakBucket,
  track,
  trackPageview,
  type UsageTracker
} from "./analytics";
import { STORE_KEY, emptyStore } from "./store";
import { FakeStorage } from "./testing/fake-storage";

let localStorage: FakeStorage;
let window: { localStorage: FakeStorage; sessionStorage: FakeStorage; umami?: UsageTracker };

function configure() {
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SCRIPT_URL", "https://counts.example/script.js");
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SITE_ID", "site");
}

function recordingTracker() {
  const calls: unknown[] = [];
  const tracker: UsageTracker = {
    track(nameOrOverride: unknown, data?: Record<string, string>) {
      calls.push(
        typeof nameOrOverride === "function"
          ? nameOrOverride({ url: "https://app.example/chart/?q=1#share=x", title: "t" })
          : [nameOrOverride, data]
      );
    }
  } as UsageTracker;
  return { tracker, calls };
}

beforeEach(() => {
  localStorage = new FakeStorage();
  window = { localStorage, sessionStorage: new FakeStorage() };
  vi.stubGlobal("window", window);
  vi.stubGlobal("navigator", {});
  dropPending();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("configuration", () => {
  it("is dormant without a script URL and site ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SCRIPT_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SITE_ID", "");
    expect(analyticsConfig()).toBeNull();
    expect(analyticsAllowed()).toBe(false);
  });

  it("counts a configured build by default", () => {
    configure();
    expect(analyticsAllowed()).toBe(true);
  });

  it("respects the reader's choice in the store", () => {
    configure();
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...emptyStore(), usageCounts: false }));
    expect(analyticsAllowed()).toBe(false);
  });

  it("never creates a store just by checking", () => {
    configure();
    expect(analyticsAllowed()).toBe(true);
    track({ name: "backup-downloaded" });
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it("respects Global Privacy Control and Do Not Track", () => {
    configure();
    vi.stubGlobal("navigator", { globalPrivacyControl: true });
    expect(analyticsAllowed()).toBe(false);
    vi.stubGlobal("navigator", { doNotTrack: "1" });
    expect(analyticsAllowed()).toBe(false);
  });
});

describe("sending", () => {
  it("sends nothing when not allowed, even once a tracker exists", () => {
    const { tracker, calls } = recordingTracker();
    window.umami = tracker;
    track({ name: "backup-downloaded" });
    expect(calls).toEqual([]);
  });

  it("forwards an event with exactly its data", () => {
    configure();
    const { tracker, calls } = recordingTracker();
    window.umami = tracker;
    track({ name: "chart-shared", data: { kind: "link" } });
    track({ name: "data-deleted" });
    expect(calls).toEqual([
      ["chart-shared", { kind: "link" }],
      ["data-deleted", undefined]
    ]);
  });

  it("page views carry the route only", () => {
    configure();
    const { tracker, calls } = recordingTracker();
    window.umami = tracker;
    trackPageview("/chart/");
    expect(calls).toEqual([{ url: "/chart/", title: "t" }]);
  });
});

describe("buckets", () => {
  it("streak", () => {
    expect([1, 2, 6, 7, 29, 30, 400].map(streakBucket)).toEqual(["1", "2-6", "2-6", "7-29", "7-29", "30+", "30+"]);
  });

  it("days since the first chart", () => {
    const created = "2026-01-01T09:30:00.000Z";
    expect(sinceFirstChartBucket(created, "2026-01-01")).toBe("0");
    expect(sinceFirstChartBucket(created, "2026-01-02")).toBe("1-6");
    expect(sinceFirstChartBucket(created, "2026-01-08")).toBe("7-29");
    expect(sinceFirstChartBucket(created, "2026-01-31")).toBe("30-89");
    expect(sinceFirstChartBucket(created, "2026-09-29")).toBe("90+");
    expect(sinceFirstChartBucket("not a date", "2026-09-29")).toBe("0");
  });
});
