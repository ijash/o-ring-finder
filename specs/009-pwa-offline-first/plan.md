# Implementation Plan: PWA & Offline-First Support

**Branch**: `feat/pwa-offline-first` | **Date**: 2026-11-23 | **Spec**: [specs/009-pwa-offline-first/spec.md](spec.md)

**Input**: Feature specification from `specs/009-pwa-offline-first/spec.md`

## Summary

Enable full offline-first Progressive Web App (PWA) functionality for O-Ring Finder using `vite-plugin-pwa` with Workbox `generateSW` strategy. Precache all HTML/JS/CSS/JSON catalog assets to allow 100% offline usage (search, filtering, conversion, modal) on desktop and Android. Provide a W3C-compliant Web App Manifest with standalone display and maskable icons. Add a non-intrusive bilingual (`en`/`id`) offline status indicator in the footer preserving all navbar geometry per Principle XIII. Keep production JS gzip bundle `<= 145 kB` and pass all 5 gates.

## Technical Context

**Language/Version**: TypeScript 5.7+ / 7.0+ (strict baseline)  
**Primary Dependencies**: React 19, Vite 8, `vite-plugin-pwa@2.0.0` (devDependency)  
**Storage**: Browser Cache API / Service Worker Cache Storage  
**Testing**: Vitest 5 (`v8` coverage), `@testing-library/react`  
**Target Platform**: Evergreen mobile & desktop web browsers (Chrome, Edge, Firefox, Safari iOS 16.4+, Android Chrome)  
**Project Type**: Client-side static single-page application (GitHub Pages)  
**Performance Goals**: Production JS bundle `<= 145 kB` gzip (current: 130.18 kB); 0 px Cumulative Layout Shift (CLS 0) on navbar/footer  
**Constraints**: Zero navbar alterations (Principle XIII); 100% EN/ID translation parity (Principle IX); strict Conventional Commits (Principle V)  
**Scale/Scope**: 3,822 static O-ring records in catalog; 1 new hook, 1 footer component update, 2 test suites  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (React Best Practices & Modern Component Architecture)**: PASS. `useOnlineStatus` hook encapsulates event subscription with clean unmount cleanup; no side effects during render.
- **Principle II (Strict Type Safety)**: PASS. Strict TypeScript types for manifest, hook return, and PWA options. No `any` or `@ts-ignore`.
- **Principle III (Codebase Cleanup & Maintainability)**: PASS. Clean file additions, no leftover dead files or ad-hoc scripts.
- **Principle IV (Latest Stable, Lightweight Dependencies & Supply-Chain Security)**: PASS. Researched `vite-plugin-pwa@2.0.0` explicitly supporting Vite 8 as a devDependency with 0 main-bundle runtime weight.
- **Principle V (Conventional Commits v1.0.0)**: PASS. Commits use `feat(pwa): ...`, `test(pwa): ...`, `chore(version): ...`.
- **Principle VI (Git Branching Discipline)**: PASS. Isolated on `feat/pwa-offline-first`.
- **Principle VII (Zero-Assumption Clarification Policy)**: PASS. Specific user requirements incorporated directly.
- **Principle VIII (Research-Backed Engineering Decisions)**: PASS. Verified Vite 8 peer compatibility and Workbox options.
- **Principle IX (Domain Accuracy, Bilingual Parity & Mandatory Testing)**: PASS. Added keys to both `en` and `id` dictionaries; added automated unit & build test suites.
- **Principle X (Reusable Automation Scripts in ./scripts/)**: PASS. Reuses `./scripts/verify-gates.sh` and `./scripts/check-bundle-size.mjs`.
- **Principle XI (Semantic Versioning & Deployment from Master)**: PASS. Scheduled `minor` bump `3.3.0` → `3.4.0`.
- **Principle XII (SEO-Friendly Architecture)**: PASS. Manifest links in `index.html` with canonical scopes.
- **Principle XIII (Visual Layout & Size Preservation)**: PASS. Placed offline badge in footer text; 0 px changes to navbar geometry or layout.

## Project Structure

### Documentation (this feature)

```text
specs/009-pwa-offline-first/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── pwa-manifest-sw-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output
```

### Source Code Layout

```text
public/
├── favicon.ico
├── oring-logo.png
├── pwa-192x192.png       # Standard app icon
└── pwa-512x512.png       # High-res & maskable app icon

src/
├── components/
│   └── footer/
│       └── footerText.tsx    # Incorporates subtle bilingual offline indicator
├── hooks/
│   ├── useOnlineStatus.ts    # Reactive network online/offline hook
│   └── __tests__/
│       └── useOnlineStatus.test.ts # Hook unit tests
├── locales/
│   ├── en/globals.json       # Added footer.offlineStatus / onlineStatus keys
│   └── id/globals.json       # Added footer.offlineStatus / onlineStatus keys
└── __tests__/
    └── pwaBuild.test.ts      # Verifies sw.js and manifest in production build

vite.config.ts                # Configured with VitePWA plugin
package.json                  # devDependency vite-plugin-pwa, version 3.4.0
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No constitutional violations. Design is minimal, standard, and zero-runtime-overhead.)*
