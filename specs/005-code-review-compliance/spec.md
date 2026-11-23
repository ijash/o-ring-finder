# Feature Specification: Code Review Compliance and Hygiene Fixes

**Feature Branch**: `fix/code-review-compliance`  
**Created**: 2026-11-23  
**Status**: Draft  
**Input**: User description: "Project context: `o-ring-finder` (v3.0.1, default branch `Master`, React 19 + TS 7 + Vite 8 + Vitest 5 + pnpm, 62 tests / ~97% coverage, helpers in `./scripts/`). Read `.specify/memory/constitution.md` (v1.1.0, Principles I–XIII). Execute directly: 1. Create & switch to branch `fix/code-review-compliance` from `Master`. 2. Inspect ONLY the exact files listed below (skip broad repo scans) and write concise `specs/005-code-review-compliance/spec.md` + checklist (bullets only, no filler prose) covering all fixes..."

## Clarifications

### Session 2026-11-23

- Q: What target license aligns root LICENSE and package.json? → A: Align package.json "license" field to `GPL-3.0-only` matching root LICENSE.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Canonical Key Sorting Across Languages (Priority: P1)

Users sort table columns (standard, code, ID, OD, CS) in any language interface (English or Indonesian) and obtain identical, correct sorting behavior based on canonical data attributes rather than localized label strings.

**Why this priority**: Core functional bug. Translating headers currently breaks sorting key mapping in non-English locales or requires unsafe type assertions.

**Independent Test**: Switch language between English and Indonesian, click each column header, verify sorting orders rows identically and sort indicators display correctly.

**Acceptance Scenarios**:
1. **Given** language is Indonesian (`id`), **When** user clicks header "Standar", **Then** rows sort by canonical field `standard`, not translated text "Standar".
2. **Given** any table header, **When** user focuses header via `Tab` and presses `Enter` or `Space`, **Then** sort toggles between ascending, descending, and unsorted state.
3. **Given** active sort state, **When** screen reader inspects header, **Then** `aria-sort` reflects `"ascending"`, `"descending"`, or `"none"`.

---

### User Story 2 - Resilient Filter State, Form Reset, and Debounce Lifecycle (Priority: P1)

Users filter O-ring dimensions using form inputs with immediate debounce handling, reliable numeric comparison parsing, and clean form reset without DOM selector side effects or memory leaks.

**Why this priority**: Eliminates stale closure state overwrites, prevents string-to-number comparison bugs, and stops unmounted debounce timers.

**Independent Test**: Rapidly type values into dimension inputs, verify state updates consistently; click "Clear filter", verify form inputs reset and debounce timer cancels immediately.

**Acceptance Scenarios**:
1. **Given** dimension inputs (`minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`), **When** user enters numbers, **Then** filter parses and compares values as numbers rather than raw strings.
2. **Given** pending debounce filter call, **When** user unmounts component or clicks "Clear filter", **Then** pending timer cancels immediately.
3. **Given** form contains input values, **When** user clicks "Clear filter", **Then** form resets via React form reference without scanning DOM via `document.querySelectorAll`.

---

### User Story 3 - High-Performance Table and Modal Hygiene with Localization (Priority: P2)

Users interact with catalog table and detail modal with smooth rendering, unique element identity keys, container-aware ring visualization, and localized loading feedback.

**Why this priority**: Enforces React rendering performance, removes DOM id lookups, eliminates console duplicate key warnings, and maintains bilingual parity.

**Independent Test**: Open modal, resize window/container, inspect ring visualization; verify table row keys are unique across standards (`standard-code`).

**Acceptance Scenarios**:
1. **Given** AS568, JIS, and Metric datasets with matching codes, **When** table renders rows, **Then** composite key `${row.standard}-${row.code}` prevents duplicate key warnings.
2. **Given** modal detail view, **When** container mounts or resizes, **Then** dimension tracking uses React `useRef` and `ResizeObserver` without querying `document.getElementById`.
3. **Given** modal initial loading state, **When** viewport dimensions are resolving, **Then** loading label is rendered from bilingual i18n catalogs (`en`/`id`).
4. **Given** table re-renders, **When** data or filter inputs have not changed, **Then** memoized data, filtering, and sorting avoid redundant recalculations.

---

### User Story 4 - Semantic Markup, SEO Meta Fix, and Accessible Navigation (Priority: P2)

Search engines and assistive technologies accurately parse application metadata, language controls, and top navigation header without altering user-facing visuals.

**Why this priority**: Fulfills Constitution Principles XII (SEO) and XIII (Visual Layout & Size Preservation) and accessibility requirements.

**Independent Test**: Run a11y audit on navbar and language dropdown; inspect head metadata output for valid description tag.

**Acceptance Scenarios**:
1. **Given** application title component, **When** rendered, **Then** meta description uses `<meta name="description" content="..." />` rather than setting `name` to the page title.
2. **Given** language dropdown button, **When** rendered, **Then** button contains accessible `aria-label`.
3. **Given** navigation bar, **When** rendered, **Then** navbar uses semantic `<header>` wrapper and accessible interactive title without altering visual layout, typography, or spacing per Principle XIII.

---

### User Story 5 - Node Compatibility & Codebase Hygiene (Priority: P3)

Maintainers run audit and parity scripts across supported Node runtimes (Node 18+) without path resolution failures, and codebase is free from obsolete utilities and duplicate imports.

**Why this priority**: Ensures CI/CD script reliability across environments and leaves repository free of dead code per Principle III.

**Independent Test**: Execute `scripts/audit-codebase.mjs` and `scripts/check-i18n-parity.mjs` on Node 18+; verify dead files are absent.

**Acceptance Scenarios**:
1. **Given** Node 18+ environment without `import.meta.dirname`, **When** running audit scripts, **Then** scripts resolve directory paths reliably via `fileURLToPath(import.meta.url)`.
2. **Given** source tree, **When** scanned, **Then** unused `src/utils/constants.ts`, `src/utils/mathUtils.ts`, its test, duplicate CSS imports, and commented-out code blocks are absent.

---

### Edge Cases

- User switches language while sort is active on a column: sort state persists on canonical key without resetting or throwing errors.
- User enters non-numeric or empty string in dimension bounds: input parses safely to `undefined` without corrupting filter state.
- Modal opens and closes rapidly before `ResizeObserver` fires: observer disconnects cleanly without state updates on unmounted component.
- Very long ring codes in search filter: regex/substring search executes without performance degradation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define table column headers as canonical key-label pairs `{ key: TableHeadField, label: string }[]` where keys are canonical identifiers (`standard`, `code`, `id`, `od`, `cs`).
- **FR-002**: System MUST type sort context field identifier strictly as `TableHeadField | null`, eliminating unsafe type assertions (`as keyof DataRepresentation`, `as TableHeadField`).
- **FR-003**: System MUST provide keyboard activation (`Enter`, `Space`) and `aria-sort` attributes on sortable table headers.
- **FR-004**: System MUST use functional state updater `setFilter((prev) => ({ ...prev, ... }))` for filter changes to prevent race conditions and stale closure values.
- **FR-005**: System MUST parse numeric dimension filter inputs (`minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`) to `number | undefined`.
- **FR-006**: System MUST cancel pending debounce calls on component unmount and upon clearing filters.
- **FR-007**: System MUST reset filter input fields via React form ref (`formRef.current?.reset()`) without DOM query selectors (`document.querySelectorAll`).
- **FR-008**: System MUST key table row items by unique composite key `${row.standard}-${row.code}`.
- **FR-009**: System MUST memoize dataset retrieval, filtered rows, and sorted rows using `useMemo` hooks.
- **FR-010**: System MUST memoize modal dismiss handler using `useCallback`.
- **FR-011**: System MUST externalize `"Loading..."` modal string to `src/locales/en/globals.json` and `src/locales/id/globals.json` under `modal.loading`.
- **FR-012**: System MUST replace DOM element lookups (`document.getElementById`) in modal content with React `useRef` and a `ResizeObserver` lifecycle.
- **FR-013**: System MUST delete unused `src/utils/constants.ts`, `src/utils/mathUtils.ts`, and `src/utils/__tests__/mathUtils.test.ts`.
- **FR-014**: System MUST remove duplicate `./css/index.scss` import in `src/App.tsx`.
- **FR-015**: System MUST remove commented-out code blocks in `src/components/header/languageDropdown.tsx` and `src/components/modal/visualization.tsx`.
- **FR-016**: System MUST output valid `<meta name="description" content="..." />` tag in `src/components/header/title.tsx`.
- **FR-017**: System MUST provide an accessible `aria-label` attribute on the language selection trigger button.
- **FR-018**: System MUST provide semantic `<header>` and accessible button/link structure in `src/components/header/navBar.tsx` while strictly preserving existing visual appearance and dimensions per Principle XIII.
- **FR-019**: System MUST update `scripts/audit-codebase.mjs` and `scripts/check-i18n-parity.mjs` to resolve repository root via `fileURLToPath(import.meta.url)` for Node 18+ runtime compatibility.
- **FR-020**: System MUST align package.json "license" field to "GPL-3.0-only" to match the root LICENSE file.
- **FR-021**: System MUST provide regression tests for each bug fix per Constitution Principle IX.

### Key Entities

- **TableHeadItem**: Object representing a table column with canonical `key` (`"standard" | "code" | "id" | "od" | "cs"`) and localized display `label`.
- **FilterState**: Search filter model containing optional code string, standard array, unit enum, and optional numeric bounds (`minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`).
- **SortState**: Sorting configuration model containing canonical `sortBy` (`TableHeadField | null`) and `sortDirection` (`"asc" | "desc" | null`).
- **DataRepresentation**: Standardized catalog item with `standard`, `code`, `id`, `od`, `cs`, and `unit`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of column sort actions order catalog records identically across English and Indonesian locales.
- **SC-002**: Zero direct DOM search queries (`document.querySelectorAll`, `document.getElementById`) in React component trees.
- **SC-003**: Zero duplicate key warnings logged in browser console when rendering all catalog standards.
- **SC-004**: 100% key and translation parity between English (`en`) and Indonesian (`id`) locale catalogs.
- **SC-005**: 100% test pass rate across existing and newly added regression tests (minimum 62+ tests passing) with zero TypeScript typecheck errors.
- **SC-006**: Zero pixel layout or dimension regressions across desktop and mobile viewports per Constitution Principle XIII.
- **SC-007**: Scripts in `scripts/` execute without errors under Node 18, 20, and 22 environments.

## Assumptions

- Preserving visual layout and dimensions per Principle XIII allows replacing `<h2>` or adding `<header>` / `<button>` as long as CSS classes and inline styles preserve existing visual output.
- `ResizeObserver` is natively supported in target modern browsers and test mock environments (jsdom).
- Removing `mathUtils.ts` has zero impact on core application because its calculation was already commented out in `visualization.tsx`.
