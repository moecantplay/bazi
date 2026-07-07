// Generates src/data/cities.json from the GeoNames cities15000 dump.
// Source: https://download.geonames.org/export/dump/cities15000.zip
// License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) — attribution kept in src/data/cities.json and the README.
// Usage: node scripts/generate-cities.mjs /path/to/cities15000.txt
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/generate-cities.mjs <cities15000.txt>");
  process.exit(1);
}

const MAX_CITIES = 2000;
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

const rows = readFileSync(input, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const f = line.split("\t");
    return {
      name: f[1],
      country: countryNames.of(f[8]) ?? f[8],
      lat: Number(Number(f[4]).toFixed(4)),
      lng: Number(Number(f[5]).toFixed(4)),
      tz: f[17],
      population: Number(f[14])
    };
  })
  .filter((c) => c.tz && Number.isFinite(c.population))
  .sort((a, b) => b.population - a.population)
  .slice(0, MAX_CITIES)
  .map((c) => ({ name: c.name, country: c.country, lat: c.lat, lng: c.lng, tz: c.tz }))
  .sort((a, b) => a.name.localeCompare(b.name));

const out = {
  attribution:
    "City data from GeoNames (geonames.org), licensed under CC BY 4.0. Top 2000 cities by population from the cities15000 dataset.",
  cities: rows
};

const dir = dirname(fileURLToPath(import.meta.url));
const target = join(dir, "..", "src", "data", "cities.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out));
console.log(`wrote ${rows.length} cities to ${target}`);
