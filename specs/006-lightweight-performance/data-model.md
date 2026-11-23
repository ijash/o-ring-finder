# Data Model: Lightweight Performance Optimization

**Feature**: `specs/006-lightweight-performance` | **Branch**: `perf/lightweight-optimization` | **Date**: 2026-11-23

## State & Data Flow Models

### 1. Filter State & Debounce Lifecycle

```text
[ User Action ]
  │
  ├── Select Unit Dropdown ("mm" | "inch")
  │     └─► Synchronous handleUnitFilter()
  │           ├─► Flush/Cancel pendingFilterRef
  │           └─► Immediate setFilter((prev) => ({ ...prev, unit: nextUnit }))
  │                 └─► Immediate recalculation of 3,822 row dimensions (< 50ms)
  │
  └── Type Numeric/Text Filter (ID, OD, CS, Code)
        └─► Debounced handleFilter()
              └─► pendingFilterRef buffered
                    └─► Wait 897ms idle
                          └─► setFilter((prev) => ({ ...prev, ...pending }))
```

### 2. Table Rendering Pipeline (`useDeferredValue`)

```text
[ Raw Catalogs: AS568 + JIS + Metric ] (3,822 items)
  │
  ▼
[ FilterContext.filter ] (unit, dimensions, standard, query)
  │
  ▼
[ useMemo: filteredData ]
  │
  ▼
[ SortContext: sortBy, sortDirection ]
  │
  ▼
[ useMemo: sortedRows ] (immediate derived list)
  │
  ▼
[ useDeferredValue: deferredRows ] (low-priority render transition)
  │
  ├── Urgently: Update input controls & UI state at 60fps (no dropped frames)
  └── Defers: Reconcile and commit 3,822 <tr> table rows in background
```

### 3. Modal Code-Splitting State

```text
[ TableRowsComponent ]
  │
  ├── State: showModal: boolean, modalData: DataRepresentation | null
  │
  └── onClick(row)
        │
        ▼
      [ setShowModal(true) ]
        │
        ▼
      [ Suspense fallback={null} ]
        │
        ▼
      [ React.lazy import("components/modal/modal") ] (separate chunk)
        │
        ▼
      [ CustomModal Portal ] -> document.body
```

### 4. Icon Entity Definitions

```typescript
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: string | number;
}
```
- `IconCircle`: viewBox `0 0 512 512`, path for circle outline.
- `IconLanguage`: viewBox `0 0 640 512`, path for globe/language symbol.
- `IconEraser`: viewBox `0 0 576 512`, path for eraser symbol.
- Styling: `width="1em" height="1em" fill="currentColor"` matching FontAwesome standard display.
