# Tasks: Lightweight Performance Optimization

**Input**: Design documents from `specs/006-lightweight-performance/` (`plan.md`, `spec.md`, `data-model.md`, `contracts/performance-contracts.md`, `research.md`, `quickstart.md`)

## Phase 1: Setup & Baseline

**Purpose**: Baseline measurement and reusable bundle size check tooling

- [x] T001 Record baseline `dist/` JS & CSS raw + gzip bundle sizes before optimization
- [x] T002 [P] Create Node 18+ portable bundle budget checker in `scripts/check-bundle-size.mjs` per `contracts/performance-contracts.md`
- [x] T003 Wire bundle budget checker into `scripts/verify-gates.sh` as quality gate step 5

---

## Phase 2: Foundational (Test Harness & Verification Prep)

**Purpose**: Regression test foundations before component refactoring

- [x] T004 [P] Add dropdown open/close, click-outside, and Escape key tests in `src/components/header/__tests__/languageDropdown.test.tsx`
- [x] T005 [P] Add icon rendering and SVG accessibility tests in `src/components/common/__tests__/icons.test.tsx`
- [x] T006 [P] Add synchronous unit filter update responsiveness test in `src/components/input/__tests__/inputSection.test.tsx`
- [x] T007 [P] Add deferred row rendering and lazy modal loading tests in `src/components/table/__tests__/tableRow.test.tsx`

---

## Phase 3: User Story 1 - Instant Unit Switching & Filter Responsiveness (Priority: P1) 🎯 MVP

**Goal**: Eliminate 897ms debounce lag on unit selection so dimensions update immediately across all catalog records

**Independent Test**: Change unit `<select>` value in `inputSection.tsx`; verify `FilterContext.setFilter` executes synchronously without timer delay

- [x] T008 [US1] Update `handleUnitFilter` in `src/components/input/inputSection.tsx` to update unit synchronously and cancel pending typing debounce
- [x] T009 [US1] Verify filter input debouncing remains intact for numeric and text filters in `src/components/input/inputSection.tsx`
- [x] T010 [US1] Run unit filter regression test suite in `src/components/input/__tests__/inputSection.test.tsx`

---

## Phase 4: User Story 2 - Minimal Resource Download & Bundle Slimming (Priority: P2)

**Goal**: Drop unused runtime libraries (Bootstrap JS, 4 FontAwesome packages, full Bootstrap SCSS) to achieve < 300 kB JS and < 100 kB CSS

**Independent Test**: Run `pnpm run build` and `node scripts/check-bundle-size.mjs`; verify both JS and CSS payloads meet budget limits

- [x] T011 [P] [US2] Replace FontAwesome icon components with 3 zero-dependency inline SVGs in `src/components/common/icons.tsx` per `data-model.md`
- [x] T012 [US2] Uninstall `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-solid-svg-icons`, and `@fortawesome/react-fontawesome` from `package.json` with `pnpm remove`
- [x] T013 [P] [US2] Refactor `src/components/header/languageDropdown.tsx` to native React state, click-outside handler, and Escape listener retaining `.dropdown-menu.show`
- [x] T014 [US2] Remove `import "bootstrap/dist/js/bootstrap.bundle.min.js";` from `src/App.tsx`
- [x] T015 [US2] Uninstall `@types/bootstrap` devDependency from `package.json` with `pnpm remove -D`
- [x] T016 [P] [US2] Audit all Bootstrap classes used across `src/` to confirm complete utility and component coverage
- [x] T017 [US2] Replace full Bootstrap import in `src/css/index.scss` with selective SCSS module imports preserving 100% visual styling per Principle XIII
- [x] T018 [US2] Run icon, language dropdown, and App test suites to verify zero functional or visual regression

---

## Phase 5: User Story 3 - Fluid Scrolling & Filtering Across Full Catalog (Priority: P3)

**Goal**: Non-blocking table rendering across 3,822 items via `useDeferredValue` and on-demand modal code-splitting

**Independent Test**: Trigger fast filter updates on catalog table; verify UI inputs stay responsive and modal chunk loads asynchronously on click

- [x] T019 [US3] Code-split `CustomModal` in `src/components/table/tableRow.tsx` using `React.lazy` and `Suspense` with null fallback
- [x] T020 [US3] Apply React 19 `useDeferredValue` to sorted/filtered table rows in `src/components/table/tableRow.tsx`
- [x] T021 [US3] Memoize individual catalog table row elements in `src/components/table/tableRow.tsx` to prevent unnecessary re-renders
- [x] T022 [US3] Run table row and catalog integration tests in `src/components/table/__tests__/tableRow.test.tsx` and `src/components/table/__tests__/tableSection.test.tsx`

---

## Phase 6: Polish & Verification

**Purpose**: Version bump, full gate validation, and release readiness

- [x] T023 Bump minor version from `3.0.3` to `3.1.0` in `package.json` via `node scripts/bump-version.mjs minor` per Principle XI
- [x] T024 Verify `blockExoticSubdeps: true` remains set in `package.json` and `pnpm-lock.yaml` is clean per Principle IV
- [x] T025 Run full quality gates suite via `./scripts/verify-gates.sh` (tsc, i18n parity, vitest, build, bundle budget)
