/**
 * A topic page's view-model (M20-21 R11): the page behind one of Today's
 * cards, for one profile and date. Null when the date is outside Today's
 * range or the topic names nothing that day carries, so the screen can send
 * the reader back to Today.
 */

import { topicPage, type TopicPage } from "@daymaster/content";
import { daysBetween } from "./dates.js";
import { dailyBundleFor } from "./reading.js";
import { TODAY_RANGE_DAYS } from "./today-screen.js";
import type { StoredProfile } from "./types.js";

export function topicPageFor(
  profile: StoredProfile,
  dateISO: string,
  todayISO: string,
  topic: string
): TopicPage | null {
  if (Math.abs(daysBetween(todayISO, dateISO)) > TODAY_RANGE_DAYS) {
    return null;
  }
  return topicPage(topic, dailyBundleFor(profile, dateISO).facts);
}
