#!/usr/bin/env bash
#
# verify-gates.sh - Run comprehensive quality gates for O-Ring Finder
#
# Usage:
#   ./scripts/verify-gates.sh
#
# Description:
#   Enforces Constitution v1.1.0 quality gates:
#   1. Strict TypeScript type check (npx tsc --noEmit)
#   2. Translation dictionary parity (node scripts/check-i18n-parity.mjs)
#   3. Vitest automated test suite (pnpm test)
#   4. Production build compilation (pnpm run build)
#   5. Production bundle size budget check (node scripts/check-bundle-size.mjs)
#
# Exit code:
#   0 if all gates pass, non-zero if any gate fails.
#

set -euo pipefail

echo "=== [1/5] Running TypeScript type check ==="
npx tsc --noEmit

echo "=== [2/5] Running translation dictionary parity check ==="
node scripts/check-i18n-parity.mjs

echo "=== [3/5] Running Vitest test suite ==="
pnpm test

echo "=== [4/5] Running Vite production build ==="
pnpm run build

echo "=== [5/5] Checking bundle size budgets ==="
node scripts/check-bundle-size.mjs

echo "=== All quality gates passed successfully! ==="
