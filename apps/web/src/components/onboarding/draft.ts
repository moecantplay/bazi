/**
 * The in-progress onboarding answers, before they become a StoredProfile —
 * plus their sessionStorage persistence, so an accidental refresh mid-flow
 * doesn't throw away everything already entered. Session-scoped on purpose:
 * closing the tab abandons the draft, only the saved profile is durable.
 *
 * This key (`daymaster.onboarding.v1`) is deliberately outside the single-
 * store consolidation (store.ts) — it's transient, self-clearing draft
 * state, not part of the versioned document.
 */

import { DEFAULT_CONFIG } from "@daymaster/bazi-engine";
import { DEFAULT_LOOK } from "@/lib/store";
import { isStoredCity, parseLookPreference, type LookPreference, type Sex, type StoredCity } from "@/lib/store-types";

export interface OnboardingDraft {
  date: string; // YYYY-MM-DD, "" until entered
  time: string; // HH:mm, "" until entered
  timeUnknown: boolean;
  city: StoredCity | null;
  sex: Sex | null;
  /** Chosen on the look step, just before the reveal (M19.9-04). */
  look: LookPreference;
}

export const EMPTY_DRAFT: OnboardingDraft = {
  date: "",
  time: "",
  timeUnknown: false,
  city: null,
  sex: null,
  look: DEFAULT_LOOK
};

/** The engine settings a new chart starts with (the look step's preview and the reveal both use them). */
export const ONBOARDING_CONFIG = {
  lateZiHour: DEFAULT_CONFIG.lateZiHour,
  trueSolarTime: DEFAULT_CONFIG.trueSolarTime
};

export interface DraftEnvelope {
  step: number;
  draft: OnboardingDraft;
}

const DRAFT_KEY = "daymaster.onboarding.v1";
/** Restore lands on the last gathering step (the look step) at most, never mid-reveal. */
const MAX_RESTORE_STEP = 5;

/** A draft saved before the look step existed has no `look`; `withLook` fills it. */
function isDraft(value: unknown): value is Omit<OnboardingDraft, "look"> & { look?: unknown } {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const draft = value as Record<string, unknown>;
  const cityOk = draft.city === null || isStoredCity(draft.city);
  const sexOk = draft.sex === null || draft.sex === "male" || draft.sex === "female";
  return (
    typeof draft.date === "string" &&
    typeof draft.time === "string" &&
    typeof draft.timeUnknown === "boolean" &&
    cityOk &&
    sexOk
  );
}

/** The persisted draft and step, or a fresh start when absent/unreadable. */
export function loadDraftEnvelope(): DraftEnvelope {
  const fresh: DraftEnvelope = { step: 0, draft: EMPTY_DRAFT };
  if (typeof window === "undefined") {
    return fresh;
  }
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (raw === null) {
      return fresh;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return fresh;
    }
    const envelope = parsed as Record<string, unknown>;
    if (typeof envelope.step !== "number" || !isDraft(envelope.draft)) {
      return fresh;
    }
    const step = Math.min(Math.max(Math.trunc(envelope.step), 0), MAX_RESTORE_STEP);
    return { step, draft: { ...envelope.draft, look: parseLookPreference(envelope.draft.look) ?? DEFAULT_LOOK } };
  } catch {
    return fresh;
  }
}

/** Persist the current answers and step for this browsing session. */
export function saveDraftEnvelope(envelope: DraftEnvelope): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(envelope));
  } catch {
    // Storage denied: the draft just won't survive a refresh.
  }
}

/** Drop the draft — called once the profile is saved for real. */
export function clearDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clean up if storage is unreachable.
  }
}
