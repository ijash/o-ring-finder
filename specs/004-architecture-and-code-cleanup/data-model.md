# Data Model: Architecture & Code Cleanup

**Feature**: 004-architecture-and-code-cleanup | **Date**: 2026-11-23

> This feature is a structural refactor. No new data entities are introduced. The section below documents the two context state shapes that change type definitions.

---

## FilterContext State

| Field | Before | After |
|-------|--------|-------|
| `filter` | `IDataFilter` | `IDataFilter` (unchanged) |
| `setFilter` | `React.Dispatch<SetStateAction<IDataFilter>>` | unchanged |
| Provider default | `{} as FilterContextStateType` (unsafe cast) | `undefined` (guarded by `useFilter()`) |
| Exported hook | none | `useFilter(): FilterContextStateType` |

## SortContext State

| Field | Before | After |
|-------|--------|-------|
| `sortDirection` type | `"asc" \| "desc" \| "undefined"` | `"asc" \| "desc" \| null` |
| Initial value | `"undefined"` | `null` |
| Reset value | `"undefined"` | `null` |
| Context value | inline object (no memo) | `useMemo([sortBy, sortDirection])` |

## File Movement Map

| Source | Destination | Type |
|--------|-------------|------|
| `src/components/common/constants.ts` | `src/utils/constants.ts` | move |
| `src/components/common/names.tsx` | `src/utils/names.ts` | move + rename ext |
| `src/components/common/goatCounter.tsx` | `src/components/analytics/GoatCounter.tsx` | move + rename |
| `src/components/common/__tests__/goatCounter.test.tsx` | `src/components/analytics/__tests__/GoatCounter.test.tsx` | move + rename |
| `src/components/context/filterContext.tsx` | `src/contexts/FilterContext.tsx` | move + rename |
| `src/components/context/SortContext.tsx` | `src/contexts/SortContext.tsx` | move |
| `src/components/context/__tests__/SortContext.test.tsx` | `src/contexts/__tests__/SortContext.test.tsx` | move |
| `src/components/context/index.ts` | deleted | delete |
| `src/App.css` | merged into `src/css/_custom.scss` | merge + delete |
