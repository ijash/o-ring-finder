# Tasks: Modernize Tech Stack with Vite and Latest Dependencies

**Input**: Design documents from `specs/002-migrate-vite/` (`plan.md`, `spec.md`, `research.md`, `quickstart.md`)  
**Branch**: `feat/migrate-vite`  

## Phase 1: Setup & Dependency Migration

- [x] T001 Update dependencies, scripts, and `bugs.url` in `package.json`
- [x] T002 [P] Delete legacy lockfiles `package-lock.json` and `yarn.lock`
- [x] T003 Run `pnpm install` with `blockExoticSubdeps: true` to regenerate `pnpm-lock.yaml`

---

## Phase 2: Foundational Configuration

- [x] T004 [P] Create `vite.config.ts` with React plugin, path aliases, base path, and Vitest configuration
- [x] T005 [P] Update `tsconfig.json` with target `ES2022`, `"moduleResolution": "bundler"`, and strict flags
- [x] T006 [P] Create `src/vite-env.d.ts` with Vite client references and typed `ImportMetaEnv`
- [x] T007 [P] Delete legacy `src/react-app-env.d.ts`
- [x] T008 [P] Delete stray sub-directory package manifests `src/components/package.json` and `src/utils/package.json`

---

## Phase 3: User Story 1 - Fast and Modern Development Workflow (Priority: P1) 🎯 MVP

**Goal**: Establish instant Vite dev server and optimized production build pipeline.  
**Independent Test**: Dev server starts in < 2s; production build compiles cleanly to `dist/`.  

- [x] T009 [US1] Create root `index.html` as Vite entry point with `<script type="module" src="/src/index.tsx"></script>`
- [x] T010 [US1] Verify local dev server startup and HMR via `pnpm run dev`
- [x] T011 [US1] Verify production build compilation via `pnpm run build`

---

## Phase 4: User Story 2 - Resilient, Automated Testing & Verification Gate (Priority: P2)

**Goal**: Transition test execution to Vitest and verify test suite integrity.  
**Independent Test**: `pnpm test` (`vitest run`) executes all test suites and reports passes.  

- [x] T012 [P] [US2] Configure `@testing-library/jest-dom/vitest` setup in `src/setupTests.ts`
- [x] T013 [P] [US2] Migrate smoke tests to Vitest in `src/App.test.tsx`
- [x] T014 [US2] Run `pnpm test` and verify `src/App.test.tsx` and `src/data/__tests__/oRingData.test.ts` pass

---

## Phase 5: User Story 3 - Visual Layout & Functional Parity (Priority: P3)

**Goal**: Replace lodash dependency with native utility while preserving exact layout and behavior.  
**Independent Test**: Search/filter debouncing operates smoothly; zero visual shifts in `pnpm run preview`.  

- [x] T015 [P] [US3] Implement lightweight typed debounce utility in `src/utils/debounce.ts`
- [x] T016 [P] [US3] Migrate debounce import from lodash to `src/utils/debounce.ts` in `src/components/input/inputSection.tsx`
- [x] T017 [US3] Verify visual layout and filter debounce behavior in `pnpm run preview` per Principle XIII

---

## Phase 6: User Story 4 - Production Deployment & SEO Preservation on GitHub Pages (Priority: P4)

**Goal**: Preserve all SEO metadata, environment variables, and static assets with `/o-ring-finder/` base.  
**Independent Test**: All asset links and metadata tags resolve correctly with `/o-ring-finder/` prefix in production build.  

- [x] T018 [P] [US4] Consolidate SEO metadata, title, meta tags, and manifest links in root `index.html` and delete `public/index.html`
- [x] T019 [P] [US4] Replace `react-helmet-async` with React 19 native `<title>` and `<meta>` hoisting in `src/components/header/title.tsx`
- [x] T020 [P] [US4] Update environment variable access to `import.meta.env.VITE_GOAT_COUNTER_ID` in `src/components/common/goatCounter.tsx`
- [x] T021 [P] [US4] Update environment template in `.env.example`
- [x] T022 [US4] Verify production build asset paths in `dist/index.html` for GitHub Pages compatibility

---

## Phase 7: Polish, Automation Scripts & Versioning

- [x] T023 [P] Delete dead legacy files `src/reportWebVitals.ts` and `README.old.md`
- [x] T024 [P] Create `./scripts/verify-gates.sh` with header usage documentation running typecheck, test, and build
- [x] T025 Make `./scripts/verify-gates.sh` executable via `chmod +x ./scripts/verify-gates.sh`
- [x] T026 Bump version in `package.json` to `2.4.0` per Principle XI
- [x] T027 Run `./scripts/verify-gates.sh` to validate all gates pass cleanly

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: T001 → T002 → T003.
- **Phase 2 (Foundational)**: Depends on Phase 1. Tasks T004–T008 can execute in parallel.
- **Phase 3 (US1)**: Depends on Phase 2. T009 → T010 → T011.
- **Phase 4 (US2)**: Depends on Phase 3. T012, T013 [P] → T014.
- **Phase 5 (US3)**: Depends on Phase 3. T015, T016 [P] → T017.
- **Phase 6 (US4)**: Depends on Phase 3. T018, T019, T020, T021 [P] → T022.
- **Phase 7 (Polish & Verification)**: Depends on all prior phases. T023, T024 [P] → T025 → T026 → T027.
