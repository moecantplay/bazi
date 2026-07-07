/**
 * Browser shim for Node's `node:module`.
 *
 * The BaZi engine loads astronomy-engine through `createRequire(import.meta.url)`
 * so its ESM/CJS resolution stays identical under Vitest and tsx. Webpack can't
 * follow the `node:` scheme, so for the browser bundle we alias `node:module`
 * to this file: `createRequire` returns a resolver that hands back the bundled
 * astronomy-engine namespace. It is the only module the engine ever requires.
 */

import * as astronomyEngine from "astronomy-engine";

export function createRequire() {
  return (id) => {
    if (id === "astronomy-engine") {
      return astronomyEngine;
    }
    throw new Error(`node:module shim cannot require "${id}" in the browser bundle`);
  };
}
