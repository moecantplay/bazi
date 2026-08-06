import { describe, expect, it } from "vitest";
import {
  dateFinderChartLabels,
  dateFinderVerdictSeedBase,
  findDatesFor,
  LEANING_TINT,
  LEANING_WORD,
  MAX_DATE,
  MIN_DATE
} from "../src/date-finder.js";
import { natalSeedKey } from "../src/seed-key.js";
import { FIXTURE_A } from "./fixtures.js";

describe("findDatesFor", () => {
  it("ranks at most ten candidates within the requested range", () => {
    const search = findDatesFor(FIXTURE_A, "travel", "2026-07-01", "2026-07-31", null);
    expect(search.candidates.length).toBeLessThanOrEqual(10);
    expect(search.candidates.length).toBeGreaterThan(0);
    expect(search.clampedNote).toBeNull();
  });

  // KNOWN PRE-EXISTING BUG (carried over verbatim from apps/web/src/lib/date-finder.ts,
  // not introduced or fixed by this extraction): MIN_DATE/MAX_DATE are civil-date
  // constants ("1900-01-01"/"2100-12-31"), but the engine's solar-term table actually
  // starts 1900-01-05T18:04:09Z and ends 2100-12-07T01:40:10Z. Clamping to either
  // literal boundary therefore makes findDates() throw instead of returning trimmed
  // results — the "trimmed" note is never reached for a request this far out of range.
  // Flagged to the team, out of scope to fix here (bazi-engine is untouched in this task).
  it("clamping to MIN_DATE currently throws instead of trimming (pre-existing engine/constant mismatch)", () => {
    expect(() => findDatesFor(FIXTURE_A, "travel", "1800-01-01", "1900-01-10", null)).toThrow(
      RangeError
    );
  });

  it("clamping to MAX_DATE currently throws instead of trimming (pre-existing engine/constant mismatch)", () => {
    expect(() => findDatesFor(FIXTURE_A, "travel", "2100-12-25", "2200-01-01", null)).toThrow(
      RangeError
    );
  });

  it("shortens a range longer than one year and notes it", () => {
    const search = findDatesFor(FIXTURE_A, "travel", "2026-01-01", "2028-01-01", null);
    expect(search.clampedNote).toContain("one year");
  });

  it("includes a second person's chart when given", () => {
    const person = {
      id: "p1",
      name: "Them",
      birth: { date: "1996-03-14", time: "08:15", city: FIXTURE_A.birth.city, sex: "female" as const }
    };
    const withPerson = findDatesFor(FIXTURE_A, "travel", "2026-07-01", "2026-07-31", person);
    const soloOnly = findDatesFor(FIXTURE_A, "travel", "2026-07-01", "2026-07-31", null);
    expect(withPerson.candidates.length).toBeGreaterThan(0);
    expect(soloOnly.candidates.length).toBeGreaterThan(0);
  });

  it("respects MIN_DATE/MAX_DATE as the clamp bounds", () => {
    expect(MIN_DATE).toBe("1900-01-01");
    expect(MAX_DATE).toBe("2100-12-31");
  });
});

describe("LEANING_TINT / LEANING_WORD", () => {
  it("cover every leaning", () => {
    for (const leaning of ["favors", "neutral", "friction"] as const) {
      expect(LEANING_TINT[leaning]).toBeDefined();
      expect(LEANING_WORD[leaning]).toBeDefined();
    }
  });

  it("uses the ink/paper-safe wording for favours (not 'favors')", () => {
    expect(LEANING_WORD.favors).toBe("favours");
  });
});

describe("dateFinderChartLabels", () => {
  it("returns just 'You' when searching alone", () => {
    expect(dateFinderChartLabels(null)).toEqual(["You"]);
  });

  it("adds the companion's name when searching with a person", () => {
    expect(dateFinderChartLabels("Them")).toEqual(["You", "Them"]);
  });
});

describe("dateFinderVerdictSeedBase", () => {
  it("combines the natal seed key, activity, and companion id", () => {
    expect(dateFinderVerdictSeedBase(FIXTURE_A, "travel", "p1")).toBe(
      `${natalSeedKey(FIXTURE_A)}|verdict|travel|p1`
    );
  });

  it("omits the companion segment when searching alone", () => {
    expect(dateFinderVerdictSeedBase(FIXTURE_A, "travel", null)).toBe(
      `${natalSeedKey(FIXTURE_A)}|verdict|travel`
    );
  });

  it("falls back to an empty activity segment when none is chosen yet", () => {
    expect(dateFinderVerdictSeedBase(FIXTURE_A, null, null)).toBe(
      `${natalSeedKey(FIXTURE_A)}|verdict|`
    );
  });
});
