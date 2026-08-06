#!/usr/bin/env node
/**
 * Generates src/app/tokens.generated.css — the Trail token set (DESIGN.md v4).
 *
 * Source of truth for the values below is docs/design-system/src/tokens.mjs
 * (the Trail design-system bundle, contrast- and theme-parity-verified via
 * `node docs/design-system/check.mjs`). That file lives outside the pnpm
 * workspace as a prototyping tool, not a runtime dependency of apps/web, so
 * this script keeps its own transcribed copy of the same data rather than
 * importing across the package boundary. If the source values change,
 * re-transcribe here and re-run this script — never hand-edit the output.
 *
 * Existing token names (--paper, --ink, --ink-soft, --surface, --paper-raised,
 * --hairline, --element-*) are kept so the ~50 files already using them
 * (Tailwind classes like bg-surface, text-ink-soft, bg-element-wood) need no
 * changes — only their CSS values move from theme-keyed to terrain+theme-keyed
 * (element-* stays theme-keyed only, per DESIGN.md's "hues never move with
 * the terrain" rule). New Trail-only concepts (the anchor pair, amber
 * signage, element fill tints, card shadows) get new var names, additive.
 *
 * Usage: node scripts/generate-tokens.mjs
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../src/app/tokens.generated.css");

/** Ground: paper, ink, the anchor mass, and the hairline. Per terrain, per theme. */
const TERRAIN_GROUND = {
  wood: {
    light: { paper: "#F0EEE2", ink: "#232819", anchor: "#181C10", "ink-soft": "#686C55", surface: "#FAF9EF", hairline: "rgba(78,82,55,.32)" },
    dark: { paper: "#161911", ink: "#EAEADC", anchor: "#EAEADC", "ink-soft": "#9A9D85", surface: "#20241A", hairline: "rgba(214,216,186,.26)" },
  },
  fire: {
    light: { paper: "#F6EBDC", ink: "#2C2118", anchor: "#1D140C", "ink-soft": "#786655", surface: "#FDF6EA", hairline: "rgba(104,74,48,.30)" },
    dark: { paper: "#1B1410", ink: "#F0E5DA", anchor: "#F0E5DA", "ink-soft": "#A89283", surface: "#271F18", hairline: "rgba(230,206,186,.22)" },
  },
  earth: {
    light: { paper: "#F2ECD4", ink: "#2A2415", anchor: "#1D180B", "ink-soft": "#72684D", surface: "#FBF7E6", hairline: "rgba(100,86,44,.30)" },
    dark: { paper: "#191610", ink: "#EDE6D3", anchor: "#EDE6D3", "ink-soft": "#A59A76", surface: "#241F15", hairline: "rgba(224,212,176,.22)" },
  },
  metal: {
    light: { paper: "#EEEFED", ink: "#24262B", anchor: "#14161A", "ink-soft": "#676B72", surface: "#F9FAFA", hairline: "rgba(74,78,88,.26)" },
    dark: { paper: "#15171A", ink: "#E7EAED", anchor: "#E7EAED", "ink-soft": "#949BA6", surface: "#1F2226", hairline: "rgba(204,210,220,.20)" },
  },
  water: {
    light: { paper: "#E5EDF3", ink: "#1F2830", anchor: "#101820", "ink-soft": "#5D6B75", surface: "#F4F9FC", hairline: "rgba(54,76,92,.28)" },
    dark: { paper: "#121820", ink: "#E1EAF1", anchor: "#E1EAF1", "ink-soft": "#8A9BA8", surface: "#1B232C", hairline: "rgba(190,212,228,.20)" },
  },
};

/** Data + signage hues. Theme-keyed only — identical across all five terrains. */
const HUES = {
  light: {
    "element-wood": "#46672F", "element-wood-fill": "#D5E1BE",
    "element-fire": "#9A4323", "element-fire-fill": "#F5D2BF",
    "element-earth": "#785D1F", "element-earth-fill": "#EDDFAC",
    "element-metal": "#626458", "element-metal-fill": "#E5E3D3",
    "element-water": "#3A607C", "element-water-fill": "#CBDBE7",
    "signal-amber": "#835D13", "signal-amber-fill": "#F1E2BB",
  },
  dark: {
    "element-wood": "#ADCB96", "element-wood-fill": "#2A3820",
    "element-fire": "#EFA47C", "element-fire-fill": "#412718",
    "element-earth": "#DCC077", "element-earth-fill": "#3A3017",
    "element-metal": "#B7B5A6", "element-metal-fill": "#2B2B22",
    "element-water": "#A0BFD7", "element-water-fill": "#1F2F3B",
    "signal-amber": "#DDB35E", "signal-amber-fill": "#392D13",
  },
};

/** Theme-keyed only — dark elevates by a deeper shadow plus fill, still no borders. */
const SHADOW = {
  light: {
    "shadow-hero": "0 2px 8px rgba(48,50,28,.07), 0 12px 30px rgba(48,50,28,.09)",
    "shadow-card": "0 1px 4px rgba(48,50,28,.06)",
    "shadow-node": "0 1px 4px rgba(48,50,28,.15)",
    "shadow-nav": "0 8px 26px rgba(24,28,16,.3)",
  },
  dark: {
    "shadow-hero": "0 2px 10px rgba(0,0,0,.34)",
    "shadow-card": "0 1px 4px rgba(0,0,0,.28)",
    "shadow-node": "0 1px 4px rgba(0,0,0,.4)",
    "shadow-nav": "0 8px 26px rgba(0,0,0,.46)",
  },
};

const TERRAINS = ["wood", "fire", "earth", "metal", "water"];

/** Theme- and terrain-independent — the same five numbers everywhere. */
const SHAPE = {
  "radius-hero": "24px",
  "radius-card": "20px",
  "radius-tile": "18px",
  "radius-sheet": "28px",
  "radius-field": "14px",
  "rail-width": "2px",
  "node-size": "36px",
  "tap-min": "44px",
};

function shapeDeclarations() {
  return Object.entries(SHAPE)
    .map(([k, v]) => `--${k}: ${v};`)
    .join(" ");
}

function groundDeclarations(terrain, theme) {
  const g = TERRAIN_GROUND[terrain][theme];
  return Object.entries(g)
    .map(([k, v]) => `--${k}: ${v};`)
    .join(" ");
}

function themeDeclarations(theme) {
  return [...Object.entries(HUES[theme]), ...Object.entries(SHADOW[theme])]
    .map(([k, v]) => `--${k}: ${v};`)
    .join(" ");
}

function build() {
  const lines = [
    "/* GENERATED by scripts/generate-tokens.mjs — do not edit by hand.",
    "   Source of truth: docs/design-system/src/tokens.mjs (DESIGN.md v4). */",
    "",
    "/* Default ground (wood, light) and its hues/shadows — every terrain and",
    "   theme overrides below. --paper-raised aliases --surface: Trail gives",
    "   inputs the same fill as cards, distinguished by their border instead. */",
    `:root { ${shapeDeclarations()} ${groundDeclarations("wood", "light")} ${themeDeclarations("light")} --paper-raised: var(--surface); }`,
    "",
  ];

  for (const theme of ["light", "dark"]) {
    // Wood is the fallback ground before a profile exists and data-terrain is
    // stamped (onboarding, first paint) — it must still flip with the theme,
    // not stay pinned to light. The terrain-qualified rules below have higher
    // specificity (an extra attribute selector) and win once a terrain is set.
    const themeVars = `${themeDeclarations(theme)} ${groundDeclarations("wood", theme)} --paper-raised: var(--surface);`;
    const terrainRules = (selectorFor) =>
      TERRAINS.map(
        (t) => `${selectorFor(t)} { ${groundDeclarations(t, theme)} --paper-raised: var(--surface); }`,
      ).join("\n");

    // OS preference, no explicit choice.
    lines.push(
      `@media (prefers-color-scheme: ${theme}) {`,
      `  :root:not([data-theme]) { ${themeVars} }`,
      terrainRules((t) => `  :root:not([data-theme])[data-terrain="${t}"]`),
      "}",
      "",
    );

    // Explicit choice via the Settings toggle — must reach everything the
    // media query does (2026-07-30 rule: no rule lives only in the media query).
    lines.push(
      `:root[data-theme="${theme}"] { ${themeVars} }`,
      terrainRules((t) => `:root[data-theme="${theme}"][data-terrain="${t}"]`),
      "",
    );
  }

  return lines.join("\n");
}

await writeFile(OUT, build());
console.log(`Wrote ${OUT}`);
