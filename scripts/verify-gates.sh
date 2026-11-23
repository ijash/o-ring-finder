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
#   2. Vitest automated test suite (pnpm test)
#   3. Production build compilation (pnpm run build)
#
# Exit code:
#   0 if all gates pass, non-zero if any gate fails.
#

set -euo pipefail

echo "=== [1/3] Running TypeScript type check ==="
npx tsc --noEmit

echo "=== [2/3] Running Vitest test suite ==="
pnpm test

echo "=== [3/3] Running Vite production build ==="
pnpm run build

echo "=== All quality gates passed successfully! ==="
