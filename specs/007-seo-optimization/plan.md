# Implementation Plan: SEO Optimization & URL Deep-Linking

**Branch**: `feat/seo-optimization` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md) in [specs/007-seo-optimization/](./)

## Summary

- **Keyword-Rich Metadata & Single Meta Tag**: Update `<title>` and `<meta name="description">` in [index.html](/home/ijash/Documents/repos/o-ring-finder/index.html) and [src/locales/](/home/ijash/Documents/repos/o-ring-finder/src/locales) with high-intent keywords (`O-Ring Size Chart & Finder`, `AS568`, `JIS`, `Metric`, `ID`, `OD`, `CS`, `mm & inch`, `3,822 sizes`); prevent duplicate `<meta name="description">` tags at runtime.
- **Canonical, Hreflang & Social Sharing**: Add canonical link `https://ijash.github.io/o-ring-finder/`, hreflang alternates (`en`, `id`, `x-default`), Open Graph (`og:*`), Twitter Card (`twitter:*`), and lightweight 1200x630 `public/og-image.png`.
- **Valid Structured Data (JSON-LD)**: Remove invalid per-row RDFa from [tableRow.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/table/tableRow.tsx); embed Schema.org JSON-LD `@graph` in [index.html](/home/ijash/Documents/repos/o-ring-finder/index.html) for `WebApplication` (with `potentialAction: SearchAction` targeting `https://ijash.github.io/o-ring-finder/?code={search_term_string}`), `Dataset` (3,822 sizes), and `FAQPage`.
- **URL Deep-Linking**: Parse query parameters (`code`, `unit`, `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`) on initial load in [FilterContext.tsx](/home/ijash/Documents/repos/o-ring-finder/src/contexts/FilterContext.tsx), pre-populate inputs in [inputSection.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/input/inputSection.tsx), and synchronize active filters back to URL via `window.history.replaceState`.
- **Crawlability & Semantic Landmarks**: Add `public/sitemap.xml`, link in [public/robots.txt](/home/ijash/Documents/repos/o-ring-finder/public/robots.txt), rich `<noscript>` in [index.html](/home/ijash/Documents/repos/o-ring-finder/index.html), sibling landmarks (`<header>`, `<main>`, `<footer>`) in [main.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/main.tsx), fix `<small><p>` invalid nesting in [footerText.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/footer/footerText.tsx), and explicit dimensions on spec image.
- **Collapsible Bilingual FAQ**: Add lightweight, accessible `<details>`/`<summary>` sizing FAQ section above `<footer>` with 100% i18n parity in `en`/`id` (user-approved addition under Principle XIII).
- **Semver & Security**: Never touch or delete `public/google*.html`; schedule minor version bump `3.1.0` → `3.2.0` (Principle XI); zero new runtime dependencies (Principle IV).

## Technical Context

- **Language/Version**: TypeScript 5.7+ (`tsconfig.json` strict mode baseline)
- **Primary Dependencies**: React 19, react-dom 19, i18next, react-i18next, Vite 8, Vitest 5, Sass
- **Storage**: Client-side static JSON catalogs (AS568, JIS, Metric; 3,822 items)
- **Testing**: Vitest 5 + jsdom + testing-library/react; 73 baseline tests, ≥ 80% coverage
- **Target Platform**: Browser / static web application (GitHub Pages)
- **Project Type**: Client-side single-page application (SPA)
- **Performance Goals**: JS payload < 300 kB raw (< 85 kB gzip); CSS payload < 100 kB raw (< 25 kB gzip); 0 dropped frames; 0 Cumulative Layout Shift (CLS < 0.1)
- **Constraints**: 100% visual layout and styling preservation of navbar, form, table, and modal (Principle XIII); zero new runtime dependencies (Principle IV); 5/5 quality gates passing (Principle IX)
- **Scale/Scope**: ~10 files modified; 1 new FAQ component; 1 new utility module; 0 new npm packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | React Best Practices | ✅ PASS | Pure components, disciplined state in [FilterContext.tsx](/home/ijash/Documents/repos/o-ring-finder/src/contexts/FilterContext.tsx), proper effect cleanup, native `<details>`/`<summary>` keyboard accessibility |
| II | Strict Type Safety | ✅ PASS | Strict URL parameter typing (`UrlFilterParams`), zero `any`, zero `@ts-ignore`, 100% strict compiler check |
| III | Codebase Cleanup | ✅ PASS | Removes invalid per-row RDFa attributes from table rows; fixes invalid `<small><p>` nesting in [footerText.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/footer/footerText.tsx) |
| IV | Lightweight Dependencies | ✅ PASS | Zero new dependencies; uses native `URLSearchParams`, `window.history.replaceState`, native HTML `<details>`, static JSON-LD |
| V | Conventional Commits | ✅ PASS | Atomic commits using `feat:`, `chore:`, `test:`, and `docs:` scopes |
| VI | Git Branching Discipline | ✅ PASS | Isolated on dedicated branch `feat/seo-optimization` created from `Master` |
| VII | Zero-Assumption Clarification | ✅ PASS | 0 open `[NEEDS CLARIFICATION]` markers; all architectural and UX choices pre-approved by user |
| VIII | Research-Backed Decisions | ✅ PASS | Aligned with official `.github/skills/seo-best-practices/` guidelines, Schema.org specifications, and Core Web Vitals |
| IX | Mandatory Testing | ✅ PASS | Automated unit & integration tests for URL parameter parsing, URL sync, FAQ rendering, i18n parity, and JSON-LD schema |
| X | Reusable Scripts | ✅ PASS | Reuses existing `./scripts/check-i18n-parity.mjs`, `./scripts/check-bundle-size.mjs`, and `./scripts/verify-gates.sh` |
| XI | Semver & Deploy from Master | ✅ PASS | Schedules minor version bump `3.1.0` → `3.2.0` via `node scripts/bump-version.mjs minor`; deploy from `Master` |
| XII | SEO-Friendly Architecture | ✅ PASS | Primary goal: canonical tags, hreflang alternates, Open Graph, Twitter cards, sitemap, JSON-LD `@graph`, rich `<noscript>`, semantic landmarks |
| XIII | Visual Layout Preservation | ✅ PASS | Preserves 100% visual styling and geometry for navbar, form inputs, table rows, and modal; includes user-approved collapsible FAQ addition directly above footer |

## Project Structure

### Documentation (this feature)

```text
specs/007-seo-optimization/
├── plan.md              # Implementation plan
├── research.md          # Architectural research and decisions
├── data-model.md        # State models & data flows
├── quickstart.md        # Verification procedures
├── contracts/
│   └── seo-contracts.md # URL param, JSON-LD, metadata, and landmark contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Modifications

```text
index.html                                UPDATE (meta tags, canonical, hreflang, Open Graph, Twitter cards, JSON-LD, noscript)
public/
├── robots.txt                            UPDATE (append sitemap declaration)
├── sitemap.xml                           CREATE (XML sitemap with canonical and alternates)
└── og-image.png                          CREATE (1200x630 lightweight social share card)
src/
├── components/
│   ├── main.tsx                          UPDATE (semantic landmark hierarchy: header, main, footer siblings)
│   ├── header/
│   │   └── title.tsx                     UPDATE (clean metadata coordination, prevent duplicate meta tags)
│   ├── footer/
│   │   └── footerText.tsx                UPDATE (fix invalid <small><p> nesting)
│   ├── input/
│   │   └── inputSection.tsx              UPDATE (pre-populate from URL filters, explicit img width/height and alt)
│   ├── table/
│   │   └── tableRow.tsx                  UPDATE (remove invalid per-row RDFa attributes)
│   └── faq/
│       ├── faqSection.tsx                CREATE (collapsible bilingual O-ring sizing FAQ & guide)
│       └── index.ts                      CREATE (export FaqSection)
├── contexts/
│   └── FilterContext.tsx                 UPDATE (read URL query params on mount, sync active filters via replaceState)
├── utils/
│   ├── urlParams.ts                      CREATE (pure URL param parsing & serialization helpers)
│   └── index.ts                          UPDATE (re-export urlParams)
└── locales/
    ├── en/globals.json                   UPDATE (high-intent meta titles/descriptions, FAQ section copy)
    └── id/globals.json                   UPDATE (high-intent Indonesian meta titles/descriptions, FAQ copy)
```

## Complexity Tracking

> **No violations; zero new architectural complexity or abstractions added.**
