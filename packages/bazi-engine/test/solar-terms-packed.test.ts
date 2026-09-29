/**
 * The packed solar-term table the engine ships (M19.8-08) must decode to
 * exactly the audited JSON it was packed from — every name, longitude and
 * millisecond, all 2,412 jié.
 */

import { describe, expect, it } from "vitest";
import audited from "../data/solar-terms.json" with { type: "json" };
import { decodeSolarTerms } from "../src/solar-terms-packed.js";
import { SOLAR_TERMS } from "../src/solar-terms.js";

describe("packed solar-term table", () => {
  it("decodes to the audited JSON exactly", () => {
    expect(decodeSolarTerms()).toEqual(audited);
  });

  it("is what the engine reads", () => {
    expect(SOLAR_TERMS).toEqual(audited);
    expect(SOLAR_TERMS).toHaveLength(2412);
  });
});
