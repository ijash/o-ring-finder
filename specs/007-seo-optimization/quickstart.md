# Quickstart & Verification Guide: SEO Optimization & URL Deep-Linking

**Feature**: `specs/007-seo-optimization` | **Branch**: `feat/seo-optimization` | **Date**: 2026-11-23

## Prerequisites
- Node.js ≥ 18
- pnpm installed
- Working branch: `feat/seo-optimization`

## Verification Procedures

### 1. Run Automated Test Suite
```bash
pnpm test
```
**Expected Outcome**:
- All 73+ tests pass cleanly.
- New unit/integration tests verify:
  1. `parseUrlFilters` handles valid, empty, malformed, negative, and mixed query strings.
  2. `syncFilterToUrl` serializes filter updates cleanly with `replaceState`.
  3. `FilterContext` parses query string on mount and updates URL on state change.
  4. `InputSection` pre-populates form controls from URL-initialized filter.
  5. `FaqSection` renders all 4 Q&A items and toggles open state with keyboard/click.
  6. Single meta description verified; duplicate description tag prevented.
  7. JSON-LD structured data payload in `index.html` validates as valid JSON with required Schema.org fields.

### 2. Verify Bilingual i18n Parity
```bash
node ./scripts/check-i18n-parity.mjs
```
**Expected Outcome**: All keys in `src/locales/en/globals.json` match `src/locales/id/globals.json` with 100% parity (including all new `faq.*` keys and updated `meta.*` keys).

### 3. Verify Production Build & Bundle Budgets
```bash
pnpm run build
node ./scripts/check-bundle-size.mjs
```
**Expected Outcome**:
- TypeScript strict type-check passes with 0 errors.
- Production build completes cleanly into `dist/`.
- Bundle size remains well within budget (< 300 kB JS, < 100 kB CSS).

### 4. Verify Quality Gates
```bash
./scripts/verify-gates.sh
```
**Expected Outcome**: 5/5 quality gates pass (Type check, i18n parity, test coverage, bundle budget, production build).

### 5. Interactive End-to-End Validation
Run local dev server:
```bash
pnpm run dev
```
1. **URL Deep-Linking**:
   - Navigate to `http://localhost:5173/o-ring-finder/?code=010&unit=inch`.
   - Verify unit dropdown displays `Imperial (Inch)`.
   - Verify code input contains `010`.
   - Verify table only displays rows matching code `010` in inches.
   - Modify max ID; verify address bar updates query parameter without page reload.
   - Click "Clear filter"; verify URL parameters clear while unit remains.
2. **Metadata & Head Tags**:
   - Inspect page `<head>` in DevTools Elements tab:
   - Confirm single `<title>` and single `<meta name="description">`.
   - Confirm canonical link `https://ijash.github.io/o-ring-finder/`.
   - Confirm Open Graph and Twitter card tags.
   - Confirm JSON-LD script contains `@graph` with `WebApplication`, `Dataset`, and `FAQPage`.
3. **Table RDFa Cleanup**:
   - Inspect table `<tr>` rows in DevTools Elements tab:
   - Confirm `vocab`, `typeof`, `property` attributes are completely absent.
4. **Semantic HTML & FAQ**:
   - Inspect landmarks: `<header>`, `<main>`, `<footer>` are sibling elements.
   - Verify FAQ section above footer with 4 expandable `<details>` items.
   - Switch language; verify FAQ questions and answers toggle seamlessly between English and Indonesian.
   - Verify specification diagram `<img>` has explicit width and height.
