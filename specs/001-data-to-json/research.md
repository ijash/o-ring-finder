# Research & Technical Decisions: Data to JSON Transformation

**Feature**: `001-data-to-json`  
**Date**: 2026-11-23  
**Status**: Completed

## 1. Data Extraction & Parity Strategy

### Decision
Use a temporary, one-time Node.js script (`scripts/extract-data.ts` or `scripts/extract-data.js`) executed with `npx ts-node` or `node` (using jsdom or cheerio/htmlparser2, or basic regex/DOM simulation) to extract rows from `src/data/dataAs568.ts`, `src/data/dataJis.ts`, and `src/data/dataMetric.ts` into flat JSON arrays:
- `src/data/as568.json`
- `src/data/jis.json`
- `src/data/metric.json`

Validate 100% data parity against legacy `StandardData` extraction before deleting the legacy files.

### Rationale
- Parsing at build/development time completely eliminates runtime DOM overhead (`document.createElement("DIV")`, `tmp.innerHTML = html`, and DOM table traversal).
- Pre-extracting directly into committed JSON files means browser clients load pure static JSON arrays with zero startup computation.
- Keeps extraction script outside production build as a temporary verification and extraction harness that is removed once parity is proven.

### Alternatives Considered
- *Runtime fetch of HTML*: Rejected (violates Constitution Principle I; slow, unnecessary network request).
- *Virtual DOM parsing at app startup*: Rejected (violates Constitution Principle I; retains CPU and bundle bloat).
- *Manual transcription*: Rejected (hundreds of rows, high probability of human error).

---

## 2. JSON Schema & Numerical Representations

### Decision
Store dimensions (`cs`, `id`, `od`) in millimeters (`mm`) as standard JavaScript numbers (floats).
Format per record:
```json
{
  "standard": "AS568",
  "code": "001",
  "cs": 1.78,
  "id": 1.78,
  "od": 5.34
}
```
Validation rules:
- `standard`: Exact `Standard` enum values (`"AS568"`, `"JIS"`, `"Common Metric"`).
- `code`: Non-empty string.
- `cs`, `id`, `od`: Finite positive numbers (`> 0`). Zero `NaN` or `null` values permitted.

### Rationale
- Matches the legacy raw table data where millimeters were the base measurements.
- Flat arrays allow direct `.filter()`, `.map()`, and index lookups without nested iteration overhead.
- Vite / webpack handles `resolveJsonModule: true` natively, generating minimal bundle footprints.

### Alternatives Considered
- *Storing both `mm` and `inch` pre-computed in JSON*: Rejected (increases JSON bundle size by ~2x; `convertToUnit` in memory is fast and trivially computed).
- *Single combined `orings.json` file*: Rejected (user clarified in Q2: separate flat JSON array per standard file).

---

## 3. Strict Type Safety & Pure Functional Accessors

### Decision
Deprecate and delete `StandardData` class and `IGetValues`. Refactor `IData.ts` to strictly type `IDataObject` and domain enums:
- `IDataObject.standard`: `Standard` (not `string`).
- Remove `IData` interface (class-based abstraction).
- Introduce `src/data/oRingData.ts` providing pure functions:
  - `TABLE_HEADERS: readonly ["Standard", "Code", "ID", "OD", "CS"]`
  - `convertToUnit(records: readonly IDataObject[], unit?: MeasurementUnit): DataRepresentation[]`
  - `getStandardData(standard: Standard, unit?: MeasurementUnit): DataRepresentation[]`
  - `getAllORingData(unit?: MeasurementUnit): DataRepresentation[]`
- Immutability: `convertToUnit` maps to new objects; does not mutate source data. Inch conversion formula uses exact legacy rounding: `Number((val / 25.4).toFixed(3))`.

### Rationale
- Conforms to Constitution Principle I (pure functional rendering, no unneeded class state) and Principle II (strict types, immutability, zero `any`, zero unsafe casts).
- Eliminates class instantiation and method-binding boilerplate in React consumers.

### Alternatives Considered
- *Preserve `StandardData` class as a facade over JSON*: Rejected during clarify (user selected Option B: pure functional accessors).

---

## 4. Consumer Migration Scope

### Decision
Touch ONLY the two consumer components directly referencing the legacy class API:
1. `src/components/table/tableSection.tsx`:
   - Replace `StandardData.getHeaders()` with `TABLE_HEADERS` (or `getTableHeaders()`).
   - Query data using `getAllORingData(filterContext.filter.unit)` or `[getStandardData(Standard.AS, ...), ...]`.
2. `src/components/table/tableRow.tsx`:
   - Update props from `data: IData[]` to `data: readonly DataRepresentation[]` (or flatten rows upstream in `TableSection`).
   - Remove unsafe cast `row.standard as Standard` since `IDataObject.standard` is strictly typed to `Standard`.
3. Other components (`src/components/modal/*`, `src/components/input/inputSection.tsx`, `src/components/context/filterContext.tsx`) only import types (`DataRepresentation`, `IDataFilter`, `MeasurementUnit`), which are preserved in `IData.ts`. No logic edits needed in those files.

### Rationale
- Follows lazy senior developer ladder: minimal surgical diff; change only what is required.
