# Research: PWA Offline-First Support

**Feature**: `009-pwa-offline-first`  
**Date**: 2026-11-23

## Research Questions & Findings

### 1. PWA Tooling: `vite-plugin-pwa` vs `workbox-build` custom hook

- **Context**: Project uses Vite 8 (`^8.3.8`). Constitution Principle IV mandates researched, lightweight dependencies with zero legacy dead code and strict bundle size control (`<= 145 kB` gzip).
- **Investigation**: Evaluated `vite-plugin-pwa@2.0.0` package metadata via `pnpm info vite-plugin-pwa`. Peer dependency explicitly supports `"vite": "^3.1.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"`.
- **Decision**: Adopt `vite-plugin-pwa` (devDependency only).
- **Configuration**:
  - `registerType: "autoUpdate"`: seamless prompt-free service worker update.
  - `workbox.clientsClaim: true`, `workbox.skipWaiting: true`: immediate control of open clients upon update.
  - `workbox.globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"]`: precaches entire app bundle, O-ring JSON catalogs, fonts, and assets.
  - `workbox.navigateFallbackDenylist: [/^\/o-ring-finder\/google[a-z0-9]+\.html$/]`: prevents service worker intercepting Google verification page.
  - `injectRegister: "auto"` or script tag: emits lightweight registration script without runtime bundle bloat.
- **Alternatives Considered**:
  - Manual `workbox-build` in Vite `closeBundle`: Works but requires maintaining custom SW generation script and manual manifest bundling. `vite-plugin-pwa` is the official community standard for Vite and supports Vite 8 natively as a devDependency without adding runtime bundle weight.

### 2. Manifest Configuration & Standard Compliance

- **Context**: Android Chrome and desktop installability require full manifest specification (`id`, `start_url`, `scope`, `display: standalone`, valid icons).
- **Decision**: Configure manifest directly in `vite-plugin-pwa` with:
  - `id: "/o-ring-finder/"`
  - `name: "O-Ring Size Chart & Finder"`
  - `short_name: "O-Ring Finder"`
  - `start_url: "/o-ring-finder/"`
  - `scope: "/o-ring-finder/"`
  - `display: "standalone"`
  - `theme_color: "#0f172a"`
  - `background_color: "#0f172a"`
  - `icons`:
    - `192x192` PNG icon (`purpose: "any"`)
    - `512x512` PNG icon (`purpose: "any"`)
    - `512x512` PNG icon (`purpose: "maskable"`)
    - `favicon.ico` for legacy browser fallbacks.

### 3. Non-Intrusive Offline Status Indicator

- **Context**: Principle XIII strictly forbids changing navbar layout, spacing, or height. Principle IX requires bilingual parity (`en`/`id`).
- **Decision**:
  - Implement a clean React hook `useOnlineStatus()` using browser `navigator.onLine` and `online`/`offline` window events.
  - Mount an unobtrusive indicator inside `src/components/footer/footerText.tsx`.
  - When offline, displays a subtle badge: "Working Offline" (`en`) / "Mode Luring" (`id`).
  - When online, renders nothing (0 DOM footprint, 0 layout shifts, preserves all navbar geometry).
- **Alternatives Considered**:
  - Navbar badge or toast: Rejected because altering navbar geometry violates Principle XIII, and toasts add extra CSS/JS weight.

### 4. Automated Testing Strategy

- **Decision**:
  - Unit test `src/hooks/__tests__/useOnlineStatus.test.ts` testing online/offline event transitions with clean listener cleanup.
  - Build validation test `src/__tests__/pwaBuild.test.ts` that verifies `dist/sw.js` and `dist/manifest.webmanifest` exist with valid PWA manifest fields after production build.
  - Parity check in `scripts/check-i18n-parity.mjs` covering new keys in `src/locales/en/globals.json` and `src/locales/id/globals.json`.
