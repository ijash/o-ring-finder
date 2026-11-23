# Research: Architecture & Code Cleanup

**Feature**: 004-architecture-and-code-cleanup | **Date**: 2026-11-23

---

## Context Memoization in React Providers

- **Decision**: Wrap `FilterContextProvider` value in `useMemo([filter])` and `SortProvider` value in `useMemo([sortBy, sortDirection])`.
- **Rationale**: React re-renders all context consumers whenever the provider's `value` reference changes. An inline object literal `{ filter, setFilter }` creates a new reference every render, causing unnecessary consumer re-renders even when values are unchanged.
- **Alternatives considered**: `useReducer` with split state/dispatch contexts — valid but heavier churn; `useMemo` is the minimum correct fix for existing shape.

## Guarded Context Hook Pattern

- **Decision**: Export `useFilter()` from `FilterContext.tsx` mirroring the existing `useSort()` in `SortContext.tsx`.
- **Rationale**: Raw `useContext(FilterContext)` returns `undefined` (after removing `{} as …` cast) outside a provider, producing a silent runtime error. A guarded hook throws immediately with a descriptive message.
- **Alternatives considered**: Keeping `{} as FilterContextStateType` cast — prohibited by Principle II (unsafe cast).

## `SortDirection` Type: `null` vs `"undefined"` String

- **Decision**: Replace `"asc" | "desc" | "undefined"` with `"asc" | "desc" | null`.
- **Rationale**: Using the string `"undefined"` as a sentinel is a type anti-pattern. `null` is the correct TypeScript primitive for "intentionally absent value". Equality checks `=== "undefined"` become `=== null`; `useState<SortDirection>(null)` replaces `useState<SortDirection>("undefined")`.
- **Alternatives considered**: Separate boolean `isSorted` flag — more state, same semantics; `null` is simpler.

## `i18next` Init: Module Scope vs Factory Function

- **Decision**: Change `src/locales/i18n.ts` to export the initialized `i18next` instance directly (run `.use(...).init(...)` at module evaluation time) instead of exporting a factory `function i18nInit()`.
- **Rationale**: Calling `i18next()` inside JSX render (current `src/index.tsx`) violates Principle I ("side effects MUST NOT run during render"). Module-scope init runs exactly once on import; subsequent HMR re-evaluations of `index.tsx` import the already-initialized instance from the module cache.
- **Alternatives considered**: `React.StrictMode` double-invoke guard — not a fix; moves init to `useEffect` — unnecessary complexity.

## `GoatCounter` Load Race Fix

- **Decision**: In `useEffect`, check `document.readyState === "complete"` first; if true, inject immediately; otherwise add `window` `"load"` listener.
- **Rationale**: On fast connections the browser's `load` event fires before React's `useEffect` runs. The current code registers a listener that will never fire. The `readyState` guard covers both cases.
- **Pattern**:
  ```ts
  if (document.readyState === "complete") {
    inject();
  } else {
    window.addEventListener("load", inject);
    return () => window.removeEventListener("load", inject);
  }
  ```
- **Alternatives considered**: `setTimeout(inject, 0)` — fragile timing hack.

## ARIA Hygiene in `CustomModal`

- **Decision**: Restore `aria-labelledby="itemDetails"`, add `role="dialog"` and `aria-modal="true"` to the backdrop `div`; add `Escape` keydown handler on `document` that calls `handleClose`.
- **Rationale**: The attributes were commented out, breaking screen reader association. `Escape` to close is required by Principle I a11y mandate and ARIA dialog pattern.
- **Implementation note**: `Escape` listener must be added/removed in the same `useEffect` as `show` to avoid stale closure.

## File Placement: `constants.ts`, `names.tsx`, `goatCounter.tsx`

- **Decision**:
  - `constants.ts` (color map) → `src/utils/constants.ts`
  - `names.tsx` (site metadata) → `src/utils/names.ts` (`.ts`; no JSX)
  - `goatCounter.tsx` → `src/components/analytics/GoatCounter.tsx`
- **Rationale**: `src/components/common/` is for shared UI primitives. Constants and config are utilities; analytics injection is not a UI primitive.
- **Alternatives considered**: `src/config/` for `names.ts` — valid; avoided to minimize new top-level folders; `utils/` already holds non-UI helpers.

## `src/App.css` Removal

- **Decision**: Inspect `App.css` rules; merge any non-duplicate rules into `src/css/_custom.scss`; remove the file and its `import` from `App.tsx`.
- **Rationale**: `src/css/` is the designated style layer. `App.css` is a Vite scaffold leftover.
- **Alternatives considered**: Keeping it — violates Principle III (cleanup mandate).

## Vite Alias + tsconfig Paths: `contexts`

- **Decision**: Add `contexts: path.resolve(import.meta.dirname, "./src/contexts")` to `vite.config.ts` `resolve.alias` and `"contexts": ["./src/contexts"]` to `tsconfig.json` `paths`.
- **Rationale**: `src/contexts/` is a new top-level folder; without an alias, imports would use relative paths which break after moves. Existing `"*": ["./src/*"]` wildcard in `tsconfig.json` already resolves `contexts/*` bare imports — the explicit alias is added to `vite.config.ts` for Vitest resolution parity and consistency with other aliases.
- **Alternatives considered**: Rely solely on `"*": ["./src/*"]` wildcard — works for TS but Vite needs an explicit alias entry.

## Version Bump

- **Decision**: `patch` bump `3.0.0 → 3.0.1` via `./scripts/bump-version.mjs patch`.
- **Rationale**: Pure refactor; no new features, no breaking changes. Principle XI requires semver.
