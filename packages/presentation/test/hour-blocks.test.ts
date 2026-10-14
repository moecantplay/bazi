import { describe, expect, it } from "vitest";
import { hourBlocks } from "../src/hour-blocks.js";

describe("hourBlocks", () => {
  it("lists the twelve blocks from the rat hour, with clock labels", () => {
    const blocks = hourBlocks("亥");
    expect(blocks).toHaveLength(12);
    expect(blocks[0]).toMatchObject({ branch: "子", animal: "rat", label: "11 pm–1 am", startHour: 23 });
    expect(blocks[11]).toMatchObject({ branch: "亥", animal: "pig", label: "9–11 pm", startHour: 21 });
  });

  it("marks exactly one rough hour (clash) and one easy hour (combine)", () => {
    const blocks = hourBlocks("亥");
    expect(blocks.filter((block) => block.mark === "rough").map((block) => block.animal)).toEqual(["snake"]);
    expect(blocks.filter((block) => block.mark === "easy").map((block) => block.animal)).toEqual(["tiger"]);
  });
});
