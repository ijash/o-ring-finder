# Data Model: O-Ring Catalog & Dimension Representation

**Feature**: `001-data-to-json`  
**Date**: 2026-11-23  
**Status**: Completed

## 1. Core Domain Types (`src/data/IData.ts`)

### `Standard` (Enum)
Governing standardization specification for the O-ring profile.
```typescript
export enum Standard {
  AS = "AS568",
  JIS = "JIS",
  METRIC = "Common Metric",
}
```

### `MeasurementUnit` (Enum)
Dimensional unit system for display and filtering.
```typescript
export enum MeasurementUnit {
  MM = "mm",
  INCH = "″",
}
```

### `IDataObject` (Base Entity)
Canonical stored O-ring record in millimeters (`mm`).
```typescript
export interface IDataObject {
  readonly standard: Standard;
  readonly code: string;
  readonly cs: number;
  readonly id: number;
  readonly od: number;
}
```

| Field | Type | Description | Invariants / Validation Rules |
| :--- | :--- | :--- | :--- |
| `standard` | `Standard` | Governing standard | Must be one of `Standard.AS`, `Standard.JIS`, `Standard.METRIC`. |
| `code` | `string` | Standard part identification code | Non-empty trimmed string (e.g., `"001"`, `"P-10"`, `"1.5x20"`). |
| `cs` | `number` | Cross-section nominal dimension in mm | Finite number, `> 0`, non-NaN. |
| `id` | `number` | Inside diameter nominal dimension in mm | Finite number, `> 0`, non-NaN. |
| `od` | `number` | Outside diameter nominal dimension in mm | Finite number, `> 0`, non-NaN; typically `id + (2 * cs)` or standard defined. |

### `DataRepresentation` (View Model / Converted Entity)
Dimensioned O-ring record presented in a requested unit system.
```typescript
export interface DataRepresentation extends IDataObject {
  readonly unit: MeasurementUnit;
}
```

| Field | Type | Description | Invariants / Validation Rules |
| :--- | :--- | :--- | :--- |
| `unit` | `MeasurementUnit` | Active measurement unit | Either `MeasurementUnit.MM` or `MeasurementUnit.INCH`. |
| `cs` | `number` | Converted cross-section | If `unit === INCH`: `Number((baseCs / 25.4).toFixed(3))`. If `unit === MM`: equals `baseCs`. |
| `id` | `number` | Converted inside diameter | If `unit === INCH`: `Number((baseId / 25.4).toFixed(3))`. If `unit === MM`: equals `baseId`. |
| `od` | `number` | Converted outside diameter | If `unit === INCH`: `Number((baseOd / 25.4).toFixed(3))`. If `unit === MM`: equals `baseOd`. |

---

## 2. JSON Storage Schema Files

### `src/data/as568.json`
- **Schema**: `Array<IDataObject>`
- **Content**: ~394 records for Aerospace Standard AS568.
- **Example**:
  ```json
  [
    {
      "standard": "AS568",
      "code": "001",
      "cs": 1.78,
      "id": 0.74,
      "od": 4.3
    }
  ]
  ```

### `src/data/jis.json`
- **Schema**: `Array<IDataObject>`
- **Content**: ~339 records for Japanese Industrial Standard JIS B 2401 (P, G, S, V series).
- **Example**:
  ```json
  [
    {
      "standard": "JIS",
      "code": "P-3",
      "cs": 1.9,
      "id": 2.8,
      "od": 6.6
    }
  ]
  ```

### `src/data/metric.json`
- **Schema**: `Array<IDataObject>`
- **Content**: ~188 records for Common Metric sizes.
- **Example**:
  ```json
  [
    {
      "standard": "Common Metric",
      "code": "1.5x20",
      "cs": 1.5,
      "id": 20,
      "od": 23
    }
  ]
  ```

---

## 3. Filter Specification (`IDataFilter`)
Existing filter interface preserved for UI components:
```typescript
export interface IDataFilter {
  unit?: MeasurementUnit;
  minId?: number;
  maxId?: number;
  minOd?: number;
  maxOd?: number;
  minCs?: number;
  maxCs?: number;
  code?: string;
  standard?: Standard[];
}
```
All numeric bounds (`min*`, `max*`) operate against the currently active unit representation (`mm` or `inch`).
