# Contract: O-Ring Data Access Layer

**Module**: `src/data/oRingData.ts` (re-exported via `src/data/index.ts`)  
**Feature**: `001-data-to-json`  
**Date**: 2026-11-23

## 1. Constants & Type Definitions

```typescript
import { DataRepresentation, IDataObject, MeasurementUnit, Standard } from "./IData";

/**
 * Standard table column headers for UI display.
 */
export const TABLE_HEADERS: readonly ["Standard", "Code", "ID", "OD", "CS"] = [
  "Standard",
  "Code",
  "ID",
  "OD",
  "CS",
] as const;
```

---

## 2. Pure Accessor Functions

### `convertToUnit`
Converts an array of base millimeter records into a requested measurement unit immutably.
```typescript
/**
 * Transforms an array of base mm catalog records into the requested measurement unit.
 * Always returns new record objects without mutating input records.
 *
 * @param records Array of base catalog records (in mm)
 * @param unit Target measurement unit (defaults to MeasurementUnit.MM)
 * @returns Array of DataRepresentation in target unit
 */
export function convertToUnit(
  records: readonly IDataObject[],
  unit: MeasurementUnit = MeasurementUnit.MM
): DataRepresentation[];
```
**Invariants:**
- When `unit === MeasurementUnit.MM`, each output record has `unit: MeasurementUnit.MM` and dimensions equal to base values.
- When `unit === MeasurementUnit.INCH`, each output record has `unit: MeasurementUnit.INCH` and dimensions rounded to 3 decimal places via `Number((val / 25.4).toFixed(3))`.
- Input `records` are strictly read-only and never mutated.

---

### `getStandardData`
Retrieves all records for a specific standard in the requested unit.
```typescript
/**
 * Retrieves records for a specific O-ring standard in the requested unit.
 *
 * @param standard The O-ring standard (AS568, JIS, or Common Metric)
 * @param unit Target measurement unit (defaults to MeasurementUnit.MM)
 * @returns Array of DataRepresentation for that standard
 */
export function getStandardData(
  standard: Standard,
  unit?: MeasurementUnit
): DataRepresentation[];
```

---

### `getAllORingData`
Retrieves combined records across all standards in the requested unit.
```typescript
/**
 * Retrieves combined records across all standards (AS568, JIS, Common Metric)
 * in the requested measurement unit.
 *
 * @param unit Target measurement unit (defaults to MeasurementUnit.MM)
 * @returns Combined array of DataRepresentation
 */
export function getAllORingData(
  unit?: MeasurementUnit
): DataRepresentation[];
```

---

## 3. UI Component Consumption Changes

### `TableSection` (`src/components/table/tableSection.tsx`)
**Before:**
```typescript
const translatedTableHead = StandardData.getHeaders().map((header) => ...);
<TableRowsComponent
  data={[as568, jis, metric]}
  filter={filterContext.filter}
/>
```
**After:**
```typescript
import { TABLE_HEADERS, getAllORingData } from "data";
// ...
const translatedTableHead = TABLE_HEADERS.map((header) => ...);
const oRingData = getAllORingData(filterContext.filter.unit);
<TableRowsComponent
  data={oRingData}
  filter={filterContext.filter}
/>
```

### `TableRowsComponent` (`src/components/table/tableRow.tsx`)
**Before:**
```typescript
interface props {
  data: IData[];
  filter?: IDataFilter;
}
// inside component:
data.forEach((s) => {
  let processedData = s.getValues(filter.unit).filter(...);
  ...
  specialStyle.standard(row.standard as Standard);
});
```
**After:**
```typescript
interface props {
  data: readonly DataRepresentation[];
  filter?: IDataFilter;
}
// inside component:
// Directly filter `data` array without nested `s.getValues()` loops;
// `row.standard` is already typed as `Standard` (no unsafe type cast).
```
