# Quickstart: Architecture & Code Cleanup

**Feature**: 004-architecture-and-code-cleanup | **Date**: 2026-11-23

## Prerequisites

- Node.js ≥ 20, pnpm installed
- Branch: `refactor/architecture-and-code-cleanup` checked out

## Validation Sequence

Run these in order after completing each implementation task group. All must pass before merging.

### 1. Type check

```sh
pnpm exec tsc --noEmit
```

**Expected**: zero errors.

### 2. Full test suite

```sh
pnpm test
```

**Expected**: 56+ tests pass; coverage ≥ 80% stmt/line/fn, ≥ 75% branch (Vitest enforces thresholds).

### 3. Build

```sh
pnpm run build
```

**Expected**: exits 0, no circular-dependency warnings, `dist/` produced.

### 4. Audit

```sh
node ./scripts/audit-codebase.mjs
```

**Expected**: "Zero prohibited legacy files, console.log statements, or type escape hatches detected."

### 5. Dev smoke test (manual)

```sh
pnpm dev
```

Open browser → verify table renders, filter/sort works, modal opens/closes with **Escape** and close button, language toggle works. Zero visual diff vs. `Master`.

### 6. Version bump (last step, after all above pass)

```sh
node ./scripts/bump-version.mjs patch
```

**Expected**: `package.json` version changes from `3.0.0` to `3.0.1`.

## Key Acceptance Checks

| Check | Command / Method | Pass Condition |
|-------|-----------------|----------------|
| `useFilter()` outside provider throws | add test or check existing | Error message contains "FilterContextProvider" |
| `SortDirection` has no `"undefined"` string | `grep -r '"undefined"' src/` | zero matches |
| No `{} as FilterContextStateType` | `grep -r '{} as' src/` | zero matches |
| `App.css` removed | `ls src/App.css` | file not found |
| `src/components/context/` removed | `ls src/components/context/` | directory not found |
| GoatCounter in `analytics/` | `ls src/components/analytics/` | `GoatCounter.tsx` present |
| `contexts` alias resolves | `pnpm exec tsc --noEmit` + `pnpm test` | pass |

## References

- [data-model.md](./data-model.md) — file movement map and type changes
- [research.md](./research.md) — rationale for every decision
- [spec.md](./spec.md) — full requirements and acceptance scenarios
