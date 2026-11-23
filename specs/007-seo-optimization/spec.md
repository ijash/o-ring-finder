# Feature Specification: SEO Optimization & URL Deep-Linking

**Feature Branch**: `feat/seo-optimization`  
**Created**: 2026-11-23  
**Status**: Ready for Planning  
**Input**: User description: "Optimize for SEO with keyword-rich metadata, single canonical tag, hreflang alternates, Open Graph and Twitter cards, valid JSON-LD structured data (WebApplication with SearchAction, Dataset with 3,822 sizes, FAQPage), URL deep-linking and state sync via query parameters, crawlability via sitemap.xml and robots.txt, semantic HTML landmarks, invalid nesting fixes, CLS prevention on spec image, and compact bilingual collapsible FAQ and sizing reference guide while preserving existing UI layout."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search Engine Discovery & Snippet Previews (Priority: P1)

Search engine crawlers and users sharing links on messaging and social platforms encounter high-intent search terms ("O-Ring Size Chart & Finder", "AS568", "JIS", "Metric", "3,822 sizes", "ID", "OD", "CS", "mm & inch") in page titles and meta descriptions, accompanied by valid social preview cards (title, description, and preview image), canonical link headers, and language-alternate indicators.

**Why this priority**: Directly drives search index ranking, click-through rate, and brand trust across global English and Indonesian technical searchers.

**Independent Test**: Inspect static markup and browser head tags to confirm single unambiguous title, meta description, canonical link, Open Graph metadata, Twitter card metadata, and hreflang alternate links without runtime tag duplication.

**Acceptance Scenarios**:
1. **Given** a crawler or browser requesting the root index document, **When** examining `<head>`, **Then** find `<title>`, `<meta name="description">`, `<link rel="canonical" href="https://ijash.github.io/o-ring-finder/">`, hreflang alternates for `en`, `id`, and `x-default`, and complete Open Graph and Twitter card tags pointing to a valid 1200x630 social preview graphic.
2. **Given** a user switching the active application language between English and Indonesian, **When** viewing the browser tab and page metadata, **Then** the page title and meta description dynamically reflect the active language using keyword-rich domain phrasing without creating duplicate description tags.

---

### User Story 2 - Deep-Linked URL State & Shareable Filters (Priority: P1)

Engineers, procurement specialists, and search bots can navigate directly to specific O-ring sizes or filter criteria via bookmarkable and shareable URL query parameters (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`), and interactions with the filter form continuously synchronize state back to the URL without reloading the page.

**Why this priority**: Enables search engines to index deep-link filter results and allows engineers to share exact size specifications via URL.

**Independent Test**: Open the application with query parameters (e.g. `?code=010&unit=mm`), verify that input fields pre-populate, filtered table displays matching records immediately, and modifying filters updates the browser URL bar smoothly.

**Acceptance Scenarios**:
1. **Given** a URL containing search parameters `?code=010&unit=inch`, **When** the page loads, **Then** the unit selector initializes to inches, the code input displays "010", and the table filters to show only matching O-rings.
2. **Given** an active user session, **When** the user changes dimension bounds or enters a ring code, **Then** the browser address bar reflects the active filters via URL query parameters without polluting history stack or triggering page reloads.
3. **Given** an active filter query in the URL, **When** the user activates the clear filter action, **Then** all filter parameters are cleared from the URL while preserving unit preference.

---

### User Story 3 - Structured Data & Search Action Integration (Priority: P2)

Search bots parsing page metadata receive valid, error-free JSON-LD structured data describing the application as a `WebApplication` supporting direct query search actions (`SearchAction`), a technical `Dataset` encompassing 3,822 O-ring dimensional specifications across AS568, JIS, and Metric standards, and an `FAQPage` aligned with the visible sizing reference guide.

**Why this priority**: Unlocks rich search result cards, knowledge panels, sitelinks search box eligibility, and structured data validation without RDFa syntax errors.

**Independent Test**: Run Google Rich Results validator on the structured data payload to verify schema conformity and zero errors or warnings.

**Acceptance Scenarios**:
1. **Given** a structured data parser inspecting the page, **When** evaluating the `<script type="application/ld+json">` graph, **Then** it detects valid `WebApplication`, `Dataset`, and `FAQPage` definitions conforming to Schema.org standards.
2. **Given** individual table rows in the search results table, **When** inspecting rendered row DOM elements, **Then** per-row RDFa attributes (`vocab`, `typeof`, `property`) are completely absent, avoiding duplicate or invalid entity declarations.
3. **Given** the `WebApplication` search action specification, **When** evaluated, **Then** it references `https://ijash.github.io/o-ring-finder/?code={search_term_string}` with a matching `query-input` target.

---

### User Story 4 - Accessible Sizing Guide & Bilingual FAQ (Priority: P2)

Users and crawlers seeking technical guidance on O-ring measurement (measuring inside diameter, outside diameter, and cross section), differences between AS568, JIS B 2401, and Metric dimensional standards, and unit conversion formulas have access to a clean, collapsible, bilingual FAQ section situated directly above the footer.

**Why this priority**: Supplies authoritative contextual text and long-tail keyword relevance for search indexation while giving users immediate domain assistance without disturbing tool ergonomics.

**Independent Test**: Toggle collapsible FAQ sections in both English and Indonesian; verify smooth expansion, keyboard accessibility, semantic markup, and complete text parity.

**Acceptance Scenarios**:
1. **Given** the home page view, **When** scrolling toward the footer, **Then** a collapsible accordion/details sizing guide is present with questions covering standard differences, measurement guidelines, and tolerance/conversion details.
2. **Given** a user switching languages from English to Indonesian, **When** viewing the FAQ section, **Then** all questions, summaries, and technical explanations display in natural Indonesian with 100% key parity.
3. **Given** screen reader and keyboard navigation, **When** focusing on FAQ questions, **Then** standard Enter/Space keys toggle expansion state with correct accessibility states.

---

### User Story 5 - Crawler Accessibility & Clean Semantic HTML (Priority: P3)

Web crawlers and assistive technologies experience valid, sequential HTML landmarks (`<header>`, `<main>`, `<footer>` as sibling elements), crawler discovery files (`robots.txt`, `sitemap.xml`), noscript accessibility fallbacks, correct image sizing attributes, and valid nesting across all page elements.

**Why this priority**: Eliminates crawl traps, prevents Cumulative Layout Shift (CLS), and ensures compliance with web standards.

**Independent Test**: Run automated HTML validation, check robots.txt directives, verify sitemap XML structure, and confirm zero layout shift on the specification diagram.

**Acceptance Scenarios**:
1. **Given** a search engine crawler requesting `robots.txt`, **When** inspected, **Then** it permits crawling of all content and references `Sitemap: https://ijash.github.io/o-ring-finder/sitemap.xml`.
2. **Given** `sitemap.xml`, **When** parsed, **Then** it lists the canonical site URL with change frequency, priority, and alternate language links.
3. **Given** a browser with JavaScript disabled, **When** loading the page, **Then** `<noscript>` provides a comprehensive static text summary of the tool, supported standards, and measurement guide.
4. **Given** the technical specification image `oring-spec.jpg`, **When** rendered in the browser, **Then** it specifies explicit width and height dimensions and a descriptive `alt` attribute.
5. **Given** the page layout structure, **When** inspecting DOM hierarchy, **Then** `<header>`, `<main>`, and `<footer>` exist as semantic siblings, and footer text contains no invalid `<small><p>` tag nesting.

---

### Edge Cases

- **Malformed URL parameters**: Non-numeric values in numeric range fields (`minId=abc`) MUST be safely ignored without throwing runtime errors or resetting valid sibling filters.
- **Out-of-range or negative dimensions**: Negative numbers or inverse ranges (`minId=50&maxId=10`) MUST be handled gracefully by the filter engine without application crashes.
- **Unknown unit in URL parameter**: If `unit` is not recognized, the system MUST default to Metric (`mm`).
- **Empty or whitespace query string**: When query parameters are blank, the application MUST load default unfiltered view cleanly.
- **Language persistence with URL query**: Preserving language selection via `lng` query parameter or local storage MUST not conflict with dimensional filter parameters.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide high-intent, keyword-optimized `<title>` and `<meta name="description">` tags in `index.html` featuring primary terms: `O-Ring Size Chart & Finder`, `AS568`, `JIS`, `Metric`, `ID`, `OD`, `CS`, `mm & inch`, and `3,822 sizes`.
- **FR-002**: System MUST guarantee that exactly one `<meta name="description">` element exists in the document head at runtime to eliminate duplicate meta description tags.
- **FR-003**: System MUST provide canonical URL declaration `<link rel="canonical" href="https://ijash.github.io/o-ring-finder/">` and hreflang alternate links (`en`, `id`, `x-default`) in the document head.
- **FR-004**: System MUST include Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:site_name`, `og:locale`, `og:locale:alternate`) and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- **FR-005**: System MUST provide a dedicated, lightweight 1200x630 pixel social share graphic at `public/og-image.png`.
- **FR-006**: System MUST remove invalid per-row RDFa attributes (`vocab="https://schema.org/" typeof="Product"` and child property attributes) from search table rows.
- **FR-007**: System MUST provide valid Schema.org JSON-LD structured data containing `@graph` items for `WebApplication` (with `SearchAction` targeting `https://ijash.github.io/o-ring-finder/?code={search_term_string}`), `Dataset` (indexing 3,822 standard sizes), and `FAQPage`.
- **FR-008**: System MUST parse initial filter state from URL query parameters on page load (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`).
- **FR-009**: System MUST pre-populate filter form input controls with values parsed from URL parameters.
- **FR-010**: System MUST synchronize active filter state back to the browser URL query string using non-destructive browser history updates (`replaceState`) so links remain shareable.
- **FR-011**: System MUST clear URL filter parameters when the user clicks the "Clear filter" action while retaining the active measurement unit.
- **FR-012**: System MUST provide `public/sitemap.xml` listing the canonical URL, last modification date, and language alternate links.
- **FR-013**: System MUST declare `Sitemap: https://ijash.github.io/o-ring-finder/sitemap.xml` inside `public/robots.txt`.
- **FR-014**: System MUST include a descriptive `<noscript>` section in `index.html` summarizing tool capabilities, supported standards, and measurement overview for non-JS crawlers.
- **FR-015**: System MUST structure top-level landmarks as siblings (`<header>`, `<main>`, `<footer>`) rather than nesting header and footer elements inside `<main>`.
- **FR-016**: System MUST correct invalid HTML nesting in footer markup by removing `<p>` tags nested directly inside `<small>`.
- **FR-017**: System MUST assign explicit `width`, `height`, and descriptive `alt` text to the specification image `oring-spec.jpg` to prevent Cumulative Layout Shift (CLS).
- **FR-018**: System MUST provide a collapsible, bilingual (`en`/`id`) O-Ring Sizing FAQ & Reference section directly above the footer detailing AS568, JIS, and Metric differences, ID/OD/CS measurement instructions, and unit conversion guidelines.
- **FR-019**: System MUST preserve 100% of existing navbar, input form, table, and modal visual layout, geometry, spacing, and styling in strict compliance with Principle XIII.
- **FR-020**: System MUST externalize all user-facing strings for the FAQ section and updated metadata to `src/locales/en/globals.json` and `src/locales/id/globals.json` with 100% key parity.
- **FR-021**: System MUST introduce zero new runtime npm dependencies in compliance with Principle IV.

### Key Entities

- **Search Metadata & Social Graph**: Set of head elements specifying title, meta description, canonical URL, hreflang alternates, Open Graph cards, and Twitter cards for search and social indexers.
- **URL Filter State**: State representation mapped to and from browser query parameters (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`), ensuring bidirectional synchronization with the application filter model.
- **Structured Data Graph (JSON-LD)**: Machine-readable schema graph linking WebApplication, Dataset (3,822 items across AS568, JIS, Metric), and FAQPage to enhance search snippet presentation.
- **Bilingual FAQ & Sizing Reference**: Collapsible instructional knowledge base explaining technical standards, cross-section sizing, inside/outside diameter measurement, and unit conversions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required SEO technical elements (canonical tag, hreflang tags, Open Graph tags, Twitter card, valid JSON-LD, sitemap link in robots.txt) present and validated without syntax errors.
- **SC-002**: Zero duplicate `<meta name="description">` tags rendered in document head across both initial load and language switching.
- **SC-003**: 100% of valid URL query parameters (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`) correctly initialize application filter state and input form controls on initial load.
- **SC-004**: Active filter changes update URL address parameters within 1 second without triggering page reload or disrupting user scroll position.
- **SC-005**: 100% removal of invalid per-row RDFa attributes from table rows, reducing unnecessary per-row DOM attribute bloat across all 3,822 records.
- **SC-006**: Structured data parses with 0 errors and 0 warnings against Schema.org validation standards.
- **SC-007**: 100% string parity between English and Indonesian locale files for all newly introduced FAQ and metadata keys.
- **SC-008**: 100% passing automated test suite with regression tests covering URL query parsing, URL state sync, FAQ rendering, and metadata verification.
- **SC-009**: Production build bundle size remains within defined budget with zero new runtime dependencies added.
- **SC-010**: Cumulative Layout Shift (CLS) on specification image resolved via explicit aspect-ratio/dimension attributes.

## Assumptions

- The deployment target remains GitHub Pages at `https://ijash.github.io/o-ring-finder/`.
- Deep linking is managed purely via client-side query string parameters (`window.location.search`) because GitHub Pages serves a single static `index.html` for single-page applications.
- Social sharing crawlers (such as Facebook, Twitter, LinkedIn, Slack) that do not execute client-side JavaScript will read static meta tags and the `og:image` from `index.html`.
- Principle XIII allows the addition of the compact, collapsible FAQ section above the footer as explicitly requested and approved by the user, while preserving the exact layout and geometry of all existing UI components (navbar, filter inputs, table, modal).
