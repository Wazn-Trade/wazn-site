// Copy brand CSS out of @wazn-trade/brand into assets/css/ so the static pages
// can reference it without resolving `node_modules/` at runtime. Pins are in
// package-lock.json; this script is a deterministic write, idempotent.
//
//   npm run sync-brand
//
// Replaces the Wave 0 interim scripts/check-tokens.sh (deleted when this
// landed). CI runs `git diff --exit-code assets/css/` after sync to catch
// forgotten re-syncs.

import { createRequire } from "node:module";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const require = createRequire(import.meta.url);

function resolveBrandFile(subpath) {
  // package.json#exports gates what we can import from @wazn-trade/brand.
  // Resolve each entry to its real path on disk via require.resolve so
  // the caller gets a clear error if the package isn't installed.
  return require.resolve(`@wazn-trade/brand/${subpath}`);
}

const pairs = [
  [resolveBrandFile("tokens.css"), resolve(repoRoot, "assets/css/tokens.css")],
  [resolveBrandFile("components.css"), resolve(repoRoot, "assets/css/components.css")],
];

await mkdir(resolve(repoRoot, "assets/css"), { recursive: true });

for (const [src, dst] of pairs) {
  await copyFile(src, dst);
  console.log(`sync: ${src} -> ${dst}`);
}
