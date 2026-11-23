# Feature Specification: Test Suite and Routine Automation Scripts

**Feature Branch**: `feat/test-suite-and-scripts`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "create a test suite so it safe after every feature/bugfix. also create scripts here for routine tasks."

## Clarifications

### Session 2026-11-23

- Q: What coverage threshold should be enforced and via what tool? → A: Enforce 80% statements, 80% lines, 80% functions, and 75% branches via `@vitest/coverage-v8`.
- Q: What is the test framework execution scope? → A: Vitest + React Testing Library (`jsdom`) only (unit, component, and integration tests; no Playwright/Cypress browser E2E to keep repo lightweight per Principle IV).
- Q: What is the exact routine helper script manifest in `./scripts/`? → A: Five scripts: `verify-gates.sh` (enhanced for tsc, i18n, vitest, build), `check-i18n-parity.mjs` (key parity + non-empty strings), `audit-codebase.mjs` (scans any, @ts-ignore, console.log, legacy artifacts), `bump-version.mjs` (patch/minor SemVer bumper, blocks major, prints conventional commit), and `test-coverage.sh` (Vitest coverage runner).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Regression Safety for Core User Interactions (Priority: P1)

Users and maintainers need confidence that all catalog search, dimensional filtering, table sorting, unit conversion, and detail inspection features continue to function accurately without regression across releases.

**Why this priority**:
- Prevents broken searches, inaccurate O-ring sizing conversions, or broken modal inspections from reaching production users.
- Enforces mandatory automated testing mandated by Constitution Principle IX.

**Independent Test**:
- Run automated test suite validating catalog filtering, debounce timing, unit conversion (`mm` ↔ `inch`), sorting, modal dialogs, and external search links in isolation.

**Acceptance Scenarios**:
1. **Given** catalog data loaded, **When** user enters dimensional bounds (min/max ID, OD, CS) or code search text, **Then** matching records appear after input debounce and non-matching records are excluded.
2. **Given** active filter values across input fields, **When** user triggers "Clear filter", **Then** all inputs reset to empty state and table displays all catalog entries.
3. **Given** table of O-ring results, **When** user clicks a table column header, **Then** results sort ascending, descending, or return to default order with correct sort indicators.
4. **Given** default metric view (`mm`), **When** user switches measurement unit to imperial (`inch`), **Then** all displayed dimensions convert accurately without mutating source catalog entries.
5. **Given** a table row, **When** user clicks the row, **Then** details modal opens with correct attributes, visualization, and marketplace/web product search links; pressing close or browser back closes the modal.

---

### User Story 2 - Localization Integrity and Telemetry Hygiene (Priority: P2)

Bilingual users (`en` and `id`) must experience 100% complete translation parity with zero missing translation keys or layout shifts, while privacy-preserving analytics load only when configured.

**Why this priority**:
- Guarantees zero untranslated fallback strings or key mismatches across English and Indonesian locales.
- Validates telemetry script injection respects environment configuration without throwing runtime errors.

**Independent Test**:
- Execute automated parity test comparing `en` and `id` dictionary keys and test language dropdown switching alongside telemetry script mounting.

**Acceptance Scenarios**:
1. **Given** localization dictionaries, **When** automated parity validation runs, **Then** every key in `en/globals.json` exists in `id/globals.json` with identical structure, and vice versa.
2. **Given** application running in English, **When** user selects Indonesian in language dropdown, **Then** document language attribute and all UI copy update immediately.
3. **Given** environment without telemetry identifier, **When** application mounts, **Then** no third-party tracker script tag is injected into DOM.

---

### User Story 3 - Standardized Routine Automation Scripts (Priority: P3)

Developers and AI agents need standardized, reusable scripts in `./scripts/` for recurring quality gates, localization audits, dependency checks, and release readiness.

**Why this priority**:
- Fulfills Constitution Principle X by preventing repetitive manual commands and reducing token usage.
- Standardizes pre-commit and pre-release verification across all future roadmap items.

**Independent Test**:
- Execute each script from repository root; each script must run standalone, log clear diagnostic output, and return exit code 0 on success or non-zero on failure.

**Acceptance Scenarios**:
1. **Given** developer or agent preparing changes, **When** running quality gate helper, **Then** typecheck, automated tests, and production build run sequentially with clear pass/fail status.
2. **Given** modified translation files, **When** running localization parity script, **Then** any missing or extraneous keys across locales are detected and reported.
3. **Given** repository ready for release, **When** running release-check helper, **Then** working tree cleanliness, test status, build artifact status, and version bump requirements are validated.

---

### Edge Cases

- Filtering with non-numeric or extreme boundary inputs (e.g., negative numbers, min greater than max).
- Rapid typing triggering multiple debounce cycles in search input.
- Modal back-button navigation (`popstate`) handling when modal is already closed or reopened.
- Missing or malformed translation entries in nested locale namespaces.
- Script invocation from subdirectories or with missing environment flags.
- Window resize events during modal visualization rendering when dimensions are zero.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide automated unit tests covering all utility functions in `src/utils/*` (`mathUtils`, `debounce`, `htmlUtils`).
- **FR-002**: System MUST provide component and integration tests verifying `InputSection` filter behaviors: ID, OD, CS range filtering, code text search, debounce delay handling, and filter clearing.
- **FR-003**: System MUST provide component tests verifying `TableSection`, `TableHead`, and `TableRowsComponent` sorting across all columns (standard, code, ID, OD, CS) in ascending, descending, and default orders.
- **FR-004**: System MUST provide component tests verifying unit switching (`mm` to `inch` and `inch` to `mm`) across inputs, table captions, table cells, and modal details.
- **FR-005**: System MUST provide component tests verifying modal lifecycle (open on row click, close via close button, close via backdrop click, close via history `popstate`) and product search link generation.
- **FR-006**: System MUST provide integration tests verifying `LanguageDropdown` switching, `document.documentElement.lang` synchronization, and complete key-by-key parity between `src/locales/en/globals.json` and `src/locales/id/globals.json`.
- **FR-007**: System MUST provide component tests verifying `GoatCounter` script injection behavior when `VITE_GOAT_COUNTER_ID` is present vs undefined.
- **FR-008**: System MUST provide routine automation scripts in `./scripts/` adhering to Constitution Principle X, including self-documenting header comments, arguments, and exit code contracts:
  1. `scripts/verify-gates.sh`: Enhanced quality gate executing `npx tsc --noEmit`, `node scripts/check-i18n-parity.mjs`, `pnpm test`, and `pnpm run build`.
  2. `scripts/check-i18n-parity.mjs`: Node.js ESM script verifying 100% bidirectional key parity and non-empty string values between `src/locales/en/globals.json` and `src/locales/id/globals.json`.
  3. `scripts/audit-codebase.mjs`: Node.js ESM script scanning for strict compliance violations (explicit `any`, `@ts-ignore`, `@ts-expect-error`, `console.log`, and legacy artifact files).
  4. `scripts/bump-version.mjs`: Node.js ESM script for safe SemVer updates supporting `patch` and `minor` only (strictly blocking `major` per Principle XI) and generating Conventional Commit message template.
  5. `scripts/test-coverage.sh`: Shell script running Vitest with `@vitest/coverage-v8`, verifying configured coverage thresholds and printing concise summary.
- **FR-009**: Test suite scope MUST be strictly Vitest + React Testing Library (`jsdom`) for unit, component, and integration tests; no browser E2E frameworks (Playwright/Cypress) permitted per Principle IV.
- **FR-010**: Test coverage thresholds MUST enforce a minimum of 80% statements, 80% lines, 80% functions, and 75% branches across application logic via `@vitest/coverage-v8`.
- **FR-011**: All tests and scripts MUST preserve existing visual styling, layout, breakpoints, and element geometry without alteration (Constitution Principle XIII).

### Key Entities

- **TestSuite**: Collection of automated unit, component, and integration test specifications executed via standard test runner.
- **FilterCriteria**: Search query and numeric min/max bounds applied to inner diameter, outer diameter, cross section, code string, standard type, and measurement unit.
- **LocaleDictionary**: Key-value nested JSON structure mapping translation identifiers to localized strings in English and Indonesian.
- **AutomationScript**: Standalone executable in `./scripts/` with usage header, exit code contracts, and diagnostic output for recurring developer and agent operations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of core interactive user flows (filtering, sorting, unit conversion, modal dialog, language switching) covered by passing automated tests.
- **SC-002**: Automated test suite executes to completion in under 15 seconds on local development workstations.
- **SC-003**: 100% key parity verified between English and Indonesian translation dictionaries with zero missing keys.
- **SC-004**: All routine scripts in `./scripts/` execute standalone, provide self-documenting `--help` or header usage notes, and return exit code 0 on clean state.
- **SC-005**: Zero visual layout, spacing, or sizing alterations introduced into application UI.
- **SC-006**: Automated test coverage achieves or exceeds 80% statements, 80% lines, 80% functions, and 75% branches enforced via `@vitest/coverage-v8`.

## Assumptions

- Vitest and `@testing-library/react` configured in project are the primary test runners for fast local feedback.
- JSDOM environment in Vitest provides sufficient DOM API simulation for component and modal testing.
- Scripts in `./scripts/` can execute via `bash` or `node` using modern ESM syntax supported by repository environment.
- No production runtime dependencies will be added for test-only or script-only tooling.
