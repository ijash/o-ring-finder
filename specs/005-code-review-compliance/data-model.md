# Data Model: Code Review Compliance and Hygiene Fixes

## 1. Table Sorting Entities

### `TableHeadField`
- **Definition**: Union of sortable data attributes.
- **Type**: `"standard" | "code" | "id" | "od" | "cs"`
- **Usage**: Canonical key for sort dispatching and column identity.

### `TableHeadItem`
- **Definition**: Header configuration tuple passed to `TableHead`.
- **Fields**:
  - `key: TableHeadField` (canonical key)
  - `label: string` (localized display name)

### `SortState`
- **Definition**: Active sorting configuration in `SortContext`.
- **Fields**:
  - `sortBy: TableHeadField | null` (current sorted column; `null` when unsorted)
  - `sortDirection: "asc" | "desc" | null` (current sort direction; `null` when unsorted)
- **Methods**:
  - `setSortBy: (sortBy: TableHeadField | null) => void`
  - `setSortDirection: (direction: "asc" | "desc" | null) => void`
  - `resetSort: () => void`

## 2. Filter State Model

### `IDataFilter`
- **Definition**: Search and dimension bounds filter criteria.
- **Fields**:
  - `unit: MeasurementUnit` (required: `"mm"` or `"inch"`)
  - `code?: string` (optional search substring)
  - `standard?: Standard[]` (optional selected standard subset)
  - `minId?: number` (parsed numeric minimum inner diameter)
  - `maxId?: number` (parsed numeric maximum inner diameter)
  - `minOd?: number` (parsed numeric minimum outer diameter)
  - `maxOd?: number` (parsed numeric maximum outer diameter)
  - `minCs?: number` (parsed numeric minimum cross section)
  - `maxCs?: number` (parsed numeric maximum cross section)

## 3. Catalog Row Identity

### `DataRepresentation`
- **Fields**:
  - `standard: Standard` (`Standard.AS` | `Standard.JIS` | `Standard.METRIC`)
  - `code: string` (standard part number / code)
  - `id: number` (inner diameter in active unit)
  - `od: number` (outer diameter in active unit)
  - `cs: number` (cross section in active unit)
  - `unit: MeasurementUnit`
- **Identity / React Key**: `${row.standard}-${row.code}`
  - Guarantees uniqueness across standards where code names overlap.
