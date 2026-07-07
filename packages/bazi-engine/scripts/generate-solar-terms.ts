/**
 * Generates `data/solar-terms.json` covering the 12 jié for years 1900–2100.
 *
 * Run with `pnpm --filter @daymaster/bazi-engine generate:solar-terms`.
 * The runtime engine reads only the embedded JSON this produces; it performs
 * no astronomy computation for month/year boundaries.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { solarTermsForRange } from "../src/solar-term-search.js";

const START_YEAR = 1900;
const END_YEAR = 2100;

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, "..", "data", "solar-terms.json");

const entries = solarTermsForRange(START_YEAR, END_YEAR);
writeFileSync(outputPath, `${JSON.stringify(entries, null, 2)}\n`);

console.log(
  `Wrote ${entries.length} solar-term entries (${START_YEAR}–${END_YEAR}) to ${outputPath}`,
);
