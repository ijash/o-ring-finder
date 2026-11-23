# Quickstart: PWA & Offline-First Validation Guide

**Feature**: `009-pwa-offline-first`  
**Date**: 2026-11-23

## Prerequisites

- Node.js 20+
- pnpm 9+

## Validation Steps

### 1. Install & Build Verification

```bash
# 1. Install dependencies
pnpm install

# 2. Run TypeScript check & production build
pnpm run build

# 3. Verify PWA artifacts generated in dist/
test -f dist/sw.js && echo "sw.js exists"
test -f dist/manifest.webmanifest && echo "manifest.webmanifest exists"
```

### 2. Run Automated Test Suite & Quality Gates

```bash
# Run unit and build tests
pnpm test

# Run all 5 project quality gates
./scripts/verify-gates.sh
```

### 3. Offline Verification in Browser

1. Start preview server:
   ```bash
   pnpm run preview
   ```
2. Navigate to `http://localhost:4173/o-ring-finder/`.
3. Open DevTools -> Application -> Service Workers:
   - Confirm Service Worker is registered with scope `/o-ring-finder/` and active.
4. Open DevTools -> Application -> Manifest:
   - Confirm manifest loads with `id`, `start_url`, `theme_color`, `display: standalone`, and icons.
5. In DevTools Network tab, toggle **Offline**:
   - Refresh page. Page loads completely with all static O-ring data.
   - Enter filter queries (e.g. ID `10`, OD `14`). Search results update instantly.
   - Check footer: Subtle offline badge displays indicating cached catalog mode.
