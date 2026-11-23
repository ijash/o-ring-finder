# Tasks: Dark and Light Theme Mode

**Input**: Design documents from `specs/008-dark-light-theme/` (`plan.md`, `spec.md`, `data-model.md`, `contracts/theme-contracts.md`, `research.md`, `quickstart.md`)

## Phase 1: Setup & Foundations

**Purpose**: Test scaffolding, icons, and localization foundations

- [x] T001 [P] Add `IconSun` and `IconMoon` zero-dependency inline SVG components to `src/components/common/icons.tsx` per `contracts/theme-contracts.md`
- [x] T002 [P] Re-export `IconSun` and `IconMoon` in `src/components/common/index.ts`
- [x] T003 [P] Add `theme.*` translation keys in `src/locales/en/globals.json` and `src/locales/id/globals.json` per `contracts/theme-contracts.md`
- [x] T004 [P] Create theme context test suite in `src/contexts/__tests__/ThemeContext.test.tsx` testing initialization, persistence, and toggle
- [x] T005 [P] Create theme toggle component test suite in `src/components/header/__tests__/themeToggle.test.tsx` testing render, aria-labels, and click events

---

## Phase 2: User Story 1 - Seamless Theme Switching & Zero-FOUC Initial Load (Priority: P1) 🎯 MVP

**Goal**: Anti-FOUC pre-paint script, `ThemeContext` state management, accessible navbar toggle, and `<meta name="theme-color">` synchronization

**Independent Test**: Load page with dark preference pre-stored in `localStorage` or OS `prefers-color-scheme: dark`; verify DOM renders in dark theme on initial paint with 0 white flash; click theme toggle to switch modes smoothly

- [x] T006 [P] [US1] Embed synchronous anti-FOUC pre-paint `<script>` in `<head>` of `index.html` per `contracts/theme-contracts.md`
- [x] T007 [P] [US1] Implement `ThemeContext`, `ThemeProvider`, and `useTheme` in `src/contexts/ThemeContext.tsx` citing `data-model.md` for `Theme` and `ThemePreference`
- [x] T008 [US1] Re-export `ThemeContext`, `ThemeProvider`, `useTheme`, and `Theme` in `src/contexts/index.ts`
- [x] T009 [US1] Wrap application root with `ThemeProvider` in `src/components/main.tsx`
- [x] T010 [P] [US1] Implement accessible `ThemeToggle` component in `src/components/header/themeToggle.tsx` per `contracts/theme-contracts.md`
- [x] T011 [US1] Re-export `ThemeToggle` in `src/components/header/index.ts` and `src/components/index.ts`
- [x] T012 [US1] Integrate `ThemeToggle` button into navbar adjacent to `LanguageDropdown` in `src/components/header/navBar.tsx`
- [x] T013 [US1] Synchronize `<meta name="theme-color">` dynamically inside `src/contexts/ThemeContext.tsx` effect
- [x] T014 [US1] Run unit tests in `src/contexts/__tests__/ThemeContext.test.tsx` and `src/components/header/__tests__/themeToggle.test.tsx` to verify clean state transitions

---

## Phase 3: User Story 2 - Full Theme Contrast & Readability Across All Components (Priority: P1)

**Goal**: Bootstrap 5.3 `data-bs-theme` and SCSS contrast adaptations across navbar, filter inputs, table, modal, FAQ, and footer

**Independent Test**: Inspect computed styles and contrast across inputs, table rows, modal, FAQ cards, and footer in dark mode to verify WCAG AA compliance (4.5:1 text contrast)

- [x] T015 [P] [US2] Update `src/css/_custom.scss` with dark-mode hover styles (`.clickable:hover`), surface elevation, and contrast variables
- [x] T016 [P] [US2] Update `src/components/header/navBar.tsx` branding and container contrast in dark mode
- [x] T017 [P] [US2] Update `src/components/input/inputSection.tsx` form control styling and focus indicators for dark mode
- [x] T018 [P] [US2] Update `src/components/table/tableHead.tsx` header background and sort icon contrast for dark mode
- [x] T019 [P] [US2] Update `src/components/table/tableRow.tsx` row hover background and standard badges for dark mode
- [x] T020 [P] [US2] Update `src/components/modal/modalContent.tsx` attribute table and product links for dark mode
- [x] T021 [P] [US2] Update `src/components/faq/faqSection.tsx` card styling, question summary colors, and borders for dark mode
- [x] T022 [US2] Run existing component test suites (`src/components/table/__tests__/tableRow.test.tsx`, `src/components/faq/__tests__/faqSection.test.tsx`, `src/components/input/__tests__/inputSection.test.tsx`) to verify dark mode rendering

---

## Phase 4: User Story 3 - High-Contrast 3D O-Ring SVG Visualization (Priority: P2)

**Goal**: Upgrade `RingVisualization` to theme-aware realistic 3D-shaded pure-SVG O-ring with subtle dot-grid backdrop and soft radial glow

**Independent Test**: Open O-ring detail modal in Dark Mode; verify SVG ring graphic, dimension callout lines, and text labels stand out with high contrast against container background

- [x] T023 [P] [US3] Create visualization test suite in `src/components/modal/__tests__/visualization.test.tsx` testing SVG render, dimension coords, and theme contrast
- [x] T024 [US3] Upgrade `src/components/modal/visualization.tsx` to realistic 3D toroidal SVG with subtle dot-grid backdrop, ambient glow, and theme-aware contrast colors citing `data-model.md`
- [x] T025 [US3] Run `src/components/modal/__tests__/visualization.test.tsx` to verify SVG rendering in both light and dark themes

---

## Phase 5: Polish, Quality Gates & Release Prep

**Purpose**: Quality gate verification, bilingual parity, version bump, and release readiness

- [x] T026 [P] Run `node ./scripts/check-i18n-parity.mjs` to verify 100% `en`/`id` parity for all new `theme.*` keys
- [x] T027 [P] Run `node ./scripts/check-bundle-size.mjs` to verify bundle budget gate passes cleanly with zero new runtime deps
- [x] T028 Run full test suite `pnpm test` to verify ≥95% test coverage and 100% test pass rate
- [x] T029 Execute `minor` version bump `3.2.0` → `3.3.0` via `node ./scripts/bump-version.mjs minor` per Principle XI
- [x] T030 Run full 5/5 quality gates verification via `./scripts/verify-gates.sh`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational / User Story 1 (Phase 2)**: Depends on Phase 1 completion (T001-T005)
- **User Story 2 (Phase 3)**: Depends on Phase 2 completion (requires active ThemeProvider and `data-bs-theme`)
- **User Story 3 (Phase 4)**: Depends on Phase 2 completion (requires active ThemeContext in modal)
- **Polish & Release Prep (Phase 5)**: Depends on Phases 1–4 completion

### Parallel Opportunities

- **Phase 1**: T001, T002, T003, T004, T005 can all run in parallel (independent files)
- **Phase 2**: T006, T007, T010 can run in parallel
- **Phase 3**: T015, T016, T017, T018, T019, T020, T021 can run in parallel
- **Phase 4**: T023 can run in parallel with earlier test tasks
- **Phase 5**: T026, T027 can run in parallel before full suite
