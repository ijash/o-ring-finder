&lt;!--
Sync Impact Report:
- Version change: Initial ratification → 1.0.0
- Added sections: Core Principles (I–IX), Technical Stack &amp; Codebase Cleanup Baseline, Development Workflow &amp; Quality Gates, Governance
- Inspected repository: https://github.com/ijash/o-ring-finder (commit 2e9d640, v2.3.6, default branch: Master)
- Follow-up templates to align: .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
--&gt;

# O-Ring Finder Constitution

**Project:** [O-Ring Finder](https://github.com/ijash/o-ring-finder) (`o-ring-finder`)  
**Version:** 1.0.0  
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

* **Remove dead and duplicate artifacts:** Eliminate unused files (`README.old.md`, duplicate `index.html` copies, stray sub-directory `package.json` files under `src/components/` and `src/utils/`), commented-out code, and unused imports or variables.
* **Consistent module boundaries:** Organize code cleanly by responsibility (`components/`, `data/`, `hooks/`, `locales/`, `styles/`, `utils/`), avoid circular barrel re-exports, and keep components focused on a single concern.
* **Automated lint and formatting gates:** Enforce consistent formatting and linting across all TypeScript, TSX, and SCSS files. No `console.log` statements may remain in production code.
* **Configuration accuracy:** Keep `.env.example`, `package.json` metadata (such as repository and issue URLs), and documentation strictly synchronized with the actual code.

### IV. Latest Stable Dependencies & Supply-Chain Security

Dependencies MUST stay current, minimal, and verifiable:

* **Latest stable releases only:** New and existing dependencies MUST target their latest stable versions. Deprecated, unmaintained, or end-of-life packages (such as `react-scripts` / Create React App, `@fortawesome/react-fontawesome@0.2.x`, or accidental installs like `popper@1.0.1`) MUST be replaced or removed during maintenance.
* **Single package manager and lockfile:** Standardize on one package manager (`pnpm`) with a single committed lockfile (`pnpm-lock.yaml`). Remove competing lockfiles (`package-lock.json`, `yarn.lock`) once migration is complete.
* **Supply-chain protection:** Keep pnpm's [`blockExoticSubdeps`](https://pnpm.io/settings/dependency-resolution) enabled (`true`) so transitive dependencies cannot pull untrusted git repositories or arbitrary tarball URLs. Never weaken supply-chain settings to work around an unneeded or misnamed package.
* **Minimal footprint:** Prefer native TypeScript/Browser APIs over heavy utility libraries (e.g., evaluate whether `lodash` is needed for trivial operations) to keep the static GitHub Pages bundle lean.

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

* **Verify via web search when needed:** Before adopting new library versions, migration paths, React/TypeScript APIs, or O-ring engineering standards (AS568, JIS B 2401, ISO 3601), perform web research against official documentation and authoritative references.
* **Record sources:** Plans and specs that rely on external standards, migration guides, or compatibility notes MUST cite the verified source URLs.

### IX. Domain Accuracy, Bilingual Parity & Test Verification

O-Ring Finder is a technical reference tool; data accuracy and reliability are core product requirements:

* **Measurement precision:** All dimensional conversions (`1 inch = 25.4 mm`) and filter range comparisons (ID, OD, CS) MUST be deterministic, accurate, and covered by unit tests.
* **Bilingual i18n parity:** Every user-facing string MUST be externalized to both `src/locales/en/globals.json` and `src/locales/id/globals.json` with matching keys—no hardcoded UI copy in components.
* **Real automated test coverage:** Replace placeholder boilerplate tests (`App.test.tsx`) with meaningful unit and component tests covering dataset parsing/integrity, unit conversion, filtering, sorting, modal display, and language switching. Every bug fix MUST include a regression test.

## Technical Stack & Codebase Cleanup Baseline

| Area | Current State (v2.3.6) | Constitutional Target |
| :--- | :--- | :--- |
| Framework | React 19 + TypeScript 5.7 | Latest stable React + TypeScript with strict compiler flags |
| Build & Tooling | Deprecated `react-scripts@5.0.1`, `target: es5` | Latest stable modern bundler (e.g., Vite) + modern ES target |
| Package Manager | Mixed `package-lock.json` + `yarn.lock`, running `pnpm` | Single `pnpm` workflow with `pnpm-lock.yaml` only |
| Data Layer | Runtime HTML-table parsing (`StandardData.ts`) | Typed static data modules with immutable unit conversion |
| Dependencies | Includes `popper@1.0.1`, deprecated FontAwesome v0.2.x | Audited, latest stable packages only; `blockExoticSubdeps: true` |
| Styling & UI | Bootstrap 5 + SCSS + FontAwesome | Clean SCSS/UI architecture with accessible components |
| Localization | `i18next` + `react-i18next` (`en`, `id`) | Strictly typed keys with 100% `en`/`id` parity |
| Deployment | GitHub Pages (`gh-pages`) | Reproducible production build deployed cleanly to GitHub Pages |

## Development Workflow & Quality Gates

1. **Clarify first:** Resolve any ambiguous scope, UX, or technical questions with the user before creating specs or code.
2. **Research when needed:** Verify latest stable versions, APIs, and O-ring specifications before finalizing plans.
3. **Branch cleanly:** Create a dedicated branch (`feat/...`, `fix/...`, `refactor/...`) from `Master` for all non-chore work.
4. **Verify before commit:** Every change MUST pass type-checking (`tsc --noEmit`), linting, automated tests, and a clean production build before committing or opening a PR.
5. **Commit cleanly:** Use Conventional Commits v1.0.0 for every commit; wait for explicit user approval before merging to `Master` or deploying.

## Governance

* **Supremacy:** This constitution supersedes ad-hoc habits or legacy patterns currently present in the codebase. Existing code that violates these principles is treated as technical debt to be cleaned up incrementally or via dedicated cleanup specs.
* **Constitution check:** Every Spec Kit plan (`plan.md`) and code review MUST verify compliance against Principles I–IX. Any intentional exception MUST be documented with explicit rationale and approved by the user.
* **Versioning & amendments:** Governance updates follow Semantic Versioning:
  * **MAJOR:** Removing or incompatibly redefining an existing principle.
  * **MINOR:** Adding a new principle or materially expanding mandatory rules.
  * **PATCH:** Clarifications, wording improvements, or non-semantic refinements.
* **Sync obligation:** Whenever this constitution is amended, update the `Sync Impact Report` header and propagate relevant changes to dependent Spec Kit templates in the same change.
