# Implementation Plan: Dark and Light Theme Mode

**Branch**: `feat/dark-light-theme` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md) in [specs/008-dark-light-theme/](./)

## Summary

- **Theme State Management**: Add [ThemeContext.tsx](/home/ijash/Documents/repos/o-ring-finder/src/contexts/ThemeContext.tsx) (`useTheme` custom hook) with memoized context value, `localStorage` persistence under key `oring_theme`, and OS `prefers-color-scheme` fallback.
- **Anti-FOUC Inline Script**: Embed synchronous pre-paint `<script>` in `<head>` of [index.html](/home/ijash/Documents/repos/o-ring-finder/index.html) to apply `data-bs-theme` on `<html>` and sync `<meta name="theme-color">` before DOM render.
- **Accessible Navbar Toggle**: Create `ThemeToggle` in [src/components/header/themeToggle.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/header/themeToggle.tsx) using zero-dependency inline SVG icons (`IconSun`, `IconMoon` in [icons.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/common/icons.tsx)), bilingual `en`/`id` labels and `aria-label`, placed adjacent to language selector in [navBar.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/header/navBar.tsx).
- **Bootstrap 5.3 Color Modes & SCSS Adjustments**: Apply Bootstrap 5.3 `data-bs-theme="dark"` styling across navbar, form controls, table ([tableHead.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/table/tableHead.tsx), [tableRow.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/table/tableRow.tsx)), detail modal ([modalContent.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/modal/modalContent.tsx)), FAQ section ([faqSection.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/faq/faqSection.tsx)), and footer. Update [src/css/](/home/ijash/Documents/repos/o-ring-finder/src/css) for dark mode hover and contrast.
- **3D O-Ring SVG Upgrade**: Upgrade [visualization.tsx](/home/ijash/Documents/repos/o-ring-finder/src/components/modal/visualization.tsx) to theme-aware realistic 3D toroidal SVG with subtle dot-grid backdrop, ambient glow, and high-contrast dimension lines/text while preserving exact container dimensions.
- **SemVer & Quality Gates**: Schedule `minor` version bump `3.2.0` → `3.3.0` (Principle XI); verify zero new runtime dependencies (Principle IV), 100% i18n parity in `en`/`id` (Principle IX), strict visual layout preservation (Principle XIII), and 5/5 quality gates in `./scripts/verify-gates.sh`.

## Technical Context

- **Language/Version**: TypeScript 5.7+ (`tsconfig.json` strict mode baseline)
- **Primary Dependencies**: React 19, react-dom 19, i18next, react-i18next, Bootstrap 5.3 (selective SCSS), Vite 8, Vitest 5, Sass
- **Storage**: `localStorage` (`oring_theme`: `"light" | "dark"`)
- **Testing**: Vitest 5 + jsdom + testing-library/react; 95 baseline tests, ≥ 95% coverage
- **Target Platform**: Modern desktop and mobile web browsers (GitHub Pages)
- **Project Type**: Client-side single-page application (SPA)
- **Performance Goals**: Zero FOUC on initial cold paint; instant toggle (< 50ms); bundle size within existing budget
- **Constraints**: 100% visual layout, spacing, and geometry preservation (Principle XIII); zero new runtime dependencies (Principle IV); zero type escape hatches (Principle II)
- **Scale/Scope**: ~8 existing files modified, 2 new source files (`ThemeContext.tsx`, `themeToggle.tsx`), 0 new npm packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | React Best Practices | ✅ PASS | Pure components; memoized `ThemeContext` value; guarded `useTheme` hook; effect cleanup for media query listener; keyboard accessible toggle |
| II | Strict Type Safety | ✅ PASS | Strict `Theme = "light" | "dark"` union type; zero `any`, zero `@ts-ignore`; non-null assertions guarded |
| III | Codebase Cleanup | ✅ PASS | Reuses existing icons module; removes hardcoded light-mode background assumptions cleanly without dead code |
| IV | Lightweight Dependencies | ✅ PASS | Zero new runtime dependencies; uses native inline SVGs, native `matchMedia`, native `localStorage`, Bootstrap 5.3 color mode |
| V | Conventional Commits | ✅ PASS | Atomic commits using `feat:`, `chore:`, `test:`, and `docs:` scopes |
| VI | Git Branching Discipline | ✅ PASS | Dedicated feature branch `feat/dark-light-theme` created from `Master` |
| VII | Zero-Assumption Clarification | ✅ PASS | All clarifications resolved (2-way toggle, upgraded 3D SVG visualization) |
| VIII | Research-Backed Decisions | ✅ PASS | Aligned with Bootstrap 5.3 color modes documentation and W3C anti-FOUC patterns |
| IX | Mandatory Testing | ✅ PASS | Automated unit tests for `ThemeContext`, `ThemeToggle`, `RingVisualization`, and 100% i18n parity check |
| X | Reusable Scripts | ✅ PASS | Reuses `./scripts/verify-gates.sh`, `./scripts/check-i18n-parity.mjs`, `./scripts/check-bundle-size.mjs` |
| XI | Semver & Deploy from Master | ✅ PASS | Schedules minor version bump `3.2.0` → `3.3.0` via `node scripts/bump-version.mjs minor`; deploy from `Master` |
| XII | SEO-Friendly Architecture | ✅ PASS | Synchronizes `<meta name="theme-color">` dynamically; preserves all semantic landmarks and structured data |
| XIII | Visual Layout Preservation | ✅ PASS | Colors and contrast only; zero geometry shift, zero sizing alteration on navbar, inputs, table, modal, or FAQ |

## Project Structure

### Documentation (this feature)

```text
specs/008-dark-light-theme/
├── plan.md              # Implementation plan
├── research.md          # Architectural research and decisions
├── data-model.md        # State models, DOM tokens, and color mappings
├── quickstart.md        # Verification procedures & test checklist
├── contracts/
│   └── theme-contracts.md # Context, DOM, i18n, and component contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Modifications

```text
index.html                                UPDATE (anti-FOUC pre-paint script, dynamic theme-color meta tag)
src/
├── contexts/
│   ├── ThemeContext.tsx                  CREATE (ThemeContext, ThemeProvider, useTheme hook)
│   ├── __tests__/
│   │   └── ThemeContext.test.tsx         CREATE (unit tests for theme state, persistence, and fallback)
│   └── index.ts                          UPDATE (export ThemeContext, ThemeProvider, useTheme, Theme)
├── components/
│   ├── common/
│   │   ├── icons.tsx                     UPDATE (add IconSun, IconMoon inline SVGs)
│   │   └── index.ts                      UPDATE (re-export IconSun, IconMoon)
│   ├── header/
│   │   ├── themeToggle.tsx               CREATE (accessible ThemeToggle button with Sun/Moon icons)
│   │   ├── __tests__/
│   │   │   └── themeToggle.test.tsx      CREATE (unit tests for theme toggle button)
│   │   ├── navBar.tsx                    UPDATE (embed ThemeToggle adjacent to LanguageDropdown)
│   │   └── index.ts                      UPDATE (re-export ThemeToggle)
│   ├── modal/
│   │   ├── visualization.tsx             UPDATE (upgrade to theme-aware 3D toroidal SVG + dot-grid)
│   │   └── modalContent.tsx              UPDATE (dark-mode styling adaptation for attribute table)
│   ├── table/
│   │   ├── tableHead.tsx                 UPDATE (high-contrast header styling in dark mode)
│   │   └── tableRow.tsx                  UPDATE (hover background adjustment for dark mode)
│   ├── input/
│   │   └── inputSection.tsx              UPDATE (clean focus and contrast in dark mode)
│   └── main.tsx                          UPDATE (wrap with ThemeProvider)
├── css/
│   └── _custom.scss                      UPDATE (dark mode hover overrides, dot grid styles)
└── locales/
    ├── en/globals.json                   UPDATE (theme toggle i18n strings)
    └── id/globals.json                   UPDATE (theme toggle i18n strings)
```

## Planned Phases

- **Phase 0 (Research & Decisions)**: Complete (`research.md` resolved).
- **Phase 1 (Design & Contracts)**: Complete (`data-model.md`, `contracts/theme-contracts.md`, `quickstart.md` generated).
- **Phase 2 (Tasks & Implementation)**: Task generation via `/speckit-tasks` to implement foundational context, anti-FOUC script, UI components, styling, SVG upgrade, automated tests, and quality gate verification.
