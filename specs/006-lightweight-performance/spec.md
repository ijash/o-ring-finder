# Feature Specification: Lightweight Performance Optimization

**Feature Branch**: `perf/lightweight-optimization`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "optimize for lightweight performance, yet not changing the behavior of user experience."

## Clarifications

### Session 2026-11-23

- Q: Replace heavy Bootstrap JS bundle with lightweight native React state dropdown vs keeping bootstrap.bundle.min.js in main bundle? (FR-006) → A: Replace `bootstrap.bundle.min.js` (~80 kB) with native React `useState` + click-outside + `Escape` close in `languageDropdown.tsx`, keeping exact Bootstrap CSS classes (`.dropdown-menu.show`) for 100% identical visuals. Remove `bootstrap/dist/js/bootstrap.bundle.min.js` from `src/App.tsx`.
- Q: Replace FontAwesome library dependencies with 3 lightweight inline SVG React icons vs keeping @fortawesome/* packages? (FR-007) → A: Replace the 4 `@fortawesome/*` packages with 3 lightweight inline SVG components in `src/components/common/icons.tsx` (matching exact current icon paths and `1em` sizing), and uninstall all 4 `@fortawesome/*` dependencies from `package.json`.
- Q: Use progressive chunked rendering with useDeferredValue vs virtualized windowing library? (FR-008) → A: Use React 19 `useDeferredValue` + memoized row rendering (NO scroll virtualization) so native Ctrl+F browser search, SEO/DOM crawlability, and exact scroll behavior stay 100% intact while keeping typing and filtering smooth. Also lazy-load `CustomModal` (`React.lazy` + `Suspense`), use selective Bootstrap SCSS imports in `src/css/index.scss`, and make `handleUnitFilter` in `inputSection.tsx` update synchronously without debounce lag.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant Unit Switching & Filter Responsiveness (Priority: P1)

Users adjusting units (mm ↔ inch) or typing dimension filters expect immediate visual feedback without sluggish interface lag or unneeded debounce wait.

**Why this priority**: Directly impacts primary tool workflow; switching measurement unit is a single discrete action that should update immediately rather than waiting for an 897ms typing debounce timer.

**Independent Test**: Select unit dropdown ("inch" or "mm") and measure time until table values convert; must update under 50ms without pending timeout.

**Acceptance Scenarios**:

1. **Given** default metric table view, **When** user selects "inch" from unit dropdown, **Then** all dimensions convert immediately without debounce lag.
2. **Given** active numeric filter, **When** user types numeric boundary, **Then** typing remains debounced for input settling while UI thread stays unblocked.
3. **Given** active filters and search queries, **When** user clicks clear/reset button, **Then** table and form reset immediately to initial state.

---

### User Story 2 - Minimal Resource Download & Fast First Contentful Paint (Priority: P2)

Users on mobile or metered connections load the application with minimal initial payload transfer, downloading only assets and scripts needed for initial view.

**Why this priority**: O-Ring Finder is a single-page technical reference accessed in workshops and field environments where bandwidth may be constrained.

**Independent Test**: Measure production asset transfer sizes; verify total initial JS transfer < 80 kB gzip (< 300 kB uncompressed) and initial CSS transfer < 20 kB gzip (< 100 kB uncompressed).

**Acceptance Scenarios**:

1. **Given** cold visit to web application, **When** page loads, **Then** browser transfers minimal critical CSS and core runtime JS without unused vendor libraries.
2. **Given** page loaded, **When** user clicks a table row, **Then** modal dialog and supporting detail view load on demand without delaying initial page render.
3. **Given** search engine crawler inspecting HTML, **When** page is parsed, **Then** all standard catalog rows and schema markup remain discoverable.

---

### User Story 3 - Fluid Scrolling & Filtering Across Full Catalog (Priority: P3)

Users scrolling through all 3,822 items or filtering large datasets experience smooth 60fps scrolling without UI stutter or unresponsive clicks.

**Why this priority**: Catalog contains 3,822 records across AS568, JIS, and Metric standards; heavy DOM overhead or synchronous re-filtering must not drop frames.

**Independent Test**: Perform fast scroll through catalog and trigger filter updates while monitoring frame rate and input delay; frame drops must remain zero and INP < 100ms.

**Acceptance Scenarios**:

1. **Given** complete catalog displayed, **When** user scrolls rapidly through table rows, **Then** scrolling stays fluid with zero visual tearing or layout shift.
2. **Given** 3,822 items rendered, **When** user applies standard filter (AS568 / JIS / Metric), **Then** transition is non-blocking and responsive.

---

### Edge Cases

- **Fast consecutive filter adjustments**: Rapid adjustments to min/max sliders and inputs must not race or leave stale filtered records rendered.
- **Immediate unit toggle during pending filter**: Switching units while a filter debounce is running must flush pending changes consistently with new unit.
- **Low-memory mobile browsers**: Rendering full catalog must not cause tab crashes or excessive memory spikes on resource-constrained devices.
- **Offline / slow-connection modal trigger**: Opening item modal on slow connection must display smoothly without broken modal layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Unit selection (`<select>`) MUST update data view synchronously and immediately, eliminating the 897ms typing debounce lag for unit conversions.
- **FR-002**: Filter typing inputs (ID, OD, CS, Code) MUST maintain responsive debouncing to prevent excessive re-renders during active typing.
- **FR-003**: Detail modal (`CustomModal`) MUST be code-split using `React.lazy` and `Suspense` so dialog code and assets are excluded from initial critical bundle payload.
- **FR-004**: Large visual assets (`oring-spec.jpg`, marketplace icons, logo) MUST be optimized for compressed transfer size without visual artifacting or layout alteration.
- **FR-005**: Styling bundle MUST selectively import only utilized Bootstrap SCSS modules in `src/css/index.scss`, omitting unused components (carousels, accordions, tooltips, popovers, navbars) while preserving exact geometry, typography, and colors (Principle XIII).
- **FR-006**: Language dropdown MUST replace `bootstrap.bundle.min.js` with native React `useState`, click-outside handler, and `Escape` key support in `languageDropdown.tsx`, retaining `.dropdown-menu.show` CSS classes for 100% visual parity. `bootstrap.bundle.min.js` import MUST be removed from `src/App.tsx`.
- **FR-007**: Icon components (`IconCircle`, `IconLanguage`, `IconEraser`) MUST replace all 4 `@fortawesome/*` packages with 3 lightweight zero-dependency inline SVG React components matching exact SVG paths and `1em` dimensions. `@fortawesome/*` packages MUST be uninstalled.
- **FR-008**: Table rows (3,822 items) MUST use React 19 `useDeferredValue` and memoized rendering with NO scroll virtualization, ensuring native in-page search (`Ctrl+F`), native full-page scrolling, and SEO DOM markup remain 100% intact.
- **FR-009**: All existing automated tests (63 tests) MUST continue passing cleanly under quality gates (`./scripts/verify-gates.sh`).

### Key Entities

- **Catalog Item**: Represents an O-ring standard entry (standard, code, inside diameter, outside diameter, cross section) mapped across units.
- **Filter State**: Captures active dimensional bounds (min/max for ID, OD, CS), text query, standard selections, and active measurement unit.
- **Modal Payload**: Detailed dimensional data, visual diagrams, and purchasing links loaded when a catalog item is inspected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Initial JavaScript transfer payload reduced by at least 60% (from ~748 kB uncompressed to < 300 kB uncompressed / < 80 kB gzip).
- **SC-002**: Initial CSS transfer payload reduced by at least 50% (from ~226 kB uncompressed to < 100 kB uncompressed / < 20 kB gzip).
- **SC-003**: Unit switching (`mm` ↔ `inch`) updates catalog dimensions across all rows in under 50ms (measured from selection change to DOM paint).
- **SC-004**: Interaction to Next Paint (INP) remains below 100ms during search and filter operations on standard desktop and mobile profiles.
- **SC-005**: Exact visual layout, element dimensions, margins, paddings, and font sizes preserved with 0px regression across all viewport breakpoints.
- **SC-006**: 100% test pass rate across existing unit and component tests with strict type checking and zero compiler errors.

## Assumptions

- **Zero visual/layout change constraint**: All optimizations must be purely architectural and asset-level; typography, color scheme, element positioning, and styling classes remain visually identical (Principle XIII).
- **Client-side only**: Application remains purely static and hostable on GitHub Pages without server-side rendering or edge compute.
- **Search engine crawlability**: Table content and metadata must remain discoverable for search crawlers (Principle XII).
- **Browser baseline**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge) supporting ES2022+ and modern CSS.
