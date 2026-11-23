# O-Ring Finder — AS568, JIS & Metric O-Ring Size Lookup Tool

[![Live Demo](https://img.shields.io/badge/live-GitHub%20Pages-brightgreen.svg)](https://ijash.github.io/o-ring-finder/)
[![Version](https://img.shields.io/badge/version-3.3.0-blue.svg)](https://github.com/ijash/o-ring-finder/releases)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-orange.svg)](./LICENSE)

> **Open the live tool directly:** **[https://ijash.github.io/o-ring-finder/](https://ijash.github.io/o-ring-finder/)**

**O-Ring Finder** is a fast, free, client-side **O-ring size chart, lookup, and dimension finder** covering **3,822 standardized O-ring sizes** across **AS568**, **JIS**, and **Common Metric** standards. Designed for engineers, machinists, mechanics, pneumatic/hydraulic technicians, and airgun/regulator maintenance, it lets you filter seals by **Inner Diameter (ID)**, **Outer Diameter (OD)**, **Cross-Section (CS)**, or **standard size code** in both **millimeters (mm)** and **inches (″)**.

## Try It Now

No installation or account required—use the live web app on desktop or mobile:

**[Visit O-Ring Finder Live → https://ijash.github.io/o-ring-finder/](https://ijash.github.io/o-ring-finder/)**

1. Choose your preferred unit (**Millimeters `mm`** or **Inches `″`**).
2. Filter by **size code** (e.g., `008`, `P-10`, `2x20`) or set **Min / Max** bounds for **ID**, **OD**, and **CS**.
3. Click any column header to sort results, or click any row to open the **SVG dimension visualizer**, full specification table, and quick marketplace search links.

## Supported O-Ring Standards

| Standard | Common Use Cases | Records Included | Units |
| :--- | :--- | ---: | :--- |
| **AS568** (SAE / Aerospace Standard) | US industrial, hydraulic, pneumatic, regulator & automotive seals | 394 | `mm` / `″` |
| **JIS** (Japanese Industrial Standard — P/G/S/V) | Japanese machinery, motorcycles, automotive & precision cylinders | 545 | `mm` / `″` |
| **Common Metric** | General metric machinery, DIY, plumbing, NBR / FKM (Viton) / Silicone seals | 2,883 | `mm` / `″` |
| **Total Catalog** | **Instant static JSON lookup (zero backend latency)** | **3,822** | **`mm` / `″`** |

## Key Features

* **Dark & Light Theme Mode:** Accessible navbar theme toggle (`ThemeContext`) with synchronous anti-FOUC pre-paint script, Bootstrap 5.3 `data-bs-theme` color modes, dynamic `<meta name="theme-color">` sync, and realistic 3D toroidal SVG visualizer with high contrast in both themes.
* **Precision Range Filtering:** Filter O-rings simultaneously by `ID`, `OD`, and `CS` min/max ranges or search directly by size code.
* **URL Deep-Linking & Shareable State:** Bookmark or share exact filter configurations via query parameters (e.g. `?code=010&unit=inch`), automatically synchronized with browser history.
* **Instant Metric ↔ Imperial Conversion:** Switch seamlessly between **millimeters (`mm`)** and **inches (`″`)** with deterministic 3-decimal precision (`1 in = 25.4 mm`).
* **Interactive Dimension Visualizer:** Click any O-ring row to inspect a proportional SVG diagram displaying `OD`, `ID`, and `CS` callouts alongside full specs.
* **Quick Marketplace Lookup:** One-click product search links (Shopee, Tokopedia, Marco Rubber) pre-filled with the selected O-ring standard and dimensions.
* **Bilingual Sizing Guide & FAQ (EN / ID):** Collapsible O-ring reference guide explaining AS568, JIS, and Metric differences, measuring techniques, and unit conversion formulas with 100% bilingual parity.
* **SEO & Rich Structured Data:** Valid Schema.org JSON-LD structured data (`WebApplication`, `Dataset`, `FAQPage`), complete Open Graph / Twitter Card social previews, sitemap, and semantic landmarks.
* **Fast, Lightweight & Accessible:** Built on static JSON catalogs, zero external icon dependencies (inline SVGs), keyboard-accessible sorting (`aria-sort`), Escape-to-close modals, and zero server dependencies.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **UI & Language** | React 19, TypeScript 7 (strict mode) |
| **Build & Dev Server** | Vite 8 |
| **Testing & Coverage** | Vitest 5, React Testing Library, `@vitest/coverage-v8` |
| **Styling & Icons** | Bootstrap 5.3 (modular SCSS), zero-dependency inline SVGs |
| **Internationalization** | `i18next`, `react-i18next`, `i18next-browser-languagedetector` |
| **Package Manager & Hosting** | `pnpm` (`blockExoticSubdeps: true`), GitHub Pages (`gh-pages`) |

## Project Structure

```text
o-ring-finder/
├── index.html                  # Vite entry point, SEO metadata & JSON-LD graph
├── public/                     # Static assets (og-image.png, sitemap.xml, robots.txt, favicon)
├── scripts/                    # Reusable automation & quality-gate scripts
│   ├── audit-codebase.mjs      # Type-safety & hygiene audit
│   ├── bump-version.mjs        # Safe SemVer bumper (patch / minor)
│   ├── check-bundle-size.mjs   # Automated bundle size budget validator
│   ├── check-i18n-parity.mjs   # EN ↔ ID translation parity validator
│   ├── test-coverage.sh        # Vitest coverage runner
│   └── verify-gates.sh         # Full gate: tsc + i18n + vitest + build + bundle budget
└── src/
    ├── components/             # UI components (header, input, table, modal, faq, footer, analytics)
    │   └── faq/                # Collapsible bilingual sizing guide & FAQ
    ├── contexts/               # ThemeContext (useTheme), FilterContext (useFilter) & SortContext (useSort)
    ├── css/                    # SCSS design tokens & modular styles
    ├── data/                   # Static JSON catalogs (as568, jis, metric) + pure accessors
    ├── locales/                # Bilingual EN & ID translation files
    └── utils/                  # Native typed helpers (debounce, names, urlParams)
```

## Local Development

### Prerequisites

* **Node.js** `>= 20.11` (helper scripts are Node `18+` compatible)
* **pnpm** `>= 10`

### Setup & Commands

```bash
# 1. Clone the repository
git clone https://github.com/ijash/o-ring-finder.git
cd o-ring-finder

# 2. Install dependencies
pnpm install

# 3. (Optional) Configure GoatCounter analytics
cp .env.example .env

# 4. Start the Vite dev server
pnpm dev
```

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start Vite local development server with HMR |
| `pnpm test` | Run Vitest unit, component, and integration test suite |
| `pnpm run build` | Type-check (`tsc --noEmit`) and create production bundle in `dist/` |
| `pnpm run preview` | Preview the production `dist/` build locally |
| `./scripts/verify-gates.sh` | Run all quality gates (TypeScript, i18n parity, Vitest, Vite build) |
| `./scripts/test-coverage.sh` | Run Vitest with V8 coverage report |
| `pnpm run deploy` | Build and publish `dist/` to GitHub Pages (`Master` branch) |

## Contributing

Contributions, standard data corrections, and bug reports are welcome!

1. Fork or clone the repository and create a dedicated branch from `Master` (`feat/<slug>`, `fix/<slug>`, or `refactor/<slug>`).
2. Follow [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages.
3. Ensure `./scripts/verify-gates.sh` passes with zero errors and add tests for any new behavior or bug fix.
4. Open a pull request against `Master` describing the change.

## License

Licensed under the **[GNU General Public License v3.0 (GPL-3.0)](https://www.google.com/search?q=./LICENSE)**.

## Changelog

```text
v3.3.0 (2026-11-23)
- Add dark and light theme mode with 2-way toggle in navbar and localStorage persistence
- Add synchronous anti-FOUC pre-paint script in index.html with OS prefers-color-scheme detection
- Implement ThemeContext (useTheme) with dynamic <meta name="theme-color"> synchronization
- Add zero-dependency inline SVG IconSun and IconMoon with 100% EN/ID bilingual aria-labels
- Adapt Bootstrap 5.3 data-bs-theme and SCSS dark-mode styling across table, inputs, modal, and FAQ
- Upgrade RingVisualization to realistic 3D toroidal SVG with dot-grid backdrop and theme contrast

v3.2.0 (2026-11-23)
- Implement URL query parameter deep-linking and replaceState sync (?code=...&unit=...)
- Embed Schema.org JSON-LD structured data graph (WebApplication, Dataset, FAQPage) in index.html
- Add canonical link, hreflang alternates (en, id, x-default), Open Graph, Twitter cards, and og-image.png
- Remove invalid per-row RDFa attributes from catalog table rows
- Add collapsible bilingual O-ring sizing reference and FAQ guide above footer with 100% i18n parity
- Restructure semantic landmarks as siblings (header, main, footer) and fix invalid footer nesting
- Add sitemap.xml, declare sitemap in robots.txt, and add rich noscript summary

v3.1.0 (2026-11-23)
- Lightweight performance optimizations: eliminate 80 kB Bootstrap JS and 4 FontAwesome packages
- Implement zero-dependency inline SVG icons and native React state language dropdown
- Optimize Bootstrap SCSS with selective module imports preserving 100% visual styling
- Apply React 19 useDeferredValue for smooth catalog table rendering and code-split detail modal
- Add reusable scripts/check-bundle-size.mjs and enforce automated bundle size budget in verify-gates.sh

v3.0.3 (2026-11-23)
- Sync unit select dropdown with filter.unit when clicking Clear in inch mode
- Split input handlers into strictly typed numeric, text, and unit handlers
- Export typed TABLE_HEADER_KEYS to remove remaining type assertions
- Remove unused htmlUtils module and add regression test for Clear unit sync

v3.0.2 (2026-11-23)
- Fix table sorting in Indonesian by using canonical column keys instead of translated labels
- Fix stale filter closure on rapid multi-field input, parse numeric bounds, and add debounce cleanup
- Use composite row keys (standard-code) and memoize table data, filtering, sorting, and modal callbacks
- Replace DOM queries in modal with useRef + ResizeObserver and localize loading text
- Fix SEO meta description attribute, add aria-sort / aria-label / semantic header, align license to GPL-3.0-only
- Make audit and i18n parity scripts portable across Node 18+

v3.0.1 (2026-11-23)
- Reorganize project architecture: relocate contexts to src/contexts/ with useFilter/useSort & useMemo
- Move GoatCounter to src/components/analytics/ and fix readyState load race
- Merge App.css into SCSS, initialize i18next at module scope, add Escape & ARIA to modal

v3.0.0 (2026-11-23)
- Add comprehensive Vitest + React Testing Library test suite (56+ tests, >96% statement coverage)
- Add reusable automation scripts in ./scripts/ (verify-gates, test-coverage, audit-codebase, check-i18n-parity, bump-version)
- Fix EN/ID i18n key parity mismatch

v2.4.0 (2026-11-23)
- Migrate build toolchain from Create React App (react-scripts) to Vite 8, Vitest 5, and TypeScript 7
- Remove 1,100+ legacy dependencies (react-scripts, lodash, popper, react-helmet-async, terser)
- Transform AS568 (394), JIS (545), and Common Metric (2,883) HTML tables into static JSON datasets (~30% smaller JS bundle)
- Adopt React 19 native metadata hoisting, native debounce utility, and single pnpm lockfile
- Establish Spec-Driven Development constitution and roadmap

v2.3.6 (2026-01-09)
- Update marketplace search URLs

v2.3.5 (2025-03-04)
- Support browser Back button to close O-ring detail modal
- Fix small-screen table padding and horizontal overflow (2025-02-06)
- Update translations, shop URLs, and general code cleanup (2025-01-16)

v2.3.2 (2024-12-28)
- Add GoatCounter privacy-friendly visitor counter
- Add Product Finder in detail modal with Shopee, Tokopedia, and Marco Rubber search links
- Add FontAwesome icons and multilingual EN/ID support via i18next with navbar language dropdown
- Fix modal DOM placement via React Portal outside table rows
- Upgrade CRA to react-scripts 5.0.1 and add production minification/obfuscation

v1.4.2 (2024-12-21)
- Fix row pointer cursor and measurement display
- Update README documentation

v1.4.1 (2024-12-21)
- Optimize SVG O-ring visualization rendering

v1.4.0 (2024-12-21)
- Add OD / ID / CS dimension labels to SVG O-ring visualization
- Refine modal close button

v1.3.1 (2024-12-21)
- Display application version in footer

v1.3.0 (2024-12-21)
- Introduce O-ring detail modal with stability and input fixes (2024-12-20 – 2024-12-21)

v1.2.1 (2024-12-19)
- Add interactive column sorting (ascending/descending)
- Fix case-insensitive O-ring code search (2024-12-14)

v0.1.0 – v1.x (2022-09-17 – 2022-12-30)
- Add SEO metadata and Helmet integration (2022-12-30)
- Fix table header styling and layout wrappers (2022-11 – 2022-12)
- Expand O-ring catalog with additional standards (AS568, JIS, Common Metric), Bootstrap UI, favicon/public assets, and GitHub Pages deployment (2022-09-23 – 2022-09-25)
- Initial commit: first React + TypeScript O-ring size table with alternating row colors (2022-09-17)
```