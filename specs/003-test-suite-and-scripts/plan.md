# Implementation Plan: Test Suite and Routine Automation Scripts

**Branch**: `feat/test-suite-and-scripts` | **Date**: 2026-11-23 | **Spec**: [specs/003-test-suite-and-scripts/spec.md](./spec.md)

**Input**: Feature specification from `specs/003-test-suite-and-scripts/spec.md`

## Summary

Build a comprehensive automated test suite (unit, component, integration) using Vitest, React Testing Library, and JSDOM with >= 80% coverage (75% branches) via `@vitest/coverage-v8`, alongside 5 reusable routine developer automation scripts in `./scripts/` (`verify-gates.sh`, `check-i18n-parity.mjs`, `audit-codebase.mjs`, `bump-version.mjs`, `test-coverage.sh`), strictly preserving existing UI visual geometry and scheduling a `minor` SemVer bump (`2.4.0` → `2.5.0`).

## Technical Context

- **Language/Version**: TypeScript 5.7+ / ESNext (strict mode enabled).
- **Primary Dependencies**: React 19, Vitest 5.1.1, `@testing-library/react` 16.3.3, `@vitest/coverage-v8` 5.1.1, Node.js 20+.
- **Storage**: In-memory static JSON catalogs (`src/data/*.json`).
- **Testing**: Vitest + `@testing-library/react` + `jsdom`. Coverage via `@vitest/coverage-v8`.
- **Target Platform**: Modern Evergreen Browsers / GitHub Pages static hosting.
- **Project Type**: Client-side Single Page Application (SPA).
- **Performance Goals**: Complete test suite execution < 15 seconds locally.
- **Constraints**: No visual layout/styling/geometry mutations (Principle XIII); zero production dependencies added (Principle IV).
- **Scale/Scope**: 10 unit/component/integration test suites, 5 automation scripts, 1 i18n parity fix.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Compliance Details |
| :--- | :--- | :--- |
| **I. React Best Practices** | PASS | Tests verify pure rendering, context separation, clean effect unmounts, and accessibility without adding runtime side effects. |
| **II. Strict Type Safety** | PASS | All test utilities and scripts written in strict TypeScript / Node.js ESM. Zero `any`, `@ts-ignore`, or unsafe assertions. |
| **III. Codebase Cleanup** | PASS | Cleans up lingering i18n key anomaly in `en/globals.json`, eliminates dead code, enforces zero `console.log` in app code. |
| **IV. Lightweight Dependencies** | PASS | Only devDependency `@vitest/coverage-v8` matching Vitest 5 added; no heavy browser E2E frameworks (Playwright/Cypress). `blockExoticSubdeps: true` maintained. |
| **V. Conventional Commits** | PASS | All commits adhere to `type(scope): description`. `bump-version.mjs` generates compliant commit templates. |
| **VI. Git Branching Discipline** | PASS | Isolated on dedicated `feat/test-suite-and-scripts` branch branched from `Master`. |
| **VII. Zero-Assumption Clarification** | PASS | All 3 initial ambiguities clarified and documented in `spec.md` before planning. |
| **VIII. Research-Backed Decisions** | PASS | Verified `@vitest/coverage-v8@5.1.1` compatibility with `vitest@5.1.1` via `pnpm view` and npm registry. |
| **IX. Mandatory Testing & Parity** | PASS | 100% of interactive user flows covered by automated tests; i18n parity script guarantees bilingual completeness. |
| **X. Reusable Scripts in `./scripts/`** | PASS | 5 reusable, documented scripts created in `./scripts/` with header documentation and exit-code contracts. |
| **XI. Semantic Versioning** | PASS | Scheduled `minor` bump (`2.4.0` → `2.5.0`) in `package.json`; `bump-version.mjs` explicitly rejects `major` without approval. |
| **XII. SEO-Friendly Architecture** | PASS | Tests verify semantic HTML landmarks (`<main>`, headings), metadata synchronization, and schema.org markup. |
| **XIII. Visual Layout Preservation** | PASS | NON-NEGOTIABLE: Zero CSS/SCSS or JSX layout/sizing modifications. 100% visual preservation guaranteed. |

## Project Structure

### Documentation (this feature)

```text
specs/003-test-suite-and-scripts/
├── plan.md              # Implementation plan
├── research.md          # Coverage tooling and script design
├── data-model.md        # Test state models and script CLI contracts
├── quickstart.md        # Step-by-step verification guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code & Scripts

```text
scripts/
├── audit-codebase.mjs      # Fast static check for any, ts-ignore, console.log
├── bump-version.mjs        # Safe patch/minor SemVer bumper
├── check-i18n-parity.mjs   # 100% key and value parity validator
├── test-coverage.sh        # Vitest coverage runner with threshold check
└── verify-gates.sh         # Master gate: tsc + i18n + vitest + build

src/
├── App.test.tsx                                # App-level integration test
├── components/
│   ├── common/__tests__/goatCounter.test.tsx   # Telemetry injection test
│   ├── header/__tests__/languageDropdown.test.tsx # Language switch test
│   ├── input/__tests__/inputSection.test.tsx   # Filter inputs & debounce test
│   ├── modal/__tests__/modal.test.tsx          # Modal lifecycle & popstate test
│   └── table/__tests__/tableSection.test.tsx   # Table sorting & rendering test
├── data/__tests__/oRingData.test.ts            # Dataset integrity & conversion test
├── locales/
│   ├── __tests__/i18n.test.ts                  # Localization parity & setup test
│   ├── en/globals.json                         # Fixed schema parity
│   └── id/globals.json                         # Indonesian dictionary
└── utils/__tests__/
    ├── debounce.test.ts                        # Timer debounce & cancel test
    ├── htmlUtils.test.ts                       # DOM width extraction test
    └── mathUtils.test.ts                       # Percentage remapping test
```

## Complexity Tracking

*No constitutional violations. Zero unnecessary abstractions.*

