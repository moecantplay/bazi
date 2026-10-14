/**
 * Every module under src/ is reached from a page (M24-12). Retired screens
 * left their components behind once; this walks the imports from every
 * `app/**` route file and fails on anything no page reaches, so a removal
 * can't leave its pieces in the build again. Tests and test helpers are
 * reached by the test runner, not a page, and are skipped.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = resolve(__dirname);
const EXTENSIONS = [".ts", ".tsx"];
const IMPORT = /(?:import|export)\s[^"']*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return EXTENSIONS.some((extension) => name.endsWith(extension)) ? [path] : [];
  });
}

function isTestOnly(path: string): boolean {
  return /\.test\.tsx?$/.test(path) || relative(SRC, path).startsWith("lib/testing/");
}

/** The file an import names, or null for a package import. */
function resolveImport(from: string, specifier: string): string | null {
  let base: string;
  if (specifier.startsWith("@/")) {
    base = join(SRC, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = resolve(dirname(from), specifier);
  } else {
    return null;
  }
  const candidates = [base, ...EXTENSIONS.map((extension) => `${base}${extension}`), ...EXTENSIONS.map((extension) => join(base, `index${extension}`))];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

function importsOf(path: string): string[] {
  const text = readFileSync(path, "utf8");
  return [...text.matchAll(IMPORT)]
    .map((match) => resolveImport(path, match[1] ?? match[2] ?? ""))
    .filter((target): target is string => target !== null);
}

describe("no orphan modules", () => {
  it("every module under src/ is reached from a route", () => {
    const files = sourceFiles(SRC).filter((path) => !isTestOnly(path));
    const routes = files.filter((path) => relative(SRC, path).startsWith("app/"));
    const reached = new Set(routes);
    const queue = [...routes];
    while (queue.length > 0) {
      const next = queue.pop()!;
      for (const target of importsOf(next)) {
        if (!reached.has(target)) {
          reached.add(target);
          queue.push(target);
        }
      }
    }
    const orphans = files.filter((path) => !reached.has(path)).map((path) => relative(SRC, path));
    expect(orphans).toEqual([]);
  });
});
