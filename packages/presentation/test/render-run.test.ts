import { describe, expect, it } from "vitest";
import type { TokenLine } from "@daymaster/content";
import { renderRun } from "../src/render-run.js";

describe("renderRun", () => {
  it("keeps text and term runs intact and adds a stable key per run", () => {
    const line: TokenLine = [
      { kind: "text", text: "The old calendars name this year " },
      { kind: "term", term: "Indirect Resource", gloss: "a lucky break you didn't plan for", han: "偏印" },
      { kind: "text", text: "." }
    ];
    expect(renderRun(line)).toEqual([
      { kind: "text", text: "The old calendars name this year ", key: 0 },
      {
        kind: "term",
        term: "Indirect Resource",
        gloss: "a lucky break you didn't plan for",
        han: "偏印",
        key: 1
      },
      { kind: "text", text: ".", key: 2 }
    ]);
  });

  it("returns an empty array for an empty TokenLine", () => {
    expect(renderRun([])).toEqual([]);
  });

  it("does not mutate the input runs", () => {
    const line: TokenLine = [{ kind: "text", text: "hello" }];
    renderRun(line);
    expect(line[0]).toEqual({ kind: "text", text: "hello" });
  });
});
