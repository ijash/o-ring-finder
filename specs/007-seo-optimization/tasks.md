# Tasks: SEO Optimization & URL Deep-Linking

**Input**: Design documents from `specs/007-seo-optimization/` (`plan.md`, `spec.md`, `data-model.md`, `contracts/seo-contracts.md`, `research.md`, `quickstart.md`)

## Phase 1: Setup & Foundations

**Purpose**: Test fixtures, utility scaffolding, and social assets setup

- [x] T001 [P] Generate lightweight 1200x630 social preview image in `public/og-image.png` per `contracts/seo-contracts.md`
- [x] T002 [P] Create XML sitemap with canonical and language alternates in `public/sitemap.xml` per `contracts/seo-contracts.md`
- [x] T003 [P] Declare sitemap location in `public/robots.txt` per `contracts/seo-contracts.md`
- [x] T004 [P] Create URL query parameter unit test suite in `src/utils/__tests__/urlParams.test.ts`
- [x] T005 [P] Create SEO metadata and structured data verification test in `src/__tests__/seoMetadata.test.ts`

---

## Phase 2: User Story 1 - Search Engine Discovery & Snippet Previews (Priority: P1) 🎯 MVP

**Goal**: High-intent keyword `<title>`, single `<meta name="description">`, canonical, hreflang, Open Graph, and Twitter cards

**Independent Test**: Inspect `<head>` in `index.html` and rendered browser DOM to verify single title, single meta description, canonical, hreflang alternates, and social card tags without runtime duplication

- [x] T006 [P] [US1] Update high-intent metadata strings (`meta.title`, `meta.description`) in `src/locales/en/globals.json` and `src/locales/id/globals.json`
- [x] T007 [US1] Update `index.html` with keyword-rich `<title>`, `<meta name="description">`, canonical link, hreflang alternates, Open Graph, and Twitter card tags per `contracts/seo-contracts.md`
- [x] T008 [US1] Refactor `src/components/header/title.tsx` to prevent duplicate runtime `<meta name="description">` tags in document head
- [x] T009 [US1] Run metadata tests in `src/__tests__/seoMetadata.test.ts` to confirm 0 duplicate description tags across language changes

---

## Phase 3: User Story 2 - Deep-Linked URL State & Shareable Filters (Priority: P1)

**Goal**: Bidirectional synchronization between URL query parameters (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`) and application filter state

**Independent Test**: Load `?code=010&unit=inch&minId=5`; confirm inputs pre-populate, table filters matching rows, and filter changes update URL via `replaceState` without reload

- [x] T010 [P] [US2] Implement `parseUrlFilters` and `syncFilterToUrl` in `src/utils/urlParams.ts` citing `data-model.md` for `UrlFilterParams.code`, `UrlFilterParams.unit`, `UrlFilterParams.minId`, `UrlFilterParams.maxId`, `UrlFilterParams.minOd`, `UrlFilterParams.maxOd`, `UrlFilterParams.minCs`, and `UrlFilterParams.maxCs`
- [x] T011 [US2] Re-export url utility functions in `src/utils/index.ts`
- [x] T012 [US2] Update `src/contexts/FilterContext.tsx` to initialize filter state from `parseUrlFilters(window.location.search)` and sync updates via `syncFilterToUrl`
- [x] T013 [US2] Update `src/components/input/inputSection.tsx` to pre-populate text and numeric form controls from initial filter state and clean URL on clear filter action
- [x] T014 [US2] Add URL deep-linking integration tests in `src/contexts/__tests__/FilterContext.test.tsx` and `src/components/input/__tests__/inputSection.test.tsx`
- [x] T015 [US2] Run `src/utils/__tests__/urlParams.test.ts` to verify parsing and serialization edge cases (negative numbers, malformed strings, unit fallbacks)

---

## Phase 4: User Story 3 - Structured Data & Search Action Integration (Priority: P2)

**Goal**: Valid Schema.org JSON-LD `@graph` (`WebApplication`, `Dataset`, `FAQPage`) and removal of invalid per-row table RDFa

**Independent Test**: Validate JSON-LD script block against Schema.org specification; confirm zero `vocab`, `typeof`, `property` attributes in rendered table rows

- [x] T016 [P] [US3] Remove invalid per-row RDFa attributes (`vocab`, `typeof`, `property`) from `src/components/table/tableRow.tsx`
- [x] T017 [US3] Embed Schema.org JSON-LD `@graph` (`WebApplication` with `SearchAction`, `Dataset` of 3,822 sizes, and `FAQPage`) in `index.html` per `data-model.md`
- [x] T018 [US3] Add JSON-LD schema parsing and validation assertions in `src/__tests__/seoMetadata.test.ts`
- [x] T019 [US3] Run table row tests in `src/components/table/__tests__/tableRow.test.tsx` to verify clean DOM output and modal functionality

---

## Phase 5: User Story 4 - Accessible Sizing Guide & Bilingual FAQ (Priority: P2)

**Goal**: Collapsible `<details>`/`<summary>` bilingual FAQ section positioned directly above footer with 100% i18n parity

**Independent Test**: Render FAQ section in `en` and `id`; verify 4 technical questions toggle with click and keyboard `Enter`/`Space` without layout shift

- [x] T020 [P] [US4] Add `faq.*` translation keys (sectionTitle, sectionSubtitle, q1-q4 question & answer) in `src/locales/en/globals.json` and `src/locales/id/globals.json` per `data-model.md`
- [x] T021 [P] [US4] Implement collapsible accessible FAQ component in `src/components/faq/faqSection.tsx` using semantic `<details>` and `<summary>` elements
- [x] T022 [US4] Export FAQ component in `src/components/faq/index.ts` and `src/components/index.ts`
- [x] T023 [US4] Mount `FaqSection` inside container above footer in `src/components/main.tsx`
- [x] T024 [P] [US4] Create FAQ component test suite in `src/components/faq/__tests__/faqSection.test.tsx` testing bilingual rendering and accordion toggles
- [x] T025 [US4] Run `node ./scripts/check-i18n-parity.mjs` to enforce 100% bilingual parity across all new `faq.*` and `meta.*` keys

---

## Phase 6: User Story 5 - Crawler Accessibility & Clean Semantic HTML (Priority: P3)

**Goal**: Semantic landmark siblings (`<header>`, `<main>`, `<footer>`), valid footer nesting, explicit image dimensions (CLS prevention), and rich `<noscript>`

**Independent Test**: Verify landmark hierarchy in browser DOM, confirm 0 `<p>` tags nested inside `<small>`, check `oringSpec` image width/height attributes, and verify `<noscript>` fallback

- [x] T026 [P] [US5] Fix invalid `<small><p>` nesting in `src/components/footer/footerText.tsx`
- [x] T027 [US5] Restructure top-level layout in `src/components/main.tsx` so `<header>`, `<main>`, and `<footer>` are semantic siblings
- [x] T028 [US5] Add explicit `width="340"`, `height="230"`, and descriptive `alt` attribute to `oringSpec` image in `src/components/input/inputSection.tsx` to eliminate CLS
- [x] T029 [US5] Add rich static `<noscript>` content in `index.html` summarizing tool features, O-ring standards, and measurement formulas
- [x] T030 [US5] Add crawler accessibility and landmark structure tests in `src/__tests__/seoMetadata.test.ts`

---

## Phase 7: Polish, Quality Gates & Release Prep

**Purpose**: Quality gate verification, version bump, and release readiness

- [x] T031 Verify `public/google*.html` Google Search Console verification file remains untouched and untampered
- [x] T032 Bump minor version from `3.1.0` to `3.2.0` in `package.json` via `node scripts/bump-version.mjs minor` per Principle XI
- [x] T033 Verify `pnpm test` passes 100% of test suites with coverage thresholds maintained
- [x] T034 Run bundle budget check `node ./scripts/check-bundle-size.mjs` to confirm JS < 300 kB and CSS < 100 kB (Principle IV)
- [x] T035 Run full quality gates via `./scripts/verify-gates.sh` (tsc, i18n parity, vitest, bundle budget, production build)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundations (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2 - P1)**: Depends on Phase 1 test scaffolding
- **User Story 2 (Phase 3 - P1)**: Depends on Phase 1 urlParams test scaffolding
- **User Story 3 (Phase 4 - P2)**: Independent; can run parallel to US1/US2
- **User Story 4 (Phase 5 - P2)**: Independent; can run parallel to US1/US2/US3
- **User Story 5 (Phase 6 - P3)**: Depends on Phase 4 & 5 component completions
- **Polish & Release Prep (Phase 7)**: Depends on all user stories completing

### Parallel Opportunities

- Phase 1: T001, T002, T003, T004, T005 can all execute in parallel
- Phase 2: T006 can run in parallel with T007
- Phase 3: T010 can run in parallel with T014 test authoring
- Phase 4: T016 (tableRow) can run in parallel with T017 (index.html)
- Phase 5: T020 (locales), T021 (faqSection), and T024 (faq tests) can run in parallel
- Phase 6: T026 (footerText) can run in parallel with T028 (inputSection) and T029 (index.html)

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup & Foundations (T001-T005)
2. Complete Phase 2: User Story 1 (Metadata, Canonical, Social Tags) (T006-T009)
3. Complete Phase 3: User Story 2 (URL Query Parameter Deep-Linking) (T010-T015)
4. Validate MVP: test metadata, shareable links, and filter persistence

### Incremental Delivery

1. Foundation + US1 + US2 → Core SEO & shareable links functional (MVP)
2. Add US3 → Schema.org JSON-LD & clean table DOM
3. Add US4 → Bilingual sizing guide & FAQ section
4. Add US5 → Semantic landmarks, CLS prevention, and rich noscript fallback
5. Polish & Gates → Version bump `3.2.0` and `./scripts/verify-gates.sh` pass
