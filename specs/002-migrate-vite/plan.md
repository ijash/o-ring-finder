# Implementation Plan: Modernize Tech Stack with Vite and Latest Dependencies

**Branch**: `feat/migrate-vite` | **Date**: 2026-11-23 | **Spec**: [specs/002-migrate-vite/spec.md](spec.md)

**Input**: Feature specification from `specs/002-migrate-vite/spec.md`

## Summary

Migrate O-Ring Finder from deprecated Create React App (`react-scripts` 5.0.1) to Vite (`^8.3.8`) with `@vitejs/plugin-react` (`^6.3.0`) and Vitest (`^5.1.1`). Consolidate HTML entry into root `index.html`, migrate environment variables to `import.meta.env`, upgrade all dependencies to latest stable lightweight versions, purge legacy scaffolding (`react-scripts`, `popper`, `lodash`, `terser`, `ajv`, `web-vitals`, `react-helmet-async`, competing lockfiles, stray `package.json` files), replace `lodash` debounce with a tiny typed utility in `src/utils/debounce.ts`, leverage React 19 native document metadata hoisting, create `./scripts/verify-gates.sh`, and preserve 100% visual layout and size fidelity per Constitution v1.1.0 (Principles I–XIII).

## Technical Context

- **Language/Version**: TypeScript ^7.0.2, Node.js >= 18
- **Primary Dependencies**: React ^19.0.0, Vite ^8.3.8, @vitejs/plugin-react ^6.3.0, Bootstrap ^5.3.9, Sass ^1.108.2, i18next ^27.2.4, react-i18next ^18.0.3, @fortawesome/react-fontawesome ^3.5.0
- **Build & Dev Toolchain**: Vite with ESM, modern ES2022 target, `base: "/o-ring-finder/"`, `sourcemap: false`, native minifier
- **Testing**: Vitest ^5.1.1 + jsdom ^31.0.1 + @testing-library/react ^16.3.3 + @testing-library/jest-dom ^8.0.0
- **Target Platform**: Client-side SPA hosted on GitHub Pages (`gh-pages` deployment from `dist`)
- **Performance Goals**: Dev server cold start < 2s, HMR update < 200ms, production build < 15s
- **Constraints**: 100% visual layout/size preservation (Principle XIII), strict typing with zero `any` (Principle II), SEO metadata parity (Principle XII), clean single `pnpm` workflow with `blockExoticSubdeps: true` (Principle IV)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance Analysis / Status |
| :--- | :--- | :--- |
| **I. React Best Practices** | Functional components, pure rendering, React 19 native metadata | **PASS**: Replaces `react-helmet-async` with React 19 native `<title>` and `<meta>` hoisting; pure rendering preserved. |
| **II. Strict Type Safety** | Strict compiler baseline, zero `any`, zero unsafe casts | **PASS**: `tsconfig.json` updated to `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, typed `ImportMetaEnv`. |
| **III. Codebase Cleanup** | Remove dead/deprecated files, clean module boundaries | **PASS**: Purges `README.old.md`, `public/index.html`, `src/reportWebVitals.ts`, `src/components/package.json`, `src/utils/package.json`, competing lockfiles. |
| **IV. Dependencies & Security** | Latest stable lightweight dependencies, single `pnpm` workflow | **PASS**: Removes `react-scripts`, `popper`, `terser`, `ajv`, `web-vitals`, `lodash`, unused `@fortawesome/free-brands-svg-icons`. Researched latest stable versions in `research.md`. |
| **V. Conventional Commits** | Conventional Commits v1.0.0 | **PASS**: All commits will follow `feat(build): ...`, `refactor(deps): ...`, `test(vite): ...`, or `chore(cleanup): ...`. |
| **VI. Git Discipline** | Dedicated feature branch, human-gated merges/pushes | **PASS**: Operating on isolated `feat/migrate-vite` branch created from `Master`. |
| **VII. Zero-Assumption** | No guessing on ambiguities; clarify with user | **PASS**: All 3 spec clarifications resolved via `/speckit-clarify` (Vitest, native minifier, full cleanup). |
| **VIII. Research-Backed** | Verify via official docs / web search | **PASS**: Package versions and React 19 metadata capabilities researched and documented in `research.md`. |
| **IX. Domain Accuracy & Tests** | Measurement precision, mandatory testing, bilingual parity | **PASS**: Test suite migrated to Vitest; `oRingData.test.ts` and `App.test.tsx` verify domain precision and rendering; i18n parity maintained. |
| **X. Reusable Scripts** | Reusable helper scripts in `./scripts/` with usage header | **PASS**: Introduces `./scripts/verify-gates.sh` running typecheck, test, and build. |
| **XI. SemVer & Deployment** | Version bump per feature, deploy from `Master` only | **PASS**: Minor version bump (`2.3.6` → `2.4.0`) scheduled for build toolchain upgrade before `Master` merge. |
| **XII. SEO-Friendly** | Semantic HTML, metadata, canonical URLs, crawler access | **PASS**: Consolidates all SEO meta tags, favicon, manifest, and robots.txt in root `index.html` with correct base path. |
| **XIII. Layout Preservation** | 100% visual layout, geometry, and styling preservation | **PASS**: Zero styling, geometry, or layout changes. Bootstrap and SCSS compile identically. |

**Gate Result**: All 13 Principles PASS.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-migrate-vite/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Dependency research and technical decisions
├── quickstart.md        # Run and verification workflow guide
└── checklists/
    └── requirements.md  # Spec quality checklist (16/16 passing)
```

### Source Code Changes

```text
# Root configuration & entry files
├── vite.config.ts                    # [NEW] Vite + Vitest config with path aliases and base URL
├── index.html                        # [NEW/MODIFY] Root Vite entry HTML with consolidated SEO meta
├── tsconfig.json                     # [MODIFY] Modern ES2022 target, bundler resolution, strict flags
├── package.json                      # [MODIFY] Updated dependencies, Vite/Vitest scripts, metadata
├── pnpm-lock.yaml                    # [MODIFY] Single clean lockfile
├── .env.example                      # [MODIFY] VITE_GOAT_COUNTER_ID format
├── README.old.md                     # [DELETE] Legacy documentation
├── package-lock.json                 # [DELETE] Legacy npm lockfile
├── yarn.lock                         # [DELETE] Legacy yarn lockfile
# Source directory
├── src/
│   ├── vite-env.d.ts                 # [NEW] Vite client types and typed ImportMetaEnv
│   ├── react-app-env.d.ts            # [DELETE] Legacy CRA types
│   ├── reportWebVitals.ts            # [DELETE] Legacy CRA web vitals boilerplate
│   ├── setupTests.ts                 # [MODIFY] Vitest @testing-library/jest-dom setup
│   ├── App.test.tsx                  # [MODIFY] Component smoke test under Vitest
│   ├── utils/
│   │   ├── debounce.ts               # [NEW] Lightweight typed debounce replacing lodash
│   │   └── package.json              # [DELETE] Stray sub-directory package.json
│   ├── components/
│   │   ├── package.json              # [DELETE] Stray sub-directory package.json
│   │   ├── common/
│   │   │   └── goatCounter.tsx       # [MODIFY] import.meta.env.VITE_GOAT_COUNTER_ID
│   │   ├── header/
│   │   │   └── title.tsx             # [MODIFY] React 19 native <title> and <meta> tags
│   │   └── input/
│   │       └── inputSection.tsx      # [MODIFY] Import debounce from utils/debounce
# Automation
└── scripts/
    └── verify-gates.sh               # [NEW] Reusable gate verification script
```

---

## Phases & Execution Strategy

### Phase 1: Toolchain & Configuration Setup
1. Create `vite.config.ts`:
   - Plugins: `@vitejs/plugin-react`
   - `base`: `"/o-ring-finder/"`
   - `build`: `{ outDir: "dist", sourcemap: false }`
   - `resolve.alias`: mapping `assets`, `components`, `data`, `locales`, `utils` to `./src/*`
   - `test`: `{ globals: true, environment: "jsdom", setupFiles: "./src/setupTests.ts" }`
2. Update `tsconfig.json`:
   - `"target": "ES2022"`, `"moduleResolution": "bundler"`, `"allowJs": false`
   - Strict baseline: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`
   - `"types": ["vitest/globals"]`
3. Add `src/vite-env.d.ts` with `/// <reference types="vite/client" />` and interface `ImportMetaEnv`. Delete `src/react-app-env.d.ts`.

### Phase 2: HTML Entry, Environment Variables & SEO Migration
1. Move/consolidate all `<head>` metadata from `public/index.html` into root `index.html`.
2. Add `<script type="module" src="/src/index.tsx"></script>` before `</body>`.
3. Replace `%PUBLIC_URL%` with relative paths or base URL references.
4. Delete `public/index.html` (preserve favicon, manifest, robots.txt, logo in `public/`).
5. Update `src/components/common/goatCounter.tsx` to read `import.meta.env.VITE_GOAT_COUNTER_ID`.
6. Update `.env.example` with `VITE_GOAT_COUNTER_ID`.

### Phase 3: Dependency Audit, Legacy Purge & Native React 19 Metadata
1. Create `src/utils/debounce.ts` (lightweight typed debounce).
2. Update `src/components/input/inputSection.tsx` to use `debounce` from `utils`.
3. Update `src/components/header/title.tsx` to use React 19 native `<title>` and `<meta>` (remove `react-helmet-async`).
4. Update `package.json`:
   - Remove: `react-scripts`, `popper`, `terser`, `ajv`, `web-vitals`, `lodash`, `@types/lodash`, `@types/jest`, `react-helmet-async`, `@types/react-helmet`, `@fortawesome/free-brands-svg-icons`.
   - Add/Update: `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `bootstrap`, `sass`, `i18next`, `react-i18next`, `gh-pages`.
   - Update scripts: `"dev": "vite"`, `"build": "tsc --noEmit && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`, `"deploy": "pnpm run build && gh-pages -d dist"`.
   - Fix `bugs.url` in `package.json`.
5. Remove dead files: `src/reportWebVitals.ts`, `README.old.md`, `package-lock.json`, `yarn.lock`, `src/components/package.json`, `src/utils/package.json`.
6. Regenerate `pnpm-lock.yaml` via `pnpm install`.

### Phase 4: Test Suite & Automation Helper
1. Configure `src/setupTests.ts` with `@testing-library/jest-dom/vitest` (or `@testing-library/jest-dom`).
2. Update `src/App.test.tsx` to render `<App />` and assert core elements render cleanly.
3. Verify `src/data/__tests__/oRingData.test.ts` executes and passes under Vitest.
4. Create `./scripts/verify-gates.sh` (executable, documented with usage comment).

### Phase 5: Verification & Version Bump
1. Run `./scripts/verify-gates.sh` (typecheck, tests, production build).
2. Verify visual appearance and layout match baseline via `pnpm run preview`.
3. Bump version in `package.json` to `2.4.0` (`minor` bump for build toolchain modernization).

