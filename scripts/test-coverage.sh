#!/usr/bin/env bash
#
# test-coverage.sh - Run Vitest with V8 code coverage analysis
#
# Usage:
#   ./scripts/test-coverage.sh
#
# Description:
#   Executes Vitest test suite with @vitest/coverage-v8.
#   Enforces Constitution v1.1.0 Principle IX:
#     - Minimum 80% Statements
#     - Minimum 80% Lines
#     - Minimum 80% Functions
#     - Minimum 75% Branches
#
# Exit codes:
#   0: All tests pass and coverage meets or exceeds configured thresholds.
#   Non-zero: Tests failed or coverage fell below thresholds.
#

set -euo pipefail

echo "=== Running Vitest Suite with V8 Code Coverage ==="
pnpm vitest run --coverage

echo "=== Code coverage thresholds verified successfully! ==="
