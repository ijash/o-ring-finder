# Quickstart Validation Guide

**Branch**: `fix/code-review-compliance`  
**Purpose**: Step-by-step verification procedures for code review compliance and hygiene fixes.

## 1. Automated Quality Gates

Run all quality gates to verify clean compilation, i18n parity, test suite, and production build:

```bash
# Verify all gates in one command
./scripts/verify-gates.sh
```

Expected output:
- Type check: zero errors (`tsc --noEmit`).
- i18n parity: 100% leaf key parity between `en` and `id` catalogs.
- Test runner: 62+ tests passing.
- Vite build: clean bundle generation under `dist/`.

## 2. Script Node 18+ Compatibility Audit

Run audit scripts independently to verify portable ESM path resolution:

```bash
node scripts/audit-codebase.mjs
node scripts/check-i18n-parity.mjs
```

Expected output:
- Both scripts execute and exit with code `0`.
- Zero prohibited legacy files, `console.log` statements, or type escape hatches.

## 3. Targeted Regression Tests

Run Vitest against modified components and contexts:

```bash
pnpm test
```

Key test scenarios:
- **SortContext**: Canonical sorting by `standard`, `code`, `id`, `od`, `cs` across locales.
- **TableHead**: Keyboard interaction (`Enter`, `Space`) and `aria-sort` attributes.
- **InputSection**: Form reset without DOM queries; debounce cancellation on unmount and clear.
- **TableRowsComponent**: Unique composite key rendering without React warnings.

## 4. Visual & Layout Regression Verification

Start local dev server and inspect UI:

```bash
pnpm run dev
```

Verify:
- Navigation bar: Brand title styled with `#1375AC` color and `#54b2e9 1px 1px 0` shadow, identical visual geometry per Principle XIII.
- Language dropdown: Clean button toggle with `aria-label`.
- Table layout: Column widths and spacing unchanged.
- Modal: Ring visualization resizes smoothly without console errors or element lookup failures.
