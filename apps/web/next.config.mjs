import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectDir = dirname(fileURLToPath(import.meta.url));
const nodeModuleShim = resolve(projectDir, "shims/node-module.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Emit route directories (/today/index.html) so clean URLs resolve on bare
  // static hosts and the service worker can precache the route documents.
  trailingSlash: true,
  transpilePackages: ["@daymaster/bazi-engine", "@daymaster/content"],
  webpack: (config, { webpack }) => {
    // The engine's TypeScript sources use NodeNext-style ".js" import
    // specifiers that resolve to ".ts" files. Teach webpack to follow them so
    // transpilePackages can compile the engine into the browser bundle.
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js", ".jsx"]
    };

    // The engine loads astronomy-engine via `node:module`'s createRequire.
    // Webpack can't read the `node:` scheme, so rewrite that one request to a
    // browser shim that returns the bundled astronomy-engine instead.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:module$/, (resource) => {
        resource.request = nodeModuleShim;
      })
    );

    return config;
  }
};

export default nextConfig;
