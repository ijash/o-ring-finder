# Research & Design Decisions: Lightweight Performance Optimization

**Feature**: `specs/006-lightweight-performance` | **Branch**: `perf/lightweight-optimization` | **Date**: 2026-11-23

## Baseline Bundle Metrics (Pre-Optimization)

Measured from `pnpm run build` on `Master` (`v3.0.3`):
- **JavaScript**: `dist/assets/index-*.js` = 747.53 kB raw (~181.57 kB gzip)
- **CSS**: `dist/assets/index-*.css` = 225.21 kB raw (~30.59 kB gzip)
- **HTML**: `dist/index.html` = 0.85 kB raw (~0.43 kB gzip)
- **Total Bundle**: ~973.59 kB raw (~212.59 kB gzip)

---

## 1. Bootstrap JavaScript Elimination

### Decision
Remove `import "bootstrap/dist/js/bootstrap.bundle.min.js";` from `src/App.tsx`. Implement dropdown interactivity in `src/components/header/languageDropdown.tsx` with native React `useState`, click-outside listener, and `Escape` keyboard dismissal.

### Rationale
- `bootstrap.bundle.min.js` adds ~80 kB of uncompressed JavaScript (including Popper.js).
- In the entire application, only `LanguageDropdown` relies on Bootstrap JS for opening/closing the dropdown menu.
- `CustomModal` is already fully managed via React state (`show`, `setShowModal`), body portal, and custom `Escape`/`popstate` listeners.
- Native React implementation uses identical Bootstrap classes (`.dropdown-menu.show`, `aria-expanded`) preserving 100% visual layout and styling per Principle XIII.
- `@types/bootstrap` devDependency is no longer needed and can be safely removed.

### Alternatives Considered
- *Keep Bootstrap JS*: Unnecessary ~80 kB bloat for a single 2-item dropdown menu.
- *Use Floating UI / Popper*: Adds unnecessary dependency for a fixed header menu that only needs `.dropdown-menu-end` CSS positioning.

---

## 2. FontAwesome Dependency Removal via Inline SVGs

### Decision
Uninstall all 4 `@fortawesome/*` packages (`@fortawesome/fontawesome-svg-core`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`). Replace `src/components/common/icons.tsx` with 3 zero-dependency inline SVG React components.

### Rationale
- FontAwesome icon packages add ~45 kB of JS bundle overhead, icon runtime factories, and stylesheet injection logic.
- Only 3 icons are used across the entire app:
  1. `IconCircle`: Used in table row bullet/status (`faCircle` regular, viewBox `0 0 512 512`).
  2. `IconLanguage`: Used in language selector toggle (`faLanguage` solid, viewBox `0 0 640 512`).
  3. `IconEraser`: Used in filter clear button (`faEraser` solid, viewBox `0 0 576 512`).
- Inline SVG components provide exact paths, `viewBox`, `fill="currentColor"`, and `width="1em" height="1em"`, ensuring 100% visual parity and instant rendering with 0 runtime dependencies.

### Alternatives Considered
- *Use Lucide React or React Icons*: Adds new external packages for only 3 icons; violates Principle IV (prefer native/zero-dep over libraries for small needs).
- *Keep FontAwesome*: Violates Principle IV (eliminate bloated dependencies when trivial native solution exists).

---

## 3. Selective Bootstrap SCSS Modular Imports

### Decision
Replace `@import "bootstrap/scss/bootstrap.scss";` in `src/css/index.scss` with selective imports of only the Bootstrap SCSS modules and utilities actually used by `o-ring-finder`.

### Rationale
- Full `bootstrap.scss` compiles all components: accordion, alerts, badges, breadcrumbs, button groups, carousels, list groups, navs, offcanvas, pagination, placeholders, popovers, progress, spinners, toasts, and tooltips. None of these exist in `o-ring-finder`.
- Audit of classes used in `src/`:
  - Core: `functions`, `variables`, `maps`, `mixins`, `root`, `reboot`, `type`, `images`, `containers`, `grid`
  - Components: `tables`, `forms`, `buttons`, `transitions`, `dropdown`, `card`, `modal`, `close`
  - Layout & Utilities: `helpers`, `utilities`, `utilities/api`
- Selective imports reduce compiled CSS from ~225 kB to < 80 kB raw (< 15 kB gzip) while keeping all existing classes functional with 0px visual shift.

---

## 4. Large Catalog (3,822 Rows) Rendering Performance

### Decision
Adopt React 19 `useDeferredValue` for the filtered and sorted row list in `src/components/table/tableRow.tsx`, and wrap row rendering in memoized components. Retain full native DOM table rows without scroll virtualization.

### Rationale
- Virtualized lists (`react-window`, `@tanstack/react-virtual`) break browser native `Ctrl+F` search, break search-engine crawler indexing of catalog entries (violating Principle XII), and change native browser scrollbar dynamics.
- React 19 `useDeferredValue` decouples user typing and filter interactions from expensive catalog table reconciliation. Keystone inputs remain 60fps responsive without input lag.
- Memoizing row items avoids re-creating VDOM nodes for unchanged rows.

---

## 5. Instant Unit Selection & Debounce Correction

### Decision
Update `handleUnitFilter` in `src/components/input/inputSection.tsx` to immediately invoke `setFilter` with the new unit without routing through `debouncedFlush()`. Flush or cancel any pending numeric filter debounce synchronously.

### Rationale
- Unit switching is a discrete `<select>` dropdown action, not rapid keyboard typing.
- The 897ms debounce on unit changes forced users to wait nearly a full second before seeing inch/mm conversions, creating perceived sluggishness.
- Synchronous update provides instant (< 50ms) unit toggling across the entire catalog.

---

## 6. Code-Splitting CustomModal via React.lazy

### Decision
Code-split `CustomModal` using `React.lazy(() => import("components/modal/modal"))` with `<Suspense fallback={null}>` in `src/components/table/tableRow.tsx`.

### Rationale
- The modal is only shown when a user clicks a row.
- Modal includes detailed dimensional charts, marketplace search link builders, and image references.
- Lazy-loading removes modal code and its dependencies from the initial critical rendering path.

---

## 7. Reusable Bundle Size Gate Script

### Decision
Create `./scripts/check-bundle-size.mjs` (Principle X) and integrate it into `./scripts/verify-gates.sh` and CI.

### Rationale
- Enforces hard bundle limits:
  - Total JS < 300 kB raw (< 85 kB gzip)
  - Total CSS < 100 kB raw (< 25 kB gzip)
- Prevents future PRs from inadvertently introducing bundle bloat.
