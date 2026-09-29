/**
 * The single gateway for anonymous usage counts (M19.8-06). Everything that
 * leaves the device for counting goes through `track`, whose event union is
 * the complete list — no call site can add a key. Nothing here ever reads
 * birth details or journal notes.
 *
 * Dormant by default: a build counts only when NEXT_PUBLIC_ANALYTICS_SCRIPT_URL
 * and NEXT_PUBLIC_ANALYTICS_SITE_ID are set (an Umami-compatible tracker —
 * its free cloud tier, or self-hosted once M21 has a backend). Even then a
 * reader is counted only if their store allows it and their browser sends no
 * Global Privacy Control or Do Not Track signal. No cookies, no identifiers.
 */

import { DEFAULT_LOOK, peekStore, type JournalMark } from "./store";
import type { LookPreference, StoredProfile } from "./store-types";

type YesNo = "yes" | "no";
export type StreakBucket = "1" | "2-6" | "7-29" | "30+";
export type SinceFirstChartBucket = "0" | "1-6" | "7-29" | "30-89" | "90+";
export type OnboardingStepName = "date" | "time" | "city" | "sex" | "disclaimer" | "look" | "reveal";

export type UsageEvent =
  | {
      name: "reading-opened";
      data: {
        look: LookPreference;
        theme: "light" | "dark";
        installed: YesNo;
        streak: StreakBucket;
        sinceFirstChart: SinceFirstChartBucket;
      };
    }
  | { name: "look-chosen"; data: { look: LookPreference; where: "onboarding" | "settings" | "note" } }
  | { name: "onboarding-step"; data: { step: OnboardingStepName } }
  | { name: "onboarding-finished"; data: { look: LookPreference } }
  | { name: "reading-marked"; data: { mark: JournalMark } }
  | { name: "chart-shared"; data: { kind: "image" | "link" } }
  | { name: "backup-downloaded" }
  | { name: "data-deleted" }
  /** `kind` is the error's name only: engine messages can contain the stored birth date. */
  | { name: "screen-error"; data: { route: string; kind: string } };

interface PageviewProps {
  url: string;
  [key: string]: unknown;
}

/** The part of Umami's tracker API this app uses. */
export interface UsageTracker {
  track(name: string, data?: Record<string, string>): void;
  track(override: (props: PageviewProps) => PageviewProps): void;
}

declare global {
  interface Window {
    umami?: UsageTracker;
  }
}

interface AnalyticsConfig {
  scriptUrl: string;
  siteId: string;
  /** Where events are sent, when that differs from the script's origin. */
  hostUrl: string | null;
}

/** The build's analytics configuration, or null when the build doesn't count at all. */
export function analyticsConfig(): AnalyticsConfig | null {
  const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
  const siteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID;
  if (!scriptUrl || !siteId) {
    return null;
  }
  return { scriptUrl, siteId, hostUrl: process.env.NEXT_PUBLIC_ANALYTICS_HOST_URL || null };
}

/** True when the browser sends Global Privacy Control or Do Not Track. */
export function browserAsksNotToTrack(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const signals = navigator as Navigator & { globalPrivacyControl?: boolean };
  return signals.globalPrivacyControl === true || signals.doNotTrack === "1";
}

/** Reads the store without migrating or writing: counting must never create a store (see peekStore). */
export function analyticsAllowed(): boolean {
  return analyticsConfig() !== null && !browserAsksNotToTrack() && (peekStore()?.usageCounts ?? true);
}

/**
 * Sends waiting for the tracker script. React runs a child's effects before
 * its parent's, so a screen can report before the layout has injected the
 * script; those sends queue here and flush on load.
 */
type Send = (tracker: UsageTracker) => void;
const MAX_PENDING = 50;
let pending: Send[] = [];

function dispatch(send: Send): void {
  if (typeof window === "undefined") {
    return;
  }
  if (!analyticsAllowed()) {
    pending = [];
    return;
  }
  if (window.umami) {
    send(window.umami);
    return;
  }
  if (pending.length < MAX_PENDING) {
    pending.push(send);
  }
}

function flushPending(): void {
  const queued = pending;
  pending = [];
  const tracker = window.umami;
  if (!tracker || !analyticsAllowed()) {
    return;
  }
  for (const send of queued) {
    send(tracker);
  }
}

/** Forget queued sends — the tracker failed to load, or a test starts fresh. */
export function dropPending(): void {
  pending = [];
}

export function track(event: UsageEvent): void {
  dispatch((tracker) => {
    if ("data" in event) {
      tracker.track(event.name, event.data);
    } else {
      tracker.track(event.name);
    }
  });
}

/** A page view that carries the route only: never a query string or fragment. */
export function trackPageview(pathname: string): void {
  dispatch((tracker) => tracker.track((props) => ({ ...props, url: pathname })));
}

/** Inject the tracker script once, if this reader and build allow counting. */
export function startUsageCounts(): void {
  const config = analyticsConfig();
  if (config === null || !analyticsAllowed() || document.querySelector("script[data-usage-counts]")) {
    return;
  }
  const script = document.createElement("script");
  script.src = config.scriptUrl;
  script.defer = true;
  script.dataset.usageCounts = "";
  script.dataset.websiteId = config.siteId;
  script.dataset.autoTrack = "false";
  script.dataset.doNotTrack = "true";
  if (config.hostUrl !== null) {
    script.dataset.hostUrl = config.hostUrl;
  }
  script.addEventListener("load", flushPending);
  script.addEventListener("error", dropPending);
  document.head.appendChild(script);
}

export function streakBucket(days: number): StreakBucket {
  if (days >= 30) {
    return "30+";
  }
  if (days >= 7) {
    return "7-29";
  }
  return days >= 2 ? "2-6" : "1";
}

/** Whole days from the chart's creation to `todayISO`, bucketed. */
export function sinceFirstChartBucket(createdAt: string, todayISO: string): SinceFirstChartBucket {
  const days = Math.floor(
    (Date.parse(`${todayISO}T00:00:00Z`) - Date.parse(`${createdAt.slice(0, 10)}T00:00:00Z`)) / 86_400_000
  );
  if (!Number.isFinite(days) || days <= 0) {
    return "0";
  }
  if (days >= 90) {
    return "90+";
  }
  if (days >= 30) {
    return "30-89";
  }
  return days >= 7 ? "7-29" : "1-6";
}

function currentTheme(): "light" | "dark" {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === "light" || pinned === "dark") {
    return pinned;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function installedToHomeScreen(): YesNo {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches ? "yes" : "no";
}

/** The first Today open of a day: which look, and how long this reader has been coming back. */
export function trackReadingOpened(profile: StoredProfile, streak: number, todayISO: string): void {
  if (!analyticsAllowed()) {
    return;
  }
  track({
    name: "reading-opened",
    data: {
      look: peekStore()?.look ?? DEFAULT_LOOK,
      theme: currentTheme(),
      installed: installedToHomeScreen(),
      streak: streakBucket(streak),
      sinceFirstChart: sinceFirstChartBucket(profile.createdAt, todayISO)
    }
  });
}
