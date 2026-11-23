# Feature Specification: Modernize Tech Stack with Vite and Latest Dependencies

**Feature Branch**: `feat/migrate-vite`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "update the tech so it uses react vite and all latest stable tech and dependencies."

## Clarifications

### Session 2026-11-23

- Q: What test runner should be selected to replace `react-scripts test`? → A: Migrate to Vitest (+ latest `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) for native Vite integration.
- Q: How should production asset minification and obfuscation be handled? → A: Use Vite's built-in minifier with `sourcemap: false` in production; remove the separate `obfuscate` shell script and standalone `terser` dependency.
- Q: What is the scope of dependency and codebase cleanup for this migration? → A: Full cleanup: update all packages to latest stable lightweight versions (verified via web research per Principles IV & VIII), remove legacy/accidental dependencies (`react-scripts`, `popper`, deprecated `@fortawesome/react-fontawesome@0.2.x`, unused `lodash`/`web-vitals`/`@types/react-helmet`, `ajv`), remove competing lockfiles (`package-lock.json`, `yarn.lock`), and clean dead scaffolding (`public/index.html` after migrating tags to root `index.html`, `README.old.md`, stray `src/*/package.json`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast and Modern Development Workflow (Priority: P1)

As a software engineer maintaining O-Ring Finder, I want a fast, lightweight modern build toolchain and local development server with instantaneous module replacement, so that developing, testing, and debugging changes is frictionless and feedback loops are near-instant.

**Why this priority**: Replacing Create React App (`react-scripts` 5.0.1) with Vite eliminates deprecated toolchains, slashes local startup and reload latency, and provides a modern build pipeline supporting latest web standards.

**Independent Test**: Can be tested by running the local development server and build commands, verifying rapid startup, instant hot module updates upon source file changes, and error-free compilation to modern ECMAScript target.

**Acceptance Scenarios**:

1. **Given** a developer starts the local development environment, **When** the dev server command is run, **Then** the application starts up in under 2 seconds and serves the application locally with full functionality.
2. **Given** the local development server is running, **When** a source code change is saved in a component or stylesheet, **Then** the browser updates within milliseconds without losing application state where possible.
3. **Given** the production build command is invoked, **When** the bundler compiles the project, **Then** it generates clean, optimized, lightweight static assets into the distribution directory without deprecated tooling warnings.

---

### User Story 2 - Resilient, Automated Testing & Verification Gate (Priority: P2)

As a developer or maintainer, I want automated unit and component testing integrated with the modern toolchain, so that every change, feature, and refactor is verified by automated test suites before being merged or deployed.

**Why this priority**: Principle IX makes automated testing a non-negotiable release gate. Transitioning away from `react-scripts` requires an equally robust or superior automated testing pipeline that executes rapidly and verifies domain accuracy, dimensional conversions, and component behavior.

**Independent Test**: Can be tested by executing the automated test suite command, validating that all existing tests (catalog parity, unit conversion, component behavior) run to completion and report accurate pass/fail results.

**Acceptance Scenarios**:

1. **Given** test suites in the repository, **When** the test command is run, **Then** all tests execute in a modern test environment, reporting comprehensive test results with clear assertions.
2. **Given** a regression or intentional assertion failure introduced in test suites, **When** tests execute, **Then** the test runner fails with a non-zero exit code and pinpoints the failing assertion.

---

### User Story 3 - Visual Layout & Functional Parity for End Users (Priority: P3)

As an end user looking up O-ring dimensions, I want the web application to function identically with zero visual disruptions, preserving all exact layouts, dimensions, responsive behaviors, themes, and search/filter interactions.

**Why this priority**: Principle XIII mandates strict preservation of visual layout and sizing. Modernizing build systems and dependencies must not introduce any visual shifts, broken styles, or regressions in user-facing capabilities.

**Independent Test**: Can be tested by comparing production build output against the baseline across all primary user journeys (searching by code, filtering by ID/OD/CS ranges, switching units between mm and inches, toggling language between English and Indonesian, opening detail modals).

**Acceptance Scenarios**:

1. **Given** the application loaded in a web browser, **When** inspecting the layout, typography, element spacing, and button sizes, **Then** all visual elements are pixel-identical to the pre-migration baseline.
2. **Given** an end user interacting with the filter panel, table sorting, language selector, and detail modals, **When** actions are performed, **Then** all features behave identically to the baseline application.

---

### User Story 4 - Production Deployment & SEO Preservation on GitHub Pages (Priority: P4)

As a site visitor finding O-Ring Finder via search engines or GitHub, I want the production site to load rapidly, maintain search engine discoverability, and have intact metadata and assets when hosted on GitHub Pages subpath.

**Why this priority**: Principle XII requires SEO-friendly architecture, and Principle XI requires smooth deployment to GitHub Pages. Toolchain migration must preserve base URL routing, Open Graph tags, robots.txt, manifest.json, and metadata parity across bilingual settings.

**Independent Test**: Can be tested by building for production with the GitHub Pages base path, serving the output, and verifying that all asset URLs (scripts, styles, icons, manifest), meta tags, and structured headers resolve cleanly with status 200.

**Acceptance Scenarios**:

1. **Given** the production build for GitHub Pages, **When** inspected, **Then** all generated asset paths include the configured repository base path (`/o-ring-finder/`) without 404 resource errors.
2. **Given** search engine crawlers inspecting the page, **When** HTML and head elements are examined, **Then** semantic landmarks, title, meta description, favicon, manifest, and robots.txt are present and valid in both English and Indonesian.

---

### Edge Cases

- **Asset Path Resolution in Static Subpaths**: GitHub Pages serves from `/o-ring-finder/`. Absolute `/` paths break images or icons unless properly configured with base path.
- **Environment Variables and Public URL Replacement**: CRA uses `REACT_APP_*` and `%PUBLIC_URL%` in HTML templates. Vite uses `VITE_*` and standard HTML asset imports or `base` path interpolation.
- **SCSS/Bootstrap Compatibility**: Bootstrap 5 and custom SCSS styles must compile without deprecation crashes or layout-shifting style resets.
- **Minification and Obfuscation Parity**: Current build executes post-build Terser mangling/compression. Production output must maintain compact bundle size and performance without breaking runtime execution.
- **Transitive Dependency Conflicts**: Pnpm with `blockExoticSubdeps: true` (Principle IV) must resolve clean, secure dependency trees without unvetted sources.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace Create React App (`react-scripts` 5.0.1) with Vite as the build tool and development server.
- **FR-002**: System MUST compile TypeScript targeting modern ECMAScript standards (ES2022 or modern browser baseline) with strict compiler settings (`"strict": true`, `"noUncheckedIndexedAccess": true`, etc. per Principle II).
- **FR-003**: System MUST provide a development server supporting instant hot module replacement (HMR) for React components and SCSS styles.
- **FR-004**: System MUST produce an optimized, minified production build compatible with GitHub Pages hosting under the `/o-ring-finder/` path prefix.
- **FR-005**: System MUST provide an automated test runner command powered by Vitest (integrated with `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`) that executes all project tests without relying on `react-scripts test`.
- **FR-006**: Production build pipeline MUST produce minified static assets via Vite's built-in minifier with `sourcemap: false` in production, removing the separate `obfuscate` shell script and standalone `terser` dependency.
- **FR-007**: Dependency manifests and repository files MUST undergo a full cleanup: update all dependencies to latest stable lightweight versions, remove legacy/superseded dependencies (`react-scripts`, `popper`, deprecated `@fortawesome/react-fontawesome@0.2.x`, unused `lodash`, `web-vitals`, `@types/react-helmet`, `ajv`), delete competing lockfiles (`package-lock.json`, `yarn.lock`), and delete dead scaffolding (`public/index.html` after migrating tags to root `index.html`, `README.old.md`, stray `src/*/package.json`).
- **FR-008**: System MUST preserve all existing visual layout, styling, element geometry, and component dimensions with 100% fidelity per Principle XIII.
- **FR-009**: System MUST preserve all search engine discoverability assets (meta tags, title, description, manifest.json, robots.txt, icons) per Principle XII.
- **FR-010**: All user-facing strings and i18n configurations MUST continue to maintain bilingual parity (`en` and `id`) per Principle IX.

### Key Entities

*(No new domain data entities introduced; this is a build infrastructure and dependency modernization feature).*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Development server cold start time is under 2.0 seconds (compared to 15-30+ seconds with legacy CRA).
- **SC-002**: Hot Module Replacement (HMR) updates render in browser in under 200 milliseconds upon saving source file changes.
- **SC-003**: Production build completes in under 15 seconds on standard CI/developer machines.
- **SC-004**: Total production JavaScript bundle size does not exceed baseline (smaller or equal to existing build).
- **SC-005**: 100% of automated tests pass without errors or unhandled warnings under the new test runner.
- **SC-006**: Zero layout or visual styling shifts across all viewport breakpoints compared to baseline.
- **SC-007**: Production deployment on GitHub Pages loads without 404 errors for any assets, scripts, stylesheets, or images.

## Assumptions

- Application remains a single-page client-side static web application deployed to GitHub Pages.
- Package manager remains strictly `pnpm` with `pnpm-lock.yaml` as mandated by Principle IV.
- Existing React version (React 19) and TypeScript baseline are maintained and supported by the new Vite toolchain.
- Visual components, layout structure, and DOM hierarchies remain unchanged to honor Principle XIII.
- Root `index.html` will serve as Vite's entry point, migrating template tags from `public/index.html`.

