# Architectural Research: Dark and Light Theme Mode

**Feature**: Dark and Light Theme Mode  
**Branch**: `feat/dark-light-theme`  
**Date**: 2026-11-23  

## Research Topics & Decisions

### 1. Theme State Management & Context Architecture

- **Decision**: Implement `ThemeContext` and `useTheme` in [src/contexts/ThemeContext.tsx](/home/ijash/Documents/repos/o-ring-finder/src/contexts/ThemeContext.tsx) with memoized context value and guarded hook.
- **Rationale**: Follows Principle I (`useTheme` custom hook with guard; memoized provider value to prevent re-render cascades). Matches existing `FilterContext` and `SortContext` patterns in `src/contexts/`.
- **Alternatives considered**:
  - Global state library (Zustand, Redux): Rejected under Principle IV (zero new runtime deps; React Context is built-in and optimal for app-wide theme).
  - Pure CSS / media query only without React state: Rejected because users require manual toggle persistence across visits overriding OS defaults.

### 2. Flash of Unstyled Content (FOUC) Prevention

- **Decision**: Synchronous inline `<script>` in `<head>` of [index.html](/home/ijash/Documents/repos/o-ring-finder/index.html) reading `localStorage.getItem("oring_theme")` and falling back to `window.matchMedia("(prefers-color-scheme: dark)").matches`. Immediately sets `document.documentElement.setAttribute("data-bs-theme", theme)` and updates `<meta name="theme-color">` before CSS parsing and DOM render.
- **Rationale**: Eliminates white flash during cold reload when user has dark mode selected. Standard web best practice for client-side SPAs.
- **Alternatives considered**:
  - React `useEffect` in root component: Rejected because React mounting occurs after initial paint, causing a noticeable 50-200ms white flash (FOUC).
  - Server-side cookie injection: Rejected because O-Ring Finder is a static client-side single-page app deployed on GitHub Pages.

### 3. Bootstrap 5.3 Color Mode & SCSS Integration

- **Decision**: Rely on Bootstrap 5.3 native `data-bs-theme="light"` and `data-bs-theme="dark"` on `<html>`. Augment custom styles in [src/css/](/home/ijash/Documents/repos/o-ring-finder/src/css) using Bootstrap CSS custom properties (`var(--bs-body-bg)`, `var(--bs-body-color)`, `var(--bs-border-color)`) and `[data-bs-theme="dark"]` scoped selectors where hardcoded light colors exist.
- **Key component adjustments**:
  - **Navbar** ([navBar.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/header/navBar.tsx)): Keep primary branding `#1375AC` with high-contrast text shadow across both modes; adjust container and borders.
  - **Table** ([tableHead.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/table/tableHead.tsx), [tableRow.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/table/tableRow.tsx)): Ensure clickable row hover uses `rgba(var(--bs-primary-rgb), 0.15)` in dark mode instead of `#f0f0f0`; table header `th` remains dark with high contrast text.
  - **Modal** ([modalContent.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/modal/modalContent.tsx)): Attribute table header and borders adapt to Bootstrap 5.3 dark table styles.
  - **FAQ Section** ([faqSection.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/faq/faqSection.tsx)): Uses `bg-body`, `text-body`, and `border` which adapt automatically under `data-bs-theme="dark"`.
  - **Inputs & Dropdowns**: Inherit Bootstrap 5.3 dark form-control styles with crisp focus rings.
- **Rationale**: Bootstrap 5.3 includes built-in dark mode variables (`_variables-dark.scss` is already imported in `src/css/index.scss`). Zero extra CSS footprint.

### 4. Zero-Dependency Inline SVG Icons for Theme Toggle

- **Decision**: Add `IconSun` and `IconMoon` zero-dependency inline SVG components to [src/components/common/icons.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/common/icons.tsx).
- **Rationale**: Principle IV strictly prohibits adding icon libraries (e.g. FontAwesome, Lucide, React Icons). The existing icons in `icons.tsx` (`IconCircle`, `IconLanguage`, `IconEraser`) use native inline SVG paths.
- **Button UX**: Single compact button next to `LanguageDropdown` in navbar. Clicking toggles `light` ↔ `dark`. Displays Moon icon when light (prompting switch to dark) and Sun icon when dark (prompting switch to light).

### 5. Dynamic `<meta name="theme-color">` Sync

- **Decision**: Synchronize `<meta name="theme-color">` in `<head>` dynamically:
  - Light mode: `#2fa4e7` (matching Cerulean primary navbar / status bar).
  - Dark mode: `#1a1d20` (matching dark mode surface / navbar).
- **Rationale**: Ensures mobile browser URL bars, pull-to-refresh headers, and PWA system chrome match the active theme seamlessly.

### 6. Upgraded Realistic 3D-Shaded O-Ring Visualization SVG

- **Decision**: Upgrade [src/components/modal/visualization.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/modal/visualization.tsx) to a realistic 3D-shaded pure-SVG O-ring with:
  - Multi-stop radial gradient creating toroidal specular highlight (light source at top-left).
  - Outer drop shadow / soft ambient occlusion for realistic depth.
  - Subtle theme-aware dot-grid backdrop pattern (light grey in light mode, deep slate in dark mode).
  - Soft center radial glow (ambient lighting).
  - Crisp high-contrast dimension lines and labels (`#3388B9` in light mode, `#54b2e9` / `#79c7f7` in dark mode).
  - 100% preservation of outer SVG `dimensions.width` × `dimensions.height` container and layout geometry (Principle XIII).
- **Rationale**: Resolves User Story 3 and user clarification. The rubber O-ring is black by industry standard; dark mode requires high-contrast backdrop and dimension callouts so the 3D ring stands out crisply.

### 7. SemVer & Release Plan

- **Decision**: Schedule `minor` version bump (`3.2.0` → `3.3.0`) via `node scripts/bump-version.mjs minor`.
- **Rationale**: Conforms to Principle XI (backward-compatible new functionality is a minor release).
