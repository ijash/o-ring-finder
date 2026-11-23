# Feature Specification: Dark and Light Theme Mode

**Feature Branch**: `feat/dark-light-theme`  
**Created**: 2026-11-23  
**Status**: Ready for Planning  
**Input**: User description: "Dark and light theme support with ThemeContext (useTheme), accessible navbar theme toggle button using zero-dep inline SVG icons, bilingual en/id labels and aria-labels, localStorage persistence, prefers-color-scheme detection with pre-paint inline script in index.html to prevent FOUC, Bootstrap 5.3 data-bs-theme on <html>, SCSS/color-mode styling across navbar, form inputs, table, modal, FAQ, footer, <meta name="theme-color"> sync, and theme-aware RingVisualization SVG contrast while preserving exact layout geometry and zero new runtime dependencies."

## Clarifications

### Session 2026-11-23

- Q: What theme toggle mode should be used in the navbar? → A: 2-way Light / Dark toggle in the navbar (compact single-click Sun/Moon icon button matching language button height/style) that initializes from `prefers-color-scheme` when `localStorage` has no saved preference.
- Q: What is the scope of the RingVisualization SVG in dark mode? → A: Upgrade `src/components/modal/visualization.tsx` to the theme-aware realistic 3D-shaded pure-SVG O-ring with subtle dot-grid backdrop and soft radial glow (high contrast for the black rubber O-ring in both light and dark modes, zero external assets, exact same `dimensions.width` × `dimensions.height` container).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seamless Theme Switching & Zero-FOUC Initial Load (Priority: P1)

Users browsing O-Ring Finder in low-light environments can switch the application interface into Dark Mode or back to Light Mode via a prominent, accessible navbar toggle button. When opening or refreshing the app, the UI renders immediately in the user's preferred theme without any visual flash of unstyled light content (FOUC) or jarring layout shift.

**Why this priority**: Core user need for visual comfort, eye strain reduction in low-light industrial or workshop settings, and polished UX.

**Independent Test**: Load page with dark preference pre-stored in `localStorage` or OS `prefers-color-scheme: dark`; verify DOM renders in dark theme on initial paint with zero white flash; click theme toggle button to switch modes smoothly.

**Acceptance Scenarios**:
1. **Given** a user with OS preference set to dark and no stored `localStorage` setting, **When** loading the application for the first time, **Then** the page renders immediately with `data-bs-theme="dark"` on `<html>`, `<meta name="theme-color">` set to the dark background color, and the theme toggle showing the dark state icon/label without FOUC.
2. **Given** an active application session in Light Mode, **When** the user clicks the theme toggle button in the navbar, **Then** the interface transitions immediately to Dark Mode, `localStorage` persists the choice, and `<meta name="theme-color">` updates accordingly.
3. **Given** a saved theme choice in `localStorage`, **When** the user refreshes or reopens the page in a new tab, **Then** the saved theme is restored instantly on pre-paint.

---

### User Story 2 - Full Theme Contrast & Readability Across All Components (Priority: P1)

Users interact with all application sections—header, navbar, search/filter inputs, catalog data table (headers and rows), dimension modal, product search links, FAQ accordion, and footer—with high contrast, legible typography, proper surface elevation, and clear focus indicators in both light and dark themes.

**Why this priority**: A theme is unusable if table text, inputs, or headers become unreadable or have poor contrast ratios in either mode.

**Independent Test**: Inspect computed styles and contrast ratios across all pages, interactive inputs, table rows, and modals in both light and dark themes to verify WCAG AA compliance (4.5:1 text contrast).

**Acceptance Scenarios**:
1. **Given** Dark Mode is active, **When** inspecting the navbar and table headers, **Then** background colors, borders, and text contrast ensure high legibility without hardcoded conflicting white/light backgrounds.
2. **Given** Dark Mode is active, **When** focusing or typing in dimensional filter input fields (ID, OD, CS, Code, Unit), **Then** form controls render with dark-theme backgrounds, high-contrast borders, legible input text, and clear focus outlines.
3. **Given** Dark Mode is active, **When** clicking a row to open the O-ring detail modal, **Then** the modal backdrop, dialog surface, attribute table, and e-commerce links use dark-mode styling with legible text.
4. **Given** either theme is active, **When** navigating via keyboard, **Then** all interactive controls (theme toggle, language dropdown, table headers, inputs, modal buttons, FAQ accordion) exhibit visible focus rings.

---

### User Story 3 - High-Contrast O-Ring Dimensional Visualization in Dark Mode (Priority: P2)

When viewing an O-ring detail modal in Dark Mode, the SVG visualization depicts the black rubber O-ring, its cross-section gradient, dimension arrows (OD, ID, CS), and dimension text labels with clear contrast against the container background, ensuring engineering dimensions are easily readable.

**Why this priority**: The black rubber O-ring and dimension markings are rendered on a light gradient by default; in dark mode, an unadjusted black O-ring against dark backgrounds would lose detail or vanish.

**Independent Test**: Open O-ring detail modal in Dark Mode; verify SVG ring graphic, dimension callout lines, and text labels are clearly distinguished from the background container.

**Acceptance Scenarios**:
1. **Given** Dark Mode is active, **When** opening the detail modal for any standard O-ring, **Then** the SVG visualization renders the realistic 3D-shaded pure-SVG O-ring with a subtle dark dot-grid backdrop, soft radial glow, and high-contrast dimension markings (OD, ID, CS).
2. **Given** Light Mode is active, **When** viewing the detail modal, **Then** the SVG visualization renders the realistic 3D-shaded pure-SVG O-ring with a subtle light dot-grid backdrop, soft radial glow, and crisp high-contrast dimension markings.

---

### Edge Cases

- **System theme changes dynamically**: When the user has not explicitly set a manual preference, changes to the OS `prefers-color-scheme` media query should update the theme dynamically.
- **LocalStorage disabled/blocked**: If `localStorage` access throws (e.g., restricted iframe or strict privacy mode), the app must gracefully fall back to in-memory state and OS media query without throwing errors.
- **Rapid toggle interaction**: Rapidly clicking the toggle button must not trigger race conditions, memory leaks, or unsynchronized DOM state.
- **Printing / Print Media**: Printing the page (`@media print`) should default to high-contrast light colors regardless of active screen theme.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `ThemeContext` and `useTheme` hook in `src/contexts/` to expose current theme, theme setter, and toggle handler.
- **FR-002**: System MUST render an accessible theme toggle button in the navbar (`NavBar.tsx`) adjacent to `LanguageDropdown`.
- **FR-003**: Theme toggle button MUST render zero-dependency inline SVG icons (sun and moon) defined in `src/components/common/icons.tsx`.
- **FR-004**: Theme toggle button MUST feature localized `aria-label` and title attributes with 100% parity across `en` and `id` locales.
- **FR-005**: System MUST persist user theme selection in `localStorage` under key `oring_theme`.
- **FR-006**: System MUST initialize theme preference by first checking `localStorage`, falling back to OS `prefers-color-scheme: dark`.
- **FR-007**: System MUST execute an inline pre-paint `<script>` in `index.html` before React hydration to inspect `localStorage` and `prefers-color-scheme`, immediately applying `data-bs-theme` to `<html>` to eliminate FOUC.
- **FR-008**: System MUST provide a 2-way Light / Dark toggle in the navbar (compact single-click Sun/Moon icon button matching language button height/style) that switches between "light" and "dark", initializing from `prefers-color-scheme` when `localStorage` has no saved preference.
- **FR-009**: System MUST synchronize `<meta name="theme-color">` in `<head>` dynamically whenever theme changes.
- **FR-010**: System MUST apply Bootstrap 5.3 color mode architecture (`data-bs-theme="light"` and `data-bs-theme="dark"`) across navbar, inputs, table (`tableHead`, `tableRow`), modal (`modalContent`), FAQ section (`faqSection`), and footer.
- **FR-011**: System MUST upgrade `RingVisualization` in `src/components/modal/visualization.tsx` to a theme-aware realistic 3D-shaded pure-SVG O-ring with subtle dot-grid backdrop and soft radial glow, ensuring high contrast for the black rubber O-ring in both light and dark modes, zero external assets, and exact preservation of `dimensions.width` × `dimensions.height` container.
- **FR-012**: System MUST strictly preserve all existing layout geometry, element sizes, paddings, margins, and typography scale between light and dark themes per Principle XIII (colors and contrast only, zero layout shift).
- **FR-013**: System MUST introduce zero new runtime dependencies per Principle IV.
- **FR-014**: System MUST maintain 100% automated test pass rate with regression coverage for theme context, toggle component, and persistence per Principle IX.

### Key Entities

- **Theme**: Union type `"light" | "dark"` representing active resolved visual color mode.
- **ThemePreference**: Stored user preference (`"light" | "dark"`).
- **ThemeContextValue**: Interface exposing `theme`, `toggleTheme`, `setTheme`, and `isDark`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero flash of unstyled light content (FOUC) on cold page reload under dark theme (measured via pre-paint attribute presence on `<html>`).
- **SC-002**: 100% WCAG AA contrast ratio compliance (minimum 4.5:1 for body copy and 3:1 for large headers/icons) across all components in both themes.
- **SC-003**: Zero pixel deviation in element layout, component dimensions, margins, or padding between themes (Principle XIII).
- **SC-004**: Theme toggle responds to user click within 50ms with instantaneous visual update.
- **SC-005**: 100% test pass rate across existing 95 tests plus new theme unit and integration tests.
- **SC-006**: 0 new runtime dependencies added; production bundle size passes `./scripts/check-bundle-size.mjs` gate cleanly.
- **SC-007**: 100% bilingual parity between `en` and `id` locales verified via `./scripts/check-i18n-parity.mjs`.

## Assumptions

- Bootstrap 5.3 native color mode (`data-bs-theme="dark"`) provides the primary dark-mode CSS variables and styling foundations.
- Custom SCSS adjustments in `src/css/` will use Bootstrap 5.3 `[data-bs-theme="dark"]` selectors or CSS variables rather than competing dark mode mechanisms.
- The theme toggle button will be styled as a standard compact Bootstrap button matching `LanguageDropdown` sizing to prevent navbar height shift.
