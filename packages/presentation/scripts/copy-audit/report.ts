/**
 * The copy audit's output (M20-02 R3): one JSON object with every metric per
 * surface, overall, per fixture and per slot, and a short printed summary of
 * it. Neither carries a timestamp, so two runs on the same code are identical.
 */

import { measureViews, slotNames, type ViewMetrics } from "./metrics.js";
import type { SurfaceName, Surfaces } from "./surfaces.js";

export interface SurfaceReport {
  overall: ViewMetrics;
  byFixture: Record<string, ViewMetrics>;
  bySlot: Record<string, ViewMetrics>;
}

export interface AuditReport {
  inputs: { start: string; days: number; fixtures: string[] };
  surfaces: Record<SurfaceName, SurfaceReport>;
}

const PRINTED_REPEATS = 5;
const PRINTED_SENTENCE_LENGTH = 70;

export function buildReport(surfaces: Surfaces, inputs: AuditReport["inputs"]): AuditReport {
  const entries = Object.entries(surfaces) as [SurfaceName, Surfaces[SurfaceName]][];
  const reports = entries.map(([name, views]): [SurfaceName, SurfaceReport] => [
    name,
    {
      overall: measureViews(views),
      byFixture: Object.fromEntries(inputs.fixtures.map((fixture) => [fixture, measureViews(views.filter((view) => view.fixture === fixture))])),
      bySlot: Object.fromEntries(slotNames(views).map((slot) => [slot, measureViews(views, slot)]))
    }
  ]);
  return { inputs, surfaces: Object.fromEntries(reports) as Record<SurfaceName, SurfaceReport> };
}

function percent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

function shorten(sentence: string): string {
  return sentence.length <= PRINTED_SENTENCE_LENGTH ? sentence : `${sentence.slice(0, PRINTED_SENTENCE_LENGTH - 1)}…`;
}

function surfaceLines(name: string, report: SurfaceReport): string[] {
  const { overall } = report;
  const fixtures = Object.entries(report.byFixture)
    .map(([fixture, metrics]) => `${fixture} ${percent(metrics.uniqueRatio)}`)
    .join(" · ");
  const slots = Object.entries(report.bySlot).map(([slot, metrics]) => {
    const top = metrics.topRepeats[0];
    const repeat = top ? `  top ×${top.count}: ${shorten(top.sentence)}` : "";
    return `    ${slot.padEnd(16)} ${String(metrics.sentences).padStart(6)} sentences  ${percent(metrics.uniqueRatio).padStart(6)} unique${repeat}`;
  });
  const repeats = overall.topRepeats.slice(0, PRINTED_REPEATS).map((entry) => `    ×${entry.count}  ${shorten(entry.sentence)}`);
  return [
    `${name} — ${overall.views} views`,
    `  Unique sentences   ${overall.uniqueSentences} of ${overall.sentences} (${percent(overall.uniqueRatio)})`,
    `  By fixture         ${fixtures}`,
    `  Words per view     min ${overall.wordsPerView.min} · avg ${overall.wordsPerView.average} · max ${overall.wordsPerView.max}`,
    `  Em-dashes per view avg ${overall.emDashesPerView.average} · max ${overall.emDashesPerView.max}`,
    `  Within-view repeats ${overall.withinViewRepeats.pairs} sentence pairs share a 4-word phrase`,
    `  Said twice on a view ${overall.withinViewDuplicates.extra} extra showings of a sentence already on that view`,
    "  By slot",
    ...slots,
    "  Most repeated",
    ...(repeats.length > 0 ? repeats : ["    none"]),
    ""
  ];
}

export function printableReport(report: AuditReport): string {
  const { start, days, fixtures } = report.inputs;
  const header = [`Copy audit — from ${start}, ${days} days, fixtures ${fixtures.join(", ")}`, ""];
  const sections = Object.entries(report.surfaces).flatMap(([name, surface]) => surfaceLines(name, surface));
  return `${[...header, ...sections].join("\n")}\n`;
}
