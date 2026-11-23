# Tasks: Architecture & Code Cleanup

**Input**: Design documents from `specs/004-architecture-and-code-cleanup/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

## Phase 1: Setup

- [x] T001 [P] Configure `contexts` path alias in `vite.config.ts`
- [x] T002 [P] Configure `contexts` path mapping in `tsconfig.json`

## Phase 2: Foundational

- [x] T003 [P] Move and rename `src/components/common/constants.ts` to `src/utils/constants.ts`
- [x] T004 [P] Move and rename `src/components/common/names.tsx` to `src/utils/names.ts`
- [x] T005 [P] Move `src/components/common/goatCounter.tsx` to `src/components/analytics/GoatCounter.tsx`
- [x] T006 [P] Move `src/components/common/__tests__/goatCounter.test.tsx` to `src/components/analytics/__tests__/GoatCounter.test.tsx`
- [x] T007 [P] Move `src/components/context/filterContext.tsx` to `src/contexts/FilterContext.tsx`
- [x] T008 [P] Move `src/components/context/SortContext.tsx` to `src/contexts/SortContext.tsx`
- [x] T009 [P] Move `src/components/context/__tests__/SortContext.test.tsx` to `src/contexts/__tests__/SortContext.test.tsx`
- [x] T010 Remove obsolete directory `src/components/context/`

## Phase 3: User Story 1 - Source Tree Is Navigable by Responsibility (Priority: P1)

- [x] T011 [US1] Merge `src/App.css` styles into `src/css/_custom.scss` and remove `src/App.css`
- [x] T012 [US1] Remove `import "./App.css"` from `src/App.tsx`
- [x] T013 [P] [US1] Update exports in `src/components/common/index.ts`
- [x] T014 [P] [US1] Update exports in `src/utils/index.ts`
- [x] T015 [US1] Update component barrel re-exports and add analytics export in `src/components/index.ts`
- [x] T016 [US1] Update all relative and barrel import paths to moved files across `src/`

## Phase 4: User Story 2 - Context Providers Do Not Cause Avoidable Re-Renders (Priority: P2)

- [x] T017 [US2] Implement `useMemo` for provider value and export guarded `useFilter()` hook in `src/contexts/FilterContext.tsx` citing `data-model.md` `FilterContext`
- [x] T018 [US2] Wrap context value in `useMemo` for `sortBy` and `sortDirection` in `src/contexts/SortContext.tsx`
- [x] T019 [US2] Update consumer components in `src/components/` to use `useFilter()` hook instead of raw `useContext(FilterContext)`
- [x] T020 [P] [US2] Add unit test asserting `useFilter()` throws outside provider in `src/contexts/__tests__/FilterContext.test.tsx`

## Phase 5: User Story 3 - Type System Reflects Domain Reality (Priority: P2)

- [x] T021 [US3] Replace `"undefined"` with `null` for `SortDirection` and reset values in `src/contexts/SortContext.tsx` citing `data-model.md` `SortContext.sortDirection`
- [x] T022 [US3] Eliminate `{} as FilterContextStateType` unsafe cast in `src/contexts/FilterContext.tsx` citing `data-model.md` `FilterContext`
- [x] T023 [P] [US3] Move `i18next` initialization to module scope in `src/locales/i18n.ts` and update `src/index.tsx`
- [x] T024 [P] [US3] Restore ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="itemDetails"`) and add `Escape` keydown handler in `src/components/modal/modal.tsx`
- [x] T025 [P] [US3] Clean empty interfaces and redundant types in `src/components/common/standardElementProps.ts` and `src/components/main.tsx`
- [x] T026 [P] [US3] Update sort tests for `null` sortDirection in `src/contexts/__tests__/SortContext.test.tsx`
- [x] T027 [P] [US3] Add unit tests for `Escape` key close and ARIA attributes in `src/components/modal/__tests__/modal.test.tsx`

## Phase 6: User Story 4 - Runtime Timing Bugs Are Fixed (Priority: P3)

- [x] T028 [US4] Add `document.readyState === "complete"` check before `load` listener in `src/components/analytics/GoatCounter.tsx`
- [x] T029 [US4] Update and add regression test for already-loaded DOM in `src/components/analytics/__tests__/GoatCounter.test.tsx`

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T030 [P] Run typecheck validation via `pnpm exec tsc --noEmit`
- [x] T031 [P] Run codebase hygiene audit via `node ./scripts/audit-codebase.mjs`
- [x] T032 Run test suite and coverage gates via `./scripts/test-coverage.sh`
- [x] T033 Run all quality verification gates via `./scripts/verify-gates.sh`
- [x] T034 Bump patch version `3.0.0` to `3.0.1` via `node ./scripts/bump-version.mjs patch`

## Dependencies & Execution Order

- Phase 1 (Setup) & Phase 2 (Foundational) must complete first.
- Phase 3 (US1) establishes clean imports after file moves.
- Phase 4 (US2) and Phase 5 (US3) can proceed in parallel once paths are stable.
- Phase 6 (US4) depends on Phase 2 file moves.
- Phase 7 (Polish) validates all gates and bumps version.

## Implementation Strategy

- **MVP**: Complete Phases 1, 2, and 3 (Tree structure clean, tests green).
- **Increment 2**: Complete Phases 4 and 5 (Context memoization, guarded hooks, type cleanup, modal ARIA/Escape).
- **Increment 3**: Complete Phase 6 (Analytics race fix).
- **Final**: Complete Phase 7 (Gates & version bump).
