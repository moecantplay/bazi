/**
 * A topic page's view-model (M20-21 R11): the page behind one of Today's
 * cards, for one profile and date. Null when the date is outside Today's
 * range or the topic names nothing that day carries, so the screen can send
 * the reader back to Today. Reshape trial R14 adds the chart context the
 * fuller page needs.
 */

import { lifeStage, type Chart, type Palace } from "@daymaster/bazi-engine";
import { topicPage, type TopicContext, type TopicPage } from "@daymaster/content";
import { addDays, daysBetween } from "./dates.js";
import { chartFor } from "./chart.js";
import { dailyBundleFor } from "./reading.js";
import { TODAY_RANGE_DAYS } from "./today-screen.js";
import { daySoreSpot } from "./trial-sore-spot.js";
import type { StoredProfile } from "./types.js";

const MAX_RECURRENCES = 3;

function natalSigns(chart: Chart): TopicContext["natalSigns"] {
  const palaces: Palace[] = chart.hour ? ["year", "month", "day", "hour"] : ["year", "month", "day"];
  return palaces.map((palace) => ({ palace, branch: chart[palace as "year" | "month" | "day" | "hour"]!.branch }));
}

function natalClashPalaces(chart: Chart): Palace[] {
  return chart.interactions.filter((interaction) => interaction.type === "six-clash").flatMap((interaction) => interaction.palaces);
}

/** Up to three later dates in Today's range whose day carries the same topic. */
function recurrences(profile: StoredProfile, dateISO: string, todayISO: string, topic: string): string[] {
  const found: string[] = [];
  const last = addDays(todayISO, TODAY_RANGE_DAYS);
  for (let date = addDays(dateISO, 1); daysBetween(date, last) >= 0 && found.length < MAX_RECURRENCES; date = addDays(date, 1)) {
    if (topicPage(topic, dailyBundleFor(profile, date).facts) !== null) {
      found.push(date);
    }
  }
  return found;
}

export function topicPageFor(profile: StoredProfile, dateISO: string, todayISO: string, topic: string): TopicPage | null {
  if (Math.abs(daysBetween(todayISO, dateISO)) > TODAY_RANGE_DAYS) {
    return null;
  }
  const { facts, dayPillar } = dailyBundleFor(profile, dateISO);
  if (topicPage(topic, facts) === null) {
    return null;
  }
  const chart = chartFor(profile);
  const neighbour = (offset: number) => lifeStage(chart.dayMaster, dailyBundleFor(profile, addDays(dateISO, offset)).dayPillar.branch).english;
  const context: TopicContext = {
    strength: chart.strength.value,
    sore: daySoreSpot(chart, dayPillar, facts),
    natalSigns: natalSigns(chart),
    natalClashPalaces: natalClashPalaces(chart),
    stageNeighbours: topic.startsWith("stage:") ? { yesterday: neighbour(-1), tomorrow: neighbour(1) } : null,
    recurrences: recurrences(profile, dateISO, todayISO, topic),
  };
  return topicPage(topic, facts, context);
}
