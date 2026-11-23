# Implementation Plan: Code Review Compliance and Hygiene Fixes

**Branch**: `fix/code-review-compliance` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-code-review-compliance/spec.md`

## Summary

- **Canonical Key Sorting**: Pass `{ key: TableHeadField, label: string }[]` through `tableHead.tsx` and `tableSection.tsx`; type `SortContext.sortBy` strictly as `TableHeadField | null` to eliminate unsafe casts.
- **Filter State & Debounce**: Use functional updater `setFilter((prev) => ...)`, parse dimension bounds to `number | undefined`, add `cancel()` to debounce helper for unmount/clear cleanup, and reset inputs via form ref.
- **React Hygiene & Localization**: Key rows by `${row.standard}-${row.code}`, memoize dataset retrieval/filtering/sorting (`useMemo`) and modal dismissal (`useCallback`), externalize modal loading string to `en`/`id`, and track container dimensions with `useRef` + `ResizeObserver`.
- **Dead Code Cleanup**: Remove unused `src/utils/constants.ts`, `src/utils/mathUtils.ts`, `src/utils/__tests__/mathUtils.test.ts`, duplicate SCSS import in `src/App.tsx`, and commented code in `languageDropdown.tsx` and `visualization.tsx`.
- **SEO, a11y & Scripts**: Fix meta description tag in `title.tsx`, add `aria-label` to language selector, add `aria-sort` and keyboard trigger to table headers, provide accessible header/brand in `navBar.tsx` preserving visual layout per Principle XIII, and make scripts Node 18+ portable using `fileURLToPath(import.meta.url)`.
- **License & Version**: Align `package.json` license to `"GPL-3.0-only"` matching root `LICENSE`; schedule patch release bump `3.0.1` → `3.0.2` via `./scripts/bump-version.mjs patch`.

## Technical Context

**Language/Version**: TypeScript 5.7+, React 19

**Primary Dependencies**: Vite 8, Vitest 5, i18next, react-i18next, Bootstrap 5 (CSS only)

**Storage**: N/A (client-side static catalog)

**Testing**: Vitest 5 + jsdom; `pnpm test`; coverage gates ≥ 80% stmt/line/fn, ≥ 75% branch

**Target Platform**: Browser (GitHub Pages static deploy)

**Project Type**: Web application (SPA)

**Performance Goals**: Zero performance regression; eliminate redundant render cascades via memoization

**Constraints**: Zero visual layout or dimension shifts (Principle XIII); strict typing (Principle II); regression tests for all fixes (Principle IX); zero new dependencies (Principle IV)

**Scale/Scope**: ~15 files affected; 62+ baseline tests + targeted regression tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | React Best Practices | ✅ PASS | Functional state updates, `useMemo`, `useCallback`, `ResizeObserver` + `useRef` replacing DOM queries, full debounce cleanup on unmount |
| II | Strict Type Safety | ✅ PASS | `TableHeadField | null` eliminates `as keyof DataRepresentation` and `as TableHeadField` casts; `tsc --noEmit` gate enforced |
| III | Codebase Cleanup | ✅ PASS | Deletes unused `constants.ts`, `mathUtils.ts`, math tests, duplicate CSS import, and commented-out code blocks |
| IV | Lightweight Dependencies | ✅ PASS | Zero new npm dependencies; uses native Web APIs (`ResizeObserver`) and Node standard library |
| V | Conventional Commits | ✅ PASS | Atomic commits using `fix:`, `refactor:`, and `chore:` scopes |
| VI | Git Branching Discipline | ✅ PASS | Isolated on dedicated branch `fix/code-review-compliance` from `Master` |
| VII | Zero-Assumption Clarification | ✅ PASS | Clarification resolved: `package.json` license aligned to `"GPL-3.0-only"` matching root `LICENSE` |
| VIII | Research-Backed Decisions | ✅ PASS | Verified Node 18+ ESM path resolution, `ResizeObserver` lifecycle, and standard debounce cancellation API |
| IX | Mandatory Testing | ✅ PASS | Regression tests planned for sorting i18n, filter updates, debounce unmount, and keyboard navigation; all 62+ tests passing |
| X | Reusable Scripts | ✅ PASS | Upgrades `audit-codebase.mjs` and `check-i18n-parity.mjs` for Node 18+ portability; uses `bump-version.mjs` |
| XI | Semver & Deploy from Master | ✅ PASS | Schedules patch version bump `3.0.1` → `3.0.2` via `./scripts/bump-version.mjs patch`; deployment strictly from `Master` |
| XII | SEO-Friendly Architecture | ✅ PASS | Corrects `<meta name="description" ... />` attribute in `title.tsx` |
| XIII | Visual Layout Preservation | ✅ PASS | Zero changes to visual layout, dimensions, typography, spacing, or CSS rules |

## Project Structure

### Documentation (this feature)

```text
specs/005-code-review-compliance/
├── plan.md              # This implementation plan
├── research.md          # Technical analysis & design decisions
├── data-model.md        # Entities, contracts & state models
├── quickstart.md        # Step-by-step verification procedures
├── contracts/
│   └── component-contracts.md # Component & script interface contracts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code Modifications

```text
src/
├── App.tsx                           UPDATE (remove duplicate ./css/index.scss import)
├── components/
│   ├── header/
│   │   ├── languageDropdown.tsx      UPDATE (add aria-label, remove commented code)
│   │   ├── navBar.tsx                UPDATE (semantic <header> + accessible brand title, visual style preserved)
│   │   └── title.tsx                 UPDATE (fix meta description tag attribute)
│   ├── input/
│   │   └── inputSection.tsx          UPDATE (functional setFilter, parse numbers, formRef, debounce cleanup)
│   ├── modal/
│   │   ├── modalContent.tsx          UPDATE (useRef + ResizeObserver, i18n loading)
│   │   └── visualization.tsx         UPDATE (remove commented-out SVG logic)
│   └── table/
│       ├── tableHead.tsx             UPDATE (canonical TableHeadField items, aria-sort, keyboard handling)
│       ├── tableRow.tsx              UPDATE (composite key standard-code, memoize filtered/sorted data)
│       └── tableSection.tsx          UPDATE (pass canonical header tuples, memoize dataset)
├── contexts/
│   └── SortContext.tsx               UPDATE (type sortBy as TableHeadField | null)
├── locales/
│   ├── en/globals.json               UPDATE (add modal.loading)
│   └── id/globals.json               UPDATE (add modal.loading)
└── utils/
    ├── constants.ts                  REMOVE (unused STANDARDIZATION_COLOR)
    ├── mathUtils.ts                  REMOVE (unused remapPercent)
    ├── debounce.ts                   UPDATE (add cancel() capability)
    ├── index.ts                      UPDATE (remove constants and mathUtils exports)
    └── __tests__/
        └── mathUtils.test.ts         REMOVE (tests for deleted mathUtils)

scripts/
├── audit-codebase.mjs                UPDATE (Node 18+ path resolution via fileURLToPath)
└── check-i18n-parity.mjs             UPDATE (Node 18+ path resolution via fileURLToPath)

package.json                          UPDATE (align license to GPL-3.0-only; bump 3.0.1 -> 3.0.2)
```

## Complexity Tracking

> Zero Constitution violations requiring justification.
