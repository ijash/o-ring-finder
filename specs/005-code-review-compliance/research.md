# Research: Code Review Compliance and Hygiene Fixes

## 1. Canonical Key Sorting vs Localized Labels

- **Decision**: Define `type TableHeadField = "standard" | "code" | "id" | "od" | "cs"`. Header config passes `{ key: TableHeadField, label: string }[]`.
- **Rationale**: Currently, `tableHead.tsx` receives translated strings, generates `headerId` from `h.replace(/ /g, "").toLowerCase()`, and passes it to `setSortBy`. In Indonesian, "Standar" matches no key in `DataRepresentation`, breaking sorting or falling back to string coercion. Typing `sortBy` as `TableHeadField | null` in `SortContext` eliminates `as keyof DataRepresentation` casts.
- **Alternatives considered**: Mapping translated label back to canonical key via reverse lookup dictionary. Rejected as fragile and unnecessary when direct key-label tuple is idiomatic.

## 2. Filter State & Debounce Lifecycle

- **Decision**:
  - Use functional state updates: `setFilter((prev) => ({ ...prev, [filterName]: parsedValue }))`.
  - Parse numeric inputs: `val === "" ? undefined : parseFloat(val)`. Pass `number | undefined` in `IDataFilter`.
  - Add `.cancel()` to `debounce` helper (`src/utils/debounce.ts`); call `setFilterDebounced.cancel()` on unmount and inside `handleClear`.
  - Use React form ref: attach `<form ref={formRef}>` around inputs; call `formRef.current?.reset()` in `handleClear`.
- **Rationale**: Prevents stale closure overwrites on rapid typing; ensures numeric comparisons in `TableRowsComponent` (`row.id < filter.minId`) do not compare numbers against strings; prevents memory leaks from unmounted debounced callbacks; removes direct DOM querying (`document.querySelectorAll`).
- **Alternatives considered**: Controlled input state for each field in `InputSection`. Rejected because debouncing already acts as decoupled trigger; form reset via DOM ref is standard and minimal.

## 3. Table & Modal React Hygiene

- **Decision**:
  - Key: Use `<tr key={`${row.standard}-${row.code}`}>`.
  - Memoization: Wrap data fetching, filtering, and sorting in `useMemo` hooks. Wrap `handleCloseModal` in `useCallback`.
  - Modal loading i18n: Add `"loading": "Loading..."` in `en/globals.json` and `"loading": "Memuat..."` in `id/globals.json` under `modal`.
  - Container sizing: Replace `getElementWidth(containerId)` + `window.resize` with React `useRef<HTMLDivElement>(null)` and `ResizeObserver`.
- **Rationale**: AS568, JIS, and Metric datasets can have overlapping ring codes (e.g., standard code collisions), producing duplicate React keys. `ResizeObserver` on element ref avoids document-global queries and accurately measures element box mutations.
- **Alternatives considered**: Keeping `window.addEventListener("resize")`. Rejected because modal container width can change without window resize (CSS transitions, container scrollbar toggles).

## 4. Dead Code & Hygiene

- **Decision**:
  - Remove `src/utils/constants.ts` and `src/utils/mathUtils.ts`. Remove exports from `src/utils/index.ts`.
  - Remove `src/utils/__tests__/mathUtils.test.ts`.
  - Remove duplicate `import "./css/index.scss"` from `src/App.tsx`.
  - Remove commented-out JSX in `src/components/header/languageDropdown.tsx` and `src/components/modal/visualization.tsx`.
- **Rationale**: `STANDARDIZATION_COLOR` is unused. `remapPercent` was only used in commented-out SVG code in `visualization.tsx`. Unused code violates Constitution Principle III.
- **Alternatives considered**: Keeping math utility for potential future SVG animation. Rejected under YAGNI and Principle III.

## 5. SEO, a11y & Scripts

- **Decision**:
  - `title.tsx`: Change `<meta name={t("meta.title")} ... />` to `<meta name="description" content={t("meta.description", ...)} />`.
  - `languageDropdown.tsx`: Add `aria-label={t("langSelect.display")}` to dropdown button.
  - `tableHead.tsx`: Add `aria-sort` (`"ascending" | "descending" | "none"`), `tabIndex={0}`, and `onKeyDown` (`Enter` / `Space` triggers `handleSort`).
  - `navBar.tsx`: Wrap navigation inside `<header className="sticky-top">`. Render brand title as accessible clickable element with semantic `<button type="button">` or `<a>` styled to preserve exact typography, `#1375AC` color, `#54b2e9 1px 1px 0` text shadow, and spacing per Principle XIII.
  - `audit-codebase.mjs` & `check-i18n-parity.mjs`: Replace `import.meta.dirname` with `dirname(fileURLToPath(import.meta.url))`.
- **Rationale**: `import.meta.dirname` was introduced in Node v20.11.0; Node 18 environments fail immediately. SEO description tag currently uses title text as `name` attribute instead of `"description"`.
- **Alternatives considered**: Polyfilling `import.meta.dirname`. Rejected in favor of standard `node:url` and `node:path` APIs.

## 6. License Alignment & Versioning

- **Decision**: Align `package.json` `"license"` to `"GPL-3.0-only"` to match root `LICENSE` (GNU GPL v3). Bump version `3.0.1 → 3.0.2` (patch release).
- **Rationale**: Resolves Principle VII discrepancy. Patch bump complies with Principle XI for backward-compatible bug fixes and refactoring.
