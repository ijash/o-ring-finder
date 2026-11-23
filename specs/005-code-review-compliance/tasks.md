---
description: "Task list for Code Review Compliance and Hygiene Fixes"
---

# Tasks: Code Review Compliance and Hygiene Fixes

**Input**: Design documents from `specs/005-code-review-compliance/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline repository configuration and script compatibility

- [x] T001 Align `package.json` license field to `"GPL-3.0-only"` matching root `LICENSE` file
- [x] T002 [P] Update `scripts/audit-codebase.mjs` to resolve repository root via `fileURLToPath(import.meta.url)` and `dirname`
- [x] T003 [P] Update `scripts/check-i18n-parity.mjs` to resolve repository root via `fileURLToPath(import.meta.url)` and `dirname`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility contracts and context types required by user stories

- [x] T004 [P] Update `src/utils/debounce.ts` to add `.cancel()` method to `DebouncedFunction` interface and return object
- [x] T005 [P] Update `src/contexts/SortContext.tsx` to type `SortState.sortBy` strictly as `TableHeadField | null` and export `TableHeadField` per `data-model.md` (`SortState.sortBy`, `SortState.sortDirection`)
- [x] T006 [P] Add `modal.loading` string to `src/locales/en/globals.json` (`"Loading..."`) and `src/locales/id/globals.json` (`"Memuat..."`)

---

## Phase 3: User Story 1 - Canonical Key Sorting Across Languages (Priority: P1) 🎯 MVP

**Goal**: Sort table columns by canonical attributes in both English and Indonesian without translation bugs or type casts

**Independent Test**: Switch language between English and Indonesian in UI, click each header, verify data sorts identically on canonical keys.

### Tests for User Story 1
- [x] T007 [P] [US1] Add regression test for Indonesian column sorting and canonical key persistence in `src/components/table/__tests__/tableSection.test.tsx`
- [x] T008 [P] [US1] Add unit tests for `TableHeadField | null` and sort reset transitions in `src/contexts/__tests__/SortContext.test.tsx` (citing `data-model.md` `SortState.sortBy`)

### Implementation for User Story 1
- [x] T009 [P] [US1] Update `src/components/table/tableHead.tsx` to accept `headerItems: { key: TableHeadField, label: string }[]`, render `aria-sort`, and handle `Enter`/`Space` keyboard triggers (citing `data-model.md` `TableHeadItem`)
- [x] T010 [US1] Update `src/components/table/tableSection.tsx` to map `TABLE_HEADERS` into canonical `{ key, label }` tuples and pass to `TableHead`
- [x] T011 [US1] Update `src/components/table/tableRow.tsx` to sort rows by `TableHeadField` directly without `as keyof DataRepresentation` type casts

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Resilient Filter State, Form Reset, and Debounce Lifecycle (Priority: P1)

**Goal**: Ensure functional state updates, numeric dimension comparison, debounce timer cleanup, and DOM-free form reset

**Independent Test**: Rapidly type into dimension inputs, verify numeric filtering behaves accurately, trigger form reset via form ref, and verify debounce unmount cleanup.

### Tests for User Story 2
- [x] T012 [P] [US2] Add unit tests for `debounce.cancel()` timer cancellation in `src/utils/__tests__/debounce.test.ts`
- [x] T013 [P] [US2] Add regression test for rapid multi-field debounce, unmount cancellation, and form ref reset in `src/components/input/__tests__/inputSection.test.tsx`

### Implementation for User Story 2
- [x] T014 [US2] Update `src/components/input/inputSection.tsx` to use functional `setFilter((prev) => ...)`, parse dimension bounds to `number | undefined` per `data-model.md` (`IDataFilter.minId`, `IDataFilter.maxId`, `IDataFilter.minOd`, `IDataFilter.maxOd`, `IDataFilter.minCs`, `IDataFilter.maxCs`), cancel pending debounce on unmount and in `handleClear`, and reset via `formRef.current?.reset()`

**Checkpoint**: User Stories 1 and 2 both function independently.

---

## Phase 5: User Story 3 - High-Performance Table and Modal Hygiene with Localization (Priority: P2)

**Goal**: Prevent duplicate key warnings, memoize heavy computations, and replace DOM element queries with `useRef` + `ResizeObserver`

**Independent Test**: Render catalog containing duplicate codes across AS568/JIS/Metric, open modal and verify smooth visualization resize and localized loading indicator.

### Tests for User Story 3
- [x] T015 [P] [US3] Add regression test for duplicate key collision prevention (`standard-code`) and modal Escape/a11y in `src/components/modal/__tests__/modal.test.tsx`

### Implementation for User Story 3
- [x] T016 [P] [US3] Update `src/components/table/tableRow.tsx` to key row items by `${row.standard}-${row.code}` per `data-model.md` (`DataRepresentation`), memoize `filteredData` and `sortedData` with `useMemo`, and memoize `handleCloseModal` with `useCallback`
- [x] T017 [P] [US3] Update `src/components/table/tableSection.tsx` to memoize `getAllORingData` result with `useMemo` on `filter.unit`
- [x] T018 [US3] Update `src/components/modal/modalContent.tsx` to replace `document.getElementById` and window resize listener with `useRef` + `ResizeObserver`, and render localized `t("modal.loading")`

**Checkpoint**: User Stories 1, 2, and 3 fully functional and testable independently.

---

## Phase 6: User Story 4 - Semantic Markup, SEO Meta Fix, and Accessible Navigation (Priority: P2)

**Goal**: Fix HTML meta description, add button a11y labels, and provide accessible header/title preserving exact visual styling per Principle XIII

**Independent Test**: Validate meta tags in DOM, inspect screen-reader labels on buttons, and verify visual geometry of top navigation bar.

### Tests for User Story 4
- [x] T019 [P] [US4] Add a11y and meta description validation tests in `src/App.test.tsx` and `src/components/header/__tests__/languageDropdown.test.tsx`

### Implementation for User Story 4
- [x] T020 [P] [US4] Update `src/components/header/title.tsx` to output valid `<meta name="description" content="..." />` attribute
- [x] T021 [P] [US4] Update `src/components/header/languageDropdown.tsx` to add `aria-label={t("langSelect.display")}` and remove commented code
- [x] T022 [US4] Update `src/components/header/navBar.tsx` with semantic `<header>` wrapper and accessible clickable title preserving exact typography, color, text-shadow, and spacing per Principle XIII

**Checkpoint**: User Stories 1 through 4 pass all accessibility, SEO, and visual preservation checks.

---

## Phase 7: User Story 5 - Node Compatibility & Codebase Hygiene (Priority: P3)

**Goal**: Remove unused utilities, tests, duplicate imports, and dead commented code

**Independent Test**: Run codebase hygiene audit and verify removed files/exports are absent from bundle.

### Implementation for User Story 5
- [x] T023 [P] [US5] Delete unused `src/utils/constants.ts` and `src/utils/mathUtils.ts`
- [x] T024 [P] [US5] Delete unused test `src/utils/__tests__/mathUtils.test.ts`
- [x] T025 [US5] Update `src/utils/index.ts` to remove exports for deleted `constants` and `mathUtils` modules
- [x] T026 [P] [US5] Remove duplicate `import "./css/index.scss"` in `src/App.tsx`
- [x] T027 [P] [US5] Remove commented-out SVG positioning code in `src/components/modal/visualization.tsx`

**Checkpoint**: All user stories complete with zero dead code or hygiene violations.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Version bump, full quality gates verification, and release readiness

- [x] T028 Bump version `3.0.1` → `3.0.2` via `node scripts/bump-version.mjs patch` in `package.json`
- [x] T029 Run `./scripts/verify-gates.sh` to verify typecheck, 100% i18n parity, 62+ passing tests, and clean production build
- [x] T030 Execute `quickstart.md` validation scenarios verifying zero visual regression per Principle XIII

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks User Stories 1 and 2.
- **User Stories (Phases 3–7)**: Depend on Foundational phase completion; can proceed in priority order (P1 → P2 → P3).
- **Polish (Phase 8)**: Depends on all user stories completing.

### Parallel Opportunities
- T002, T003 in Phase 1 run in parallel.
- T004, T005, T006 in Phase 2 run in parallel.
- T007, T008 (tests) and T009 run in parallel within Phase 3.
- T012, T013 run in parallel within Phase 4.
- T015, T016, T017 run in parallel within Phase 5.
- T019, T020, T021 run in parallel within Phase 6.
- T023, T024, T026, T027 run in parallel within Phase 7.
