/**
 * The stored-profile shapes every view-model in this package derives from.
 * Presentation is the canonical home for these types (the pure layer
 * everything else builds on); the localStorage read/write functions that
 * validate and persist them stay in apps/web.
 */

export type Sex = "male" | "female";
export type LateZiHour = "midnight" | "shift-day";

export interface StoredCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
}

export interface StoredBirth {
  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm, null = unknown
  city: StoredCity;
  sex: Sex;
}

export interface StoredConfig {
  lateZiHour: LateZiHour;
  trueSolarTime: boolean;
}

export interface StoredProfile {
  birth: StoredBirth;
  config: StoredConfig;
  createdAt: string; // ISO
}

export interface StoredPerson {
  id: string;
  name: string;
  birth: StoredBirth;
}
