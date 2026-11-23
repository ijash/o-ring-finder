# Technical Research: Vite Migration & Modernization

**Feature**: `specs/002-migrate-vite/spec.md`  
**Branch**: `feat/migrate-vite`  
**Date**: 2026-11-23  

## 1. Verified Dependency Versions (npm registry)

| Package | Current in Repo | Latest Stable | Role / Decision |
| :--- | :--- | :--- | :--- |
| `vite` | — | `^8.3.8` | Core build toolchain & dev server |
| `@vitejs/plugin-react` | — | `^6.3.0` | React JSX & Fast Refresh plugin for Vite |
| `vitest` | — | `^5.1.1` | Native Vite test runner (replaces `react-scripts test`) |
| `jsdom` | — | `^31.0.1` | Headless browser DOM environment for Vitest |
| `@testing-library/react` | `^13.4.0` | `^16.3.3` | React 19 compatible component testing utilities |
| `@testing-library/jest-dom` | `^5.17.0` | `^8.0.0` | DOM matcher extensions for expect assertions |
| `@testing-library/user-event` | `^13.5.0` | `^14.6.13` | Browser interaction simulation |
| `typescript` | `5.7` | `^7.0.2` | TypeScript compiler baseline |
| `sass` | `^1.83.0` | `^1.108.2` | SCSS preprocessor compiler |
| `bootstrap` | `^5.3.3` | `^5.3.9` | CSS framework |
| `@types/bootstrap` | `^5.2.10` | `^5.2.10` | Bootstrap TypeScript type definitions |
| `i18next` | `^24.2.0` | `^27.2.4` | Internationalization runtime |
| `react-i18next` | `^15.2.0` | `^18.0.3` | React bindings for i18next |
| `i18next-browser-languagedetector` | `^8.0.2` | `^8.3.1` | Browser locale auto-detection |
| `@fortawesome/react-fontawesome` | `^0.2.2` | `^3.5.0` | FontAwesome React component |
| `@fortawesome/fontawesome-svg-core` | `^6.7.2` | `^7.3.1` | FontAwesome icon core runtime |
| `@fortawesome/free-solid-svg-icons` | `^6.7.2` | `^7.3.1` | Solid icon pack (`faEraser`, `faLanguage`) |
| `@fortawesome/free-regular-svg-icons` | `^6.7.2` | `^7.3.1` | Regular icon pack (`faCircle`) |
| `gh-pages` | `^6.2.0` | `^6.3.0` | GitHub Pages deployment utility |
| `react` / `react-dom` | `^19.0.0` | `^19.0.0` | React core baseline (retained) |
| `@types/react` / `@types/react-dom` | `^19.0.2` | `^19.0.2` | React types (retained) |

## 2. Dependencies to Remove (Principles III & IV)

| Package | Reason for Removal |
| :--- | :--- |
| `react-scripts` | Deprecated CRA toolchain, replaced by Vite |
| `popper` | Accidental dependency (Bootstrap uses `@popperjs/core`) |
| `terser` | Standalone dependency unneeded; Vite uses native minifier |
| `ajv` | Legacy unreferenced validator dependency |
| `web-vitals` / `src/reportWebVitals.ts` | CRA boilerplate, uncalled in runtime |
| `lodash` / `@types/lodash` | Only 1 call (`debounce` in `inputSection.tsx`); replaced by tiny typed utility in `src/utils/debounce.ts` |
| `@types/jest` | Replaced by `vitest` globals |
| `@fortawesome/free-brands-svg-icons` | Zero usages across repository |
| `react-helmet-async` / `@types/react-helmet` | Replaced by React 19 native `<title>` and `<meta>` hoisting |

## 3. React 19 Native Document Metadata vs `react-helmet-async`

- **Finding**: In React 19, `<title>`, `<meta>`, and `<link>` components rendered anywhere in the component tree are automatically hoisted to `<head>`.
- **Decision**: Remove `react-helmet-async`, `@types/react-helmet`, and `<HelmetProvider>` / `<Helmet>` wrapper in `src/components/header/title.tsx`. Render `<title>` and `<meta>` natively inside `Title`.
- **Benefit**: Eliminates a third-party dependency, removes context overhead, and uses React 19 platform features (Principles I, IV, XII).

## 4. Vite Configuration & Path Aliases

- **Base path**: `base: "/o-ring-finder/"` for GitHub Pages.
- **Output directory**: `dist` (update `deploy` script to `gh-pages -d dist`).
- **Path aliases**: In CRA, `tsconfig.json` had `"baseUrl": "src"`. To prevent breaking non-relative imports (`components/*`, `data/*`, `locales/*`, `utils/*`, `assets/*`), configure Vite `resolve.alias`:
  ```ts
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      data: path.resolve(__dirname, "./src/data"),
      locales: path.resolve(__dirname, "./src/locales"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  }
  ```
- **Vitest configuration**: Integrated in `vite.config.ts` via `test: { globals: true, environment: "jsdom", setupFiles: "./src/setupTests.ts" }`.
