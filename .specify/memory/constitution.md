<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.1.1 (PATCH: rewrite all sections in ASD-STE100 format; no rule changes)
- Modified principles:
  - Principles I–XIII: rewritten in ASD-STE100 Simplified Technical English (short sentences, active voice, concrete words)
- Added sections: None
- Removed sections: None
- Follow-up TODOs: None
-->

# O-Ring Finder Constitution

**Project:** [O-Ring Finder](https://github.com/ijash/o-ring-finder) (`o-ring-finder`)
**Version:** 1.1.1
**Ratified:** 2026-11-23
**Last Amended:** 2026-11-29
**Default Branch:** `Master`

This document gives the mandatory engineering rules, architecture limits, and workflow gates for **O-Ring Finder**.
**O-Ring Finder** is a client-side React and TypeScript web application.
Users use it to search, filter, sort, and inspect O-ring dimensions for AS568, JIS, and Common Metric standards.
Every specification, implementation plan, task list, and pull request MUST obey this constitution.

## Core Principles

### I. React Best Practices & Modern Component Architecture

All UI code MUST use standard, modern React patterns.
These patterns keep component output predictable, accessible, and easy to maintain.

* **Pure components:** A component MUST compute its output only from props and state. Do NOT run side effects during render. For example, initialize `i18next` one time at module startup, not inside JSX render.
* **Local state and safe context:** Keep state local when possible. Context providers (`FilterContext`, `SortProvider`) MUST memoize exposed value objects, or split state and dispatch, to stop unnecessary re-renders. Context modules MUST export a guarded custom hook (for example, `useFilter` or `useSort`). Components MUST NOT call raw `useContext`.
* **Clean effects:** Every `useEffect` MUST list all dependencies. Every `useEffect` MUST remove event listeners, timers, and added DOM nodes on unmount. Do NOT use `useEffect` for derived state that render logic or `useMemo` can compute directly.
* **Typed static data:** Store static O-ring catalogs (AS568, JIS, Common Metric) as typed TypeScript or JSON modules. Do NOT parse raw HTML strings with `document.createElement` or `innerHTML`.
* **Default accessibility (a11y):** Interactive controls (modals, dropdowns, sort headers, filter inputs) MUST support keyboard navigation, visible focus states, semantic HTML elements, and valid ARIA attributes. Users MUST be able to close modals with the `Escape` key.

### II. Strict Type Safety (NON-NEGOTIABLE)

TypeScript is a mandatory correctness gate, not an optional check.

* **Strict compiler settings:** `tsconfig.json` MUST set `"strict": true` and `"allowJs": false`. It MUST also enable `"noUncheckedIndexedAccess": true`, `"noFallthroughCasesInSwitch": true`, `"noUnusedLocals": true`, and `"noUnusedParameters": true`.
* **No type bypasses:** Do NOT use `any`, `@ts-ignore`, or `@ts-nocheck`. Do NOT use unsafe type casts such as `{} as ContextType` or unguarded `as HTMLElement`. Do NOT use non-null assertions (`!`) unless an explicit runtime check runs first.
* **Explicit domain types:** Replace magic strings (such as `"undefined"` for a `SortDirection`) with strict union types (`"asc" | "desc" | null`). Remove empty interfaces (`IGetValues {}`, `MainProps {}`). Add explicit types for all i18n keys, filter payloads, and measurement units.
* **Immutable data:** Data transforms (such as `mm` to `inch` conversion) MUST return new objects. Do NOT change shared catalog records in place with `Object.assign` or direct property writes.

### III. Codebase Cleanup & Maintainability

Every change MUST make the repository cleaner, simpler, and free of unused files.

* **Remove unused code:** Delete unused files, commented-out code, unused imports, and obsolete helpers when you find them.
* **Clear module boundaries:** Group files by responsibility (`components/`, `data/`, `hooks/`, `locales/`, `styles/`, `utils/`). Do NOT create circular barrel re-exports. Keep each component focused on one task.
* **Lint and format gates:** Enforce consistent formatting and linting on all TypeScript, TSX, and SCSS files. Remove all `console.log` calls from production code.
* **Accurate configuration:** Keep `.env.example`, `package.json` metadata (such as repository and issue URLs), and documentation aligned with the actual code.

### IV. Latest Stable, Lightweight Dependencies & Supply-Chain Security

Dependencies MUST stay current, minimal, researched, and safe.

* **Latest stable and lightweight packages:** Use the latest stable version for new and existing dependencies. Choose lightweight packages. Use native TypeScript and browser APIs instead of large utility libraries so the GitHub Pages bundle stays small.
* **Research before changes:** Before you install, upgrade, or replace a dependency, search the web for official release notes, bundle size, maintenance status, and compatibility docs.
* **Remove legacy packages and unused code:** Completely remove deprecated, unmaintained, accidental, or replaced packages (such as `react-scripts`, `@fortawesome/react-fontawesome@0.2.x`, or `popper@1.0.1`). Also remove all unused code that supported those packages. Do NOT keep them as dormant dependencies.
* **One package manager and lockfile:** Use `pnpm` as the only package manager and `pnpm-lock.yaml` as the only committed lockfile. Remove other lockfiles (`package-lock.json`, `yarn.lock`).
* **Supply-chain protection:** Keep pnpm's [`blockExoticSubdeps`](https://pnpm.io/settings/dependency-resolution) set to `true`. This blocks transitive dependencies from arbitrary git repositories or tarball URLs. Do NOT disable supply-chain checks to work around an unneeded or misnamed package.

### V. Conventional Commits v1.0.0 (NON-NEGOTIABLE)

Every commit message MUST obey the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification.

* **Format:** Use `<type>[optional scope]: <description>`. Write the subject in imperative mood, lowercase, with no period at the end.
* **Allowed types:** Use only `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
* **Breaking changes:** Mark breaking changes with `!` after the type or scope (for example, `feat!: migrate build toolchain to Vite`), or add a `BREAKING CHANGE:` footer that explains the impact.
* **One logical change per commit:** Each commit SHOULD contain one logical change that builds and passes all checks.

### VI. Git Branching Discipline

Isolate all non-trivial work on separate branches.

* **Branch per feature or fix:** Create a branch from `Master` for every new feature, bug fix, or refactor. Use one of these prefixes: `feat/<short-slug>`, `fix/<short-slug>`, `refactor/<short-slug>`, or `docs/<short-slug>`.
* **Small-chore exception:** Commit directly to `Master` ONLY for low-risk chores that do not change app behavior (for example, typo fixes, `.gitignore` updates, or minor doc and config edits).
* **Human approval for merges and releases:** AI agents MUST NOT auto-merge branches into `Master`, force-push shared history, or publish release tags without explicit user approval.

### VII. Zero-Assumption Clarification Policy (NON-NEGOTIABLE)

Clarity comes before speed.

* **Ask when unclear:** If a requirement, UX behavior, engineering formula, dependency choice, or architecture trade-off is unclear, STOP. Ask the user short, specific questions before you write specs, plans, or code.
* **Report conflicts:** If repository files conflict with each other or with a user request (for example, conflicting lockfiles, environment variable names, or license fields), report the conflict and ask the user how to proceed. Do NOT guess.

### VIII. Research-Backed Engineering Decisions

Verify external technical facts before you make decisions.

* **Verify with web search:** Before you adopt a library version, migration path, React or TypeScript API, SEO standard, or O-ring standard (AS568, JIS B 2401, ISO 3601), check official docs and authoritative sources on the web.
* **Record source URLs:** Plans and specs that use external standards, migration guides, or compatibility notes MUST list the verified source URLs.

### IX. Domain Accuracy, Bilingual Parity & Mandatory Testing (NON-NEGOTIABLE)

O-Ring Finder is a technical reference tool. Data accuracy and automated tests are mandatory release gates.

* **Tests on every change:** Every feature, bug fix, and refactor MUST include automated tests (unit, integration, or component tests). Do NOT commit or merge any change without a passing test suite. Every bug fix MUST include a regression test.
* **Accurate measurements:** Unit conversions (`1 inch = 25.4 mm`) and filter range checks (`ID`, `OD`, `CS`) MUST be deterministic, accurate, and covered by unit tests.
* **Bilingual i18n parity:** Move every user-facing string into both `src/locales/en/globals.json` and `src/locales/id/globals.json` with identical keys. Do NOT hardcode UI text inside components.

### X. Reusable Automation Scripts in `./scripts/`

Reduce repeated shell work and token usage with local helper scripts.

* **Check `./scripts/` first:** Before you run multi-step shell commands or write one-off snippets, check `./scripts/` for an existing script and reuse it.
* **Create reusable scripts:** For repeatable tasks—such as chores, code inspection, batch edits, quality checks, data validation, i18n parity checks, or test runs—create a clean script in `./scripts/`.
* **Clear names and header comments:** Give every script a descriptive filename (for example, `check-i18n-parity.mjs`, `verify-gates.sh`, `inspect-deps.mjs`). Put a short header comment at the top of the file that explains its purpose, usage, and arguments.
* **No one-time clutter:** Commit only scripts in `./scripts/` that have ongoing value. Delete one-time migration scripts after use.

### XI. Semantic Versioning & Deployment from `Master`

Releases follow Semantic Versioning and ship only from `Master`.

* **Bump version for each feature or fix:** Update the version in `package.json` for every completed feature or bug fix before deployment.
* **Agent chooses `minor` or `patch`:** The agent chooses `minor` (backward-compatible new feature) or `patch` (backward-compatible bug fix, refactor, or maintenance) based on compatibility.
* **User approves `major` bumps (NON-NEGOTIABLE):** Agents MUST NOT run a `major` version bump on their own. If a change breaks compatibility and needs a `major` release, recommend it with reasons and wait for explicit user approval.
* **Deploy from `Master`:** Deploy to GitHub Pages only from `Master` after the feature branch merges, all quality gates pass, and the version is bumped.

### XII. SEO-Friendly Architecture

Structure the application so search engines can crawl and index it accurately.

* **Semantic HTML and metadata:** Use semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, valid heading order). Keep `<title>`, `<meta name="description">`, canonical URLs, Open Graph tags, and JSON-LD structured data accurate and synchronized with the active language (`en` or `id`).
* **Crawlability and technical SEO:** Keep `robots.txt`, `manifest.json`, icon links, and `alt` attributes accurate and current.
* **Allowed SEO updates:** Agents MAY update markup, metadata, head tags, and supporting code to improve or maintain SEO, provided every change obeys Principle XIII (Visual Layout & Size Preservation).

### XIII. Visual Layout & Size Preservation (NON-NEGOTIABLE)

Keep the current visual design unless the user explicitly asks for a change.

* **Do not change layout or size:** Agents MUST NOT change page layout, component geometry, spacing, breakpoints, font scale, or element sizes unless the user explicitly asks for it.
* **Keep refactors visually identical:** Code cleanups, React refactors, dependency upgrades, accessibility fixes, and SEO updates MUST keep the exact visual appearance and dimensions.

## Technical Stack & Codebase Cleanup Baseline

| Area | Current State | Constitutional Target |
| :--- | :--- | :--- |
| Framework | React 19 + TypeScript 7 | Latest stable React and TypeScript with strict compiler flags |
| Build & Tooling | Vite 8 + modern ES target | Latest stable lightweight bundler and modern ES target |
| Package Manager | `pnpm` with `pnpm-lock.yaml` | Single `pnpm` workflow with `pnpm-lock.yaml` only |
| Data Layer | Static JSON (`as568.json`, `jis.json`, `metric.json`) | Strictly typed, immutable static JSON modules with full test coverage |
| Dependencies | Audited, lightweight packages; `blockExoticSubdeps: true` | Researched, lightweight, latest stable packages only; zero legacy deps |
| Automation | Helper scripts in `./scripts/` | Reusable, documented helper scripts in `./scripts/` |
| Styling & UI | Bootstrap 5 + SCSS | Accessible, SEO-friendly UI with identical layout and sizing |
| Localization | `i18next` + `react-i18next` (`en`, `id`) | Strictly typed keys with 100% `en`/`id` parity |
| Deployment | GitHub Pages (`gh-pages`) | Version-bumped production build deployed from `Master` |

## Development Workflow & Quality Gates

1. **Check `./scripts/` and clarify first:** Check `./scripts/` for existing scripts. Ask the user to resolve any unclear scope, UX, or technical question before you write specs or code.
2. **Research before you act:** Verify latest stable lightweight dependencies, APIs, SEO rules, and O-ring standards on the web before you finalize a plan.
3. **Use a clean branch:** Create a dedicated branch (`feat/...`, `fix/...`, `refactor/...`) from `Master` for all non-chore work.
4. **Verify before commit:** Run type-checking (`tsc --noEmit`), linting, automated tests, and a production build before you commit or open a PR. Keep layout and element sizes unchanged unless requested.
5. **Version, commit, and deploy:** Use Conventional Commits v1.0.0 for all commits. Bump `minor` or `patch` for each feature or fix, and ask approval before any `major` bump. Wait for explicit user approval before you merge to `Master` or deploy from `Master`.

## Governance

* **Rule priority:** This constitution replaces informal habits or old patterns in the codebase. Treat existing code that breaks these rules as technical debt to clean up over time.
* **Compliance checks:** Every Spec Kit plan (`plan.md`) and code review MUST check Principles I–XIII. Document and get user approval for any intentional exception.
* **Version rules:** Constitution updates follow Semantic Versioning:
  * **MAJOR:** Remove or incompatibly redefine an existing principle.
  * **MINOR:** Add a new principle or expand mandatory rules.
  * **PATCH:** Clarify text, improve wording, or fix non-semantic details.
* **Template sync:** When you amend this constitution, update the `Sync Impact Report` header and update dependent Spec Kit templates in the same change.

**Version**: 1.1.1 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-29
