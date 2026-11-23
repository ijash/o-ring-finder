# Tasks: PWA & Offline-First Support

**Branch**: `feat/pwa-offline-first` | **Spec**: [specs/009-pwa-offline-first/spec.md](spec.md) | **Plan**: [specs/009-pwa-offline-first/plan.md](plan.md)

## Tasks

- [x] [T001] [P1] Install `vite-plugin-pwa@^2.0.0` as devDependency in `package.json` with pnpm (`pnpm add -D vite-plugin-pwa`).
- [x] [T002] [P1] Generate/place PWA icons `public/pwa-192x192.png` and `public/pwa-512x512.png` from existing logo asset.
- [x] [T003] [P1] Configure `VitePWA` in `vite.config.ts` with `registerType: "autoUpdate"`, Workbox caching glob patterns (`**/*.{js,css,html,ico,png,svg,json,woff2}`), `clientsClaim: true`, `skipWaiting: true`, `navigateFallbackDenylist`, and complete manifest configuration (`id`, `start_url`, `scope`, `standalone`, colors, icons).
- [x] [T004] [P1] Update `public/manifest.json` and `index.html` to align metadata, theme colors, manifest link, and apple-touch-icon links.
- [x] [T005] [P2] Add bilingual translation keys for offline status in `src/locales/en/globals.json` and `src/locales/id/globals.json`.
- [x] [T006] [P2] Create reactive `useOnlineStatus` hook with event cleanup in `src/hooks/useOnlineStatus.ts`.
- [x] [T007] [P2] Add subtle, accessible offline indicator in `src/components/footer/footerText.tsx` (preserving navbar geometry per Principle XIII).
- [x] [T008] [P2] Create unit test suite for `useOnlineStatus` hook in `src/hooks/__tests__/useOnlineStatus.test.ts`.
- [x] [T009] [P2] Create build verification test in `src/__tests__/pwaBuild.test.ts` verifying service worker generation and manifest schema.
- [x] [T010] [P3] Bump version `3.3.0` → `3.4.0` in `package.json` and update `.specify/memory/roadmap.md`.
- [x] [T011] [P3] Run `./scripts/verify-gates.sh` to confirm all 5 quality gates pass cleanly (TS check, i18n parity, Vitest suite, Vite build, bundle size <= 145 kB gzip).
