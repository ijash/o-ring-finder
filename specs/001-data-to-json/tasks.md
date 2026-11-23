---
description: "Task list for Data to JSON Transformation implementation"
---

# Tasks: Data to JSON Transformation

**Input**: Design documents from `specs/001-data-to-json/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/data-access-contract.md`, `quickstart.md`)  
**Branch**: `refactor/data-to-json`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `data-model.md`, `contracts/data-access-contract.md`, `quickstart.md`, `.specify/memory/constitution.md`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable task (independent files, no blocking prerequisites)
- **[Story]**: Associated user story from `spec.md` (`[US1]`, `[US2]`, `[US3]`)
- Every task includes explicit file paths
- Checkpoints provide Conventional Commits v1.0.0 messages (no auto-push or merge)

---

## Phase 1: User Story 1 - Data Extraction & Parity Validation (Priority: P1) 🎯 MVP

**Goal**: Extract legacy HTML table datasets (`dataAs568.ts`, `dataJis.ts`, `dataMetric.ts`) into static, pre-structured JSON arrays (`as568.json`, `jis.json`, `metric.json`), eliminating runtime DOM parsing while asserting 100% parity against legacy `StandardData` outputs.

**Independent Test**: Run parity script in `scripts/extract-data.ts`; verify exactly 394 AS568 records, 339 JIS records, and 188 Common Metric records match legacy outputs in both `mm` and `inch` units with 0 discrepancies.

- [x] T001 [US1] Create temporary extraction and parity validation script in `scripts/extract-data.ts` to parse HTML table strings into flat JSON arrays and assert parity against `StandardData`
- [x] T002 [P] [US1] Extract AS568 catalog into `src/data/as568.json` conforming to `IDataObject.standard`, `IDataObject.code`, `IDataObject.cs`, `IDataObject.id`, and `IDataObject.od` defined in `data-model.md`
- [x] T003 [P] [US1] Extract JIS catalog into `src/data/jis.json` conforming to `IDataObject.standard`, `IDataObject.code`, `IDataObject.cs`, `IDataObject.id`, and `IDataObject.od` defined in `data-model.md`
- [x] T004 [P] [US1] Extract Common Metric catalog into `src/data/metric.json` conforming to `IDataObject.standard`, `IDataObject.code`, `IDataObject.cs`, `IDataObject.id`, and `IDataObject.od` defined in `data-model.md`
- [x] T005 [US1] Execute parity assertions in `scripts/extract-data.ts` to verify 100% row-by-row and dimension parity (`mm` and `inch`) between generated JSON files and `StandardData`
- [x] T006 [US1] Delete temporary extraction script `scripts/extract-data.ts` after parity verification succeeds

**Checkpoint**: Static JSON files generated and validated with 100% parity.  
**Commit note**: `chore(data): extract catalog datasets to static json files`

---

## Phase 2: User Story 2 - Type System Refinement & Pure Accessors (Priority: P2)

**Goal**: Establish strict domain types in `IData.ts` and implement pure, immutable functional data accessors in `oRingData.ts` with exact 3-decimal inch unit conversion.

**Independent Test**: Import accessors (`getStandardData`, `getAllORingData`, `convertToUnit`) in `src/data/index.ts`; verify base records remain unmodified when converted to `inch` and converted values match `toFixed(3)` precision.

- [x] T007 [US2] Update `src/data/IData.ts` to tighten `IDataObject.standard` to `Standard`, maintain `DataRepresentation.unit` per `data-model.md`, and remove legacy `IGetValues` and `IData` interfaces
- [x] T008 [US2] Create pure immutable accessors in `src/data/oRingData.ts` providing `TABLE_HEADERS`, `convertToUnit` (converting `DataRepresentation.cs`, `DataRepresentation.id`, and `DataRepresentation.od` per `data-model.md`), `getStandardData`, and `getAllORingData` per `contracts/data-access-contract.md`
- [x] T009 [US2] Update `src/data/index.ts` to re-export new accessors, types, and JSON datasets alongside legacy exports (preserving compatibility before Phase 4 cleanup)

**Checkpoint**: Strict types and pure accessors ready for consumer integration.  
**Commit note**: `refactor(data): implement pure immutable accessors and tighten types`

---

## Phase 3: User Story 3 - Consumer Migration (Priority: P3)

**Goal**: Migrate UI table components (`TableSection`, `TableRowsComponent`) from legacy `StandardData` class calls to new pure functional accessors and strict types.

**Independent Test**: Render the catalog table in development; verify table headers, standard badges, and numerical dimensions render identically without `as Standard` casts or DOM errors.

- [x] T010 [P] [US3] Update `src/components/table/tableSection.tsx` to consume `TABLE_HEADERS` and `getAllORingData` from `src/data/index.ts` instead of `StandardData.getHeaders()` and class instances per `contracts/data-access-contract.md`
- [x] T011 [P] [US3] Update `src/components/table/tableRow.tsx` to accept `data` as `readonly DataRepresentation[]`, replace `s.getValues()` iteration with direct filtering, and eliminate `row.standard as Standard` casts per `contracts/data-access-contract.md`

**Checkpoint**: UI consumers migrated to pure accessors and compiling cleanly.  
**Commit note**: `refactor(table): migrate table components to pure data accessors`

---

## Phase 4: Polish & Verification (Legacy Cleanup & Quality Gates)

**Purpose**: Remove deprecated legacy files, implement comprehensive automated tests, and run project validation gates.

- [x] T012 Delete legacy files `src/data/dataAs568.ts`, `src/data/dataJis.ts`, `src/data/dataMetric.ts`, `src/data/StandardData.ts`, `src/data/values.ts`, and remove obsolete exports from `src/data/index.ts`
- [x] T013 Implement automated unit tests in `src/data/__tests__/oRingData.test.ts` verifying dataset integrity (AS568, JIS, Metric), 3-decimal inch precision, and immutability per `quickstart.md`
- [x] T014 Run full verification gates: `npx tsc --noEmit`, `pnpm test -- --watchAll=false`, and `pnpm build`

**Checkpoint**: Legacy files removed, unit tests passing, build green.  
**Commit note**: `refactor(data): remove legacy dom data parser and add unit tests`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: US1 (Extraction & Parity)
    │
    ▼
Phase 2: US2 (Types & Pure Accessors)
    │
    ▼
Phase 3: US3 (Consumer Migration)
    │
    ▼
Phase 4: Polish & Verification (Cleanup & Quality Gates)
```

- **Phase 1 (US1)**: Must complete first to produce `as568.json`, `jis.json`, `metric.json` required by accessors.
- **Phase 2 (US2)**: Depends on Phase 1 JSON files to construct and export pure accessors.
- **Phase 3 (US3)**: Depends on Phase 2 pure accessors and tightened types.
- **Phase 4 (Polish)**: Depends on Phase 3 completion so legacy files can be safely deleted without breaking imports.

### Parallel Opportunities

- **Phase 1**: Tasks T002, T003, and T004 (extracting AS568, JIS, and Metric JSON) can be executed in parallel once T001 is ready.
- **Phase 3**: Tasks T010 (`tableSection.tsx`) and T011 (`tableRow.tsx`) touch distinct files and can be executed in parallel.

---

## Parallel Execution Examples

### Parallel JSON Extraction (Phase 1)
```bash
# Extract individual JSON files concurrently in T001 script:
extractStandard("AS568", as568HtmlTable, "src/data/as568.json");
extractStandard("JIS", jisHtmlTable, "src/data/jis.json");
extractStandard("Common Metric", metricHtmlTable, "src/data/metric.json");
```

### Parallel Consumer Updates (Phase 3)
```bash
# Update tableSection and tableRow concurrently:
Task T010: "src/components/table/tableSection.tsx"
Task T011: "src/components/table/tableRow.tsx"
```

---

## Implementation Strategy

### MVP First (Phase 1 / US1)
1. Complete T001–T006 (Extraction & Parity Validation).
2. Validate 100% row counts and dimension accuracy against legacy parser.
3. Establish verified static JSON foundations.

### Incremental Delivery (Phases 2 & 3)
1. Add strict types and accessors in `src/data/` (T007–T009).
2. Migrate UI table components (T010–T011).
3. Verify table displays without regressions.

### Cleanup & Hardening (Phase 4)
1. Delete all legacy HTML tables and DOM parsing classes (T012).
2. Add unit tests for dataset integrity, conversion formula, and immutability (T013).
3. Run verification gates `tsc`, `test`, and `build` (T014).
