/** The in-progress onboarding answers, before they become a StoredProfile. */

import type { Sex, StoredCity } from "@/lib/profile";

export interface OnboardingDraft {
  date: string; // YYYY-MM-DD, "" until entered
  time: string; // HH:mm, "" until entered
  timeUnknown: boolean;
  city: StoredCity | null;
  sex: Sex | null;
}

export const EMPTY_DRAFT: OnboardingDraft = {
  date: "",
  time: "",
  timeUnknown: false,
  city: null,
  sex: null
};
