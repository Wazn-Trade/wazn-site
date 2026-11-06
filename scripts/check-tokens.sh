#!/usr/bin/env bash
# Interim guard against wazn-site/wazn-brand drift while Wave 2 is not yet live.
#
# tokens.css and components.css in wazn-site are copies of the files in
# wazn-brand/design-system/. There is no build step linking them. This script
# diffs the live copies against the brand source and fails CI if they drift,
# with a reminder of which file to re-copy.
#
# Retire this script once wazn-site consumes @wazn/brand via npm (TODO 2.1).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRAND="${BRAND_DIR:-$ROOT/../wazn-brand/design-system}"

if [[ ! -d "$BRAND" ]]; then
  echo "[skip] brand dir not found at $BRAND (set BRAND_DIR to override)"
  exit 0
fi

# source-in-brand    ::    local-copy-in-site
PAIRS=(
  "$BRAND/tokens.css::$ROOT/assets/css/tokens.css"
  "$BRAND/components/bundle.css::$ROOT/assets/css/components.css"
)

status=0
for pair in "${PAIRS[@]}"; do
  src="${pair%%::*}"
  dst="${pair##*::}"
  if [[ ! -f "$src" ]]; then
    echo "[warn] $src not found in wazn-brand; skipping"
    continue
  fi
  if [[ ! -f "$dst" ]]; then
    echo "DRIFT: $dst is missing. Copy from $src."
    status=1
    continue
  fi
  if ! diff -q "$src" "$dst" >/dev/null; then
    echo "DRIFT: $dst differs from $src."
    echo "  cp '$src' '$dst'"
    status=1
  fi
done

if [[ $status -eq 0 ]]; then
  echo "ok: site CSS tokens/components match wazn-brand."
else
  echo
  echo "Re-copy the drifted files from wazn-brand/design-system/ into wazn-site/assets/css/."
  echo "This script is interim and goes away once Wave 2 (npm consumption of @wazn/brand) lands."
fi
exit $status
