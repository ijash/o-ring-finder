# Quickstart: Test Suite and Routine Automation Scripts

## Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x

## Verification Workflow

### 1. Run Complete Test Suite
```bash
pnpm test
```
*Expected*: All unit, component, and integration tests pass cleanly under 15s.

### 2. Run Test Coverage Check
```bash
./scripts/test-coverage.sh
```
*Expected*: Output shows coverage >= 80% (statements/lines/functions) and >= 75% (branches) with exit code 0.

### 3. Check I18n Translation Parity
```bash
node ./scripts/check-i18n-parity.mjs
```
*Expected*: "100% key parity verified between English and Indonesian dictionaries." (Exit code 0).

### 4. Run Codebase Audit
```bash
node ./scripts/audit-codebase.mjs
```
*Expected*: Zero explicit `any`, `@ts-ignore`, `@ts-expect-error`, or `console.log` occurrences found in `src/`. (Exit code 0).

### 5. Bump Version
```bash
node ./scripts/bump-version.mjs minor
```
*Expected*: `package.json` bumped from `2.4.0` to `2.5.0`, Conventional Commit command printed.

### 6. Run Complete Quality Gates
```bash
./scripts/verify-gates.sh
```
*Expected*: All 4 steps (typecheck, i18n parity, test suite, build) pass with exit code 0.
