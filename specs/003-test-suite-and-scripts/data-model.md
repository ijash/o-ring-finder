# Data Model & Interface Contracts: Test Suite and Routine Automation Scripts

## 1. Domain Entities & Test Models

### FilterState
- `unit`: `MeasurementUnit.MM` | `MeasurementUnit.INCH`
- `code?`: `string`
- `minId?`: `number`
- `maxId?`: `number`
- `minOd?`: `number`
- `maxOd?`: `number`
- `minCs?`: `number`
- `maxCs?`: `number`
- `standard?`: `Standard[]`

### SortState
- `sortBy`: `"standard" | "code" | "id" | "od" | "cs" | ""`
- `sortDirection`: `"asc" | "desc" | "undefined"`

### I18nDictionary
- Nested JSON mapping hierarchical keys to non-empty translation strings.
- Symmetry constraint: `keys(en) == keys(id)`.

## 2. Automation Script CLI Contracts

### `scripts/verify-gates.sh`
- **Execution**: `./scripts/verify-gates.sh`
- **Steps**:
  1. `npx tsc --noEmit`
  2. `node scripts/check-i18n-parity.mjs`
  3. `pnpm test`
  4. `pnpm run build`
- **Exit Code**: `0` on all passing, `1` on first failure (`set -euo pipefail`).

### `scripts/check-i18n-parity.mjs`
- **Execution**: `node scripts/check-i18n-parity.mjs [--fix]`
- **Output**: Detailed diff of missing keys between `en` and `id`, check for empty string values.
- **Exit Code**: `0` if 100% parity achieved, `1` if mismatches found.

### `scripts/audit-codebase.mjs`
- **Execution**: `node scripts/audit-codebase.mjs`
- **Checks**:
  - Prohibited tokens in `src/`: `\bany\b`, `@ts-ignore`, `@ts-expect-error`, `console\.log`.
  - Prohibited legacy files: `README.old.md`, `package-lock.json`, `yarn.lock`, etc.
- **Exit Code**: `0` if clean, `1` if violations detected.

### `scripts/bump-version.mjs`
- **Execution**: `node scripts/bump-version.mjs <patch|minor>`
- **Behavior**:
  - Rejects `major` with error: `Major bumps require explicit user authorization per Constitution Principle XI`.
  - Updates `package.json` version.
  - Emits Conventional Commit message template.
- **Exit Code**: `0` on successful bump, `1` on invalid target.

### `scripts/test-coverage.sh`
- **Execution**: `./scripts/test-coverage.sh`
- **Behavior**: Runs `pnpm vitest run --coverage` and checks threshold exit code.
- **Exit Code**: `0` if coverage >= 80% (statements/lines/functions) and 75% (branches), `1` if under threshold.
