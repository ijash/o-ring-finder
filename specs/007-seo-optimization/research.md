# Research & Design Decisions: SEO Optimization & URL Deep-Linking

**Feature**: `specs/007-seo-optimization` | **Branch**: `feat/seo-optimization` | **Date**: 2026-11-23

## 1. Single Meta Tag & React 19 Metadata Coordination

### Decision
- Update static `<title>` and `<meta name="description">` in `index.html` with high-intent keywords: `O-Ring Size Chart & Finder | AS568, JIS, Metric Sizes`.
- Update `src/components/header/title.tsx`: remove `<meta name="description" ...>` tag rendering or coordinate with document head to ensure exactly one description tag exists at runtime. React 19 natively hoists `<title>` and `<meta>` rendered in components, which creates duplicate `<meta name="description">` tags when `index.html` already defines one. Use direct document manipulation / synchronization or clean component head tagging so crawlers and browsers see exactly one canonical description tag per language.

### Rationale
- Search engines penalize or get confused by duplicate conflicting `<meta name="description">` tags.
- Non-JS crawlers only read `index.html`. JS-enabled clients update `<title>` and meta description when switching language (`en` ↔ `id`).
- Zero new libraries needed (Principle IV).

### Alternatives Considered
- *Add `react-helmet` or `react-helmet-async`*: Adds heavy external dependencies; incompatible with React 19 or redundant with native React 19 metadata hoisting and standard browser APIs. Rejected per Principle IV.

---

## 2. Canonical, Hreflang & Open Graph Social Preview

### Decision
- Add `<link rel="canonical" href="https://ijash.github.io/o-ring-finder/" />` in `index.html`.
- Add `<link rel="alternate" hreflang="en" href="https://ijash.github.io/o-ring-finder/?lng=en" />`.
- Add `<link rel="alternate" hreflang="id" href="https://ijash.github.io/o-ring-finder/?lng=id" />`.
- Add `<link rel="alternate" hreflang="x-default" href="https://ijash.github.io/o-ring-finder/" />`.
- Add Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width="1200"`, `og:image:height="630"`, `og:site_name`, `og:locale="en_US"`, `og:locale:alternate="id_ID"`).
- Add Twitter Card tags (`twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`).
- Generate lightweight `public/og-image.png` (1200x630) with clear high-contrast typography ("O-Ring Size Chart & Finder", "3,822 Sizes | AS568 • JIS • Metric").

### Rationale
- Conforms directly to rules in `.github/skills/seo-best-practices/` (`tech-canonical-urls`, `social-open-graph`, `social-twitter-cards`).
- Social platforms require static `<meta>` tags present in initial HTML response without executing client JS.
- Sizing of 1200x630 is industry standard for high-DPI social preview cards.

### Alternatives Considered
- *Dynamic OG image generation service*: Requires server/edge runtime; impossible on static GitHub Pages.
- *Omit og-image*: Poor click-through rate when shared on social media and chat apps.

---

## 3. Structured Data: Schema.org JSON-LD Graph

### Decision
- Remove invalid per-row RDFa attributes (`vocab="https://schema.org/" typeof="Product"`, `property="brand"`, `property="size"`) from `src/components/table/tableRow.tsx`.
- Add `<script type="application/ld+json">` in `index.html` containing an `@graph` with 3 schema entities:
  1. `WebApplication`: defines app name, url, description, applicationCategory (`EngineeringTool`), operatingSystem (`All`), and `potentialAction: SearchAction` with target `https://ijash.github.io/o-ring-finder/?code={search_term_string}` and `query-input="required name=search_term_string"`.
  2. `Dataset`: describes the 3,822 dimensional records across AS568, JIS B 2401, and Metric standards, license, and measurement parameters.
  3. `FAQPage`: defines Q&A entities matching the visible bilingual FAQ section on measuring and selecting O-rings.

### Rationale
- Per-row Product RDFa on 3,822 table rows bloated the DOM with invalid microdata that caused Schema.org validation warnings (missing `offers`, missing `image`, invalid `size` property).
- Centralized JSON-LD in `index.html` executes 0 runtime JS, parses instantly, passes Google Rich Results test with 0 errors, and provides Google Sitelinks Search Box eligibility via `SearchAction`.

### Alternatives Considered
- *Inject JSON-LD dynamically via React component*: Invisible to crawlers that don't execute JS or defer JS parsing; static JSON-LD in `index.html` is 100% crawlable.

---

## 4. URL Deep-Linking & History State Synchronization

### Decision
- In `src/contexts/FilterContext.tsx`:
  - On mount, read `window.location.search` using native `URLSearchParams`.
  - Parse supported query parameters: `code` (string), `unit` (`mm` | `inch`), `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs` (numeric). Validate numeric bounds; ignore invalid/NaN values.
  - Initialize filter state with parsed values.
  - Whenever `filter` changes, synchronize non-empty, non-default filter keys back to URL query parameters via `window.history.replaceState`.
- In `src/components/input/inputSection.tsx`:
  - Pre-populate text and numeric input values from `filter` on mount / clear.
  - On "Clear filter", reset URL query string to base path or only `unit` parameter without reloading the page.

### Rationale
- Users and technical buyers need shareable links for exact O-ring specifications (e.g., `?code=010&unit=inch` or `?minId=10&maxId=12`).
- Deep links enable search engines to crawl specific filter configurations.
- Using native `URLSearchParams` and `window.history.replaceState` avoids external router dependencies (Principle IV) and preserves browser back/forward history without page reloads.

### Alternatives Considered
- *Install React Router*: Heavy dependency (~30 kB+) for simple query string reflection in a single-page tool. Rejected per Principle IV.
- *Use `pushState` on every keystroke*: Pollutes browser history stack so clicking back requires dozens of clicks. `replaceState` updates the URL cleanly in place.

---

## 5. Semantic Landmarks, CLS & HTML Cleanup

### Decision
- In `src/components/main.tsx`: Refactor top-level structure into semantic siblings:
  ```tsx
  <>
    <header><NavBar /><Title /></header>
    <main className="container"><InputSection /><TableSection /><FaqSection /></main>
    <FooterText />
    <GoatCounter />
  </>
  ```
- In `src/components/footer/footerText.tsx`: Replace `<small><p>...</p></small>` with valid HTML `<div className="small text-muted"><p className="mb-1">...</p></div>`.
- In `src/components/input/inputSection.tsx`: Add explicit `width="340" height="230"` and descriptive `alt="O-ring cross-section diagram showing inside diameter (ID), outside diameter (OD), and cross section (CS)"` to `oringSpec` image.
- In `index.html`: Add rich `<noscript>` fallback describing tool, standards, dimensions, and sizing formulas.
- In `public/robots.txt`: Append `Sitemap: https://ijash.github.io/o-ring-finder/sitemap.xml`. Add `public/sitemap.xml`.

### Rationale
- Screen readers and SEO audits flag landmarks where `<header>` and `<footer>` are nested inside `<main>`.
- `<p>` inside `<small>` is invalid HTML per W3C specification.
- Explicit image dimensions eliminate Cumulative Layout Shift (CLS < 0.1) per Core Web Vitals (`cwv-cls.md`).
- Sitemap in `robots.txt` ensures search engine discovery (`tech-robots-txt.md`).

---

## 6. Collapsible Bilingual FAQ & Sizing Guide

### Decision
- Create `src/components/faq/faqSection.tsx` rendered at bottom of `<main>`, above `<footer>`.
- Use native HTML `<details>` and `<summary>` elements with clean Bootstrap utility classes.
- Questions covered:
  1. What is the difference between AS568, JIS B 2401, and Metric O-ring standards?
  2. How do I measure an O-ring (ID, OD, CS)?
  3. How do I calculate Outer Diameter (OD) from ID and CS? (OD = ID + 2 × CS)
  4. How do I convert between millimeters and inches? (1 inch = 25.4 mm)
- All copy fully translated into `src/locales/en/globals.json` and `src/locales/id/globals.json` under `faq.*`.

### Rationale
- Satisfies user-approved Principle XIII addition for technical domain reference and rich snippet indexation.
- Native `<details>`/`<summary>` requires 0 JavaScript libraries, is accessible out of the box, and preserves existing visual styling.
- 100% bilingual parity complies with Principle IX.
