# Feature Specification: PWA & Offline-First Support

**Feature Branch**: `feat/pwa-offline-first`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Offline-first PWA support for Android & desktop installation (standalone display mode, scoped to /o-ring-finder/, precaching all JS/CSS/HTML/icons/static O-ring catalog assets for 100% offline search/filter/conversion/modal/FAQ usage). Research and verify latest stable vite-plugin-pwa (Workbox generateSW, autoUpdate or prompt-free seamless background update) per Constitution Principles IV & VIII, ensuring the production JS bundle budget (<= 145 kB gzip) stays green. Complete public/manifest.json (proper id, start_url, scope, display: "standalone", theme_color, background_color, and maskable icon support) + subtle, accessible bilingual (en/id) offline status badge or install prompt only if non-intrusive to layout (Principle XIII). Automated unit/build tests verifying service worker registration/generation, manifest validity, and 100% EN/ID i18n parity (Principle IX)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Offline Catalog Search & Dimensional Filtering (Priority: P1)

As a field engineer or workshop technician with spotty or no internet connection, I want to load O-Ring Finder and filter 3,822 O-ring sizes by ID, OD, CS, standard, or code so that I can identify required seal parts on-site without disruption.

**Why this priority**: Core value of O-Ring Finder is search and verification. Field environments frequently lack network connectivity.

**Independent Test**: Load application once online, enable airplane mode/disconnect network, refresh page, and perform search, dimensional filtering, and unit conversion. All features must function identically to online mode.

**Acceptance Scenarios**:

1. **Given** application has been loaded at least once, **When** user visits or refreshes while completely offline, **Then** full page shell, styles, icons, and O-ring catalog load immediately without network errors.
2. **Given** user is offline, **When** user enters search terms, changes min/max dimension sliders, or toggles between Metric (mm) and Imperial (inch), **Then** filtered table results and counts update instantly with zero data loss.
3. **Given** user is offline, **When** user clicks an O-ring row to view detailed dimensions, **Then** detail modal opens with complete dimensional attributes and localized field labels.

---

### User Story 2 - Desktop & Mobile PWA Installation (Priority: P2)

As a frequent user on Android or desktop, I want to install O-Ring Finder as a standalone application on my home screen or desktop launcher so that it launches in its own dedicated, clean window without browser navigation chrome.

**Why this priority**: Standalone display mode provides an app-like experience, fast access from device launchers, and consistent offline launching.

**Independent Test**: Open supported browser (Chrome/Edge/Android Chrome), trigger installation from browser menu or install prompt, and launch installed app. Must open in standalone window with correct app icon, title, and theme color.

**Acceptance Scenarios**:

1. **Given** user visits the app on an install-capable browser, **When** browser checks PWA installability criteria, **Then** web application manifest validates with valid `id`, `start_url`, `scope`, standalone display, and standard/maskable icons.
2. **Given** user installs and opens the application from device launcher, **When** window opens, **Then** it renders in standalone mode without browser URL bar, maintaining the header theme color matching active theme (light or dark).

---

### User Story 3 - Transparent Background Updates & Non-Intrusive Offline Awareness (Priority: P3)

As an engineer returning online after being offline, I want the application to update seamlessly in the background without intrusive popups, while subtly indicating my connection status if offline so that I always know my network state.

**Why this priority**: Adheres to Constitution Principle XIII (preserve visual layout & sizing) and seamless UX. Users must never be blocked by modal update prompts or cluttered banners.

**Independent Test**: Simulate offline status in browser; observe subtle, non-disruptive indicator in navigation bar. Re-enable network; observe indicator clear without layout shift.

**Acceptance Scenarios**:

1. **Given** user loses network connection, **When** application detects offline status, **Then** a subtle, accessible bilingual indicator ("Offline" / "Luring") displays in the navigation bar without shifting surrounding layout.
2. **Given** user restores network connection, **When** application detects online status, **Then** offline indicator disappears cleanly and any newer application version updates smoothly in background.

---

### Edge Cases

- **First visit offline**: User visits the application URL for the very first time with no internet connection; browser native offline screen is shown (service worker cannot precache prior to first visit).
- **External e-commerce links while offline**: User clicks Marketplace/Shopee/Tokopedia search links inside detail modal while offline; browser handles external navigation failure gracefully without crashing the app.
- **Theme switching while offline**: User toggles light/dark theme while offline; theme preferences persist in `localStorage` and `theme-color` meta updates correctly.
- **Storage pressure eviction**: Browser clears caches under severe storage pressure; service worker gracefully re-fetches and re-precaches assets upon next online visit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST precache all application assets (HTML, JavaScript bundles, CSS stylesheets, inline SVG icons, static data catalogs, image assets, and manifest) upon initial install.
- **FR-002**: System MUST serve all cached application assets using a Cache-First / Stale-While-Revalidate service worker strategy, ensuring 100% offline functionality across all core capabilities (search, filtering, sorting, unit conversion, modal detail view, FAQ accordion).
- **FR-003**: System MUST provide a valid Web App Manifest at `public/manifest.json` configured with:
  - `id`: `/o-ring-finder/`
  - `start_url`: `/o-ring-finder/`
  - `scope`: `/o-ring-finder/`
  - `display`: `standalone`
  - `name`: `O-Ring Size Chart & Finder`
  - `short_name`: `O-Ring Finder`
  - `theme_color`: `#2fa4e7` (synchronized with active theme)
  - `background_color`: `#ffffff`
  - High-resolution icons including standard and maskable icon declarations (`purpose: "any maskable"` or dedicated maskable icon).
- **FR-004**: System MUST keep production JavaScript gzipped bundle size strictly `<= 145 kB` (complying with bundle budget in `scripts/check-bundle-size.mjs` and Constitution Principles IV & VIII).
- **FR-005**: System MUST provide seamless, prompt-free background cache updates (`autoUpdate` behavior) when a new release is deployed, without disrupting user workflow.
- **FR-006**: System MUST display a subtle, accessible bilingual (`en`/`id`) offline indicator when browser network status is disconnected, without altering navbar layout dimensions or vertical height (complying with Constitution Principle XIII).
- **FR-007**: System MUST provide 100% translation key parity between English (`src/locales/en/globals.json`) and Indonesian (`src/locales/id/globals.json`) for all new PWA-related UI text (complying with Constitution Principle IX).
- **FR-008**: System MUST include automated tests verifying manifest format/values, service worker build generation, offline status detection hook/component, and i18n parity.

### Key Entities

- **Service Worker Registration**: Represents browser worker lifecycle state (installing, active, updating) governing asset precaching.
- **Web App Manifest**: Declarative JSON metadata defining app identity, display mode, colors, icons, and scope for PWA installation.
- **Network Status State**: Boolean representation of client online/offline status (`navigator.onLine` and `online`/`offline` window events) consumed by UI indicator.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of core O-ring catalog browsing, searching, filtering, and detail modal operations function identically when disconnected from network after initial load.
- **SC-002**: Web application manifest passes Lighthouse PWA and browser installability audits with 0 critical errors.
- **SC-003**: Production JavaScript gzipped bundle size remains `<= 145.00 kB` (verified by `scripts/check-bundle-size.mjs`).
- **SC-004**: All 5 quality gates in `./scripts/verify-gates.sh` pass cleanly (TypeScript type check, 100% EN/ID i18n parity, 100% Vitest tests passing, clean Vite build, bundle budget compliance).
- **SC-005**: Offline status indicator causes 0 px layout shift (CLS 0) on navbar elements when transitioning between online and offline states.

## Assumptions

- Target environment is modern evergreen desktop and mobile browsers supporting Service Workers and Cache API (Chrome, Edge, Firefox, Safari iOS 16.4+, Android Chrome).
- App is hosted under subpath `/o-ring-finder/` on GitHub Pages (`https://ijash.github.io/o-ring-finder/`); all service worker scopes, base URLs, and manifest URLs align with this path.
- External marketplace search links (Shopee, Tokopedia, Google) require active internet connectivity and are documented as expected online-only interactions.
- Seamless auto-update strategy is preferred over blocking/prompting modal dialogues to prevent layout interference and user disruption.
