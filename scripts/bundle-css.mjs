// Merge tokens.css + site.css into a single minified bundle.css. This drops
// one render-blocking request (tokens + site always load together on every
// page), while components.css stays separate so other Wazn products that
// want the component kit don't pull in the site's layout CSS.
//
//   npm run bundle-css           # writes assets/css/bundle.css
//   npm run bundle-css -- --watch (TODO)
//
// Runs on top of sync-brand (so tokens.css must be up-to-date). The combined
// `npm run build` does both in order.

import { bundle } from "lightningcss";
import { writeFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const cssDir = resolve(repoRoot, "assets/css");

// Create a tiny entry file at bundle time so lightningcss resolves the imports
// from the canonical locations. We don't commit it.
const entry = resolve(cssDir, "_bundle-entry.css");
await writeFile(
  entry,
  '@import "./tokens.css";\n@import "./site.css";\n',
  "utf-8"
);

try {
  const { code } = bundle({
    filename: entry,
    minify: true,
    sourceMap: false,
    targets: {
      // Match the baseline the brand book commits to.
      chrome: 100 << 16,
      firefox: 100 << 16,
      safari: 15 << 16,
    },
  });
  const bundlePath = resolve(cssDir, "bundle.css");
  await writeFile(bundlePath, code);
  const beforeTokens = (await readFile(resolve(cssDir, "tokens.css"), "utf-8")).length;
  const beforeSite = (await readFile(resolve(cssDir, "site.css"), "utf-8")).length;
  console.log(
    `bundle: tokens(${beforeTokens}B) + site(${beforeSite}B) -> ` +
      `${bundlePath} (${code.length}B minified)`
  );
} finally {
  // Clean up the entry file either way.
  const { rm } = await import("node:fs/promises");
  await rm(entry, { force: true });
}
