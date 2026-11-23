# Implementation Plan: Architecture & Code Cleanup

**Branch**: `refactor/architecture-and-code-cleanup` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-architecture-and-code-cleanup/spec.md`

## Summary

- Relocate misplaced files to responsibility-correct folders, rename casing inconsistencies, delete `src/components/context/`, and merge `src/App.css` into `src/css/`.
- Fix React/TS debt: memoize context values, add `useFilter` guard, replace `SortDirection "undefined"` with `null`, move `i18next` init to module scope, fix `GoatCounter` load race, restore ARIA on `CustomModal`.
- Add `contexts` alias to `vite.config.ts` + `tsconfig.json`; bump version `3.0.0 → 3.0.1`.
- Zero visual changes; all 56+ tests stay green; `tsc --noEmit` passes.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19

**Primary Dependencies**: Vite 8, Vitest 5, i18next, react-i18next, Bootstrap (CSS only)

**Storage**: N/A (client-side only)

**Testing**: Vitest 5 + jsdom; `pnpm test`; coverage gates ≥ 80% stmt/line/fn, ≥ 75% branch

**Target Platform**: Browser (GitHub Pages static deploy)

**Project Type**: Web application (SPA)

**Performance Goals**: No regression in bundle size; Lighthouse score unchanged

**Constraints**: Zero visual diff (Principle XIII); no new npm dependencies; no breaking changes to public component API

**Scale/Scope**: ~80 source files; 56+ tests; single developer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | React Best Practices | ✅ PASS | Plan adds `useMemo` on contexts, guarded hook, `readyState` fix, ARIA hygiene |
| II | Strict Type Safety | ✅ PASS | `SortDirection null`, remove `{} as …` cast, `tsc --noEmit` gate required |
| III | Codebase Cleanup | ✅ PASS | Core goal of this feature; misplaced files moved, dead CSS removed |
| IV | Lightweight Dependencies | ✅ PASS | Zero new deps added |
| V | Conventional Commits | ✅ PASS | `refactor:` scope per move/fix group; `chore:` for version bump |
| VI | Git Branching Discipline | ✅ PASS | Work on `refactor/architecture-and-code-cleanup` from `Master` |
| VII | Zero-Assumption Clarification | ✅ PASS | 1 clarification resolved (contexts → `src/contexts/`) |
| VIII | Research-Backed Decisions | ✅ PASS | `research.md` documents patterns; no guessing |
| IX | Mandatory Testing | ✅ PASS | 56+ tests must stay green; coverage gates enforced |
| X | Reusable Scripts | ✅ PASS | `bump-version.mjs patch` used; `audit-codebase.mjs` run first |
| XI | Semver & Deploy from Master | ✅ PASS | `3.0.0 → 3.0.1 patch` via `./scripts/bump-version.mjs patch`; merge to Master to deploy |
| XII | SEO-Friendly Architecture | ✅ PASS | No structural changes to `index.html`, meta tags, or routing |
| XIII | Visual Layout Preservation | ✅ PASS | CSS moves are file-org only; no rule changes; enforced by screenshot diff gate |

## Project Structure

### Documentation (this feature)

```text
specs/004-architecture-and-code-cleanup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md             # /speckit-tasks output
```

### Source Code (before → after)

```text
src/
├── App.css                           REMOVE (merge rules into src/css/_custom.scss)
├── App.tsx
├── App.test.tsx
├── index.tsx
├── setupTests.ts
├── vite-env.d.ts
├── @types/
├── assets/
├── components/
│   ├── index.ts                      UPDATE (remove context re-export; add analytics)
│   ├── main.tsx
│   ├── common/
│   │   ├── constants.ts              MOVE → src/utils/constants.ts
│   │   ├── goatCounter.tsx           MOVE → src/components/analytics/GoatCounter.tsx
│   │   ├── icons.tsx
│   │   ├── index.ts                  UPDATE
│   │   ├── labelWrapper.tsx
│   │   ├── names.tsx                 MOVE → src/utils/names.ts
│   │   ├── standardElementProps.ts
│   │   └── types/
│   ├── analytics/                    NEW
│   │   └── GoatCounter.tsx           (moved + fixed readyState race)
│   ├── context/                      REMOVE entire folder
│   ├── footer/
│   ├── header/
│   ├── input/
│   ├── modal/
│   └── table/
├── contexts/                         NEW
│   ├── FilterContext.tsx             (moved + memoized + useFilter hook)
│   └── SortContext.tsx               (moved + memoized value)
├── css/
│   ├── _custom.scss                  ABSORB App.css rules here
│   └── … (unchanged)
├── data/
├── locales/
│   └── i18n.ts                      UPDATE (export initialized instance, not factory fn)
└── utils/
    ├── constants.ts                  NEW (moved from common/)
    ├── names.ts                      NEW (moved from common/)
    ├── debounce.ts
    ├── htmlUtils.ts
    ├── mathUtils.ts
    └── index.ts                      UPDATE
```

**Alias changes** (`vite.config.ts` + `tsconfig.json`):
- Add: `contexts → ./src/contexts`
- Existing aliases unchanged (`components`, `data`, `locales`, `utils`, `assets`)

**Structure Decision**: Single-project SPA. No backend. All moves are within `src/`.

## Complexity Tracking

> No Constitution violations requiring justification.

