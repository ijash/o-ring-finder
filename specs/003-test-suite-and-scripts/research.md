# Research: Test Suite and Routine Automation Scripts

## 1. Coverage Tooling & Configuration

- **Decision**: Install `@vitest/coverage-v8@^5.1.1` as devDependency to match installed `vitest@5.1.1`.
- **Rationale**:
  - Native V8 AST-based code coverage runner built directly into Vitest ecosystem.
  - Zero Babel instrumentation overhead; extremely fast on local runs.
  - Configurable directly in `vite.config.ts` under `test.coverage`.
- **Coverage Configuration**:
  ```ts
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"],
    include: ["src/**/*.{ts,tsx}"],
    exclude: [
      "src/**/*.test.{ts,tsx}",
      "src/@types/**",
      "src/vite-env.d.ts",
      "src/setupTests.ts",
      "src/index.tsx"
    ],
    thresholds: {
      statements: 80,
      lines: 80,
      functions: 80,
      branches: 75,
    },
  }
  ```

## 2. Test Architecture & Scope

- **Decision**: Scope test suite strictly to Vitest + `@testing-library/react` + `jsdom`. No Playwright/Cypress.
- **Rationale**:
  - Respects Constitution Principle IV (lightweight dependencies, no heavy E2E browser binaries).
  - JSDOM environment provides sufficient DOM manipulation, event handling, and history APIs (`window.history.pushState`, `popstate`).
- **Test File Map**:
  - `src/utils/__tests__/mathUtils.test.ts`: test `remapPercent`.
  - `src/utils/__tests__/debounce.test.ts`: test timer debounce invocation and `cancel()`.
  - `src/utils/__tests__/htmlUtils.test.ts`: test `getElementWidth` with normal and full widths, error throwing on missing ID.
  - `src/locales/__tests__/i18n.test.ts`: test `en` and `id` dictionary parity, initialization, language switching.
  - `src/components/common/__tests__/goatCounter.test.tsx`: test script injection when `VITE_GOAT_COUNTER_ID` present vs omitted.
  - `src/components/header/__tests__/languageDropdown.test.tsx`: test dropdown rendering, language selection, `document.documentElement.lang` update.
  - `src/components/input/__tests__/inputSection.test.tsx`: test numeric inputs, code input, unit dropdown, clear button, debounce timing.
  - `src/components/table/__tests__/tableSection.test.tsx`: test table caption, header rendering, row click modal trigger, column sorting asc/desc/reset.
  - `src/components/modal/__tests__/modal.test.tsx`: test modal visibility, dimensions calculation, back-button popstate listener, product search links.
  - `src/App.test.tsx`: integration test verifying full search, filter, and table workflow.

## 3. Routine Automation Scripts Manifest

- **Decision**: Provide 5 standalone, executable scripts under root `./scripts/`:
  1. `scripts/verify-gates.sh`: Enhanced shell gate running `tsc --noEmit`, `node scripts/check-i18n-parity.mjs`, `pnpm test`, and `pnpm run build`.
  2. `scripts/check-i18n-parity.mjs`: Pure Node.js ESM script reading `src/locales/en/globals.json` and `src/locales/id/globals.json`, validating bidirectional key parity, type match, and non-empty string values. Fixes discovered legacy nesting anomalies.
  3. `scripts/audit-codebase.mjs`: Fast AST / regex scanner checking for explicit `any`, `@ts-ignore`, `@ts-expect-error`, `console.log`, and legacy artifact files.
  4. `scripts/bump-version.mjs`: Node.js ESM script supporting `patch` and `minor` arguments, rejecting `major` per Principle XI, bumping `package.json`, and outputting Conventional Commit template.
  5. `scripts/test-coverage.sh`: Shell script running `vitest run --coverage` and displaying a clean summary table.
- **Header Convention**:
  - Every script includes header comment block detailing purpose, usage examples, arguments, and exit codes.
  - Scripts exit with code 0 on success, non-zero on failure.

## 4. Semantic Versioning

- **Decision**: Bump version `minor` from `2.4.0` to `2.5.0`.
- **Rationale**:
  - Adds backward-compatible new feature (complete test suite and routine developer scripts) matching Constitution Principle XI.
