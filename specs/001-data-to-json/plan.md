# Implementation Plan: Data to JSON Transformation

**Branch**: `refactor/data-to-json` | **Date**: 2026-11-23 | **Spec**: [specs/001-data-to-json/spec.md](spec.md)

**Input**: Feature specification from `specs/001-data-to-json/spec.md`

## Summary

Transform the O-Ring Finder catalog data layer from legacy client-side HTML table strings and runtime DOM parsing (`document.createElement` / `innerHTML` in `StandardData.ts`) into lightweight, pre-structured, strictly typed JSON arrays (`as568.json`, `jis.json`, `metric.json`). Implement pure functional accessors with immutable `mm` ↔ `inch` conversion in `src/data/oRingData.ts`, update consuming components (`TableSection`, `TableRowsComponent`), enforce strict types (tightening `IDataObject.standard` to `Standard`), verify 100% data parity, and clean up deprecated files (`dataAs568.ts`, `dataJis.ts`, `dataMetric.ts`, `StandardData.ts`, `values.ts`).

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js >= 18  
**Primary Dependencies**: React 19, i18next  
**Storage**: Static JSON datasets bundled with build (`resolveJsonModule: true`)  
**Testing**: Jest (`pnpm test -- --watchAll=false`), `tsc --noEmit`  
**Target Platform**: Browser (Single-Page React App on GitHub Pages)  
**Project Type**: Web Application  
**Performance Goals**: Instantaneous static data loading (0ms DOM parsing / layout thrashing on init)  
**Constraints**: 100% data parity against legacy parsed output, strict types (no `any`, no non-null assertions, no unsafe casts), strict immutability, zero runtime DOM parsing for static data  
**Scale/Scope**: ~921 catalog records across 3 standards (AS568, JIS, Common Metric); 2 UI consumer files updated  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance Analysis / Status |
| :--- | :--- | :--- |
| **I. React Best Practices** | No runtime DOM/HTML parsing for static data; pure rendering | **PASS**: Replaces `document.createElement("DIV")` and `innerHTML` with static JSON files. Pure functional accessors replace stateful class. |
| **II. Strict Type Safety** | Strict types, zero `any`, zero unsafe casts, immutability | **PASS**: `IDataObject.standard` tightened to `Standard` enum; remove `IGetValues {}`; `convertToUnit` returns new objects; remove `as Standard` cast in `tableRow.tsx`. |
| **III. Codebase Cleanup** | Remove dead/deprecated files, clean module boundaries | **PASS**: Removes legacy HTML datasets (`dataAs568.ts`, `dataJis.ts`, `dataMetric.ts`), `StandardData.ts`, and `values.ts`. Clean exports via `src/data/index.ts`. |
| **IV. Dependencies** | Latest stable dependencies, single `pnpm` workflow, no new bloat | **PASS**: No new production runtime dependencies added. Uses native JSON modules. |
| **V. Conventional Commits** | Conventional Commits v1.0.0 format | **PASS**: All commits follow `refactor(data): ...` or `test(data): ...`. |
| **VI. Git Discipline** | Dedicated feature branch, human-gated merges/pushes | **PASS**: Operating exclusively on `refactor/data-to-json`. No push/merge without user approval. |
| **VII. Zero-Assumption** | No guessing on ambiguities; clarify with user | **PASS**: All 3 spec ambiguities resolved via `/speckit-clarify` session 2026-11-23. |
| **VIII. Research-Backed** | Verify standards and technical decisions | **PASS**: Research documented in `research.md`. Standard AS568, JIS, and Metric dimensions preserved with exact parity. |
| **IX. Domain Accuracy & Tests**| Measurement precision, automated tests, parity | **PASS**: Unit tests under `src/data/__tests__/oRingData.test.ts` verify dataset integrity, 3-decimal inch precision, and immutability. |

**Gate Result**: All 9 Principles PASS with zero unjustified violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-data-to-json/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Technical decisions and research (Phase 0)
├── data-model.md        # Domain entities and JSON schemas (Phase 1)
├── quickstart.md        # Verification and testing scenarios (Phase 1)
├── contracts/
│   └── data-access-contract.md # Public accessor API & consumer changes (Phase 1)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Changes

```text
src/
├── data/
│   ├── as568.json               # [NEW] Pre-extracted AS568 catalog JSON
│   ├── jis.json                 # [NEW] Pre-extracted JIS catalog JSON
│   ├── metric.json              # [NEW] Pre-extracted Common Metric catalog JSON
│   ├── IData.ts                 # [MODIFY] Tighten types: standard: Standard; delete IData & IGetValues
│   ├── oRingData.ts             # [NEW] Pure immutable functions: convertToUnit, getStandardData, getAllORingData, TABLE_HEADERS
│   ├── index.ts                 # [MODIFY] Re-export types, JSON data, and pure accessors
│   ├── __tests__/
│   │   └── oRingData.test.ts    # [NEW] Unit tests for data integrity, conversion, immutability
│   ├── dataAs568.ts             # [DELETE] Legacy raw HTML table
│   ├── dataJis.ts               # [DELETE] Legacy raw HTML table
│   ├── dataMetric.ts            # [DELETE] Legacy raw HTML table
│   ├── StandardData.ts          # [DELETE] Legacy DOM parser class
│   └── values.ts                # [DELETE] Legacy class instances
└── components/
    └── table/
        ├── tableSection.tsx     # [MODIFY] Consume TABLE_HEADERS and getAllORingData
        └── tableRow.tsx         # [MODIFY] Consume DataRepresentation[], eliminate unsafe casts
```

---

## Phases & Execution Strategy

### Phase 1: Data Extraction & Parity Validation
1. Create temporary node extraction script (`scripts/extract-data.js` or `.ts`) simulating the legacy DOM parsing logic.
2. Extract records into:
   - `src/data/as568.json`
   - `src/data/jis.json`
   - `src/data/metric.json`
3. Execute parity assertion script comparing extracted JSON records against legacy `StandardData` outputs (both `mm` and `inch`).
4. Once 100% parity is confirmed, delete the extraction script.

### Phase 2: Type System Refinement & Pure Accessors
1. Update `src/data/IData.ts`:
   - Change `IDataObject.standard` from `string` to `Standard`.
   - Remove `IGetValues` and `IData`.
   - Ensure `DataRepresentation`, `Standard`, `MeasurementUnit`, and `IDataFilter` remain intact.
2. Create `src/data/oRingData.ts`:
   - Define `TABLE_HEADERS`.
   - Implement `convertToUnit`, `getStandardData`, `getAllORingData`.
   - Guarantee strict immutability (return new objects; no mutation).
   - Round inches via `Number((val / 25.4).toFixed(3))`.
3. Update `src/data/index.ts` to re-export the new accessors and types.

### Phase 3: Consumer Migration
1. Update `src/components/table/tableSection.tsx`:
   - Replace `StandardData.getHeaders()` with `TABLE_HEADERS`.
   - Retrieve all data using `getAllORingData(filterContext.filter.unit)`.
2. Update `src/components/table/tableRow.tsx`:
   - Change `data` prop to `readonly DataRepresentation[]`.
   - Remove `s.getValues()` iteration loop.
   - Remove `row.standard as Standard` cast.

### Phase 4: Legacy Cleanup & Automated Testing
1. Delete legacy files:
   - `src/data/dataAs568.ts`
   - `src/data/dataJis.ts`
   - `src/data/dataMetric.ts`
   - `src/data/StandardData.ts`
   - `src/data/values.ts`
2. Add comprehensive unit tests in `src/data/__tests__/oRingData.test.ts`.
3. Run verification gates:
   - `npx tsc --noEmit`
   - `pnpm test -- --watchAll=false`
   - `pnpm build`

---

## Complexity Tracking

> Zero constitutional violations; table empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| None | N/A | N/A |

