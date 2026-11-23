&lt;!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0 (MINOR: added principles and materially expanded mandatory rules)
- Modified principles:
  - Principle IV (Latest Stable Dependencies &amp; Supply-Chain Security): added mandatory lightweight preference, pre-apply web research, and mandatory removal of all legacy dependencies and irrelevant code
  - Principle IX (Domain Accuracy, Bilingual Parity &amp; Mandatory Testing): elevated automated testing to a NON-NEGOTIABLE gate for every change
- Added principles:
  - Principle X (Reusable Automation Scripts in ./scripts/)
  - Principle XI (Semantic Versioning &amp; Deployment from Master)
  - Principle XII (SEO-Friendly Architecture)
  - Principle XIII (Visual Layout &amp; Size Preservation — NON-NEGOTIABLE)
- Updated sections: Development Workflow &amp; Quality Gates, Constitution Check scope (Principles I–XIII)
- Follow-up templates to align: .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
--&gt;

# O-Ring Finder Constitution

**Project:** [O-Ring Finder](https://github.com/ijash/o-ring-finder) (`o-ring-finder`)  
**Version:** 1.1.0  
**Ratified:** 2026-11-23  
**Last Amended:** 2026-11-23  
**Default Branch:** `Master`

This constitution defines the non-negotiable engineering principles, architectural guardrails, and workflow rules for **O-Ring Finder**—a client-side React + TypeScript web application for searching, filtering, sorting, and inspecting O-ring dimensions across AS568, JIS, and Common Metric standards. Every specification, implementation plan, task list, and pull request MUST comply with this document.

## Core Principles

### I. React Best Practices & Modern Component Architecture

All UI code MUST follow idiomatic, modern React patterns that keep rendering predictable, accessible, and maintainable:

* **Functional components and pure rendering:** Components MUST be pure functions of props and state. Side effects MUST NOT run during render (e.g., `i18next` initialization MUST happen once at module startup, not inside JSX render).
* **Disciplined state and context:** Keep state as local as possible. Context providers (`FilterContext`, `SortProvider`) MUST memoize their exposed value objects (or split state/dispatch) to prevent cascading re-renders, and MUST expose a guarded custom hook (e.g., `useFilter`, `useSort`) rather than raw `useContext` calls.
* **Effect hygiene:** Every `useEffect` MUST declare complete dependencies and clean up all event listeners, timers, and injected DOM nodes on unmount. Avoid `useEffect` for derived state that can be computed during render or via `useMemo`.
* **No runtime DOM/HTML parsing for static data:** Static O-ring catalogs (AS568, JIS, Common Metric) MUST be stored and imported as typed TypeScript/JSON structures rather than parsed from raw HTML strings via `document.createElement` and `innerHTML`.
* **Accessibility (a11y) by default:** Interactive elements (modals, dropdowns, sort headers, filter inputs) MUST support keyboard navigation (including `Escape` to close modals), visible focus states, semantic HTML elements, and valid ARIA attributes.

### II. Strict Type Safety (NON-NEGOTIABLE)

TypeScript is a hard correctness gate, not an optional annotation layer:

* **Strict compiler baseline:** `tsconfig.json` MUST keep `"strict": true` and enforce `"allowJs": false`, `"noUncheckedIndexedAccess": true`, `"noFallthroughCasesInSwitch": true`, `"noUnusedLocals": true`, and `"noUnusedParameters": true`.
* **Zero escape hatches:** Explicit `any`, `@ts-ignore`, `@ts-nocheck`, and unsafe casts (such as `{} as ContextType` or unguarded `as HTMLElement`) are prohibited. Non-null assertions (`!`) are forbidden unless preceded by an explicit runtime guard.
* **Explicit domain types:** Replace magic strings (e.g., `"undefined"` as a `SortDirection`) with strict union types (`"asc" | "desc" | null`), eliminate empty interfaces (`IGetValues {}`, `MainProps {}`), and type all i18n keys, filter payloads, and measurement units.
* **Immutability:** Data transformations (such as `mm` ↔ `inch` unit conversion) MUST return new objects and MUST NEVER mutate shared catalog records in place (no `Object.assign` on source dataset entries).

### III. Codebase Cleanup & Maintainability

Every change MUST leave the repository cleaner, simpler, and free of legacy scaffolding:

* **Remove dead and irrelevant code:** Eliminate unused files (`README.old.md`, duplicate `index.html` copies, stray sub-directory `package.json` files under `src/components/` and `src/utils/`), commented-out code, unused imports, and obsolete helpers whenever encountered.
* **Consistent module boundaries:** Organize code cleanly by responsibility (`components/`, `data/`, `hooks/`, `locales/`, `styles/`, `utils/`), avoid circular barrel re-exports, and keep components focused on a single concern.
* **Automated lint and formatting gates:** Enforce consistent formatting and linting across all TypeScript, TSX, and SCSS files. No `console.log` statements may remain in production code.
* **Configuration accuracy:** Keep `.env.example`, `package.json` metadata (such as repository and issue URLs), and documentation strictly synchronized with the actual code.

### IV. Latest Stable, Lightweight Dependencies & Supply-Chain Security

Dependencies MUST stay current, minimal, researched, and verifiable:

* **Latest stable and lightweight only:** New and existing dependencies MUST target their latest stable versions and favor lightweight alternatives. Always prefer native TypeScript/Browser APIs over heavy utility libraries (e.g., evaluate removing `lodash` for trivial operations) to keep the static GitHub Pages bundle lean.
* **Research before applying:** Before installing, upgrading, or replacing any dependency, agents MUST perform web research against official release notes, bundle-size/maintenance status, and compatibility docs.
* **Remove all legacy dependencies and irrelevant code:** Deprecated, unmaintained, accidental, or superseded packages (such as `react-scripts` / Create React App, `@fortawesome/react-fontawesome@0.2.x`, or `popper@1.0.1`) and any dead code supporting them MUST be completely removed—never left behind as dormant dependencies.
* **Single package manager and lockfile:** Standardize on one package manager (`pnpm`) with a single committed lockfile (`pnpm-lock.yaml`). Remove competing lockfiles (`package-lock.json`, `yarn.lock`) once migration is complete.
* **Supply-chain protection:** Keep pnpm's [`blockExoticSubdeps`](https://pnpm.io/settings/dependency-resolution) enabled (`true`) so transitive dependencies cannot pull untrusted git repositories or arbitrary tarball URLs. Never weaken supply-chain settings to work around an unneeded or misnamed package.

### V. Conventional Commits v1.0.0 (NON-NEGOTIABLE)

Every commit message MUST conform strictly to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification:

* **Format:** `<type>[optional scope]: <description>` (imperative, lowercase subject, no trailing period).
* **Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
* **Breaking changes:** MUST be indicated with `!` after the type/scope (e.g., `feat!: migrate build toolchain to Vite`) and/or a `BREAKING CHANGE:` footer explaining the impact.
* **Atomic commits:** Each commit SHOULD represent one logical, reviewable change that builds and passes checks cleanly.

### VI. Git Branching Discipline

All non-trivial work MUST be isolated on dedicated branches:

* **Branch per feature or bug fix:** Every new feature, bug fix, or refactor MUST be developed on a dedicated branch created from `Master` using a clear prefix: `feat/<short-slug>`, `fix/<short-slug>`, `refactor/<short-slug>`, or `docs/<short-slug>`.
* **Small-chore exception:** Direct commits to `Master` are permitted ONLY for small, low-risk chores (e.g., fixing a typo, updating `.gitignore`, or minor documentation/config tweaks) that carry no behavioral risk.
* **Human-gated merges and releases:** AI agents MUST NOT auto-merge branches into `Master`, force-push shared history, or publish deployment/release tags without explicit user approval.

### VII. Zero-Assumption Clarification Policy (NON-NEGOTIABLE)

Clarity takes precedence over speed:

* **Never guess on ambiguity:** Whenever a requirement, UX behavior, engineering formula, dependency choice, or architectural trade-off is ambiguous or underspecified, STOP and ask the user concise, targeted questions before writing specs, plans, or code.
* **Surface conflicts explicitly:** If existing repository files contradict each other or a user request (e.g., conflicting lockfiles, environment variable names, or license declarations), report the discrepancy and ask for direction rather than silently picking one.

### VIII. Research-Backed Engineering Decisions

Do not rely on stale or unverified assumptions when external facts matter:

* **Verify via web search when needed:** Before adopting new library versions, migration paths, React/TypeScript APIs, SEO standards, or O-ring engineering standards (AS568, JIS B 2401, ISO 3601), perform web research against official documentation and authoritative references.
* **Record sources:** Plans and specs that rely on external standards, migration guides, or compatibility notes MUST cite the verified source URLs.

### IX. Domain Accuracy, Bilingual Parity & Mandatory Testing (NON-NEGOTIABLE)

O-Ring Finder is a technical reference tool; data accuracy and automated testing are hard release gates:

* **Always use testing:** Every feature, bug fix, and refactor MUST include automated tests (unit, integration, or component tests). No change may be committed or merged without a passing test suite. Every bug fix MUST include a regression test.
* **Measurement precision:** All dimensional conversions (`1 inch = 25.4 mm`) and filter range comparisons (ID, OD, CS) MUST be deterministic, accurate, and covered by unit tests.
* **Bilingual i18n parity:** Every user-facing string MUST be externalized to both `src/locales/en/globals.json` and `src/locales/id/globals.json` with matching keys—no hardcoded UI copy in components.

### X. Reusable Automation Scripts in `./scripts/`

Minimize repeated effort and AI token usage through purposeful local tooling:

* **Check `./scripts/` first:** Before running multi-step ad-hoc shell commands or writing one-off snippets, agents MUST check the root `./scripts/` directory for an existing helper script and reuse it.
* **Create reusable helper scripts:** For any routine, repeatable task that saves tokens or effort—such as chores, codebase inspection/examination, batch editing, quality checks, data validation, i18n parity checks, or testing—agents SHOULD create a clean, reusable script under `./scripts/`.
* **Meaningful names and self-documentation:** Every script MUST have a clear, descriptive filename (e.g., `check-i18n-parity.mjs`, `verify-gates.sh`, `inspect-deps.mjs`) and a concise header comment inside the source explaining its purpose, usage, and arguments.
* **No throwaway clutter:** Only commit scripts to `./scripts/` that provide ongoing, repeatable value; delete strictly one-time migration scripts after use.

### XI. Semantic Versioning & Deployment from `Master`

Releases follow predictable Semantic Versioning and originate strictly from `Master`:

* **Always bump version per feature/fix:** Every completed feature or bug fix MUST include an appropriate version bump in `package.json` before deployment.
* **Autonomous `minor` vs. `patch` selection:** The agent determines whether to bump `minor` (backward-compatible new functionality) or `patch` (backward-compatible bug fix, refactor, or maintenance) based on backward compatibility.
* **User-supervised `major` bumps (NON-NEGOTIABLE):** Agents MUST NEVER execute a `major` version bump autonomously. If a change introduces breaking changes warranting a major release, the agent MAY recommend a major bump with rationale and MUST wait for explicit user approval before applying it.
* **Deploy from `Master`:** Production deployments to GitHub Pages MUST run from `Master` only after the feature branch is merged, all quality gates pass, and the version has been bumped.

### XII. SEO-Friendly Architecture

The application MUST be structured for strong search-engine discoverability and clean indexing:

* **Semantic markup and metadata:** Maintain semantic HTML landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, proper heading hierarchy), accurate `<title>` and `<meta name="description">` tags, canonical URLs, Open Graph / social tags, and structured data (JSON-LD where helpful), keeping metadata synchronized with active language (`en`/`id`).
* **Crawlability and technical SEO:** Keep `robots.txt`, `manifest.json`, favicon/icon links, and meaningful `alt` attributes accurate and up to date.
* **Proactive SEO improvements permitted:** Agents MAY update markup, metadata, head tags, and supporting code to improve or maintain SEO compliance—provided those changes strictly respect Principle XIII (Visual Layout & Size Preservation).

### XIII. Visual Layout & Size Preservation (NON-NEGOTIABLE)

Preserve the user-facing visual design unless explicitly instructed otherwise:

* **Do not alter layout or sizing:** Agents MUST NOT change page layout, component geometry, spacing, breakpoints, typography scale, or element sizes unless the user explicitly asks for a layout or sizing change.
* **Non-visual refactors stay visually identical:** Code cleanups, React best-practice refactors, dependency upgrades, accessibility improvements, and SEO enhancements MUST preserve the existing visual appearance and dimensions.

## Technical Stack & Codebase Cleanup Baseline

| Area | Current State | Constitutional Target |
| :--- | :--- | :--- |
| Framework | React 19 + TypeScript 5.7 | Latest stable React + TypeScript with strict compiler flags |
| Build & Tooling | Deprecated `react-scripts@5.0.1`, `target: es5` | Latest stable lightweight bundler (e.g., Vite) + modern ES target |
| Package Manager | Mixed lockfiles, running `pnpm` | Single `pnpm` workflow with `pnpm-lock.yaml` only |
| Data Layer | Static JSON (`as568.json`, `jis.json`, `metric.json`) + pure accessors | Strictly typed, immutable static JSON modules with 100% test coverage |
| Dependencies | Legacy/unused packages being audited | Researched, lightweight, latest stable packages only; zero legacy deps; `blockExoticSubdeps: true` |
| Automation | Ad-hoc commands | Reusable, documented helper scripts in root `./scripts/` |
| Styling & UI | Bootstrap 5 + SCSS + FontAwesome | Clean, accessible, SEO-friendly UI preserving exact layout and sizing |
| Localization | `i18next` + `react-i18next` (`en`, `id`) | Strictly typed keys with 100% `en`/`id` parity |
| Deployment | GitHub Pages (`gh-pages`) | Version-bumped production build deployed cleanly from `Master` |

## Development Workflow & Quality Gates

1. **Check `./scripts/` & clarify first:** Inspect `./scripts/` for reusable helpers, and resolve any ambiguous scope, UX, or technical questions with the user before writing specs or code.
2. **Research before applying:** Verify latest stable lightweight dependencies, APIs, SEO standards, and O-ring specifications via web search before finalizing plans.
3. **Branch cleanly:** Create a dedicated branch (`feat/...`, `fix/...`, `refactor/...`) from `Master` for all non-chore work.
4. **Verify before commit:** Every change MUST pass type-checking (`tsc --noEmit`), linting, automated tests, and a clean production build before committing or opening a PR—while preserving existing layout and sizing unless explicitly requested.
5. **Version, commit, and deploy cleanly:** Use Conventional Commits v1.0.0 for every commit; bump `minor` or `patch` per feature/fix (recommending—never auto-executing—`major` bumps); wait for explicit user approval before merging to `Master` or deploying from `Master`.

## Governance

* **Supremacy:** This constitution supersedes ad-hoc habits or legacy patterns currently present in the codebase. Existing code that violates these principles is treated as technical debt to be cleaned up incrementally or via dedicated cleanup specs.
* **Constitution check:** Every Spec Kit plan (`plan.md`) and code review MUST verify compliance against Principles I–XIII. Any intentional exception MUST be documented with explicit rationale and approved by the user.
* **Versioning & amendments:** Governance updates follow Semantic Versioning:
  * **MAJOR:** Removing or incompatibly redefining an existing principle.
  * **MINOR:** Adding a new principle or materially expanding mandatory rules.
  * **PATCH:** Clarifications, wording improvements, or non-semantic refinements.
* **Sync obligation:** Whenever this constitution is amended, update the `Sync Impact Report` header and propagate relevant changes to dependent Spec Kit templates in the same change.