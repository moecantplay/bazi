/**
 * `pnpm copy-audit [--out <file>] [--sample <fixture>]` (M20-02, M24-11):
 * measures how every screen reads and prints the summary; `--out` also writes
 * the full JSON. `--sample A` prints that fixture's copy in reading order
 * instead, for the owner to read. It measures, it never gates, so it stays out
 * of `pnpm verify`.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { READING_FIXTURES } from "../test/fixtures.js";
import { addDays } from "../src/dates.js";
import { todayScreenModel } from "../src/today-screen.js";
import { buildReport, printableReport } from "./copy-audit/report.js";
import { sampleText } from "./copy-audit/sample.js";
import { DAYS, START, collectSurfaces } from "./copy-audit/surfaces.js";

const SAMPLE_DAYS = 7;

function flagValue(args: readonly string[], flag: string): string | null {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`${flag} needs a value`);
  }
  return value;
}

function printSample(fixture: string): void {
  const profile = READING_FIXTURES.find(([name]) => name === fixture)?.[1];
  if (!profile) {
    throw new Error(`No fixture "${fixture}"; pick one of ${READING_FIXTURES.map(([name]) => name).join(", ")}`);
  }
  const leadTopics = new Map(
    Array.from({ length: SAMPLE_DAYS }, (_, index) => {
      const date = addDays(START, index);
      return [date, todayScreenModel(profile, date, date).reading.leadTopic] as const;
    })
  );
  process.stdout.write(sampleText(fixture, collectSurfaces(READING_FIXTURES), leadTopics));
}

function printAudit(out: string | null): void {
  const report = buildReport(collectSurfaces(READING_FIXTURES), { start: START, days: DAYS, fixtures: READING_FIXTURES.map(([name]) => name) });
  process.stdout.write(printableReport(report));
  if (out === null) {
    return;
  }
  // pnpm runs package scripts from the package folder; resolve against where the command was typed.
  const path = resolve(process.env.INIT_CWD ?? process.cwd(), out);
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`Wrote ${path}\n`);
}

const args = process.argv.slice(2);
const sample = flagValue(args, "--sample");
if (sample === null) {
  printAudit(flagValue(args, "--out"));
} else {
  printSample(sample);
}
