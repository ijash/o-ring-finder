# CLI & Script Contracts: Routine Automation Tools

## 1. `scripts/verify-gates.sh`
- **Purpose**: Runs all mandatory pre-commit and pre-release gates.
- **Invocation**: `./scripts/verify-gates.sh`
- **Output**: Formatted progress indicators for type check, i18n parity check, Vitest run, Vite build.
- **Exit Status**: `0` on success; aborts immediately with non-zero exit code on failure.

## 2. `scripts/check-i18n-parity.mjs`
- **Purpose**: Asserts 100% bidirectional translation key parity and non-empty values between `en/globals.json` and `id/globals.json`.
- **Invocation**: `node scripts/check-i18n-parity.mjs`
- **Exit Status**: `0` on 100% parity; `1` with list of missing/extra/empty keys.

## 3. `scripts/audit-codebase.mjs`
- **Purpose**: Fast token-saving static scan for forbidden patterns (`any`, `@ts-ignore`, `@ts-expect-error`, `console.log`, legacy files).
- **Invocation**: `node scripts/audit-codebase.mjs`
- **Exit Status**: `0` on clean audit; `1` with file paths and line numbers of violations.

## 4. `scripts/bump-version.mjs`
- **Purpose**: Safe Semantic Version bumper updating `package.json` for `patch` or `minor` changes only.
- **Invocation**: `node scripts/bump-version.mjs <patch|minor>`
- **Safety Rule**: Rejects `major` with error instruction referencing Constitution Principle XI.
- **Exit Status**: `0` on success with Conventional Commit template; `1` on invalid argument.

## 5. `scripts/test-coverage.sh`
- **Purpose**: Runs Vitest test runner with `@vitest/coverage-v8` checking configured thresholds (80% statements/lines/functions, 75% branches).
- **Invocation**: `./scripts/test-coverage.sh`
- **Exit Status**: `0` when all thresholds met; `1` when thresholds breached.
