# Implementation Plan: Lightweight Performance Optimization

**Branch**: `perf/lightweight-optimization` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-lightweight-performance/spec.md`

## Summary

- **Baseline & Budget Gate**: Record baseline bundle metrics (`~748 kB` JS / `~226 kB` CSS raw), create reusable `./scripts/check-bundle-size.mjs` (Principle X), and add bundle budget check to `./scripts/verify-gates.sh`.
- **Eliminate Bootstrap JS**: Remove `bootstrap.bundle.min.js` import from `src/App.tsx`; implement native React state, click-outside, and `Escape` close in `src/components/header/languageDropdown.tsx` using exact `.dropdown-menu.show` classes. Remove `@types/bootstrap` devDependency.
- **Eliminate FontAwesome**: Replace 4 `@fortawesome/*` packages with 3 zero-dependency inline SVG components in `src/components/common/icons.tsx` (`IconCircle`, `IconLanguage`, `IconEraser`) with identical `viewBox` and `1em` sizing; uninstall packages from `package.json`.
- **Selective Bootstrap SCSS**: Audit all classes used in `src/`; replace full `bootstrap.scss` import in `src/css/index.scss` with selective imports of only used modules (reboot, type, grid, tables, forms, buttons, dropdown, card, modal, utilities) preserving 100% visual layout (Principle XIII).
- **Smooth Table Rendering**: Wrap filtered/sorted catalog rows in `src/components/table/tableRow.tsx` with React 19 `useDeferredValue` and memoized components; keep full DOM table without scroll virtualization to preserve browser `Ctrl+F` and SEO crawlability (Principle XII).
- **Instant Unit Toggle**: Make `handleUnitFilter` in `src/components/input/inputSection.tsx` update unit synchronously without 897ms typing debounce delay.
- **Code-Split Modal**: Lazy-load `CustomModal` in `tableRow.tsx` via `React.lazy` and `<Suspense fallback={null}>`.
- **Supply-Chain & Semver**: Keep `blockExoticSubdeps: true` (Principle IV); schedule minor version bump `3.0.3` → `3.1.0` via `node scripts/bump-version.mjs minor` (Principle XI).

## Technical Context

- **Language/Version**: TypeScript 5.7+ (`tsconfig.json` strict baseline)
- **Primary Dependencies**: React 19, react-dom 19, i18next, react-i18next, Vite 8, Vitest 5, Sass
- **Storage**: Client-side static JSON catalogs (AS568, JIS, Metric; 3,822 items)
- **Testing**: Vitest 5 + jsdom + testing-library/react; 63 baseline tests, ≥ 80% coverage
- **Target Platform**: Browser / static web application (GitHub Pages)
- **Project Type**: Client-side single-page application (SPA)
- **Performance Goals**: JS payload < 300 kB raw (< 85 kB gzip); CSS payload < 100 kB raw (< 25 kB gzip); unit switch latency < 50ms; 0 dropped frames during filter/scroll
- **Constraints**: 0px visual or layout deviation (Principle XIII); preserve native `Ctrl+F` and search indexing (Principle XII); zero new dependencies (Principle IV); all 63+ tests passing (Principle IX)
- **Scale/Scope**: ~10 files modified; 5 dependencies uninstalled; 1 script added

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | React Best Practices | ✅ PASS | Native state for dropdown, `useDeferredValue` for row transitions, `React.lazy` code-splitting, pure rendering |
| II | Strict Type Safety | ✅ PASS | Strict SVG prop typing (`IconProps`), zero `any`, zero `@ts-ignore`, full compiler check pass |
| III | Codebase Cleanup | ✅ PASS | Uninstalls 4 FontAwesome packages + `@types/bootstrap`; removes redundant bundle scripts and dead SCSS rules |
| IV | Lightweight Dependencies | ✅ PASS | Net removal of 5 external packages; uses native SVGs and browser APIs; `blockExoticSubdeps: true` preserved |
| V | Conventional Commits | ✅ PASS | Atomic commits using `perf:`, `refactor:`, `chore:`, and `test:` scopes |
| VI | Git Branching Discipline | ✅ PASS | Isolated on dedicated branch `perf/lightweight-optimization` created from `Master` |
| VII | Zero-Assumption Clarification | ✅ PASS | All 3 `[NEEDS CLARIFICATION]` decisions confirmed and documented in `spec.md` |
| VIII | Research-Backed Decisions | ✅ PASS | Verified baseline bundle metrics, Bootstrap SCSS dependency tree, and React 19 `useDeferredValue` ergonomics |
| IX | Mandatory Testing | ✅ PASS | Automated regression tests for dropdown a11y, inline icons, unit change responsiveness, and existing 63 tests |
| X | Reusable Scripts | ✅ PASS | Adds reusable `./scripts/check-bundle-size.mjs` checking raw & gzip thresholds; integrates into `verify-gates.sh` |
| XI | Semver & Deploy from Master | ✅ PASS | Schedules minor version bump `3.0.3` → `3.1.0` via `node scripts/bump-version.mjs minor`; deploy from `Master` |
| XII | SEO-Friendly Architecture | ✅ PASS | Retains full native DOM table rows without virtual scroll clipping, ensuring 100% crawlability and `Ctrl+F` search |
| XIII | Visual Layout Preservation | ✅ PASS | 0px visual shift; exact Bootstrap CSS classes, icon paths, colors, and layout metrics retained |

## Project Structure

### Documentation (this feature)

```text
specs/006-lightweight-performance/
├── plan.md              # This implementation plan
├── research.md          # Baseline metrics & architectural decisions
├── data-model.md        # State models & rendering pipeline
├── quickstart.md        # Verification procedures & commands
├── contracts/
│   └── performance-contracts.md # Bundle budgets & component contracts
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code Modifications

```text
package.json                              UPDATE (remove 4 @fortawesome deps & @types/bootstrap)
src/
├── App.tsx                               UPDATE (remove bootstrap JS bundle import)
├── css/
│   └── index.scss                        UPDATE (selective Bootstrap SCSS module imports)
├── components/
│   ├── common/
│   │   └── icons.tsx                     UPDATE (zero-dep inline SVG components)
│   ├── header/
│   │   └── languageDropdown.tsx          UPDATE (native React state dropdown with click-outside & Escape)
│   ├── input/
│   │   └── inputSection.tsx              UPDATE (synchronous unit filter update)
│   └── table/
│       └── tableRow.tsx                  UPDATE (useDeferredValue + memo + lazy modal)
scripts/
├── check-bundle-size.mjs                 CREATE (reusable bundle budget checker)
└── verify-gates.sh                       UPDATE (integrate bundle size gate)
```

## Complexity Tracking

> **No violations; zero new architectural complexity or abstractions added.**
