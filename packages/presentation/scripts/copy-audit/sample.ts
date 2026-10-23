/**
 * `copy-audit --sample <fixture>` (M24-11 R9): one chart's copy in reading
 * order, for the owner to read before the words ship. Seven days of Today,
 * each day's lead topic page, Ahead's twelve months of 2027 and People with
 * two other charts, all from the audit's own collection, so the sample is
 * exactly what the screens render.
 */

import type { AuditView } from "./metrics.js";
import { START, type Surfaces } from "./surfaces.js";
import { addDays } from "../../src/dates.js";

const SAMPLE_DAYS = 7;
const SAMPLE_PAIRINGS = 2;
const SAMPLE_YEAR = "2027";

function block(title: string, view: AuditView): string[] {
  return [`### ${title}`, "", ...view.slots.map((slot) => `- **${slot.slot}:** ${slot.text}`), ""];
}

/** The sample as Markdown. `leadTopics` maps each sampled date to the topic its reading leads with. */
export function sampleText(fixture: string, surfaces: Surfaces, leadTopics: ReadonlyMap<string, string>): string {
  const dates = Array.from({ length: SAMPLE_DAYS }, (_, index) => addDays(START, index));
  const lines = [`# Copy sample: fixture ${fixture}`, ""];
  for (const date of dates) {
    const today = surfaces.Today.find((view) => view.key === `${fixture} ${date}`);
    if (today) {
      lines.push(...block(`Today, ${date}`, today));
    }
    const lead = leadTopics.get(date);
    const page = surfaces["Topic pages"].find((view) => view.key === `${fixture} ${date} ${lead}`);
    if (page) {
      lines.push(...block(`Topic page, ${date}: ${lead}`, page));
    }
  }
  const months = surfaces.Ahead.filter((view) => view.fixture === fixture && view.key.endsWith(SAMPLE_YEAR) && /[A-Z][a-z]+ \d{4}$/.test(view.key));
  months.forEach((view) => lines.push(...block(`Ahead, ${view.key.slice(fixture.length + 1)}`, view)));
  surfaces.People.filter((view) => view.fixture === fixture)
    .slice(0, SAMPLE_PAIRINGS)
    .forEach((view) => lines.push(...block(`People, ${view.key}`, view)));
  return `${lines.join("\n")}\n`;
}
