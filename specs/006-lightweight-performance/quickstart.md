# Quickstart & Verification Guide: Lightweight Performance Optimization

**Feature**: `specs/006-lightweight-performance` | **Branch**: `perf/lightweight-optimization` | **Date**: 2026-11-23

## Prerequisites
- Node.js ≥ 18
- pnpm installed
- Working branch: `perf/lightweight-optimization`

## Verification Procedures

### 1. Run Automated Test Suite
```bash
pnpm test
```
**Expected Outcome**: All 63+ tests pass cleanly with coverage above thresholds.

### 2. Verify Production Build & Bundle Budgets
```bash
pnpm run build
node ./scripts/check-bundle-size.mjs
```
**Expected Outcome**:
- TypeScript type-check passes with 0 errors.
- Vite build succeeds without chunk size warning (`index-*.js` < 300 kB).
- `check-bundle-size.mjs` exits with code 0 and reports JS and CSS both within budget.

### 3. Verify Quality Gates
```bash
./scripts/verify-gates.sh
```
**Expected Outcome**: 5/5 quality gates pass (Type check, i18n parity, test coverage, bundle budget, production build).

### 4. Interactive Behavioral Validation
Run local dev server:
```bash
pnpm run dev
```
1. **Unit Switching**:
   - Change unit from `mm` to `inch` in dropdown.
   - Confirm table values convert immediately (< 50ms) without debounce lag.
2. **Language Dropdown**:
   - Click language icon button; verify dropdown menu opens (`.show`).
   - Press `Escape` key; verify dropdown closes.
   - Click outside dropdown; verify dropdown closes.
   - Switch language; verify document language and strings update properly.
3. **Modal Dialog**:
   - Click any table row; verify modal opens with backdrop and details.
   - Verify modal chunk loaded on demand in browser DevTools Network tab.
4. **Table Performance**:
   - Rapidly type into ID/OD/CS filter inputs.
   - Verify typing remains completely fluid and table updates without stutter.
