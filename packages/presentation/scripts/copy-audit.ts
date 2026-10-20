/**
 * `pnpm copy-audit [--out <file>]` (M20-02): measures how every screen reads
 * and prints the summary; `--out` also writes the full JSON. It measures, it
 * never gates, so it stays out of `pnpm verify`.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { READING_FIXTURES } from "../test/fixtures.js";
import { buildReport, printableReport } from "./copy-audit/report.js";
import { DAYS, START, collectSurfaces } from "./copy-audit/surfaces.js";

function outPathFrom(args: readonly string[]): string | null {
  const flag = args.indexOf("--out");
  if (flag === -1) {
    return null;
  }
  const path = args[flag + 1];
  if (path === undefined || path.startsWith("--")) {
    throw new Error("--out needs a file path");
  }
  // pnpm runs package scripts from the package folder; resolve against where the command was typed.
  return resolve(process.env.INIT_CWD ?? process.cwd(), path);
}

const outPath = outPathFrom(process.argv.slice(2));
const surfaces = collectSurfaces(READING_FIXTURES);
const report = buildReport(surfaces, { start: START, days: DAYS, fixtures: READING_FIXTURES.map(([name]) => name) });

process.stdout.write(printableReport(report));
if (outPath !== null) {
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`Wrote ${outPath}\n`);
}
