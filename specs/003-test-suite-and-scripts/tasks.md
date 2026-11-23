# Tasks: Test Suite and Routine Automation Scripts

**Input**: Design documents from `specs/003-test-suite-and-scripts/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/scripts-contract.md`
**Branch**: `feat/test-suite-and-scripts`

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Parallelizable (independent files, no dependencies)
- **[Story]**: User story identifier (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test coverage dependency installation and Vitest configuration

- [x] T001 Install `@vitest/coverage-v8@^5.1.1` as devDependency in `package.json`
- [x] T002 Configure V8 coverage provider and 80%/75% thresholds in `vite.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Unit test suite for core utilities in `src/utils/`

- [x] T003 [P] Create unit tests for `remapPercent` in `src/utils/__tests__/mathUtils.test.ts`
- [x] T004 [P] Create unit tests for timer debounce and cancellation in `src/utils/__tests__/debounce.test.ts`
- [x] T005 [P] Create unit tests for DOM element width resolution in `src/utils/__tests__/htmlUtils.test.ts`

**Checkpoint**: Foundation ready - utility functions tested with 100% coverage.

---

## Phase 3: User Story 1 - Comprehensive Regression Safety for Core User Interactions (Priority: P1) 🎯 MVP

**Goal**: Complete component and integration testing for search filtering, table sorting, unit switching, and modal dialogs.
**Independent Test**: `pnpm vitest run src/components/ src/App.test.tsx` passes cleanly.

- [x] T006 [P] [US1] Create component tests for `InputSection` filtering and debounce in `src/components/input/__tests__/inputSection.test.tsx` (cites `FilterState.unit`, `FilterState.code`, `FilterState.minId`, `FilterState.maxId`, `FilterState.minOd`, `FilterState.maxOd`, `FilterState.minCs`, `FilterState.maxCs` in `specs/003-test-suite-and-scripts/data-model.md`)
- [x] T007 [P] [US1] Create component tests for `TableSection`, `TableHead`, and `TableRowsComponent` in `src/components/table/__tests__/tableSection.test.tsx` (cites `SortState.sortBy`, `SortState.sortDirection` in `specs/003-test-suite-and-scripts/data-model.md`)
- [x] T008 [P] [US1] Create component tests for `CustomModal` open/close and product search links in `src/components/modal/__tests__/modal.test.tsx`
- [x] T009 [US1] Update integration tests for filtering, unit switching, and table interactions in `src/App.test.tsx`

**Checkpoint**: User Story 1 functional and verified independently.

---

## Phase 4: User Story 2 - Localization Integrity and Telemetry Hygiene (Priority: P2)

**Goal**: 100% translation key parity between English and Indonesian dictionaries, language switching, and telemetry isolation.
**Independent Test**: `pnpm vitest run src/locales/ src/components/header/ src/components/common/` passes cleanly.

- [x] T010 [P] [US2] Create component tests for telemetry script injection in `src/components/common/__tests__/goatCounter.test.tsx`
- [x] T011 [P] [US2] Create component tests for language dropdown and html lang attribute sync in `src/components/header/__tests__/languageDropdown.test.tsx`
- [x] T012 [P] [US2] Create integration tests for translation parity in `src/locales/__tests__/i18n.test.ts` (cites `I18nDictionary` in `specs/003-test-suite-and-scripts/data-model.md`)
- [x] T013 [US2] Clean up schema nesting anomaly in `src/locales/en/globals.json` to achieve 100% bidirectional parity with `src/locales/id/globals.json`

**Checkpoint**: User Story 2 verified with 100% bilingual parity.

---

## Phase 5: User Story 3 - Standardized Routine Automation Scripts (Priority: P3)

**Goal**: Deliver 5 self-documenting developer and agent automation scripts in `./scripts/`.
**Independent Test**: Execute each script in `./scripts/` standalone with clean exit code 0.

- [x] T014 [P] [US3] Create translation key and non-empty string parity script in `scripts/check-i18n-parity.mjs`
- [x] T015 [P] [US3] Create static type-safety and hygiene audit script in `scripts/audit-codebase.mjs`
- [x] T016 [P] [US3] Create safe SemVer bumper blocking major bumps in `scripts/bump-version.mjs`
- [x] T017 [P] [US3] Create Vitest coverage test runner script in `scripts/test-coverage.sh`
- [x] T018 [US3] Enhance master quality gate script in `scripts/verify-gates.sh` to run typecheck, i18n parity, tests, and build
- [x] T019 [US3] Make all automation scripts executable with `chmod +x scripts/*.sh scripts/*.mjs`

**Checkpoint**: All 5 routine automation scripts operational and self-documenting.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Version bump, final coverage validation, and quality gate execution

- [x] T020 Bump version to `2.5.0` via `node scripts/bump-version.mjs minor` in `package.json`
- [x] T021 Run coverage runner via `./scripts/test-coverage.sh` to verify >= 80% / 75% thresholds
- [x] T022 Execute master quality gates via `./scripts/verify-gates.sh` to verify clean build and tests

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: Must complete before test execution.
- **Phase 2 (Foundational)**: Unblocks all subsequent test suites.
- **Phase 3 (US1)**: Core search, filter, sort, modal, and app tests.
- **Phase 4 (US2)**: Telemetry, language dropdown, and i18n parity fix.
- **Phase 5 (US3)**: Routine automation scripts in `./scripts/`.
- **Phase 6 (Polish)**: Final version bump and verification gates.
