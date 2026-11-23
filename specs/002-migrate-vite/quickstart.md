# Quickstart & Verification Guide: Vite Migration

**Feature**: `specs/002-migrate-vite/spec.md`  
**Branch**: `feat/migrate-vite`  
**Date**: 2026-11-23  

## Prerequisites

- Node.js >= 18.x
- `pnpm` >= 9.x
- Branch: `feat/migrate-vite`

## Validation Workflow

### 1. Install Dependencies
```bash
pnpm install
```
*Expected*: Lockfile `pnpm-lock.yaml` resolves cleanly with `blockExoticSubdeps: true`. No legacy packages present.

### 2. Type Check
```bash
npx tsc --noEmit
```
*Expected*: Zero TypeScript errors under strict `"strict": true`, `"noUncheckedIndexedAccess": true`.

### 3. Run Automated Tests (Vitest)
```bash
pnpm test
```
*Expected*: All tests pass under Vitest (`oRingData.test.ts` and `App.test.tsx`).

### 4. Local Development Server
```bash
pnpm run dev
```
*Expected*: Vite dev server starts in < 2 seconds at `http://localhost:5173/o-ring-finder/`. HMR triggers on file edits.

### 5. Production Build
```bash
pnpm run build
```
*Expected*: Generates optimized static assets in `dist/` with `sourcemap: false`. Output includes root `index.html` referencing hashed JS/CSS assets with `/o-ring-finder/` base path.

### 6. Production Preview
```bash
pnpm run preview
```
*Expected*: Serves `dist/` locally to verify production asset resolution, routing, and visuals.

### 7. Full Quality Gate Verification
```bash
./scripts/verify-gates.sh
```
*Expected*: Runs type-checking, Vitest suite, and production build in sequence. Exits 0 on success.
