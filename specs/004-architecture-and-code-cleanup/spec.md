# Feature Specification: Architecture & Code Cleanup

**Feature Branch**: `refactor/architecture-and-code-cleanup`

**Created**: 2026-11-23

**Status**: Draft

**Input**: Organize and tidy up foldering, architectures and codes so it follows best practices (Roadmap item 4)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Source Tree Is Navigable by Responsibility (Priority: P1)

A developer opening the repo for the first time can find any file within 10 seconds by reading folder names alone, with no guessing about which folder owns analytics, constants, or context providers.

**Why this priority**: Structural clarity is the foundation every other improvement depends on.

**Independent Test**: Clone repo, open `src/`, locate `GoatCounter`, `names`, `constants`, and both context files without searching.

**Acceptance Scenarios**:

1. **Given** the current `src/` tree, **When** misplaced files (`goatCounter.tsx`, `names.tsx`, `constants.ts`) are moved to their correct responsibility folders and `SortContext.tsx`/`filterContext.tsx` are casing-normalized, **Then** every import still resolves and all 56+ tests stay green.
2. **Given** the barrel re-export chain `src/components/index.ts → src/components/common/index.ts → …`, **When** circular or cross-concern re-exports are eliminated, **Then** no circular-dependency warning appears in the build output.
3. **Given** `src/App.css` co-located with `App.tsx`, **When** it is merged into or replaced by an entry in `src/css/`, **Then** styles are unaffected and no visual diff exists.

---

### User Story 2 — Context Providers Do Not Cause Avoidable Re-Renders (Priority: P2)

A developer using `FilterContext` or `SortProvider` can trust that adding a new consumer does not trigger cascading re-renders across unrelated subtrees.

**Why this priority**: Correctness of context memoization prevents subtle bugs before they reach users.

**Independent Test**: Wrap the app in React DevTools Profiler; adding a `FilterContext` consumer must not re-render sibling subtrees when only unrelated state changes.

**Acceptance Scenarios**:

1. **Given** `FilterContextProvider` exposes `{ filter, setFilter }` as an inline object literal, **When** `useMemo` wraps the value, **Then** consumers only re-render when `filter` changes.
2. **Given** raw `useContext(FilterContext)` calls scattered in consumers, **When** a guarded `useFilter()` hook is exported, **Then** calling it outside a provider throws a descriptive error instead of returning `{}`.
3. **Given** `SortProvider` already has `useSort`, **When** its context value is wrapped with `useMemo`, **Then** sort consumers do not re-render on unrelated state changes.

---

### User Story 3 — Type System Reflects Domain Reality (Priority: P2)

A developer reading `SortDirection` or `FilterContext` types understands their semantics without reading runtime behavior.

**Why this priority**: Correct types prevent bugs that the compiler can catch before runtime.

**Independent Test**: `npx tsc --noEmit` passes with zero errors after all type changes.

**Acceptance Scenarios**:

1. **Given** `SortDirection = "asc" | "desc" | "undefined"`, **When** `"undefined"` is replaced with `null`, **Then** all callers are updated and `tsc --noEmit` passes.
2. **Given** `FilterContext` initialized with `{} as FilterContextStateType`, **When** replaced with a proper `undefined`-based guard, **Then** no unsafe cast remains.
3. **Given** commented-out ARIA attributes (`aria-labelledby`, `aria-hidden`) in `CustomModal`, **When** restored with correct values, **Then** aXe/accessibility audit reports zero violations for the modal.

---

### User Story 4 — Runtime Timing Bugs Are Fixed (Priority: P3)

`GoatCounter` loads its script reliably on every page load, including pages where the browser fires `load` before the React component mounts.

**Why this priority**: Analytics correctness is lower-priority than structural and type correctness.

**Independent Test**: In a throttled network environment, `GoatCounter` script tag appears in the DOM on every hard reload, including fast connections where `load` may fire before `useEffect` runs.

**Acceptance Scenarios**:

1. **Given** the current `window.addEventListener("load", handleLoad)` pattern, **When** replaced with a `document.readyState === "complete"` check that falls back to the `load` listener, **Then** the script is injected on both fast and slow connections.
2. **Given** `GoatCounter` component in `src/components/common/`, **When** moved to `src/components/analytics/` or `src/utils/`, **Then** existing test at `__tests__/goatCounter.test.tsx` is updated to the new path and still passes.

---

### Edge Cases

- Moving files changes import paths: all barrel `index.ts` files and direct imports must be updated atomically.
- Renaming `filterContext.tsx` → `FilterContext.tsx` on a case-insensitive filesystem (macOS) requires a two-step rename via git to avoid silent no-ops.
- `i18next` init is currently a function call (`i18next()`) in `src/index.tsx`; moving to module-level must not cause double-init when HMR re-executes the module.
- Replacing `SortDirection "undefined"` with `null` affects sort reset logic; all equality checks (`=== "undefined"`) must be updated.
- `src/App.css` removal must leave no dangling import in `App.tsx`.

---

## Requirements *(mandatory)*

### Functional Requirements

**Foldering & Architecture**

- **FR-001**: `goatCounter.tsx` MUST be moved out of `src/components/common/` to a dedicated analytics or utility folder.
- **FR-002**: `names.tsx` (site metadata) MUST be moved to `src/utils/` or a new `src/config/` folder.
- **FR-003**: `constants.ts` (color map) MUST be moved to `src/utils/` or `src/data/` — out of `src/components/common/`.
- **FR-004**: `filterContext.tsx` MUST be renamed to `FilterContext.tsx` (PascalCase) and both context files MUST be moved to `src/contexts/`; `src/components/context/` MUST be removed.
- **FR-005**: `src/App.css` MUST be removed; its rules MUST be merged into the existing `src/css/` layer.
- **FR-006**: Barrel `index.ts` files MUST be updated to reflect all moved/renamed files; no circular re-exports may remain.
- **FR-007**: The build (`pnpm run build`) and all 56+ tests MUST pass after every structural change.

**React & Context**

- **FR-008**: `FilterContextProvider` MUST wrap its `value` in `useMemo` keyed to `filter`.
- **FR-009**: A guarded `useFilter()` hook MUST be exported from `FilterContext`, throwing a descriptive error if called outside its provider.
- **FR-010**: `SortProvider` context value MUST be wrapped in `useMemo` keyed to `sortBy` and `sortDirection`.
- **FR-011**: `i18next` initialization MUST be moved to module-scope in `src/locales/i18n.ts` (or its call site) so it runs once, not on every render call.

**TypeScript**

- **FR-012**: `SortDirection` MUST be `"asc" | "desc" | null`; the string `"undefined"` is prohibited.
- **FR-013**: `FilterContext` MUST NOT use `{} as FilterContextStateType`; initialization MUST use `undefined` with a guarded hook.
- **FR-014**: Commented-out ARIA attributes in `CustomModal` MUST be restored with correct, non-empty values (`aria-labelledby="itemDetails"`, `role="dialog"`, `aria-modal="true"`).

**Analytics**

- **FR-015**: `GoatCounter` `useEffect` MUST check `document.readyState === "complete"` before falling back to the `window` `"load"` listener.

### Key Entities

- **FilterContext**: React context providing filter state and setter; must have guarded hook.
- **SortContext**: React context providing sort state and actions; `SortDirection` type must use `null` not `"undefined"`.
- **GoatCounter**: Analytics injector; must handle race between component mount and `window.load`.
- **names / constants**: App-level metadata and color constants; must live in correct responsibility folders.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 56+ existing tests pass (`pnpm test`) with zero failures after every change; branch coverage stays ≥ 80%, statement coverage ≥ 75%.
- **SC-002**: `pnpm run build` succeeds with zero TypeScript errors (`tsc --noEmit`) and zero circular-dependency warnings.
- **SC-003**: Zero visual or layout regressions — pixel-level screenshots before/after are identical (Principle XIII).
- **SC-004**: No file in `src/` violates the responsibility-folder contract: components in `components/`, contexts in `components/context/` or a dedicated `contexts/`, analytics isolated, utilities in `utils/`, styles in `css/`.
- **SC-005**: `useFilter()` called outside `FilterContextProvider` throws an error with a message containing "FilterContextProvider" (verifiable by unit test).
- **SC-006**: `GoatCounter` script tag appears in the DOM in both `readyState === "complete"` and deferred-load scenarios (verifiable by existing or new unit test).

---

## Assumptions

- No new npm dependencies are introduced; all fixes use existing React APIs (`useMemo`, `useContext`).
- File renames on the development machine use `git mv` to preserve history and avoid case-sensitivity pitfalls.
- Context files (`FilterContext.tsx`, `SortContext.tsx`) move to a new top-level `src/contexts/` folder; `src/components/context/` is removed entirely.
- `src/index.tsx` calling `i18next()` as a function is a module-level side effect already; moving initialization to module scope means exporting the already-initialized instance rather than a factory function.
- Tests that import from moved files are updated in the same commit as the move.
- `CustomModal` keyboard `Escape` handler is added as part of ARIA hygiene but must not break existing modal tests.
